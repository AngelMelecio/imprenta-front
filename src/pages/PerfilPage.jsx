import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/authContext'

const PerfilPage = () => {

  const { session } = useAuth()
  const [usuario, setUsuario] = useState(null)

  useEffect(() => {
    setUsuario(session.usuario)
    console.log( Object.keys(session.usuario) )
  }, [])

  return (
    <>
      <div className="relative flex w-full h-screen bg-slate-100">
        <div id="page" className="relative flex flex-col w-full h-full p-4 ">
          <h1 className="pl-2 pb-2 text-3xl font-[800] text-emerald-800">Perfil</h1>
          <div className="flex flex-col h-full p-3 bg-white rounded-lg shadow-lg ">
            {
            usuario && [
              { label: 'Nombre', value: `${usuario.nombre} ${usuario.apellidos}` },
              { label: 'Rol', value: usuario.is_staff ? 'Administrador' : 'Empleado'},
              { label: 'Correo', value: usuario.correo },
            ].map((item, i) => <div key={`ROW_${i}`} className='flex flex-row items-center h-10 px-4 border-b'>
              <p className='text-emerald-700'>{item.label}: &nbsp; </p>
              <p className='font-semibold text-gray-700 '>{item.value}</p>
            </div>)

            }
          </div >
        </div>
      </div>
    </>
  )
}

export default PerfilPage