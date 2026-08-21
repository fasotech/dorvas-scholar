const fs = require('fs');
let code = fs.readFileSync('server/routers/studentPortal.ts', 'utf8');

const seedMutation = `
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
      content: "Please read Chapter 4 of your textbook.\\n\\nKey Concepts:\\n- Wave-particle duality\\n- Heisenberg's Uncertainty Principle\\n- Schrödinger equation\\n\\nBe prepared for a quiz on Friday.",
      subject: "Physics",
      targetClass: "All",
      teacherName: "Dr. Adebayo",
    });

    return { success: true };
  }),
`;

code = code.replace(
  'submitExam: protectedProcedure',
  seedMutation + '\n  submitExam: protectedProcedure'
);

fs.writeFileSync('server/routers/studentPortal.ts', code);
