import React, { useEffect } from 'react'
import { useUsuarios } from './hooks/UsuariosContext'
import { useState } from 'react'
import { useFormik } from 'formik'
import { useParams } from 'react-router-dom'
import AbsScroll from '../../components/AbsScroll'
import Inpt from '../../components/Inpt'
import Opts from '../../components/Opts'
import ImgInpt from '../../components/ImgInpt'
import { MyIcons } from '../../constants/Icons'
import { useNavigate } from "react-router-dom";


const DetailUsuario = () => {

  let { id } = useParams()
  const { getUser, updateUser } = useUsuarios()
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true)
  const [fieldChanged, setFieldChanged] = useState(false)
  const [newPassword, setNewPassword] = useState(false)

  const userFormik = useFormik({
    initialValues: {},
    validate: (values) => {
      const errors = {}
      if (!values.nombre) {
        errors.nombre = 'Ingresa el nombre';
      } else if (values.nombre.length > 25) {
        errors.nombre = '25 caracteres o menos';
      }

      if (!values.apellidos) {
        errors.apellidos = 'Ingresa el apellido';
      } else if (values.apellidos.length > 50) {
        errors.apellidos = '50 caracteres o menos';
      }

      if (!values.correo) {
        errors.correo = 'Ingresa el correo';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.correo)) {
        errors.correo = 'Correo invalido';
      }

      if (!values.usuario) {
        errors.usuario = 'Ingresa un usuario';
      } else if ((values.usuario.length < 4 || values.usuario.length > 20)) {
        errors.usuario = 'El usuario debe tener una longitud entre 4 y 20 caracteres';
      }

      if (!values.rol) {
        errors.rol = 'Selecciona un rol';
      } else if (values.rol === 'Seleccione') {
        errors.rol = 'Selecciona un rol';
      }

      if (!values.password && newPassword) {
        errors.password = 'Ingresa una contraseña';
      } else if (values.password?.length < 8 && newPassword) {
        errors.password = '8 caracteres o más';
      }

      if (!values.password2 && newPassword) {
        errors.password2 = 'Confirme la contraseña';
      } else if (values.password !== values.password2 && newPassword) {
        errors.password2 = 'La constraseña no coincide';
      }

      return errors
    },
    onSubmit: async (values) => {
      try {
        setLoading(true)

        if (!newPassword) {
          values.password = null
          values.password2 = null
          delete values.password
          delete values.password2
        }
        await updateUser(values, newPassword)
        navigate('/usuarios')

      } catch (e) {
        //console.log('Error al guardar', e)
      } finally {
        setLoading(false)
      }
    }
  })

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const usuario = await getUser(id)
        userFormik.setValues(usuario)
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
            onClick={() => navigate('/usuarios')}
            className="w-10 h-10 rounded-full btn-neutral total-center"> <MyIcons.Left size="30px" color='#047857' /> </button>
          <h1 className='pl-3 text-3xl text-emerald-800 '>Detalles del Usuario</h1>
        </div>
        <input
          disabled={!fieldChanged}
          className='px-10 py-1.5 rounded-lg btn-emerald' value="Guardar" type='submit' />
      </div>
      <div className='w-full h-full bg-white rounded-lg shadow-md'>
        <AbsScroll vertical loading={userFormik.values === null}>
          <div className="flex flex-wrap px-2 pt-6 sm:px-9">

            <div className="flex-grow w-full px-4 total-center pb-9">
              <ImgInpt
                selecting={setFieldChanged}
                name="fotografia" formik={userFormik} />
            </div>
            <div className='flex-grow w-full px-5 mb-6'>
              <h2 className='text-lg font-bold text-emerald-800 '>
                Datos Personales
              </h2>
            </div>
            <div className="flex-grow w-full px-4 sm:w-1/2">
              <Inpt
                onKeyDown={() => setFieldChanged(true)}
                name="nombre" formik={userFormik} label="Nombre" />
            </div>
            <div className="flex-grow w-full px-4 sm:w-1/2">
              <Inpt
                onKeyDown={() => setFieldChanged(true)}
                name="apellidos" formik={userFormik} label="Apellidos" />
            </div>
            <div className="flex-grow w-full px-4 sm:w-1/2">
              <Inpt
                onKeyDown={() => setFieldChanged(true)}
                name="correo" formik={userFormik} label="Correo" />
            </div>
            <div className='flex-grow w-full px-5 mb-6'>
              <h2 className='text-lg font-bold text-emerald-800 '>
                Datos de la Cuenta
              </h2>
            </div>
            <div className="flex-grow w-full px-4 sm:w-1/2">
              <Inpt
                onKeyDown={() => setFieldChanged(true)}
                name="usuario" formik={userFormik} label="Usuario" />
            </div>
            <div className="flex-grow w-full px-4 sm:w-1/2">
              <Opts
                onKeyDown={() => setFieldChanged(true)}
                name="rol" formik={userFormik} label="Rol" options={[
                  { label: "Administrador", value: "Administrador" },
                  { label: "Empleado", value: "Empleado" },
                ]} 
                selecting={setFieldChanged}
                />
            </div>
            <div className="flex-grow w-full px-4 sm:w-1/2">
              <Opts
                name="is_active" formik={userFormik} label="Activo" options={[
                  { label: "Activo", value: true },
                  { label: "Inactivo", value: false },
                ]} 
                selecting={setFieldChanged}
                />
            </div>
            <div className='flex flex-row items-center flex-grow w-full px-5 mb-6 sm:w1/2'>
              <h2 className='text-lg font-bold text-emerald-800 '>
                Nueva contraseña
              </h2>
              <input type="checkbox" className='ml-3 switch' onChange={(e) => setNewPassword(e.target.checked)} />
            </div>
            
            {
              newPassword &&
              <>
                <div className="flex-grow w-full px-4 sm:w-1/2">
                  <Inpt
                    onKeyDown={() => setFieldChanged(true)}
                    type="password" name="password" formik={userFormik} label="Nueva Contraseña" />
                </div>
                <div className="flex-grow w-full px-4 sm:w-1/2">
                  <Inpt
                    onKeyDown={() => setFieldChanged(true)}
                    type="password" name="password2" formik={userFormik} label="Confirmar Contraseña" />
                </div>
              </>
            }
          </div>
        </AbsScroll>
      </div>
    </form>
  )
}

export default DetailUsuario