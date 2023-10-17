import axios from 'axios';
import React, { createContext, useContext } from 'react';
import { useAuth } from './authContext';
import { HOST } from '../constants/ENVs';

const AxiosContext = createContext();

export const useAxios = () => {
    return useContext(AxiosContext);
};

export const AxiosProvider = ({ children }) => {

    let isRefreshing = false;
    /**
     * This could be a way to avoid unnecessary refresh token calls
     * when multiple requests are made at the same time
   
    let failedQueue = [];

    const addToQueue = (request) => {
        failedQueue.push(request);
    }
    
    const processQueue = (error, token = null) => {
        failedQueue.forEach(prom => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(token);
            }
        });
        
        failedQueue = [];
    }   
    */


    const { signOut } = useAuth()

    const myAxios = axios.create({
        baseURL: HOST,
        headers: {

            "Content-type": "multipart/form-data",
        },
    })

    myAxios.interceptors.request.use(
        async (config) => {
            console.log('Theres a request:', config)

            /**
             * Try to get the token from the local storage
             * and set it as the default header
             */
            const session = localStorage.getItem('auth')
            if (session) {
                let acces_token = JSON.parse(session).access
                config.headers["Authorization"] =
                    `Bearer ${acces_token}`;
            }
            /**
             * dynamically set the Content-Type header 
                based on the data being sent in the POST request. 
            */
            if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
                if (config.data instanceof FormData) {
                    config.headers['Content-Type'] = 'multipart/form-data';
                }
                else if (typeof config.data === 'object') {
                    config.headers['Content-Type'] = 'application/json';
                }
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    )

    /**
     * This interceptor refreshes the token if it is expired
     */
    myAxios.interceptors.response.use(
        (response) => {
            console.log('theres a response: ', response)
            return response;
        },
        async function (error) {
            const originalRequest = error.config;
            if (
                error.response.status === 401
                && originalRequest.url !== 'token/refresh/'
                && !originalRequest._retry
                && !isRefreshing
            ) {
                console.log('Refresh token needed')
                originalRequest._retry = true;
                try {
                    isRefreshing = true;
                    const { access, refresh } = await refreshToken();
                    let session = JSON.parse(localStorage.getItem('auth'))
                    localStorage.setItem('auth', JSON.stringify({ ...session, access, refresh }));

                    myAxios.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${access}`;

                    return myAxios(originalRequest);

                } catch (refreshTokenError) {
                    signOut()
                    return Promise.reject(refreshTokenError);
                } finally {
                    isRefreshing = false;
                }
            }
            return Promise.reject(error);
        }
    );

    const refreshToken = async () => {
        let session = JSON.parse(localStorage.getItem('auth'))
        const resp = await myAxios.post(
            'token/refresh/',
            { refresh: session.refresh }
        )
        return resp.data
    }

    return (
        <AxiosContext.Provider value={{ myAxios }}>
            {children}
        </AxiosContext.Provider>
    );
};
