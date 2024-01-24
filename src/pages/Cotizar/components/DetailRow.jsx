import React from 'react'

const DetailRow = ({ data, decorador }) => {
    return (
        <div className='flex items-center justify-between h-10 px-3 border-b'>
            <div className='text-base text-gray-700'>{data.label}:</div>
            <div className='text-lg font-semibold text-emerald-800'>{(decorador ? (decorador + data.value) : data.value)}</div>
        </div>
    )
}

export default DetailRow