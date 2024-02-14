import React, { useEffect } from 'react'
import ForeignInpt from '../../Materiales/components/ForeignInpt'
import SelectTintas from './SelectTintas'

const FrmTintas = ({ formik }) => {
    
    useEffect(()=>{
        formik.setFieldValue('tintas',{back:[], front:[]})
    },[formik?.values?.prensa,formik?.values?.tinta])
    
    return (
        <div className='grid w-full grid-cols-3'>

            <div className="col-span-3 ">
                <h2 className='flex-grow w-full p-5 text-emerald-900'>Detalles de tintas</h2>
            </div>

            <div className="col-span-3 px-3 md:pl-3 md:pr-1 md:col-span-2">
                <ForeignInpt

                    label="Prensa"
                    name="prensa"
                    formik={formik}
                    url="prensas_fi"
                />
            </div>
            <div className="col-span-3 px-3 md:pl-1 md:pr-3 md:col-span-1">
                <ForeignInpt

                    label="Tinta"
                    name="tinta"
                    formik={formik}
                    url="tintas"
                />
            </div>
            {
                formik?.values?.prensa && formik?.values?.tinta &&
                <div className="col-span-3 pb-4">
                    <SelectTintas
                        value={formik?.values?.tinta?.label}
                        formik={formik}
                    />
                </div>
            }
        </div>
    )
}

export default FrmTintas