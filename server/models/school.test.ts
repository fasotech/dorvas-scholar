import { describe, expect, it } from "vitest";
import * as schoolModels from "./school";

describe("school Mongoose model contract", () => {
  it("exports all required school management collections", () => {
    const required = [
      "Role", "SchoolUser", "Student", "Teacher", "Parent", "SchoolClass", "Subject", "ClassSubject", "AcademicSession", "Term",
      "Attendance", "Exam", "Question", "ExamAttempt", "ExamAnswer", "Result", "ReportCard", "Fee", "Payment", "Announcement",
      "Message", "Notification", "Document", "AuditLog", "Homework", "Assignment", "Timetable", "Admission",
    ];
    expect(required.every((name) => name in schoolModels)).toBe(true);
    expect(required).toHaveLength(28);
  });

  it("keeps soft deletion and timestamps on operational records", () => {
    for (const current of [schoolModels.Student, schoolModels.Attendance, schoolModels.Exam, schoolModels.Result, schoolModels.Payment]) {
      expect(current.schema.path("isDeleted")).toBeDefined();
      expect(current.schema.path("createdAt")).toBeDefined();
      expect(current.schema.path("updatedAt")).toBeDefined();
    }
  });

  it("defines uniqueness indexes for attendance, attempts, and results", () => {
    const attendanceIndexes = schoolModels.Attendance.schema.indexes().map(([fields]) => fields);
    const attemptIndexes = schoolModels.ExamAttempt.schema.indexes().map(([fields]) => fields);
    const resultIndexes = schoolModels.Result.schema.indexes().map(([fields]) => fields);
    expect(attendanceIndexes.some((fields) => fields.studentId === 1 && fields.date === 1 && fields.periodKey === 1)).toBe(true);
    expect(attemptIndexes.some((fields) => fields.examId === 1 && fields.studentId === 1 && fields.attemptNumber === 1)).toBe(true);
    expect(resultIndexes.some((fields) => fields.studentId === 1 && fields.examId === 1)).toBe(true);
  });
});
