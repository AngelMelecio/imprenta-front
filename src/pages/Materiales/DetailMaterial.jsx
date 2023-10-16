import React, { useEffect, useState} from 'react'
import { useParams, useNavigate} from 'react-router-dom'
import Inpt from '../../components/Inpt'
import Opts from '../../components/Opts'
import { useFormik } from 'formik'
import AbsScroll from '../../components/AbsScroll'
//import { useUsuarios } from './hooks/UsuariosContext'

import { MyIcons } from '../../constants/Icons'
const DetailUsuario = () => {

  //let { id } = useParams()
  //const { getUser, updateUser } = useUsuarios()
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true)
  const [fieldChanged, setFieldChanged] = useState(false)

  const userFormik = useFormik({
    initialValues: {},
    validate: (values) => {
      const errors = {}

      if (!values.categoria) {
        errors.categoria = 'Selecciona una categoría';
      } else if (values.categoria === null) {
        errors.categoria = 'Selecciona una categoría';
      }

      if (!values.nombre) {
        errors.nombre = 'Ingresa el nombre';
      } else if (values.nombre.length > 25) {
        errors.nombre = '25 caracteres o menos';
      }

      if (!values.ancho) {
        errors.ancho = 'Ingresa el ancho';
      }

      if (!values.alto) {
        errors.alto = 'Ingresa el alto';
      }

      if (!values.precio) {
        errors.precio = 'Ingresa el precio';
      }

      if (!values.stock) {
        errors.stock = 'Ingresa el stock';
      }
      return errors
    },
    onSubmit: async (values) => {
      try {
        setLoading(true)


        //await updateUser(values, newPassword)
        //navigate('/usuarios')

      } catch (e) {
        //console.log('Error al guardar', e)
      } finally {
        setLoading(false)
      }
    }
  })

  useEffect(() => {
    /*
    async function load() {
      try {
        setLoading(true)
        const material = await getMaterial(id)
        userFormik.setValues(material)
      } catch (e) {
        //console.log('Error al traer detalles', e)
      } finally {
        setLoading(false)
      }
    }
    load()*/

  }, [])

  return (
    <form className='flex flex-col w-full h-screen p-3' onSubmit={userFormik.handleSubmit}>
      <div className='flex items-end justify-between pb-3'>
        <div className='flex flex-row'>
          <button
            onClick={() => navigate('/materiales')}
            className="w-10 h-10 rounded-full btn-neutral total-center"> <MyIcons.Left size="30px" color='#047857' /> </button>
          <h1 className='pl-3 text-3xl text-emerald-800 '>Detalles del Material</h1>
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
                <MyIcons.Paper className='' size='100px' style={{ color: '#065f46' }} />
              </div>
            </div>
            <div className='flex-grow w-full px-5 mb-6'>
              <h2 className='text-lg font-bold text-emerald-800 '>
                Datos del Material
              </h2>
            </div>
            <div className="flex-grow w-full px-4 sm:w-1/2">
              <Opts name="categoria" formik={userFormik} label="Categoria" options={[
                { label: "Seleccione", value: null },
                { label: "Cartulina", value: 'Cartulina' },
                { label: "Carton", value: 'Carton' },
                { label: "Sobres", value: 'Sobres' },
                { label: "Materia Prima", value: 'Materia Prima' },
                { label: "Otros", value: 'Otros' },
              ]}
                onKeyDown={() => setFieldChanged(true)} />
            </div>
            <div className="flex-grow w-full px-4 sm:w-1/2">
              <Inpt name="nombre" formik={userFormik} label="Nombre"
                onKeyDown={() => setFieldChanged(true)} />
            </div>

            <div className="flex-grow w-full px-4 sm:w-1/2">
              <Inpt type="number"
                step={0.1} name="ancho"
                onKeyDown={() => setFieldChanged(true)}
                formik={userFormik} label="Ancho (cm)" />
            </div>
            <div className="flex-grow w-full px-4 sm:w-1/2">
              <Inpt type="number"
                step={0.1} name="alto"
                onKeyDown={() => setFieldChanged(true)}
                formik={userFormik} label="Alto (cm)" />
            </div>

            <div className="flex-grow w-full px-4 sm:w-1/3">
              <Inpt name="grosor" onKeyDown={() => setFieldChanged(true)}
                formik={userFormik} label="Grosor" />
            </div>

            <div className="flex-grow w-full px-4 sm:w-1/3">
              <Inpt name="color" onKeyDown={() => setFieldChanged(true)}
                formik={userFormik} label="Color" />
            </div>

            <div className="flex-grow w-full px-4 sm:w-1/3">
              <Inpt type="number" step={0.01}
                name="gramaje"
                onKeyDown={() => setFieldChanged(true)}
                formik={userFormik} label="Gramaje" />
            </div>

            <div className="flex-grow w-full px-4 sm:w-2/3">
              <Inpt type="number" name="precio"
                onKeyDown={() => setFieldChanged(true)}
                formik={userFormik} label="Precio" />
            </div>

            <div className="flex-grow w-full px-4 sm:w-1/3">
              <Inpt type="number" name="stock"
                onKeyDown={() => setFieldChanged(true)}
                formik={userFormik} label="Stock" />
            </div>
            
          </div>
        </AbsScroll>
      </div>
    </form>
  )
}

export default DetailUsuario