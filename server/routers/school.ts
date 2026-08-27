import { getStudentProfile, updateStudentProfile, toggleStudentStatus, deleteStudent } from "../services/studentProfile";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { router, publicProcedure } from "../_core/trpc";
import { getDashboard, getRecords, createRecord, dashboardSections } from "../services/school";

export const schoolRouter = router({
  dashboard: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) throw new Error(`Auth failed! Cookies: ${JSON.stringify(ctx.req?.cookies)}, AuthHeader: ${ctx.req?.headers?.authorization}`);
      const user = ctx.user;
    return await getDashboard({ openId: user.id || (user as any).openId || user.email, email: user.email, name: user.name });
  }),
  records: publicProcedure
    .input(z.object({ section: z.enum(dashboardSections as any), query: z.string().optional().default("") }))
    .query(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error(`Auth failed! Cookies: ${JSON.stringify(ctx.req?.cookies)}, AuthHeader: ${ctx.req?.headers?.authorization}`);
      const user = ctx.user;
      return await getRecords({ openId: user.id || (user as any).openId || user.email, email: user.email, name: user.name }, input.section, input.query);
    }),
  
  getTeacherProfile: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { Teacher } = require("../models/school");
      const teacher = await Teacher.findById(input.id).lean();
      if (!teacher) throw new Error("Teacher not found");
      return { teacher };
    }),
  getStudentProfile: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error("Auth failed");
      return await getStudentProfile(ctx.user as any, input.id);
    }),
  
  updateProfilePicture: publicProcedure
    .input(z.object({ id: z.string().optional(), base64Image: z.string(), type: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error("Auth failed");
      const { SchoolUser, Student, Teacher } = require("../models/school");
      
      const identity = await require("../services/school").getSchoolIdentity(ctx.user as any);
      if (identity.role !== 'admin' && identity.role !== 'administrator') {
        throw new Error("Only administrators are allowed to update profile pictures at this time.");
      }

      let targetProfileId = null;
      let targetType = null;

      if (input.id) {
        // Admin updating someone else
        targetProfileId = input.id;
        targetType = input.type || "Student"; // Default to student if not specified
      } else {
        // User updating themselves
        const schoolUser = await SchoolUser.findOne({ email: ctx.user.email });
        if (!schoolUser) throw new Error("User not found");
        targetProfileId = schoolUser.profileId;
        targetType = schoolUser.profileType;
      }

      // 1. Update the Student/Teacher document
      if (targetType === "Student" || targetType === "student") {
        await Student.findByIdAndUpdate(targetProfileId, { profilePicture: input.base64Image });
      } else if (targetType === "Teacher" || targetType === "teacher") {
        await Teacher.findByIdAndUpdate(targetProfileId, { profilePicture: input.base64Image });
      }

      // 2. Always update the linked SchoolUser so the login avatar is synced
      if (targetProfileId) {
        await SchoolUser.updateMany(
          { profileId: targetProfileId },
          { $set: { profilePicture: input.base64Image } }
        );
      } else if (!input.id) {
        // Fallback: If no targetProfileId exists (e.g. they are an admin with no linked profile)
        await SchoolUser.updateOne(
          { email: ctx.user.email },
          { $set: { profilePicture: input.base64Image } }
        );
      }
      
      return { success: true };
    }),

  
  updateTeacherProfile: publicProcedure
    .input(z.object({ id: z.string(), updates: z.any() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error("Auth failed");
      const { Teacher, SchoolUser } = require("../models/school");
      
      const identity = await require("../services/school").getSchoolIdentity(ctx.user as any);
      
      // Admins can edit any teacher, Teachers can edit themselves
      if (identity.role !== 'admin' && identity.role !== 'administrator' && identity.profileId !== input.id) {
        throw new Error("Unauthorized to edit this teacher");
      }

      if (input.updates.password) {
        const hashedPassword = await bcrypt.hash(input.updates.password, 10);
        await SchoolUser.updateMany({ profileId: input.id }, { $set: { password: hashedPassword, plainPassword: input.updates.password } });
        delete input.updates.password;
      }

      const teacher = await Teacher.findByIdAndUpdate(input.id, { $set: input.updates }, { new: true });
      
      const schoolUserUpdates: any = {};
      if (input.updates.email) {
        schoolUserUpdates.email = input.updates.email.toLowerCase();
      }
      if (input.updates.profilePicture) {
        schoolUserUpdates.profilePicture = input.updates.profilePicture;
      }
      if (Object.keys(schoolUserUpdates).length > 0) {
        await SchoolUser.updateMany({ profileId: input.id }, { $set: schoolUserUpdates });
      }

      return teacher;
    }),

  updateStudentProfile: publicProcedure
    .input(z.object({ id: z.string(), updates: z.any() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error("Auth failed");
      return await updateStudentProfile(ctx.user as any, input.id, input.updates);
    }),
  toggleStudentStatus: publicProcedure
    .input(z.object({ id: z.string(), status: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error("Auth failed");
      return await toggleStudentStatus(ctx.user as any, input.id, input.status);
    }),
  deleteStudent: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error("Auth failed");
      return await deleteStudent(ctx.user as any, input.id);
    }),
  createRecord: publicProcedure
    .input(z.object({ section: z.enum(dashboardSections as any), payload: z.any() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error(`Auth failed! Cookies: ${JSON.stringify(ctx.req?.cookies)}, AuthHeader: ${ctx.req?.headers?.authorization}`);
      const user = ctx.user;
      return await createRecord({ openId: user.id || (user as any).openId || user.email, email: user.email, name: user.name }, input.section, input.payload);
    }),

  // CBT Endpoints
  listCBTExams: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) throw new Error("Auth failed");
    const { CBTExam } = require("../models/school");
    return await CBTExam.find({ isDeleted: false }).sort({ _id: -1 }).lean();
  }),
  createCBTExam: publicProcedure
    .input(z.object({
      title: z.string(),
      description: z.string().optional(),
      examType: z.string().optional(),
      subject: z.string().optional(),
      targetClass: z.string().optional(),
      code: z.string().optional(),
      marksPerQuestion: z.number().optional(),
      randomQuestionSelection: z.boolean().optional(),
      isPracticeTest: z.boolean().optional(),
      startAt: z.string().optional(),
      endAt: z.string().optional(),
      durationHours: z.number().optional(),
      durationMinutes: z.number().optional(),
      shuffleQuestions: z.boolean().optional(),
      shuffleAnswers: z.boolean().optional(),
      allowViewCorrectAnswers: z.boolean().optional(),
      publishResultAutomatically: z.boolean().optional(),
      instructions: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error("Auth failed");
      const { CBTExam } = require("../models/school");
      const identity = await require("../services/school").getSchoolIdentity(ctx.user as any);
      const exam = new CBTExam({ ...input, createdBy: identity.profileId || ctx.user.id });
      await exam.save();
      return exam;
    }),
  getCBTExam: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { CBTExam, CBTQuestion } = require("../models/school");
      const exam = await CBTExam.findById(input.id).lean();
      const questions = await CBTQuestion.find({ examId: input.id, isDeleted: false }).lean();
      return { exam, questions };
    }),
  addCBTQuestion: publicProcedure
    .input(z.object({ examId: z.string(), questionText: z.string(), options: z.array(z.string()), correctOptionIndex: z.number(), marks: z.number().optional() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error("Auth failed");
      const { CBTQuestion } = require("../models/school");
      const q = new CBTQuestion(input);
      await q.save();
      return q;
    }),
  deleteCBTQuestion: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error("Auth failed");
      const { CBTQuestion } = require("../models/school");
      await CBTQuestion.findByIdAndUpdate(input.id, { isDeleted: true });
      return { success: true };
    }),
  listBankQuestions: publicProcedure
    .input(z.object({ targetClass: z.string().optional(), subject: z.string().optional() }))
    .query(async ({ input }) => {
      const { CBTQuestion } = require("../models/school");
      const q: any = { examId: { $exists: false }, isDeleted: false };
      if (input.targetClass && input.targetClass !== "All") q.targetClass = input.targetClass;
      if (input.subject && input.subject !== "All") q.subject = input.subject;
      return await CBTQuestion.find(q).lean();
    }),
  createBankQuestion: publicProcedure
    .input(z.object({ targetClass: z.string(), subject: z.string(), topic: z.string().optional(), difficulty: z.string().optional(), questionText: z.string(), options: z.array(z.string()), correctOptionIndex: z.number(), tags: z.array(z.string()).optional() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error("Auth failed");
      const { CBTQuestion } = require("../models/school");
      const q = new CBTQuestion(input);
      await q.save();
      return q;
    }),
  getExamResultStats: publicProcedure
    .query(async () => {
      const { CBTExam, CBTAttempt } = require("../models/school");
      const exams = await CBTExam.find({ isDeleted: { $ne: true } }).lean();
      const stats = await Promise.all(exams.map(async (exam: any) => {
        const attempts = await CBTAttempt.find({ examId: exam._id }).lean();
        const totalCompleted = attempts.filter((a: any) => a.status === 'completed').length;
        return {
          ...exam,
          totalAttempt: attempts.length,
          totalCompleted
        };
      }));
      return stats;
    }),
  assignStudentsToCBTExam: publicProcedure
    .input(z.object({ examId: z.string(), studentIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error("Auth failed");
      const { CBTExam } = require("../models/school");
      await CBTExam.findByIdAndUpdate(input.examId, { assignedStudents: input.studentIds });
      return { success: true };
    }),
  getStudentsByClass: publicProcedure
    .input(z.object({ className: z.string() }))
    .query(async ({ input }) => {
      const { Student } = require("../models/school");
      return await Student.find({ 
        $or: [{ class: input.className }, { className: input.className }], 
        isDeleted: { $ne: true } 
      }).lean();
    }),
  publishCBTExam: publicProcedure
    .input(z.object({ id: z.string(), isPublished: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error("Auth failed");
      const { CBTExam } = require("../models/school");
      await CBTExam.findByIdAndUpdate(input.id, { isPublished: input.isPublished });
      return true;
    })
});
