import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Inpt from '../../components/Inpt'
import { useFormik } from 'formik'
import AbsScroll from '../../components/AbsScroll'
import { useSuaje } from './hooks/SuajeContext'

import { MyIcons } from '../../constants/Icons'
const DetailUsuario = () => {

  let { id } = useParams()
  const { getSuaje, updateSuaje } = useSuaje()
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true)
  const [fieldChanged, setFieldChanged] = useState(false)

  const userFormik = useFormik({
    initialValues: {},
    validate: (values) => {
      const errors = {}
      if (!values.numero) {
        errors.numero = 'Ingresa el número de identificación';
      } else if (values.numero <= 0) {
        errors.numero = 'Ingresa un número mayor a 0';
      }
      if (!values.numeroCortes) {
        errors.numeroCortes = 'Ingresa el número de cortes';
      }
      if (!values.ancho) {
        errors.ancho = 'Ingresa el ancho';
      }
      if (!values.alto) {
        errors.alto = 'Ingresa el alto';
      }
      if (!values.cantidad) {
        errors.cantidad = 'Ingresa la cantidad de tiros';
      }
      if (!values.precio) {
        errors.precio = 'Ingresa el precio';
      }else if (values.precio <= 0) {
        errors.precio = 'Ingresa un precio mayor a 0';
      }
      return errors
    },
    onSubmit: async (values) => {
      try {
        setLoading(true)
        await updateSuaje(values)
        navigate('/suajes')

      } catch (e) {

      } finally {
        setLoading(false)
      }
    }
  })

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const suaje = await getSuaje(id)
        userFormik.setValues(suaje)
      } catch (e) {
        //console.log('Error al traer detalles', e)
      } finally {
        setLoading(false)
      }
    }
    load()

  }, [])

  return (
    <form className='flex flex-col w-full h-screen p-3' onSubmit={userFormik.handleSubmit}>
      <div className='flex items-end justify-between pb-3'>
        <div className='flex flex-row'>
          <button
            onClick={() => navigate('/suajes')}
            className="w-10 h-10 rounded-full btn-neutral total-center"> <MyIcons.Left size="30px" color='#047857' /> </button>
          <h1 className='pl-3 text-3xl text-emerald-800 '>Detalles del Suaje</h1>
        </div>
        <input
          disabled={!fieldChanged}
          className='px-10 py-1.5 rounded-lg btn-emerald' value="Guardar" type='submit' />
      </div>
      <div className='w-full h-full bg-white rounded-lg shadow-md'>
        <AbsScroll vertical loading={userFormik.values === null}>
          <div className="flex flex-wrap px-2 pt-6 sm:px-9">

            <div className='flex flex-row w-full h-full p-2 total-center'>
              <div className="relative flex items-center justify-center w-full text-center">
                <MyIcons.Suaje className='' size='100px' style={{ color: '#065f46' }} />
              </div>
            </div>
            <div className='flex-grow w-full px-5 mb-6'>
              <h2 className='text-lg font-bold text-emerald-800 '>
                Datos del Suaje
              </h2>
            </div>

            <div className="flex-grow w-full px-4 sm:w-1/2">
              <Inpt type="number" name="numero"
                onKeyDown={() => setFieldChanged(true)}
                formik={userFormik} label="Número de identificación"
              />
            </div>
            <div className="flex-grow w-full px-4 sm:w-1/2">
              <Inpt type="number" name="numeroCortes"
                onKeyDown={() => setFieldChanged(true)}
                formik={userFormik} label="Número de cortes (etiquetas)" />
            </div>

            <div className="flex-grow w-full px-4 sm:w-1/2">
              <Inpt type="number" step={0.1}
                name="ancho"
                onKeyDown={() => setFieldChanged(true)}
                formik={userFormik} label="Ancho (cm)" />
            </div>

            <div className="flex-grow w-full px-4 sm:w-1/2">
              <Inpt type="number" step={0.1}
                name="alto"
                onKeyDown={() => setFieldChanged(true)}
                formik={userFormik} label="Alto (cm)" />
            </div>

            <div className='flex-grow w-full px-5 mb-6'>
              <h2 className='text-lg font-bold text-emerald-800 '>
                Defina el precio del suaje por cantidad de tiros
              </h2>
            </div>

            <div className="flex-grow w-full px-4 sm:w-1/2">
              <Inpt type="number" step={1}
                name="cantidad"
                onKeyDown={() => setFieldChanged(true)}
                formik={userFormik} label="Cantidad (Tiros)" />
            </div>
            
            <div className="flex-grow w-full px-4 sm:w-1/2">
              <Inpt type="number" step={0.1}
                name="precio"
                onKeyDown={() => setFieldChanged(true)}
                formik={userFormik} label="Precio $" />
            </div>
          </div>
        </AbsScroll>
      </div>
    </form>
  )
}

export default DetailUsuario