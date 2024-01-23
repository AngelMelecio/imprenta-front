import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAxios } from '../../context/axiosContext'
import { useAuth } from '../../context/authContext'
import { FormikProvider, useFormik } from 'formik'
import { MyIcons } from '../../constants/Icons'
import AbsScroll from '../../components/AbsScroll'
import Inpt from '../../components/Inpt'
import Modal from '../../components/Modal'
import InptTable from '../../components/InptTable'

const formatPrecios = (lista) => {
  const res = []
  lista.forEach((item) => {
    const index = res.findIndex(i => i.tinta.value === item.tinta.idTinta)
    if (index === -1) {
      res.push({
        tinta: { label: item.tinta.nombre, value: item.tinta.idTinta },
        precioCantidad: {
          cantidad: item.cantidad,
          precio: item.precioCantidad,
        },
        precioColor: [
          {
            prensa: { label: item.prensa.nombre, value: item.prensa.idPrensa },
            precio: item.precioColor,
            idPrecioPrensa: item.idPrecioPrensa
          }
        ]
      })
    } else {
      res[index].precioColor.push({
        prensa: { label: item.prensa.nombre, value: item.prensa.idPrensa },
        precio: item.precioColor,
        idPrecioPrensa: item.idPrecioPrensa
      })
    }
  })
  return res
}

const DetailTinta = () => {

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

      if (Object.keys(frm.errors).length > 0) {
        notify('Favor de llenar todos los campos!', true)
        return
      }

      try {
        setLoading(true)

        const cambiosPrecios = []
        const nuevosPrecios = []

        values.precios.forEach((item, i) => {
          item.precioColor.forEach((item2, j) => {
            if (item2.idPrecioPrensa) {
              cambiosPrecios.push({
                idPrecioPrensa: item2.idPrecioPrensa,
                precioColor: item2.precio,
                prensa: item2.prensa.value,
                tinta: item.tinta.value,
                cantidad: item.precioCantidad.cantidad,
                precioCantidad: item.precioCantidad.precio
              })
            } else {
              nuevosPrecios.push({
                precioColor: item2.precio,
                prensa: item2.prensa.value,
                tinta: item.tinta.value,
                cantidad: item.precioCantidad.cantidad,
                precioCantidad: item.precioCantidad.precio
              })
            }
          })
        })

        const resp = await myAxios.put(`api/tipoImpresiones/${id}`, {
          tipoImpresion: values.tipoImpresion,
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
      const res = await myAxios.get(`api/precios_tipo_impresion/${id}`)
      console.log(res.data.precios)
      console.log(formatPrecios(res.data.precios))
      frm.setValues({
        tipoImpresion: res.data.tipoImpresion,
        precios: formatPrecios(res.data.precios)
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
              <h1 className='pl-3 text-3xl text-emerald-800 '>Nuevo tipo de impresión</h1>
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
                      label="Tipo de impresión"
                      name="tipoImpresion"
                      formik={frm}
                    />
                  </div>
                  <div className="flex-grow w-full px-4">
                    <InptTable
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

export default DetailTinta