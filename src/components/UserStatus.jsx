import React from 'react'
import { MyIcons } from '../constants/Icons'

const UserStatus = (state) => {
    return (
        state ?
            <div className='flex flex-row items-center'>
                <MyIcons.Active className="ml-2 text-sm text-emerald-500" />
                <p className='px-1 font-semibold text-gray-700 text-clip'>Activo</p>
            </div> :
            <div className='flex flex-row items-center'>
                <MyIcons.Ghost className="ml-2 text-lg text-gray-500" />
                <p className='px-1 font-semibold text-gray-700 text-clip'>Inactivo</p>
            </div>
    )
}

export default UserStatus