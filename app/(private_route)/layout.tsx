import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import React, { ReactNode } from 'react'
import EmailVerificationBanner from '../components/EmailVerificationBanner'
import Navbar from '@components/navbar'
interface Props {
    children: ReactNode
}
export default async function PrivateLayout({ children }: Props) {
    const session = await auth()
    if (!session) return redirect('/auth/signin');
    // console.log(session.user);
    return (
        <div className='max-w-screen-xl mx-auto p-4 xl:p-0'>
            <Navbar />
            <EmailVerificationBanner />
            {children}</div>
    )
}
