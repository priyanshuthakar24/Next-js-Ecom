import nodemailer from 'nodemailer'
type profile = { name: string; email: string }
interface EmailOptions {
    profile: profile,
    subject: 'verification' | 'forget-password' | 'password-changed',
    linkUrl?: string
}

// transporter function 
const generateMailTransporter = () => {
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "ee41192bfa3781",
            pass: "f5c33c2ce8171c"
        }
    });
    return transport

}

// verification funcation 
const sendEmailVerificationLink = async (profile: profile, linkUrl: string) => {
    const transport = generateMailTransporter()
    await transport.sendMail({
        from: 'verification@next@nextecom.com',
        to: profile.email,
        html: `<h1>Please verify your email by clicking on <a href="${linkUrl}">this link</a></h1>`
    })
}
// forget-password funcation 
const sendForgetPasswordLink = async (profile: profile, linkUrl: string) => {
    const transport = generateMailTransporter()
    await transport.sendMail({
        from: 'verification@next@nextecom.com',
        to: profile.email,
        html: `<h1> clicking on <a href="${linkUrl}">this link</a> to reset your Password</h1>`
    })
}
// updatedpassword funcation 
const sendUpdatePasswordConfirmation = async (profile: profile) => {
    const transport = generateMailTransporter()
    await transport.sendMail({
        from: 'verification@next@nextecom.com',
        to: profile.email,
        html: `<h1> We changed your password <a href="${process.env.SIGN_IN_URL}">click here</a> to SignIn</h1>`
    })
}
export const sendEmail = (option: EmailOptions) => {
    const { profile, subject, linkUrl } = option
    switch (subject) {
        case 'verification':
            return sendEmailVerificationLink(profile, linkUrl!);
        case 'forget-password':
            return sendForgetPasswordLink(profile, linkUrl!);
        case 'password-changed':
            return sendUpdatePasswordConfirmation(profile);
    }
};