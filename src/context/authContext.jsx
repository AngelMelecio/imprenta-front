import React, { createContext, useContext, useEffect, useState } from 'react';
import { HOST } from '../constants/ENVs';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {

    const navigate = useNavigate()

    const [session, setSession] = useState(() => {
        /*
        */
        const auth = localStorage.getItem('auth')
        return auth ? JSON.parse(auth) : null
        //return { usuario: { nombre: 'Jose', is_staff: true } }
    });

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let fourMinutes = 1000 * 60 * 4
        let interval = setInterval(() => {
            if (session)
                refreshToken()
        }, fourMinutes)
        return () => clearInterval(interval)

    }, [session, loading])

    const notify = (message, error = false) => {
        let options = {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        }
        error ? toast.error(message, options) : toast.success(message, options)
    }

    const signIn = async (values) => {
        const response = await fetch(HOST + 'login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
        })
        let data = await response.json()
        if (!response.ok) {
            throw new Error(data.error)
        }
        setSession(data)
        localStorage.setItem('auth', JSON.stringify(data))
        notify('Bienvenido ' + data.usuario.nombre)
    }

    const refreshToken = async () => {
        const response = await fetch(HOST + '/token/refresh/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: session.refresh })
        })
        let data = await response.json()
        if (!response.ok) {
            signOut()
            throw new Error(data.error)
        }
        console.log('Successfully token refreshed')
        let newSession = { ...session, access: data.access, refresh: data.refresh }
        setSession(newSession)
        localStorage.setItem('auth', JSON.stringify(newSession))
    }

    const signOut = () => {
        setSession(null)
        localStorage.removeItem('auth')
        navigate('/login')
        notify('Sesión cerrada')
    }

    return (
        <AuthContext.Provider
            value={{
                session,
                setSession,
                signIn,
                signOut,
                notify
            }}>
            {children}
            <ToastContainer />
        </AuthContext.Provider>
    );
};
