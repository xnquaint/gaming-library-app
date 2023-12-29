'use client';

import { ChangeEvent, FormEvent, useState } from 'react'
import { signInUser } from '../utils/Firebase';
import { Link, useNavigate } from 'react-router-dom'

import { Button, Card, Label, TextInput } from 'flowbite-react';

const defaultFormFields = {
  email: '',
  password: '',
}

export const Authentication = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password } = formFields;
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);

  const resetFormFields = () => {
    return (
      setFormFields(defaultFormFields)
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsError(false);

    try {
      const userCredential = await signInUser(email, password);

      if (userCredential) {
        resetFormFields();
        navigate('/profile');
      }
    } catch (error) {
      setIsError(true);
      console.log('User Sign In Failed', error);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsError(false);
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  }

  return (
    <div className='flex flex-col justify-center items-center h-screen bg-black'>
      <div>
        <Card className="bg-white mb-5">
          <form className="flex flex-col gap-4 justify-between" onSubmit={handleSubmit}>
            <div className='text-5xl text-[#de004e]'>Sign In Into Your Account</div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email1" value="Your email" className='text-3xl' />
              </div>
              <TextInput
                sizing="lg"
                id="email1"
                name='email'
                type="email"
                placeholder="name@flowbite.com"
                value={email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password1" value="Your password" className='text-3xl' />
              </div>
              <TextInput
                sizing="lg"
                id="password1"
                name='password'
                type="password"
                value={password}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className='text-white bg-black text-5xl w-25'>Submit</Button>
            <Link to="/authentication/signup">
              <div className='underline'>
                Don't have an account? Sign Up
              </div>
            </Link>
          </form>
        </Card>
      </div>
      <div className="p-4 text-sm rounded-lg bg-red-50" role="alert" style={{ visibility: isError ? 'visible' : 'hidden' }}>
        {isError && (
          <>
            <span className="font-medium text-red-800">Error. </span>There is no such user! Please try again!
          </>
        )}
      </div>
    </div>
  )
}
