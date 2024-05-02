import { UpdatePasswordRequest } from "@/app/types";
import { error } from "console";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server"
import startDb from "@/app/lib/db";
import PasswordResetTokenModel from "@/app/models/passwordResetTokenModel";
import UserModel from "@/app/models/userModel";
import { sendEmail } from "@/app/lib/email";
import nodemailer from 'nodemailer'
export const POST = async (req: Request) => {
    try {
        const { password, token, userId } = await req.json() as UpdatePasswordRequest
        if (!password || !token || !isValidObjectId(userId)) return NextResponse.json({ error: 'Invalid request!' }, { status: 401 });
        await startDb();
        const resetToken = await PasswordResetTokenModel.findOne({ user: userId });
        if (!resetToken) return NextResponse.json({ error: 'Invalid request!,token not Found' }, { status: 401 });
        const matched = await resetToken.compareToken(token);
        if (!matched) return NextResponse.json({ error: 'Invalid request!,token Dosent match' }, { status: 401 });

        const user = await UserModel.findById(userId)
        if (!user) return NextResponse.json({ error: 'User not Found' }, { status: 404 });
        const isMatched = await user.comparePassword(password)
        if (isMatched) return NextResponse.json({ error: "New password must be different" }, { status: 401 })
        user.password = password
        await user.save();
        await PasswordResetTokenModel.findByIdAndDelete(resetToken._id);
        await sendEmail({ profile: { name: user.name, email: user.email }, subject: "password-changed" })
        return NextResponse.json({ message: "Your Password is now changed" });

    } catch (error) {
        return NextResponse.json({
            error: "Could not Upadete Password, somthing went wrong!",
        },
            { status: 500 });
    }
}
// const transport = nodemailer.createTransport({
//     host: "sandbox.smtp.mailtrap.io",
//     port: 2525,
//     auth: {
//         user: "ee41192bfa3781",
//         pass: "f5c33c2ce8171c"
//     }
// });
// await transport.sendMail({
//     from: 'verification@next@nextecom.com',
//     to: user.email,
//     html: `<h1> Your Password is now changed</h1>`
// })