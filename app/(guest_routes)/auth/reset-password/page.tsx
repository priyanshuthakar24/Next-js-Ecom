import UpdatePassword from '@/app/components/UpdatePassword';
import startDb from '@/app/lib/db';
import PasswordResetTokenModel from '@/app/models/passwordResetTokenModel';
import { notFound, redirect } from 'next/navigation';
import React from 'react'
interface Props {
    searchParams: {
        token: string;
        userId: string;
    }
}
const fetchTokenValidation = async (token: string, userId: string) => {
    await startDb();
    const resetToken = await PasswordResetTokenModel.findOne({ user: userId });
    if (!resetToken) return null;
    const matched = await resetToken.compareToken(token);
    if (!matched) return null;
    return true;
}


export default async function ResetPasswordp({ searchParams }: Props) {
    const { token, userId } = searchParams;
    if (!token || !userId) return redirect('/404')
    const isvalid = await fetchTokenValidation(token, userId)
    if (!isvalid) return redirect('/404')
    return (
        <UpdatePassword token={token} userId={userId} />
    )
}
