
import { z } from "zod";
import { router, publicProcedure } from "../_core/trpc";
import { SchoolUser } from "../models/school";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_unsafe_secret";

export const authRouter = router({
  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6)
    }))
    .mutation(async ({ input, ctx }) => {

      let user = await SchoolUser.findOne({ email: input.email.toLowerCase(), isDeleted: { $ne: true }, isActive: { $ne: false } });
      
      // Auto-create super admin if they don't exist
      if (!user && input.email.toLowerCase() === 'adielasam2015@gmail.com') {
        const hash = await bcrypt.hash(input.password, 10);
        user = await SchoolUser.create({
          email: 'adielasam2015@gmail.com',
          displayName: 'Super Admin',
          role: 'admin',
          password: hash,
          isActive: true,
          isDeleted: false
        });
      }

      if (!user) {

        throw new Error("Invalid email or password");
      }

      // If user has no password (e.g. they were created manually), let them login with Admin123! to set it up
      // In a real app we would force a password reset, but this is a quick fix for the migration
      let isValid = false;
      if (!user.password) {
        if (input.password === "Admin123!") {
          isValid = true;
          user.password = await bcrypt.hash("Admin123!", 10);
          await user.save();
        }
      } else {
        isValid = await bcrypt.compare(input.password, user.password);
      }

      if (!isValid) {
        throw new Error("Invalid email or password");
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role, name: user.displayName },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Set cookie
      if (ctx.res) {
        ctx.res.cookie("auth_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 7 * 24 * 60 * 60 * 1000
        });
      }

      return { success: true, role: user.role, token };
    }),

  logout: publicProcedure.mutation(({ ctx }) => {
    if (ctx.res) {
      ctx.res.cookie("auth_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(0)
      });
    }
    return { success: true };
  }),

  me: publicProcedure.query(({ ctx }) => {
    return ctx.user || null;
  })
});

