import React, {useState } from 'react'
import { useNavigate } from "react-router-dom";
import Inpt from '../../components/Inpt'
import Opts from '../../components/Opts'
import { useFormik } from 'formik'
import ImgInpt from '../../components/ImgInpt'
import AbsScroll from '../../components/AbsScroll'
import { useUsuarios } from './hooks/UsuariosContext'
import { MyIcons } from '../../constants/Icons'

const NewUsuario = () => {

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const { createUser } = useUsuarios()

  const userFormik = useFormik({
    initialValues: {
      is_active: true,
      is_staff: true,
      rol: null,
    },
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
      } else if (values.rol === null) {
        errors.rol = 'Selecciona un rol';
      }

      if (!values.password) {
        errors.password = 'Ingresa una contraseña';
      } else if (values.password.length < 8) {
        errors.password = '8 caracteres o más';
      }

      if (!values.password2) {
        errors.password2 = 'Confirme la contraseña';
      } else if (values.password !== values.password2) {
        errors.password2 = 'La constraseña no coincide';
      }


      return errors
    },
    onSubmit: async (values) => {
      try {
        setLoading(true)
        await createUser(values)
        navigate('/usuarios')

      } catch (e) {
        
      } finally {
        setLoading(false)
      }
    }
  })
  return (
    <form className='flex flex-col w-full h-screen p-3' onSubmit={userFormik.handleSubmit}>
      <div className='flex items-end justify-between pb-3'>
        <div className='flex flex-row'>
          <button
            onClick={() => navigate('/usuarios')}
            className="w-10 h-10 rounded-full btn-neutral total-center"> <MyIcons.Left size="30px" color='#047857' /> </button>
          <h1 className='pl-3 text-3xl text-emerald-800 '>Nuevo Usuario</h1>
        </div>
        <input className='px-10 py-1.5 rounded-lg btn-emerald' value="Guardar" type='submit' />
      </div>
      <div className='w-full h-full bg-white rounded-lg shadow-md'>
        <AbsScroll vertical loading={userFormik.values === null}>
          <div className="flex flex-wrap px-2 pt-6 sm:px-9">

            <div className="flex-grow w-full px-4 total-center pb-9">
              <ImgInpt name="fotografia" formik={userFormik} />
            </div>
            <div className='flex-grow w-full px-5 mb-6'>
              <h2 className='text-lg font-bold text-emerald-800 '>
                Datos Personales
              </h2>
            </div>
            <div className="flex-grow w-full px-4 sm:w-1/2">
              <Inpt name="nombre" formik={userFormik} label="Nombre" />
            </div>
            <div className="flex-grow w-full px-4 sm:w-1/2">
              <Inpt name="apellidos" formik={userFormik} label="Apellidos" />
            </div>
            <div className="flex-grow w-full px-4 sm:w-1/2">
              <Inpt name="correo" formik={userFormik} label="Correo" />
            </div>
            <div className='flex-grow w-full px-5 mb-6'>
              <h2 className='text-lg font-bold text-emerald-800 '>
                Datos de la Cuenta
              </h2>
            </div>
            <div className="flex-grow w-full px-4 sm:w-1/2">
              <Inpt name="usuario" formik={userFormik} label="Usuario" />
            </div>
            <div className="flex-grow w-full px-4 sm:w-1/2">
              <Opts name="rol" formik={userFormik} label="Rol" options={[
                { label: "Seleccione", value: null },
                { label: "Administrador", value: 'Administrador' },
                { label: "Empleado", value: 'Empleado' },
              ]} />
            </div>
            <div className="flex-grow w-full px-4 sm:w-1/2">
              <Inpt type="password" name="password" formik={userFormik} label="Contraseña" />
            </div>
            <div className="flex-grow w-full px-4 sm:w-1/2">
              <Inpt type="password" name="password2" formik={userFormik} label="Confirmar Contraseña" />
            </div>
          </div>
        </AbsScroll>
      </div>
    </form>
  )
}

export default NewUsuario