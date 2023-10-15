import React from 'react'
import { adminTabs, baseTabs } from '../../constants/appRoutes'
import { MyIcons } from '../../constants/Icons'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'
import { useAuth } from '../../context/authContext'
import LOGO from '../../assets/LOGO.png'

const AppBar = () => {

  const { signOut } = useAuth()

  const Tab = ({ info, ...props }) => {
    const { content, to, icon } = info
    const resolvePath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvePath.pathname, end: false })

    return (
      <Link {...props} to={to} className={'tab relative flex items-center w-10 h-10 my-1 rounded-full cursor-pointer active:opacity-60  hover:bg-emerald-500 duration-200 ' + (isActive ? 'bg-emerald-800 hover:bg-emerald-800' : '')}>
        <div className="absolute left-0 flex items-center justify-center w-10 h-10">
          {icon}
        </div>
        <div className='font-bold duration-200 opacity-0 whitespace-nowrap pl-11 group-hover:opacity-100 group-hover:delay-300'>
          {content}
        </div>
      </Link>
    )
  }

  return (
    <div className='relative w-16 h-screen text-white'>
      <div id="side-bar" className='absolute flex flex-col w-16 h-full duration-200 ease-in-out bg-emerald-600 group hover:w-56 hover:delay-300'>
        {/* AppBar Header */}
        <div className="flex flex-[0.20] w-full total-center">
            <img
              className='h-[90px] mt-4  opacity-0 group-hover:opacity-90 group-hover:delay-[410ms] group-hover:duration-300'
              src={LOGO} alt="" />
        </div>
        {/* Main Tabs */}
        <div className="flex flex-[0.60] w-full ">
          <div className="relative w-full h-full overflow-x-hidden overflow-y-scroll">
            <div className='absolute top-0 w-full pl-3'>
              {
                adminTabs.map((tab, indx) =>
                  <Tab key={"TAB_" + indx} info={tab} />
                )}
            </div>
          </div>
        </div>
        {/* Bottom Tabs */}
        <div className="flex flex-[0.20] w-full ">
          <div className="relative w-full h-full overflow-x-hidden overflow-y-scroll">
            <div className='absolute top-0 w-full pl-3'>
              <Tab info={{
                to: '/perfil', content: 'Perfil', icon: <MyIcons.Profile size={"24px"} />
              }} />
              <Tab
                onClick={signOut}
                info={{
                  to: '/exit', content: 'Cerrar Sesión', icon: <MyIcons.Exit size={"23px"} />
                }} />

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppBar