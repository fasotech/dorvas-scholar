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

  
  seedDemoData: protectedProcedure.mutation(async () => {
    // Check if demo already exists
    const existing = await CBTExam.findOne({ title: "JAMB Mathematics Mock 2026" });
    if (existing) return { success: true, message: "Demo data already exists" };

    const exam = await CBTExam.create({
      title: "JAMB Mathematics Mock 2026",
      description: "Prepare for your UTME with this standard mock exam.",
      examType: "JAMB Practice",
      subject: "Mathematics",
      targetClass: "All",
      durationMinutes: 1, // 1 min for quick testing
      isPublished: true,
    });

    await CBTQuestion.create([
      { examId: exam._id, questionText: "If 2x + 3 = 11, what is the value of x?", options: ["2", "3", "4", "5"], correctOptionIndex: 2, marks: 1 },
      { examId: exam._id, questionText: "What is the derivative of x^2 with respect to x?", options: ["x", "2x", "2", "x^2"], correctOptionIndex: 1, marks: 1 },
      { examId: exam._id, questionText: "Simplify: (3^2) * (3^3)", options: ["3^5", "3^6", "9^5", "9^6"], correctOptionIndex: 0, marks: 1 }
    ]);

    const exam2 = await CBTExam.create({
      title: "Mid-Term Physics Assessment",
      description: "Official mid-term assessment. Ensure you are ready before starting.",
      examType: "Teacher Assessment",
      subject: "Physics",
      targetClass: "All",
      durationMinutes: 30,
      isPublished: true,
    });

    await CBTQuestion.create([
      { examId: exam2._id, questionText: "What is the SI unit of Force?", options: ["Joule", "Newton", "Watt", "Pascal"], correctOptionIndex: 1, marks: 5 }
    ]);

    await ClassNote.create({
      title: "Introduction to Quantum Mechanics",
      content: "Please read Chapter 4 of your textbook.\n\nKey Concepts:\n- Wave-particle duality\n- Heisenberg's Uncertainty Principle\n- Schrödinger equation\n\nBe prepared for a quiz on Friday.",
      subject: "Physics",
      targetClass: "All",
      teacherName: "Dr. Adebayo",
    });

    return { success: true };
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
