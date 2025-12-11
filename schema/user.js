import { z } from "zod";

export const userSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    phoneNo: z.string().min(10),
})

export const EmailLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export const OtpLoginSchema = z.object({
    phoneNo: z.string().min(10),
})

export const OTPSchema = z.object({
    otp: z.number().min(100000).max(999999),
    phoneNo: z.string().min(10).optional(),
    email: z.string().email().optional()
}).refine((data) => data.phoneNo || data.email, {
    message: "Either phoneNo or email must be provided",
    path: ["email"]
});