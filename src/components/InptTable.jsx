import React from 'react'
import ForeignInpt from '../pages/Materiales/components/ForeignInpt'
import Inpt from './Inpt'
import { MyIcons } from '../constants/Icons'


const Th = ({ text, className }) => {
    let styles = `flex items-center justify-center p-2 text-sm text-emerald-800 ${className}`
    return (
        <div className={styles}>
            {text}
        </div>
    )
}
const EmptyRow = ({ children }) => {
    return (
        <>
            {children}
        </>
    )
}



const InptTable = ({ formik, isDetail = false, handleDeletePrecio }) => {

    const handleDeleteSubRow = (i, j) => {
        let containDetail = formik.values?.precios[i]?.precioColor[j]?.idPrecioPrensa
        if (!isDetail || !containDetail) {
            formik.setFieldValue(`precios.${i}.precioColor`, [
                ...formik.values?.precios[i]?.precioColor.filter((item, index) => index !== j)
            ])
            return
        }
        let idPrecioPrensa = formik.values?.precios[i]?.precioColor[j]?.idPrecioPrensa
        handleDeletePrecio(idPrecioPrensa)
    }
    const handleDeleteRow = (i) => {
        let containDetail = formik.values?.precios[i]?.precioColor?.some(item => item.idPrecioPrensa)
        if (!isDetail || !containDetail) {
            formik.setFieldValue(`precios`, [
                ...formik.values?.precios.filter((item, index) => index !== i)
            ])
            return
        }
        let idPrecioPrensa = formik.values?.precios[i]?.precioColor[0]?.idPrecioPrensa
        handleDeletePrecio(idPrecioPrensa)
    }

    return (
        <div>
            {/* Table */}
            <div className="grid grid-cols-[auto_auto_auto] gap-2 pb-4">
                {/* Table Header */}
                <Th text='Tinta' />
                <Th text='Precio por cantidad' />
                <div className='grid grid-cols-[auto_2.5rem] gap-1'>
                    <Th text='Precio por color' />
                    <></>
                </div>


                {/* Table Rows */}
                {formik.values?.precios?.map((item, i) => <EmptyRow key={`E_${i}`}>
                    <ForeignInpt
                        formik={formik}
                        value={item.tinta?.label}
                        name={`precios.${i}.tinta`}
                        url={'tintas'}
                        showErrors={false}
                        type='text'
                    />

                    <div className='grid grid-cols-2 gap-1 '>
                        <Inpt
                            formik={formik}
                            value={item?.precioCantidad?.cantidad}
                            name={`precios.${i}.precioCantidad.cantidad`}
                            showErrors={false}
                            type='number'
                            placeholder='Cantidad'
                        />
                        <Inpt
                            formik={formik}
                            value={item?.precioCantidad?.precio}
                            name={`precios.${i}.precioCantidad.precio`}
                            showErrors={false}
                            type='number'
                            format='currency'
                        />
                    </div>
                    <div className='grid grid-cols-[auto_auto_2.5rem] gap-1'>
                        {
                            // Sub Rows
                            item?.precioColor?.map((item2, j) => <EmptyRow key={`E_${i}_${j}`}>
                                <ForeignInpt
                                    formik={formik}
                                    value={item2.prensa?.label}
                                    name={`precios.${i}.precioColor.${j}.prensa`}
                                    url={'prensas_fi'}
                                    showErrors={false}
                                    type='text'
                                />
                                <Inpt
                                    formik={formik}
                                    value={item2?.precio}
                                    name={`precios.${i}.precioColor.${j}.precio`}
                                    showErrors={false}
                                    type='number'
                                    format='currency'
                                />

                                <button
                                    onClick={() =>
                                        item?.precioColor?.length === 1 ?
                                            handleDeleteRow(i) :
                                            handleDeleteSubRow(i, j)}
                                    type="button" className='duration-150 rounded-md active:opacity-70 active:duration-0 total-center hover:bg-gray-200'>
                                    <MyIcons.Trash size="17px" className='text-gray-600' />
                                </button>
                            </EmptyRow>)

                        }

                        <button
                            onClick={() => formik.setFieldValue(`precios.${i}.precioColor`, [
                                ...formik.values?.precios[i]?.precioColor,
                                {
                                    prensa: '',
                                    precio: ''
                                }
                            ])}
                            className='relative w-full h-8 col-span-2 text-sm duration-150 border rounded-md text-emerald-700 hover:border-emerald-500 active:opacity-70 active:duration-0'
                            type="button"
                        >
                            <MyIcons.Plus size="15px" className='absolute -translate-y-1/2 pointer-events-none top-1/2 left-3' />
                            Agregar prensa
                        </button>

                    </div>

                </EmptyRow>)}
            </div>
            <button
                onClick={() => formik.setFieldValue('precios', [
                    ...formik.values?.precios,
                    {
                        tinta: '',
                        precioCantidad: { cantidad: '', precio: '' },
                        precioColor: [{ prensa: '', precio: '' }]
                    }
                ])}
                type='button' className='w-full h-10 btn-emerald'>
                Agregar Fila
            </button>
        </div>
    );
}

export default InptTable