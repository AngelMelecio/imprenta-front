import React, { createContext, useContext, useState } from 'react';
import { useAuth } from '../../../context/authContext';
import { fetchAPI } from '../../../utils/fetchApiService';
import { useAxios } from '../../../context/axiosContext';
import { HOST } from '../../../constants/ENVs';

const UsuariosContext = createContext();

export const useUsuarios = () => {
    return useContext(UsuariosContext);
};

function formatUsers(users) {
    return users.map(user => ({
        ...user,
        fotografia: user.fotografia !== null ? HOST + user.fotografia : user.fotografia
    }))
}

export const UsuariosProvider = ({ children }) => {

    const { session, notify } = useAuth()
    const { myAxios } = useAxios()
    const [allUsers, setAllUsers] = useState([])
    const API_USUARIOS_URL = 'users/'

    async function getUser(id) {
        const resp = await myAxios.get(API_USUARIOS_URL + id + '/')
        return resp.data
    }

    async function refreshAllUsers() {
        try {
            const resp = await myAxios.get(API_USUARIOS_URL)
            setAllUsers(formatUsers(resp.data))
        } catch (err) {
            notify("Ocurrió un error al tratar de obtener los registros", true);
        }
    }

    async function createUser(user) {
        let formData = new FormData()
        Object.keys(user).forEach(key => {
            formData.append(key, user[key])
        })
        try {
            const resp = await myAxios.post(API_USUARIOS_URL, formData)
            notify(resp.data.message)
        } catch (err) {
            notify(err.response.data.message, true);
            if (err.response.data.errors.correo) notify(err.response.data.errors.correo[0], true)
            if (err.response.data.errors.usuario) notify(err.response.data.errors.usuario[0], true)
            if (err.response.data.errors.fotografia) notify(err.response.data.errors.fotografia[0], true)
        }
    }

    async function deleteUser(list) {
        let ids = list.map(usr => ({ id: usr }));
        try {
            const resp = await myAxios({
                method: 'delete',
                url: API_USUARIOS_URL + 'delete_user_apiView/',
                data: ids
            });

            notify(resp.data.message);
        } catch (err) {
            notify("Ocurrió un error al tratar de eliminar el usuario", true);
        }
    }

    async function updateUser(user, newPass) {
        let formData = new FormData()
        Object.keys(user).forEach(key => {
            if (key === 'fotografia' && !(user[key] instanceof File)) return
            if (user[key] !== null && user[key] !== '') formData.append(key, user[key])
        })

        try {
            const response = await myAxios.put(API_USUARIOS_URL + user.id + '/', formData);
            notify(response.data.message);
            if (newPass) {
                const passwordData = {
                    password: user.password,
                    password2: user.password
                };
                const passwordResponse = await myAxios.post(API_USUARIOS_URL + user.id + '/set_password/', passwordData);
                notify(passwordResponse.data.message);
            }
        } catch (error) {
            notify("Ocurrió un error al tratar de actualizar el usuario", true);
        }
    }



    return (
        <UsuariosContext.Provider value={{
            getUser,
            allUsers,
            refreshAllUsers,
            createUser,
            deleteUser,
            updateUser
        }}>
            {children}
        </UsuariosContext.Provider>
    );
};
