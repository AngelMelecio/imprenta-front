import React, { useState } from 'react'
import Inpt from '../components/Inpt'
import { useFormik } from 'formik'
import { useAuth } from '../context/authContext'

const LoginPage = () => {

  const { signIn } = useAuth()

  const [loading, setLoading] = useState(false)

  const authFormik = useFormik({
    initialValues: {
      usuario: '',
      password: ''
    },
    validate: (values) => {
      const errors = {}
      if (!values.usuario) errors.usuario = "Campo Obligatorio"
      return errors
    },
    onSubmit: async (values) => {
      try {
        setLoading(true)
        await signIn(values)
      } catch (e) {
        console.log("Catched: ", e)
      } finally {
        setLoading(false)
      }
    }
  })

  return (
    <div className='flex items-center justify-center h-screen bg-slate-200'>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <form onSubmit={authFormik.handleSubmit}>
          <Inpt
            name="usuario"
            formik={authFormik}
            label="Usuario" />
          <Inpt
            name="password"
            formik={authFormik}
            label="Contraseña"
            type="password" />
          <input
            disabled={loading}
            type='submit'
            value={loading ? "Ingresando..." : "Ingresar"}
            className={`w-full h-10 py-2 mt-2 btn-naranja`} />
        </form>
      </div>
    </div>
  )
}

export default LoginPage