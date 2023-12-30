'use client';

import { ChangeEvent, FormEvent, useState } from 'react'
import { addUser, signUpUser } from '../utils/Firebase';
import { useNavigate } from 'react-router-dom'

import { Button, Card, Label, TextInput } from 'flowbite-react';



const defaultFormFields = {
  email: '',
  password: '',
}

export const SignUp = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password } = formFields;
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const resetFormFields = () => {
    return (
      setFormFields(defaultFormFields)
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    

    if (formFields.password.length < 6) {
      setIsError(true);
      setErrorMessage('Password should be at least 6 characters long!');
      return;
    }

    try {
      // Send the email and password to firebase
      const userCredential = await signUpUser(email, password);
      
      if (userCredential) {

        await addUser(userCredential.user);
        console.log(userCredential);
        resetFormFields();
        navigate('/profile');
      }
    } catch (error) {
      setIsError(true);
      setErrorMessage('User already exists!');
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsError(false);
    setErrorMessage('');
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  }

  return (
    <div className='flex flex-col justify-center items-center h-screen bg-black'>
      <Card className="bg-white mb-10">
        <form className="flex flex-col gap-4 justify-between" onSubmit={handleSubmit}>
          <div className='text-5xl text-[#de004e]'>Sign Up</div>
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
        </form>
      </Card>
      <div className="p-4 text-sm rounded-lg bg-red-50" role="alert" style={{ visibility: isError ? 'visible' : 'hidden' }}>
        {isError && (
          <>
            <span className="font-medium text-red-800">Error. </span>
            {errorMessage}
          </>
        )}
      </div>
    </div>
  )
}
