
import AuthForm from '@/app/components/auth/auth-form';
import AuthHeader from '@/app/components/auth/auth-header';
import React from 'react'

const formItems = [
    { name: "Full Name", type: "text", placeHolder: "enter full name" },
    { name: "Email", type: "email", placeHolder: "enter email" },
    { name: "Password", type: "password", placeHolder: "enter password" },
    { name: "Confirm Password", type: "password", placeHolder: "enter confirm password" },
]


const SignUpPage = () => {
    return (

        <article className='bg-gray flex items-center gap-5 flex-col justify-center h-full px-4'>
            <AuthHeader />
            <div className='w-full max-w-md'>
                <AuthForm formItems={formItems} type='SIGNUP' />
            </div>
        </article>
    )
}

export default SignUpPage