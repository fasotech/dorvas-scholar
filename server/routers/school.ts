import { getStudentProfile, updateStudentProfile, toggleStudentStatus, deleteStudent } from "../services/studentProfile";
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
      
      let targetProfileId = null;
      let targetType = null;

      if (input.id) {
        // Admin updating someone else
        const identity = await require("../services/schoolAccess").getSchoolIdentity(ctx.user as any);
        if (identity.role !== 'admin' && identity.role !== 'administrator') {
          throw new Error("Unauthorized to edit other profiles");
        }
        targetProfileId = input.id;
        targetType = input.type || "Student"; // Default to student if not specified
      } else {
        // User updating themselves
        const schoolUser = await SchoolUser.findOne({ email: ctx.user.email });
        if (!schoolUser) throw new Error("User not found");
        targetProfileId = schoolUser.profileId;
        targetType = schoolUser.profileType;
        
        // Also update the SchoolUser itself
        schoolUser.profilePicture = input.base64Image;
        await schoolUser.save();
      }

      if (targetType === "Student" || targetType === "student") {
        await Student.findByIdAndUpdate(targetProfileId, { profilePicture: input.base64Image });
      } else if (targetType === "Teacher" || targetType === "teacher") {
        await Teacher.findByIdAndUpdate(targetProfileId, { profilePicture: input.base64Image });
      } else if (targetType === "Admin" || targetType === "admin") {
         // Admins might not have a profile, just update the SchoolUser which we already did
      }
      
      return { success: true };
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
    })
});
