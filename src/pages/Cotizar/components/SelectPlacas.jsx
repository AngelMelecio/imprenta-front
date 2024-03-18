import React, { useEffect} from 'react'
import Th from './Th'
import Inpt from '../../../components/Inpt'

const SelectPlacas = ({ formik }) => {

    return (
        <div className='grid grid-cols-2 gap-3 px-3'>

            <Th text="Placas frente" />
            <Th text="Placas reverso" />

            <div className='grid col-span-1 gap-2'>
                <Inpt
                    name={'placas.placasFront'} formik={formik} label="Placas"
                    value={formik?.values?.placas?.placasFront}
                    type="number"
                />
            </div>
            <div className='grid col-span-1 gap-2'>
                <Inpt
                    name={'placas.placasBack'} formik={formik} label="Placas"
                    value={formik?.values?.placas?.placasBack}
                    type="number" 
                />
            </div>
            <div className='grid col-span-2 gap-0'>
                <Inpt
                    name={'placas.precioPlaca'} formik={formik} label="Precio por placa"
                    value={formik?.values?.placas?.precioPlaca}
                    type="number" 
                />
            </div>

        </div>
    )
}

export default SelectPlacas