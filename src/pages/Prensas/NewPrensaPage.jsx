import { FormikProvider, useFormik } from 'formik'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MyIcons } from '../../constants/Icons'
import AbsScroll from '../../components/AbsScroll'
import Inpt from '../../components/Inpt'
import InptTable from '../../components/InptTable'
import { useAxios } from '../../context/axiosContext'
import { useAuth } from '../../context/authContext'
import InptPreciosTintas from './components/InptPreciosTintas'

const NewPrensaPage = () => {

  const { myAxios } = useAxios()
  const { notify } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      prensa: '',
      precios: [
        {
          tipoImpresion: "",
          cantidad: "",
          precio: "",
        }
      ]
    },
    validate: (values) => {
      const errors = {};

      if (!values.prensa || values.prensa === '') {
        errors.prensa = 'Requerido';
      }
      values.precios.forEach((item, i) => {
        if (!item.tipoImpresion || item.tipoImpresion === '') {
          errors[`precios.${i}.tipoImpresion`] = 'Requerido';
        }
        if (!item.cantidad || item.cantidad === '') {
          errors[`precios.${i}.cantidad`] = 'Requerido';
        }
        if (!item.precio || item.precio === '') {
          errors[`precios.${i}.precio`] = 'Requerido';
        }
      })

      return errors;
    },
    onSubmit: async (values) => {
      try {
        setLoading(true)
        let formatedRequest = {
          prensa: values.prensa,
          precios: values.precios.map(item => ({
            tipoImpresion: item.tipoImpresion.value,
            cantidad: item.cantidad,
            precio: item.precio
          }))
        }
        console.log(formatedRequest)
        const resp = await myAxios.post(`api/prensas/`, formatedRequest)
        notify(resp.data.message)
        navigate('/precios_tintas')

      } catch (e) {
        console.log(e)
      } finally {
        setLoading(false)
      }
    }
  })
  const handleSubmit = (e) => {
    e.preventDefault()
    if (Object.keys(formik.errors).length > 0) {
      notify('Favor de llenar todos los campos!', true)
    }
    formik.handleSubmit()
  }

  return (
    <FormikProvider value={formik}>
      <form className='flex flex-col w-full h-screen p-3' onSubmit={handleSubmit}>
        <div className='flex items-end justify-between pb-3'>
          <div className='flex flex-row'>
            <button
              type='button'
              onClick={() => navigate('/precios_tintas')}
              className="w-10 h-10 rounded-full btn-neutral total-center"> <MyIcons.Left size="30px" color='#047857' /> </button>
            <h1 className='pl-3 text-3xl text-emerald-800 '>Nueva prensa</h1>
          </div>
          <input className='px-10 py-1.5 rounded-lg btn-emerald' value="Guardar" type='submit' />
        </div>
        <div className='w-full h-full bg-white rounded-lg shadow-md'>
          <AbsScroll vertical loading={loading}>
            <div className="flex flex-wrap px-2 pt-6 sm:px-9">
              <div className='flex-grow w-full px-5 mb-6'>
                <div className='flex-grow w-full px-5 mb-6'>
                  <h2 className='text-lg font-bold text-emerald-800 '>
                    Datos
                  </h2>
                </div>
                <div className="flex-grow w-full px-4">
                  <Inpt
                    label="Nombre de la prensa"
                    name="prensa"
                    formik={formik}
                  />
                </div>
                <div className="flex-grow w-full px-4">
                  <InptPreciosTintas
                    formik={formik}
                  />
                </div>
              </div>
            </div>

          </AbsScroll>
        </div>
      </form>
    </FormikProvider>
  )
}

export default NewPrensaPage