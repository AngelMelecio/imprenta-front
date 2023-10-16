import React from 'react'

const Loader = () => {
  return (
    <div className='relative w-full h-2 overflow-hidden bg-emerald-50 animate-slide'>
        <div className='absolute h-full bg-emerald-300 '></div>
    </div>
  )
}

export default Loader