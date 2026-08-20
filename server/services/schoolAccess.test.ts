import { describe, expect, it } from "vitest";
import { canAccessSection } from "./schoolAccess";

describe("school role access matrix", () => {
  it("restricts finance settings to administrators", () => {
    expect(canAccessSection("admin", "fees")).toBe(true);
    expect(canAccessSection("teacher", "fees")).toBe(false);
    expect(canAccessSection("student", "settings")).toBe(false);
    expect(canAccessSection("parent", "settings")).toBe(false);
  });

  it("allows a student and parent only their record-oriented sections", () => {
    expect(canAccessSection("student", "results")).toBe(true);
    expect(canAccessSection("student", "students")).toBe(true);
    expect(canAccessSection("parent", "attendance")).toBe(true);
    expect(canAccessSection("parent", "classes")).toBe(false);
  });

  it("does not grant access without a recognised school role", () => {
    expect(canAccessSection(null, "students")).toBe(false);
  });
});
