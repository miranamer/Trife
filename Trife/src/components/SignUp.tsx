import {React, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { supabaseClient } from '../config/supabase-client';

const SignUp = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();

    const { error } = await supabaseClient.auth.signUp({ email, password });

    if (error) {
        setError(error.message);
        console.log('->', error.message);
    } else {
        navigate('/'); // Redirect to login after successful sign-up
    }
  };

  return (
    <div className='bg-[#F1E8D7] flex flex-col items-center justify-center w-full h-screen font-dmMono'>
        <div className="relative bottom-[10%] text-center">
            <h1 className=' text-[60px] font-bold text-[#a09780]'>Trife</h1>
            <p className='relative text-[#a09780] top-2 font-semibold'>Tree of Life</p>
        </div>
        <div className="w-[400px] h-[550px] border-[#746C59] text-[#746C59] border-2 rounded-md flex flex-col gap-10 items-center p-10 text-2xl bg-[#EEE1BF] shadow-md">
            <h1>Sign Up</h1>
            <form onSubmit={handleSignUp} action="" className='mt-10'>
                <input onChange={(e) => setEmail(e.target.value)} value={email} type="text" placeholder='Email' className='bg-[#F1E8D7] p-2 border-[#746C59] border-2 rounded-md shadow-md mb-10' />
                <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder='Password' className='bg-[#F1E8D7] p-2 border-[#746C59] border-2 rounded-md shadow-md' />
                <button className='bg-gradient-to-b from-[#F1E8D7] to-[#e7dab9] border-2 border-[#746C59] p-2 mt-10 w-full text-[#746C59] rounded-md'>Submit</button>
            </form>
            <i className='mt-5 text-lg hover:cursor-pointer hover:underline' onClick={() => navigate('/login')}> Already Have An Account? </i>
        </div>
    </div>
  )
}

export default SignUp