import React from 'react'

const Summary = ({ data }) => {
    return (
        <div className='w-full px-4'>
            {
                data.map((item, indx) =>
                    <div className='flex items-center justify-between pt-2 pb-1 border-b' key={`D_${indx}`}>
                        <p className='font-semibold text-gray-600 '>{item.label}:</p>
                        <p className='text-xl text-emerald-900'>{item.value}</p>
                    </div>)
            }
        </div>
    )
}

export default Summary