import React from 'react'

//! Add pencil icon to right of DayBar to allow editing of Title for that day
//! Add Title parameter to pages to allow Titles for each day -> On click of + button to add new day, make modal for Title

const DayBar = ({page, highlighted}) => {
    const dateToMonthMap = {'01': 'Jan'};

  return (
    <>
        <div className={`${highlighted ? 'bg-[#EEE1BF]' : 'bg-[#FAF6EC]'} hover:cursor-pointer w-full h-[85px] border-[#746C59] border-[2px] flex`}>
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