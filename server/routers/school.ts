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
