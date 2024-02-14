import React from 'react'
import ForeignInpt from '../../Materiales/components/ForeignInpt'
import Inpt from '../../../components/Inpt'
import { MyIcons } from '../../../constants/Icons'

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

const InptPreciosTintas = ({ formik, isDetail = false, handleDeletePrecio }) => {

  const handleDeleteRow = (i) => {
    if (!isDetail || !formik.values?.precios[i]?.idPrecioPrensa) {
      formik.setFieldValue(`precios`, [
        ...formik.values?.precios.filter((item, index) => index !== i)
      ])
      return
    }
    let idPrecioPrensa = formik.values?.precios[i]?.idPrecioPrensa
    handleDeletePrecio(idPrecioPrensa)
  }

  return (
    <div>
      {/* Table */}
      <div className="grid grid-cols-[auto_auto_2.5rem] gap-2 pb-4">
        {/* Table Header */}
        <Th text='Tipo de Impresion' />
        <Th text='Precio por cantidad' />
        <Th text="" />

        {/* Table Rows */}
        {formik.values?.precios?.map((item, i) => <EmptyRow key={`R_${i}`}>
          <ForeignInpt
            formik={formik}
            value={formik.values?.precios[i]?.tipoImpresion.label}
            name={`precios.${i}.tipoImpresion`}
            url="tipoImpresiones_fi"
            showErrors={false}
          />
          <div className='grid grid-cols-2 gap-1'>
            <Inpt
              formik={formik}
              value={item?.cantidad}
              name={`precios.${i}.cantidad`}
              showErrors={false}
              type='number'
              placeholder='Cantidad'
            />
            <Inpt
              formik={formik}
              value={item?.precio}
              name={`precios.${i}.precio`}
              showErrors={false}
              type='number'
              format='currency'
            />
          </div>
          <button
            onClick={() => handleDeleteRow(i)}
            type="button" className='duration-150 rounded-md active:opacity-70 active:duration-0 total-center hover:bg-gray-200'>
            <MyIcons.Trash size="17px" className='text-gray-600' />
          </button>
        </EmptyRow>)}
      </div>
      <button
        onClick={() => formik.setFieldValue('precios', [
          ...formik.values?.precios,
          {
            tipoImpresion: '',
            cantidad: "",
            precio: ""
          }
        ])}
        type='button' className='w-full h-10 btn-emerald'>
        Agregar Tipo
      </button>
    </div>
  )
}

export default InptPreciosTintas