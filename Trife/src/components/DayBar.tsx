import React from 'react'
import type { page } from '../App';

//! Add pencil icon to right of DayBar to allow editing of Title for that day
//! Add Title parameter to pages to allow Titles for each day -> On click of + button to add new day, make modal for Title

const DayBar = ({page, highlighted}) => {
    const dateToMonthMap = {'01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'}; // Do these
    //bg-gradient-to-b from-[#F1E8D7] to-[#e3d9c0]
  return (
    <>
        <div className={`${highlighted ? 'bg-gradient-to-b from-[#f2ebde] to-[#dacda9]' : 'bg-[#EEE1BF]'} rounded-md hover:cursor-pointer w-full h-[85px] border-[#746C59] border-[2px] flex`}>
            <div className="text-[#746C59] w-[120px]  h-full flex flex-col items-center justify-center text-2xl border-r-[2px] border-[#746C59]">
                <h1>{page.date.substring(0, 2)}</h1>
                <h1>{dateToMonthMap[page.date.substring(3, 5)]}</h1>
            </div>
            <div className="w-full h-full px-2 py-1">
                <h1 className="text-xl font-semibold">{page.title}</h1>
                    <p className='mt-2'>{page.details}</p>
            </div>
        </div>
    </>
  )
}

export default DayBar