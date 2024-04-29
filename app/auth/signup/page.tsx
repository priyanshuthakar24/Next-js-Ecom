"use client"
import React from "react";
import AuthFormContainer from "@components/AuthFormContainer";
// import { Button, Input } from "@material-tailwind/react/theme";
import { Button, Input } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useFormik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required!'),
  email: yup.string().email('Invalid email!').required("Email is requireq!"),
  password: yup.string().min(8, "password must be at least 8 characters.").required('Password is required!'),
});
export default function SignUp() {
  const { values, handleChange, handleBlur, handleSubmit, isSubmitting, errors, touched } = useFormik({
    initialValues: { name: '', email: '', password: '' },
    validationSchema,
    onSubmit: (values) => {
      console.log(values)
    }
  })
  const touchedKeys = Object.entries(touched).map(([key, value]) => {
    if (value) return key;
  });
  const finalErrors: string[] = []
  Object.entries(errors).forEach(([key, value]) => {
    if (touchedKeys.includes(key) && value) finalErrors.push(value)
  });
  const formErrors: string[] = finalErrors
  const { email, name, password } = values
  return (
    <AuthFormContainer title="Create New Account">
      <Input name="name" label="Name" onChange={handleChange} onBlur={handleBlur} value={name} />
      <Input name="email" label="Email" onChange={handleChange} onBlur={handleBlur} value={email} />
      <Input name="password" label="Password" type="password" onChange={handleChange} onBlur={handleBlur} value={password} />
      <Button type="submit" className="w-full">
        Sign up
      </Button>
      <div className="">
        {formErrors.map((err) => {
          return (
            <div key={err} className="space-x-1 flex items-center text-red-500">
              <XMarkIcon className="w-4 h-4" />
              <p className="text-xs">{err}</p>
            </div>
          );
        })}
      </div>
    </AuthFormContainer>
  );
}