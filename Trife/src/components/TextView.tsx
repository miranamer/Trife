import React from 'react'

const TextView = () => {
  return (
    <div>
        
        <div className="flex flex-col gap-[15vh]">
          <div className="">
            <h1 className='text-2xl underline'>Day Overview</h1>
            <p className='mt-2'>Here is some text of day overview</p>
          </div>

          <div className="flex flex-col mt-10">
            <h1 className='text-2xl underline'>All Media</h1>
            <div className="flex items-center justify-center p-2 mt-10 w-[80vh]">
                <p>- Carousel Here -</p>
            </div>
          </div>

          <div className="flex gap-2 items-center justify-between w-[80vh] mt-10">
            <div className="">
              <h1 className='text-2xl underline'>Moods</h1>
              <p className='mt-2'>All Day's Moods Here</p>
            </div>

            <div className="">
              <h1 className='text-2xl underline'>Counters</h1>
              <p className='mt-2'>All Day's Counters Here</p>
            </div>
          </div>
        </div>
    
    </div>
  )
}

export default TextView