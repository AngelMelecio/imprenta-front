import React, { createContext, useContext, useState } from 'react';
import { useAuth } from '../../../context/authContext';
import { useAxios } from '../../../context/axiosContext';

const TerminadosContext = createContext();

export const useTerminados = () => {
    return useContext(TerminadosContext);
};

export const TerminadosProvider = ({ children }) => {

    const { session, notify } = useAuth()
    const { myAxios } = useAxios()
    const [allTerminados, setAllTerminados] = useState([])
    const API_TERMINADOS_URL = 'api/terminados/'

    async function getTerminado(id) {
        const resp = await myAxios.get(API_TERMINADOS_URL + id)
        return resp.data
    }

    async function getAll() {
        const resp = await myAxios.get(API_TERMINADOS_URL)
        return resp.data
    }

    async function refreshAllTerminados() {
        try {
            const resp = await myAxios.get(API_TERMINADOS_URL)
            setAllTerminados(resp.data)
        } catch (err) {
            notify("No fue posible obtener los registros", true);
        }
    }

    async function createTerminado(terminado) {
        let formData = new FormData()
        Object.keys(terminado).forEach(key => {
            formData.append(key, terminado[key])
        })
        try {
            const resp = await myAxios.post(API_TERMINADOS_URL, formData)
            notify(resp.data.message)
        } catch (err) {
            notify(err.response.data.message, true);
        }
    }


    async function deleteTerminado(list) {
        for (let i = 0; i < list.length; i++) {
            try {
                const resp = await myAxios.delete(API_TERMINADOS_URL + list[i])
                notify(resp.data.message)
            } catch (err) {
                notify('No fue posible eliminar el terminado', true)
            }
        }
    }


    async function updateTerminado(terminado) {
        let formData = new FormData()
        Object.keys(terminado).forEach(key => {
            if (terminado[key] !== null && terminado[key] !== '') formData.append(key, terminado[key])
        })

        try {
            const response = await myAxios.put(API_TERMINADOS_URL + terminado.idTerminado, formData);
            notify(response.data.message);
        } catch (error) {
            notify("No fue posible actualizar el suaje", true);
        }
    }
    return (
        <TerminadosContext.Provider value={{
            allTerminados,
            getTerminado,
            refreshAllTerminados,
            createTerminado,
            deleteTerminado,
            updateTerminado
        }}>
            {children}
        </TerminadosContext.Provider>
    );
};
