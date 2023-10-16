import React, { useEffect } from 'react'
import { MyIcons } from '../constants/Icons'

const Modal = ({
    image = null,
    title,
    info,
    onCancel,
    onConfirm,
    onClose
}) => {

    return (
        <div className='absolute z-20 w-full h-screen appear gray-trans total-center'>
            <div className='w-full mx-5 bg-white rounded-lg shadow-md sm:mx-28 md:mx-48 emerge'>
                <button
                    onClick={onClose}
                    className='w-10 h-10 rounded-tl-lg rounded-br-lg total-center btn-neutral'>
                    <MyIcons.Cancel size="25px" className='text-gray-500' />
                </button>
                <div className='pb-5 total-center'>
                    {image}
                </div>
                <div className='px-5 pb-10'>
                    <h3 className='text-2xl font-bold text-center text-gray-800'>{title}</h3>
                    <h3 className='text-center text-gray-600'>{info}</h3>
                </div>
                <div className='flex'>
                    <button
                        onClick={onCancel}
                        className='flex-grow text-lg font-semibold text-gray-700 border-t rounded-bl-lg h-14 total-center btn-neutral hover:bg-gray-200'>
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className='flex-grow text-lg text-gray-700 rounded-br-lg h-14 total-center btn-naranja hover:bg-red-500 hover:text-white'>
                        Confirmar
                    </button>
                </div>
            </div>
            {/*
             */}
        </div>
    )
}

export default Modal