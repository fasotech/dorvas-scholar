
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { SchoolUser, Student, Teacher, Parent, Role } from "../models/school";
import bcrypt from "bcryptjs";

export const usersRouter = router({
  listUsers: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") throw new Error("UNAUTHORIZED");
    const users = await SchoolUser.find({ isDeleted: false }).lean();
    return users.map(u => ({
      id: u._id.toString(),
      email: u.email,
      displayName: u.displayName,
      role: u.role,
      isActive: u.isActive
    }));
  }),

  createUser: protectedProcedure
    .input(z.object({
      email: z.string().email(),
      displayName: z.string(),
      role: z.enum(["admin", "teacher", "student", "parent"]),
      password: z.string().min(6)
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("UNAUTHORIZED");

      const existingUser = await SchoolUser.findOne({ email: input.email.toLowerCase() });
      if (existingUser && !existingUser.isDeleted) throw new Error("Email already in use");

      const hashedPassword = await bcrypt.hash(input.password, 10);
      
      let profileId = null;
      if (input.role === "student") {
        const student = await Student.create({ name: input.displayName });
        profileId = student._id;
      } else if (input.role === "teacher") {
        const teacher = await Teacher.create({ name: input.displayName });
        profileId = teacher._id;
      } else if (input.role === "parent") {
        const parent = await Parent.create({ name: input.displayName });
        profileId = parent._id;
      }

      const newUser = await SchoolUser.create({
        email: input.email.toLowerCase(),
        displayName: input.displayName,
        role: input.role,
        password: hashedPassword,
        profileType: input.role === "admin" ? null : input.role,
        profileId,
        isActive: true,
        isDeleted: false
      });

      return { success: true, id: newUser._id.toString() };
    }),

  deleteUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("UNAUTHORIZED");

      const userToDelete = await SchoolUser.findById(input.id);
      if (!userToDelete) throw new Error("User not found");

      if (userToDelete.role === "admin" && ctx.user.email !== "adielasam2015@gmail.com") {
        throw new Error("Only the super admin can remove other admins");
      }
      
      if (userToDelete.email === "adielasam2015@gmail.com") {
        throw new Error("Cannot delete super admin");
      }

      userToDelete.isDeleted = true;
      userToDelete.isActive = false;
      await userToDelete.save();
      return { success: true };
    })
});

