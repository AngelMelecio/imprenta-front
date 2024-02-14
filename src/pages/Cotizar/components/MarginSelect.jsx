import React from 'react'
import { MyIcons } from '../../../constants/Icons'
import { customNumberInputHandler } from '../../../constants/functions'

const detailedInpts = [
  { name: 'margin_top', icon: <MyIcons.BorderTop size="22px" /> },
  { name: 'margin_bottom', icon: <MyIcons.BorderBottom size="22px" /> },
  { name: 'margin_left', icon: <MyIcons.BorderLeft size="22px" /> },
  { name: 'margin_right', icon: <MyIcons.BorderRight size="22px" /> }
]

const MarginSelect = ({ formik, name, className }) => {

  const toggleDetailed = () => {
    formik.setFieldValue('detailedMargin', !formik?.values?.detailedMargin)
  }

  const handleChange = (e) => {
    formik?.handleChange(e)
  }

  return (
    <div className={`px-3 py-2 ${className}`}>
      <p className='pb-1 pl-4 text-sm text-gray-500'>Margen</p>
      <div className="flex">

        { // Margen General
          !formik?.values.detailedMargin ?
            <div className='relative'>
              <div className="absolute left-0 w-10 h-10 text-gray-700 pointer-events-none total-center">
                <MyIcons.margin size="22px" />
              </div>
              <input
                type="number"
                onWheel={(e) => e.target.blur()}
                value={formik?.values[name] || ""}
                id={name}
                name={name}
                onKeyDown={customNumberInputHandler}
                onChange={handleChange}
                className='w-20 h-10 pl-10 mr-2 text-base font-medium text-gray-700 border rounded-lg outline-none focus:border-emerald-500'
                autoComplete='off'
              />
            </div>

            : // Margen Detallado
            <>
              {detailedInpts.map((d, i) =>
                <div key={`detailed_${i}`} className="relative">
                  <div className="absolute left-0 w-10 h-10 text-gray-700 pointer-events-none total-center">
                    {d.icon}
                  </div>
                  <input
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    value={formik?.values[d.name] || ""}
                    id={d.name}
                    name={d.name}
                    onKeyDown={customNumberInputHandler}
                    onChange={handleChange}
                    className='w-20 h-10 pl-10 mr-2 text-base font-medium text-gray-700 border rounded-lg outline-none focus:border-emerald-500'
                    autoComplete='off'
                  />
                </div>
              )}
            </>}

        <button
          onClick={toggleDetailed}
          type="button" className='w-10 h-10 text-gray-700 duration-100 border rounded-lg outline-none hover:border-emerald-500 total-center active:opacity-70 active:duration-0'>
          {
            formik?.values.detailedMargin ?
              <MyIcons.Left size="22px" />
              :
              <MyIcons.Right size="22px" />
          }
        </button>
      </div>
    </div>
  )
}

export default MarginSelect