import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { CBTExam, CBTQuestion, CBTAttempt, ClassNote, Student } from "../models/school";

export const studentPortalRouter = router({
  getDashboardData: protectedProcedure.query(async ({ ctx }) => {
    const { SchoolUser } = require("../models/school");
    const schoolUser = await SchoolUser.findOne({ _id: ctx.user.id });
    const student = schoolUser && schoolUser.profileId ? await Student.findOne({ _id: schoolUser.profileId, isDeleted: { $ne: true } }) : null;
    if (!student) throw new Error("Student profile not found");

    const activeExams = await CBTExam.find({ 
      isPublished: true, 
      isDeleted: { $ne: true },
      $or: [
        { targetClass: student.className },
        { targetClass: 'All' }
      ]
    }).lean();

    const recentNotes = await ClassNote.find({
      isDeleted: { $ne: true },
      $or: [
        { targetClass: student.className },
        { targetClass: 'All' }
      ]
    }).sort({ _id: -1 }).limit(5).lean();

    const attempts = await CBTAttempt.find({ studentId: student._id }).lean();

    // Map exams to include attempt status
    const exams = activeExams.map(exam => {
      const attempt = attempts.find(a => a.examId.toString() === exam._id.toString());
      return {
        ...exam,
        hasAttempted: !!attempt,
        score: attempt ? attempt.score : null,
        totalMarks: attempt ? attempt.totalMarks : null
      };
    });

    return {
      student,
      exams,
      recentNotes
    };
  }),

  startExam: protectedProcedure
    .input(z.object({ examId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { SchoolUser } = require("../models/school");
      const schoolUser = await SchoolUser.findOne({ _id: ctx.user.id });
      const student = schoolUser && schoolUser.profileId ? await Student.findOne({ _id: schoolUser.profileId, isDeleted: { $ne: true } }) : null;
      if (!student) throw new Error("Student profile not found");

      const exam = await CBTExam.findOne({ _id: input.examId, isDeleted: { $ne: true } });
      if (!exam) throw new Error("Exam not found");

      // Check if attempt already exists
      let attempt = await CBTAttempt.findOne({ examId: exam._id, studentId: student._id });
      
      // If Teacher Assessment and already completed, block retake
      if (attempt && attempt.status === 'completed' && exam.examType === 'Teacher Assessment') {
        throw new Error("You have already completed this assessment. Retakes are not allowed.");
      }

      // If JAMB Practice or Mock, we can allow restart by resetting or creating a new attempt 
      // (For simplicity, we'll reset the attempt if it's a practice exam)
      if (attempt && attempt.status === 'completed') {
        await CBTAttempt.deleteOne({ _id: attempt._id });
        attempt = null;
      }

      if (!attempt) {
        attempt = await CBTAttempt.create({
          examId: exam._id,
          studentId: student._id,
          status: 'in-progress'
        });
      }

      // Fetch questions but strip out the correctOptionIndex to prevent cheating
      const questions = await CBTQuestion.find({ examId: exam._id, isDeleted: { $ne: true } }).lean();
      const safeQuestions = questions.map(q => ({
        id: q._id,
        questionText: q.questionText,
        options: q.options,
        marks: q.marks
      }));

      return {
        attemptId: attempt._id,
        exam,
        questions: safeQuestions
      };
    }),

  submitExam: protectedProcedure
    .input(z.object({
      attemptId: z.string(),
      answers: z.array(z.object({
        questionId: z.string(),
        selectedOptionIndex: z.number().nullable()
      }))
    }))
    .mutation(async ({ ctx, input }) => {
      const { SchoolUser } = require("../models/school");
      const schoolUser = await SchoolUser.findOne({ _id: ctx.user.id });
      const attempt = schoolUser && schoolUser.profileId ? await CBTAttempt.findOne({ _id: input.attemptId, studentId: schoolUser.profileId }) : null;
      if (!attempt) throw new Error("Attempt not found");
      if (attempt.status === 'completed') throw new Error("Exam already submitted");

      const questions = await CBTQuestion.find({ examId: attempt.examId }).lean();
      
      let score = 0;
      let totalMarks = 0;

      for (const q of questions) {
        totalMarks += (q.marks || 1);
        const submittedAnswer = input.answers.find(a => a.questionId === q._id.toString());
        if (submittedAnswer && submittedAnswer.selectedOptionIndex === q.correctOptionIndex) {
          score += (q.marks || 1);
        }
      }

      attempt.score = score;
      attempt.totalMarks = totalMarks;
      attempt.status = 'completed';
      attempt.completedAt = new Date();
      attempt.answers = input.answers;

      await attempt.save();

      return { score, totalMarks };
    })
});
