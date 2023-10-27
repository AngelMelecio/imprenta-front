import React, { createContext, useContext, useState } from 'react';
import { useAuth } from '../../../context/authContext';
import { useAxios } from '../../../context/axiosContext';
import { HOST } from '../../../constants/ENVs';

const SuajeContext = createContext();

export const useSuaje = () => {
    return useContext(SuajeContext);
};

function formatSuajes(suajes) {
    return suajes.map(suaje => ({
        ...suaje,
    }))
}

export const SuajeProvider = ({ children }) => {

    const { session, notify } = useAuth()
    const { myAxios } = useAxios()
    const [allSuajes, setAllSuajes] = useState([])
    const API_SUAJES_URL = 'api/suajes/'

    async function getSuaje(id) {
        const resp = await myAxios.get(API_SUAJES_URL + id)
        return resp.data
    }

    async function getAll() {
        const resp = await myAxios.get(API_SUAJES_URL)
        return (formatSuajes(resp.data))
    }

    async function refreshAllSuajes() {
        try {
            const resp = await myAxios.get(API_SUAJES_URL)
            setAllSuajes(formatSuajes(resp.data))
        } catch (err) {
            notify("No fue posible obtener los registros", true);
        }
    }

    async function createSuaje(suaje) {
        let formData = new FormData()
        Object.keys(suaje).forEach(key => {
            formData.append(key, suaje[key])
        })
        try {
            const resp = await myAxios.post(API_SUAJES_URL, formData)
            notify(resp.data.message)
        } catch (err) {
            notify(err.response.data.message, true);
        }
    }


    async function deleteSuaje(list) {
        for (let i = 0; i < list.length; i++) {
            try {
                const resp = await myAxios.delete(API_SUAJES_URL + list[i])
                notify(resp.data.message)
            } catch (err) {
                notify('No fue posible eliminar el suaje', true)
            }
        }
    }


    async function updateSuaje(suaje) {
        let formData = new FormData()
        Object.keys(suaje).forEach(key => {
            if (suaje[key] !== null && suaje[key] !== '') formData.append(key, suaje[key])
        })

        try {
            const response = await myAxios.put(API_SUAJES_URL + suaje.idSuaje, formData);
            notify(response.data.message);
        } catch (error) {
            notify("No fue posible actualizar el suaje", true);
        }
    }



    return (
        <SuajeContext.Provider value={{
            getSuaje, getAll,
            allSuajes,
            refreshAllSuajes,
            createSuaje,
            deleteSuaje,
            updateSuaje
        }}>
            {children}
        </SuajeContext.Provider>
    );
};
