import { HOST } from "../constants/ENVs"


async function fetchAPI(path, options = {}) {
    const url = `${HOST}/${path}`
    const response = await fetch(url, options)
    
    if (!response.ok) {
        throw await response.json()
    }
    const data = await response.json()
    return data
}

export { fetchAPI }