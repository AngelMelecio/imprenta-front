import React from 'react'

const WhitePage = ({ children }) => {
    return (
        <div className='w-full h-full bg-white rounded-lg shadow-md'>
            <div className='relative w-full h-full overflow-scroll'>
                <div className='absolute top-0 w-full'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default WhitePage