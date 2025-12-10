import { EmailLoginSchema, userSchema, OtpLoginSchema, OTPSchema } from "../schema/user.js";
import { compareSync, hashSync } from "bcryptjs";
import { prismaClient } from "../routes/index.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { otpGenerator } from "../utils/randomOTP.js";
import { sendEmail } from "../services/mailer.js";
import redisClient from "../services/redis.js";
import { BadRequestException } from "../exceptions/bad-request.js";
import { UnprocessableEntityException } from "../exceptions/unprocessable-entity.js";
import { NotFoundException } from "../exceptions/not-found.js";
import { ErrorCodes } from "../exceptions/root.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const registerController = async(req, res, next) => {
    const result = userSchema.safeParse(req.body);
    if (!result.success) {
        return next(new UnprocessableEntityException("Zod invalidation", ErrorCodes.UNPROCESSABLE_ENTITY));
    }
    const userData = result.data;
    if (!userData.name || !userData.email || !userData.password || !userData.phoneNo) {
        return next(new BadRequestException("Please fill all the fields", ErrorCodes.ALL_FIELDS_REQUIRED));
    }
    
    // Check if email already exists
    const existingUserByEmail = await prismaClient.user.findUnique({
        where: { email: userData.email }
    });
    if (existingUserByEmail) {
        return next(new BadRequestException("Email already exists. Please use a different email.", ErrorCodes.USER_ALREADY_EXISTS));
    }
    
    // Check if phone number already exists
    const existingUserByPhone = await prismaClient.user.findUnique({
        where: { phoneNo: userData.phoneNo }
    });
    if (existingUserByPhone) {
        return next(new BadRequestException("Phone number already exists. Please use a different phone number.", ErrorCodes.USER_ALREADY_EXISTS));
    }
    
    const hashPassword = await hashSync(userData.password, 10);
    const user = await prismaClient.user.create({
        data: {
            name: userData.name,
            email: userData.email,
            password: hashPassword,
            phoneNo: userData.phoneNo
        }
    });
    return res.status(201).json({ message: "User created successfully", user: { name: user.name, email: user.email, phoneNo: user.phoneNo } });
}

export const loginController = async(req, res, next) => {
    const result = EmailLoginSchema.safeParse(req.body);
    if (!result.success) {
        return next(new UnprocessableEntityException("Zod invalidation", ErrorCodes.UNPROCESSABLE_ENTITY));
    }
    const userData = result.data;
    if (!userData.email || !userData.password) {
        return next(new BadRequestException("Please fill all the fields", ErrorCodes.ALL_FIELDS_REQUIRED));
    }
    const user = await prismaClient.user.findUnique({
        where: {
            email: userData.email
        }
    });
    if (!user) {
        return next(new NotFoundException("Invalid email or password", ErrorCodes.USER_NOT_FOUND));
    }
    const isPasswordMatch = compareSync(userData.password, user.password);
    if (!isPasswordMatch) {
        return next(new BadRequestException("Invalid email or password", ErrorCodes.INVALID_CREDENTIALS));
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
    return res.status(200).json({ message: "Login successfully", user: { name: user.name, email: user.email, phoneNo: user.phoneNo }, token });
}

export const otpLoginController = async(req, res, next) => {
    const result = OtpLoginSchema.safeParse(req.body);
    if (!result.success) {
        return next(new UnprocessableEntityException("Zod invalidation", ErrorCodes.UNPROCESSABLE_ENTITY));
    }
    const { phoneNo } = result.data;
    if (!phoneNo) {
        return next(new BadRequestException("Phone Number is required to send an OTP", ErrorCodes.PHONE_REQUIRED));
    }
    const user = await prismaClient.user.findUnique({
        where: { phoneNo }
    });
    if (!user) {
        return next(new NotFoundException("User not found with provided phone number", ErrorCodes.USER_NOT_FOUND));
    }
    const otp = otpGenerator();
    await redisClient.set(`otp:${phoneNo}`, otp, 'EX', 120); // OTP valid for 2 minutes
    const html = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fa; padding: 32px;">
            <div style="max-width: 400px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); padding: 32px;">
                <h2 style="color: #2d3748; text-align: center; margin-bottom: 16px;">Your Secure OTP</h2>
                <p style="font-size: 16px; color: #4a5568; text-align: center;">Use the code below to verify your login for <b>Multi-AI Agent Chatbot</b>:</p>
                <div style="text-align: center; margin: 24px 0;">
                    <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #3182ce; background: #ebf8ff; padding: 12px 24px; border-radius: 8px;">${otp}</span>
                </div>
                <p style="font-size: 14px; color: #718096; text-align: center;">This OTP is valid for 2 minutes. If you did not request this, please ignore this email.</p>
                <hr style="margin: 24px 0; border: none; border-top: 1px solid #e2e8f0;">
                <p style="font-size: 12px; color: #a0aec0; text-align: center;">&copy; ${new Date().getFullYear()} Multi-AI Agent Chatbot</p>
            </div>
        </div>
    `;
    await sendEmail(user.email, "Your Secure OTP for Multi-AI Agent Chatbot", html);
    return res.status(200).json({ message: "OTP sent successfully" });
}

export const otpVerifyController = async(req, res, next) => {
    const result = OTPSchema.safeParse(req.body);
    if (!result.success) {
        return next(new UnprocessableEntityException("Zod invalidation", ErrorCodes.UNPROCESSABLE_ENTITY));
    }
    const { otp, phoneNo } = result.data;
    if (!otp || !phoneNo) {
        return next(new BadRequestException("Phone Number and OTP are both required", ErrorCodes.OTP_REQUIRED));
    }
    const storedOtp = await redisClient.get(`otp:${phoneNo}`);
    if (!storedOtp) {
        return next(new BadRequestException("OTP expired or not sent to the provided phone number", ErrorCodes.INVALID_OTP));
    }
    if (Number(otp) !== Number(storedOtp)) {
        return next(new BadRequestException("Invalid OTP", ErrorCodes.INVALID_OTP));
    }
    const user = await prismaClient.user.findUnique({
        where: { phoneNo }
    });
    if (!user) {
        return next(new NotFoundException("User not found", ErrorCodes.USER_NOT_FOUND));
    }
    await redisClient.del(`otp:${phoneNo}`); // Remove OTP after successful verification
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
    return res.status(200).json({ message: "Login successfully", token });
}

export const getUserController = async(req, res, next) => {
    // user comes from authMiddleware after token verification.
    const id = req.user.id;
    const dbUser = await prismaClient.user.findUnique({
        where: {
            id: id
        }
    });
    if (!dbUser) {
        return next(new NotFoundException("User not found", ErrorCodes.USER_NOT_FOUND));
    }
    return res.status(200).json({ message: "User Retrieved Successfully", user: { id: dbUser.id, name: dbUser.name, email: dbUser.email, phoneNo: dbUser.phoneNo }});
}