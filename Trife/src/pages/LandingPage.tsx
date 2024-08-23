import React from 'react'
import TrifeMainpage from '../assets/Trife_mainpage.png'
import { IoIosCheckmarkCircle } from "react-icons/io";
import { Navigate, useNavigate } from 'react-router-dom';

const LandingPage = () => {
    
    const features = [{title: 'Add Journal Entries', details: 'Add a journal entry for each day'}, {title: 'Build A Decision Tree', details: 'Add nodes to your entry to make a tree'}, {title: 'Filter Entries', details: 'Filter entries by mood, tags, date and text'}, {title: 'Add details and images to nodes', details: "Allows you to provide context to your day"}]
    const navigate = useNavigate();

return (
    <div className="w-full h-100vh font-dmMono py-10 px-5 bg-gradient-to-b from-[#e3e5e3] to-[#a1baa7]">
        <div className='shadow-lg rounded-t-2xl bg-gradient-to-b from-[#01431B] to-[#018738] py-[10%] flex flex-col gap-10 items-center justify-center'>
            <h1 className='text-[100px] text-white'>Trife</h1>
            <p className='py-2 px-3 glassMorphism text-white font-bold rounded-3xl relative bottom-5'>Tree of Life</p>
            <div className="flex flex-col items-center gap-5 relative top-10">
                <h1 className='text-4xl text-white'>Get Started</h1>
                <div className="flex gap-5">
                    <button onClick={() => navigate('/signup')} className='glassMorphism text-[#f5eddf] px-5 py-2 rounded-md'>Sign Up</button>
                    <button onClick={() => navigate('/login')} className='glassMorphism text-[#f5eddf] px-5 py-2 rounded-md'>Log In</button>
                </div>
            </div>
        </div>

        <div className="w-full h-[3px] bg-[#746C59]"></div>

        <div className="p-10 bg-[#f5eddf]">
            <div className="w-full flex items-center justify-center text-center">
                <h1 className='text-4xl text-[#746C59] mb-10'>What is Trife?</h1>
            </div>
            <div className="flex items-center justify-center w-full gap-[10%] mt-5">
                <div className="w-[60%] flex flex-wrap">
                    <h1 className='text-2xl text-[#746C59] text-center'>Trife is a journalling app that allows you to visualise and record your day through tree structures.
                        This provides you with the ability to form correlations between the choices you have made and the effect that
                        they have had on your day. This can help you make better decisions in the future and to reflect on
                        the choices you have made in the past.
                    </h1>
                </div>
            </div>
        </div>

        <div className="w-full h-[3px] bg-[#746C59]"></div>

        <div className="p-10 bg-[#f5eddf]">
            <div className="w-full flex items-center justify-center text-center">
                <h1 className='text-4xl text-[#746C59] mb-10'>UI Design</h1>
            </div>
            <div className="flex items-center w-full gap-[10%] mt-10">
                <img src={TrifeMainpage} alt="" className='w-[50%] shadow-sm' />
                <div className="text-2xl">
                    <ul className=''>
                        <li className='shadow-md mb-10 px-2 py-2 bg-[#746C59] text-center rounded-md text-white border-2 border-[#312e27] flex items-center'><IoIosCheckmarkCircle className="mr-2 text-green-300" /> Journal Book Aesthetic</li>
                        <li className='shadow-md mb-10 px-2 py-2 bg-[#746C59] text-center rounded-md text-white border-2 border-[#312e27] flex items-center'><IoIosCheckmarkCircle className="mr-2 text-green-300" />Intuitive User Experience</li>
                        <li className='shadow-md mb-10 px-2 py-2 bg-[#746C59] text-center rounded-md text-white border-2 border-[#312e27] flex items-center'><IoIosCheckmarkCircle className="mr-2 text-green-300" />Beautiful Trees</li>
                    </ul>
                </div>
            </div>
        </div>

        <div className="w-full h-[3px] bg-[#746C59]"></div>

        <div className="p-10 bg-[#f5eddf]">
            <div className="w-full flex items-center justify-center text-center">
                <h1 className='text-4xl text-[#746C59] mb-10'>Core Features</h1>
            </div>
            <div className="flex flex-col items-center w-full gap-10 mt-10 justify-center text-[#746C59]">
                {features.map((feature, index) => (
                    <div className="text-2xl w-[80%]">
                    <div className='bg-[#EEE1BF] shadow-md rounded-md w-full h-[85px] border-[#746C59] border-[2px] flex'>
                        <div className="text-[#746C59] w-[120px]  h-full flex flex-col items-center justify-center text-2xl border-r-[2px] border-[#746C59]">
                            <h1>{index + 1}</h1>
                        </div>
                        <div className="w-full h-full px-2 py-1">
                            <h1 className="text-2xl font-semibold">{feature.title}</h1>
                                <p className='text-md mt-2'>{feature.details}</p>
                        </div>
                    </div>
                </div>
                ))}
            </div>
        </div>

        <div className="w-full h-[3px] bg-[#746C59]"></div>

        <div className="p-10 bg-[#f5eddf]">
            <div className="w-full flex items-center justify-center text-center">
                <h1 className='text-4xl text-[#746C59] mb-10'>Node Types</h1>
            </div>
            <div className="flex items-center justify-center w-full gap-[10%] mt-10 py-10">
                <p className='StyledNodeChoice'>Choice</p>
                <p className='StyledNodeResultGood'>Good</p>
                <p className='StyledNodeResultMedium'>Mid</p>
                <p className='StyledNodeResultBad'>Bad</p>
                <p className='StyledNodeRetrospect'>Retrospect</p>
            </div>
            <div className="flex flex-col justify-center w-full gap-10 mt-20 text-2xl">
                <p><span className='text-blue-400 font-bold'>Choice Node</span> - Represents a choice you either did or could have done.</p>
                <p><span className='text-green-500 font-bold'>Good Result Node</span> - A child node to a choice. Represents a choice that led to a good result.</p>
                <p><span className='text-yellow-500 font-bold'>Mid Result Node</span> - Represents a choice that led to an okay result.</p>
                <p><span className='text-red-500 font-bold'>Bad Result Node</span> - Represents a choice that led to a bad result.</p>
                <p><span className='text-pink-500 font-bold'>Retrospect Node</span> - Represents what you should have done in retrospect.</p>
            </div>
        </div>

        <div className="w-full h-[3px] bg-[#746C59]"></div>

        <div className="p-10 bg-[#f5eddf] flex items-center justify-center rounded-b-2xl">
            <p className='text-xl'>Trife - 2024</p>
        </div>


    </div>
)
}

export default LandingPage