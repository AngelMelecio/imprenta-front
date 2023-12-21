import React from 'react'

let fractions = [
    { name: '1', w_div: 1, h_div: 1 },
    { name: '1/2', w_div: 2, h_div: 1 },
    { name: '1/4', w_div: 2, h_div: 2 },
    { name: '1/6', w_div: 3, h_div: 2 },
    { name: '1/8', w_div: 4, h_div: 2 },
    { name: '1/10', w_div: 5, h_div: 2 },
    { name: '1/12', w_div: 3, h_div: 4 },
]

const FractionSelect = ({ formik, name }) => {

    return (
        <div className='px-3 py-2'>
            <p className='pb-1 pl-4 text-sm text-gray-500'>Tamaño de material</p>
            <div className='flex'>
                {fractions.map((f, i) =>
                    <button
                        key={`frac_${i}`}
                        type='button'
                        className={`
                            ${formik?.values[name] === f ? 'text-emerald-600 border-emerald-500' : 'text-gray-500'}
                            w-10 py-2 mr-2 border rounded-lg font-bold duration-150 active:opacity-70 active:duration-0`}
                        onClick={() => formik.setFieldValue(name, f)}
                    >
                        {f.name}
                    </button>)
                }
            </div>
        </div>
    )
}

export default FractionSelect