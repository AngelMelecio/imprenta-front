import React, { createContext, useContext, useState } from 'react';
import { useAuth } from '../../../context/authContext';
import { useAxios } from '../../../context/axiosContext';

const NotasContext = createContext();

export const useNotas = () => {
    return useContext(NotasContext);
};

export const NotasProvider = ({ children }) => {

    const { session, notify } = useAuth()
    const { myAxios } = useAxios()
    const [allNotas, setAllNotas] = useState([])
    const API_NOTAS_URL = 'api/notas/'

    async function getNota(id) {
        const resp = await myAxios.get(API_NOTAS_URL + id)
        return resp.data
    }

    async function getAll() {
        const resp = await myAxios.get(API_NOTAS_URL)
        return resp.data
    }

    async function refreshAllNotas() {
        try {
            const resp = await myAxios.get(API_NOTAS_URL)
            setAllNotas(resp.data)
        } catch (err) {
            notify("No fue posible obtener los registros", true);
        }
    }

    async function createNota(nota) {
        let formData = new FormData()
        Object.keys(nota).forEach(key => {
            formData.append(key, nota[key])
        })
        try {
            const resp = await myAxios.post(API_NOTAS_URL, formData)
            notify(resp.data.message)
        } catch (err) {
            notify(err.response.data.message, true);
        }
    }


    async function deleteNota(list) {
        for (let i = 0; i < list.length; i++) {
            try {
                const resp = await myAxios.delete(API_NOTAS_URL + list[i])
                notify(resp.data.message)
            } catch (err) {
                notify('No fue posible eliminar la nota', true)
            }
        }
    }


    async function updateNota(nota) {
        let formData = new FormData()
        Object.keys(nota).forEach(key => {
            if (nota[key] !== null && nota[key] !== '') formData.append(key, nota[key])
        })

        try {
            const response = await myAxios.put(API_NOTAS_URL + nota.idNota, formData);
            notify(response.data.message);
        } catch (error) {
            notify("No fue posible actualizar el suaje", true);
        }
    }
    return (
        <NotasContext.Provider value={{
            allNotas,
            getNota,
            refreshAllNotas,
            createNota,
            deleteNota,
            updateNota
        }}>
            {children}
        </NotasContext.Provider>
    );
};
