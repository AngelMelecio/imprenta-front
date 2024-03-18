import React, { useEffect } from 'react'
import ForeignInpt from '../../Materiales/components/ForeignInpt'
import SelectTintas from './SelectTintas'
import SelectPlacas from './SelectPlacas'

const FrmTintas = ({ formik }) => {

    useEffect(() => {
        if(formik?.values?.tinta){
            let str = formik?.values?.tinta?.label
            formik.setFieldValue('tintas', { back: [], front: []})
            formik.setFieldValue('placas', { placasBack: Number(str[str.length - 1]), placasFront: Number(str[0]), precioPlaca: 100 })   
        }
    }, [formik?.values?.prensa, formik?.values?.tinta])

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
            {
                formik?.values?.prensa && formik?.values?.tinta &&
                <div className="col-span-3 pb-4">
                    <SelectPlacas
                        formik={formik}
                    />
                </div>
            }
        </div>
    )
}

export default FrmTintas