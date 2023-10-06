import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../../context/authContext'
import { adminRoutes } from '../../constants/appRoutes'

const AppRouter = () => {

    const { session } = useAuth()

    return (
        session.usuario.is_staff ? (
            <Routes>
                <Route exact path="*" element={<Navigate replace to="/perfil" />} />
                {adminRoutes.map((route, i) =>
                    <Route
                        key={"ROUTE_" + i}
                        path={route.path}
                        element={route.element} />)
                }
            </Routes>
        ) : (
            <Routes>
                
            </Routes>
        )
    )
}

export default AppRouter