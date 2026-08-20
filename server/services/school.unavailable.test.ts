import { describe, expect, it, vi } from "vitest";

vi.mock("../mongo", () => ({
  getMongoConnection: vi.fn().mockResolvedValue(null),
  getMongoConnectionIssue: vi.fn().mockReturnValue("Atlas Network Access is not configured."),
}));

vi.mock("../models/school", () => ({
  AcademicSession: {}, Announcement: {}, Attendance: {}, Exam: {}, ExamAttempt: {}, Fee: {}, Payment: {}, Result: {}, SchoolClass: {}, SchoolUser: {}, Student: {},
}));

import { getDashboard, getSchoolHealth } from "./school";

describe("MongoDB-unavailable school responses", () => {
  const user = { openId: "portal-user", email: "user@example.com", name: "Portal User" };

  it("returns no dashboard records while explaining that Atlas is unavailable", async () => {
    await expect(getDashboard(user)).resolves.toMatchObject({
      metrics: [],
      upcoming: [],
      followUps: [],
      identity: { connection: "unavailable", linked: false },
    });
  });

  it("returns a setup-oriented health message without exposing the connection URI", async () => {
    const result = await getSchoolHealth(user);
    expect(result.database).toBe("unavailable");
    expect(result.message).toContain("MongoDB Atlas is unavailable");
    expect(JSON.stringify(result)).not.toContain("mongodb");
  });
});
