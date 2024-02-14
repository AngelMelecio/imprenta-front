import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAxios } from '../../context/axiosContext'
import { useAuth } from '../../context/authContext'
import { FormikProvider, useFormik } from 'formik'
import InptPreciosTintas from './components/InptPreciosTintas'
import AbsScroll from '../../components/AbsScroll'
import { MyIcons } from '../../constants/Icons'
import Inpt from '../../components/Inpt'
import Modal from '../../components/Modal'

const DetailPrensa = () => {

  const navigate = useNavigate()
  const { id } = useParams()
  const { myAxios } = useAxios()
  const { notify } = useAuth()
  const [loading, setLoading] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [idPrecioDelete, setIdPrecioDelete] = useState(null)

  const frm = useFormik({
    initialValues: null,
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

      if (Object.keys(frm.errors).length > 0) {
        notify('Favor de llenar todos los campos!', true)
        return
      }

      try {
        setLoading(true)

        const cambiosPrecios = []
        const nuevosPrecios = []

        values.precios.forEach((item, i) => {

          if (item.idPrecioPrensa) {
            cambiosPrecios.push({
              idPrecioPrensa: item.idPrecioPrensa,
              tipoImpresion: item.tipoImpresion.value,
              cantidad: item.cantidad,
              precio: item.precio,
            })
          } else {
            nuevosPrecios.push({
              tipoImpresion: item.tipoImpresion.value,
              cantidad: item.cantidad,
              precio: item.precio
            })
          }

        })

        const resp = await myAxios.put(`api/prensas/${id}`, {
          prensa: values.prensa,
          cambiosPrecios,
          nuevosPrecios
        })

        notify(resp.data.message)
        navigate('/precios_tintas')

      } catch (e) {
        notify("Error al guardar los datos", true)
        console.log(e)
      } finally {
        setLoading(false)
      }
    }
  })

  useEffect(() => {
    loadPrecios(id)
  }, [id])


  const loadPrecios = async (id) => {
    try {
      setLoading(true)
      const res = await myAxios.get(`api/precios_prensa/${id}`)
      console.log(res.data)
      //console.log(formatPrecios(res.data.precios))
      frm.setValues({
        prensa: res.data.prensa,
        precios: res.data.precios.map(precio =>({
          ...precio,
          tipoImpresion:{
            label: precio.tipoImpresion.nombre,
            value: precio.tipoImpresion.idTipoImpresion
          }
        }))
      })
    } catch (e) {
      notify("Error al cargar los datos", true)
      console.log(e)
    } finally {
      setLoading(false)
    }
  }
  const handleDelete = (idPrecioPrensa) => {
    setIdPrecioDelete(idPrecioPrensa)
    setShowModal(true)
  }

  const confimDelete = async () => {
    try {
      setLoading(true)
      const resp = await myAxios.delete(`api/precioPrensas/${idPrecioDelete}`)
      notify(resp.data.message)
      loadPrecios(id)
    } catch (e) {
      notify("Error al eliminar el precio", true)
      console.log(e)
    } finally {
      setLoading(false)
      setShowModal(false)
    }
  }

  return (
    <>
      <FormikProvider value={frm}>
        <form className='flex flex-col w-full h-screen p-3' onSubmit={frm.handleSubmit}>
          <div className='flex items-end justify-between pb-3'>
            <div className='flex flex-row'>
              <button
                type='button'
                onClick={() => navigate('/precios_tintas')}
                className="w-10 h-10 rounded-full btn-neutral total-center"> <MyIcons.Left size="30px" color='#047857' /> </button>
              <h1 className='pl-3 text-3xl text-emerald-800 '>Detalles de la prensa</h1>
            </div>
            <input className='px-10 py-1.5 rounded-lg btn-emerald' value="Guardar" type='submit' />
          </div>
          <div className='w-full h-full bg-white rounded-lg shadow-md'>
            <AbsScroll vertical loading={frm?.values === null || loading} >
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
                      formik={frm}
                    />
                  </div>
                  <div className="flex-grow w-full px-4">
                    <InptPreciosTintas
                      formik={frm}
                      isDetail={true}
                      handleDeletePrecio={handleDelete}
                    />
                  </div>
                </div>
              </div>
            </AbsScroll>
          </div>
        </form>
      </FormikProvider>
      {
        showModal &&
        <Modal
          isDelete={true}
          image={<MyIcons.Alert size="35px" className='text-amber-300' />}
          title="Eliminar precio"
          info="¿Estás seguro que deseas eliminar este precio?"
          onCancel={() => setShowModal(false)}
          onConfirm={confimDelete}
          onClose={() => setShowModal(false)}
        />
      }
    </>
  )
}

export default DetailPrensa