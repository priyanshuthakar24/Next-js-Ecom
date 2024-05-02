import EmailVerificationToken from "@/app/models/emailVerificationToken"
import UserModel from "@/app/models/userModel"
import { EmailVerificationRequest } from "@/app/types"
import { isValidObjectId } from "mongoose"
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {
    try {
        const { token, userId } = await req.json() as EmailVerificationRequest
        if (!isValidObjectId(userId) || !token) {
            return NextResponse.json({ error: "Invalid request,userId and token is required!" }, { status: 401 });
        }
        const verifyToken = await EmailVerificationToken.findOne({ user: userId })
        if (!verifyToken) {
            return NextResponse.json({ error: "invalid token!" }, { status: 401 });
        }
        const isMatched = await verifyToken.compareToken(token)
        if (!isMatched) {
            return NextResponse.json(
                { error: "Invalid token!,token dosen't match!" },
                { status: 401 }
            )
        }
        await UserModel.findByIdAndUpdate(userId, { varified: true })
        await EmailVerificationToken.findByIdAndDelete(verifyToken._id)
        return NextResponse.json({ message: 'Emai is Verified' })
    } catch (error) {
        return NextResponse.json({ error: "could not verify email,somthing went wrong!" }, { status: 500 })
    }
}