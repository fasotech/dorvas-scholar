import { Types } from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../models/school", () => ({
  Parent: { findById: vi.fn() },
  Student: { findById: vi.fn(), find: vi.fn() },
  Teacher: { findById: vi.fn() },
}));

import { Parent, Student, Teacher } from "../models/school";
import { getScopedFilter } from "./schoolAccess";

const profileId = "507f1f77bcf86cd799439011";
const childId = new Types.ObjectId("507f1f77bcf86cd799439012");
const classId = new Types.ObjectId("507f1f77bcf86cd799439013");

function resolvedQuery(value: unknown) {
  return { select: vi.fn().mockReturnValue({ lean: vi.fn().mockResolvedValue(value) }) };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getScopedFilter", () => {
  it("limits a student’s attendance query to the student profile", async () => {
    vi.mocked(Student.findById).mockReturnValue(resolvedQuery({ _id: new Types.ObjectId(profileId), classId }) as never);
    const filter = await getScopedFilter({ role: "student", linked: true, profileId, schoolUserId: null }, "attendance");
    expect(String(filter.studentId)).toBe(profileId);
  });

  it("limits a teacher’s results query to assigned classes", async () => {
    vi.mocked(Teacher.findById).mockReturnValue(resolvedQuery({ classIds: [classId], subjectIds: [] }) as never);
    const filter = await getScopedFilter({ role: "teacher", linked: true, profileId, schoolUserId: null }, "results");
    expect((filter.classId as { $in: Types.ObjectId[] }).$in.map(String)).toEqual([String(classId)]);
  });

  it("limits a parent’s fee query to linked children", async () => {
    vi.mocked(Parent.findById).mockReturnValue(resolvedQuery({ studentIds: [childId] }) as never);
    vi.mocked(Student.find).mockReturnValue(resolvedQuery([{ _id: childId, classId }]) as never);
    const filter = await getScopedFilter({ role: "parent", linked: true, profileId, schoolUserId: null }, "fees");
    expect((filter.studentId as { $in: Types.ObjectId[] }).$in.map(String)).toEqual([String(childId)]);
  });
});
