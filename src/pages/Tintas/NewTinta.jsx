import { FormikProvider, useFormik } from 'formik'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MyIcons } from '../../constants/Icons'
import AbsScroll from '../../components/AbsScroll'
import Inpt from '../../components/Inpt'
import InptTable from '../../components/InptTable'
import { useAxios } from '../../context/axiosContext'
import { useAuth } from '../../context/authContext'

const dumy = {
  tipoImpresion: '',
  precios: [
    {
      tinta: '',
      precioCantidad: {
        cantidad: '',
        precio: '',
      },
      precioColor: [
        {
          prensa: '',
          precio: '',
        }
      ]
    }
  ]
}

const NewTinta = () => {

  const { myAxios } = useAxios()
  const { notify } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const inkFormik = useFormik({
    initialValues: dumy,
    validate: (values) => {
      const errors = {};

      if (!values.tipoImpresion || values.tipoImpresion === '') {
        errors.tipoImpresion = 'Requerido';
      }
      values.precios.forEach((item, i) => {
        if (!item.tinta || item.tinta === '') {
          errors[`precios.${i}.tinta`] = 'Requerido';
        }
        if (!item.precioCantidad.cantidad || item.precioCantidad.cantidad === '') {
          errors[`precios.${i}.precioCantidad.cantidad`] = 'Requerido';
        }
        if (!item.precioCantidad.precio || item.precioCantidad.precio === '') {
          errors[`precios.${i}.precioCantidad.precio`] = 'Requerido';
        }
        item.precioColor.forEach((item2, j) => {
          if (!item2.prensa || item2.prensa === '') {
            errors[`precios.${i}.precioColor.${j}.prensa`] = 'Requerido';
          }
          if (!item2.precio || item2.precio === '') {
            errors[`precios.${i}.precioColor.${j}.precio`] = 'Requerido';
          }
        })
      })

      return errors;
    },
    onSubmit: async (values) => {
      try {
        console.log(values)
        let formatedRequest = {
          tipoImpresion: values.tipoImpresion,
          precios: values.precios.reduce((acc, curr) => {
            let precioPrensa = curr.precioColor.map(item => {
              return {
                prensa: item.prensa?.value,
                precioColor: item.precio,
                cantidad: curr.precioCantidad.cantidad,
                precioCantidad: curr.precioCantidad.precio,
                tinta: curr.tinta?.value,
              }
            })
            return [...acc, ...precioPrensa]
          }, [])
        }
        const resp = await myAxios.post(`api/tipoImpresiones/`, formatedRequest)
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
    if (Object.keys(inkFormik.errors).length > 0) {
      notify('Favor de llenar todos los campos!', true)
    }
    inkFormik.handleSubmit()
  }

  return (
    <FormikProvider value={inkFormik}>
      <form className='flex flex-col w-full h-screen p-3' onSubmit={handleSubmit}>
        <div className='flex items-end justify-between pb-3'>
          <div className='flex flex-row'>
            <button
              type='button'
              onClick={() => navigate('/precios_tintas')}
              className="w-10 h-10 rounded-full btn-neutral total-center"> <MyIcons.Left size="30px" color='#047857' /> </button>
            <h1 className='pl-3 text-3xl text-emerald-800 '>Nuevo tipo de impresión</h1>
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
                    label="Tipo de impresión"
                    name="tipoImpresion"
                    formik={inkFormik}
                  />
                </div>
                <div className="flex-grow w-full px-4">
                  <InptTable
                    formik={inkFormik}
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

export default NewTinta