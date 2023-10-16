export const sleep = async (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, ms);
    })
}

export const toUrl = (file) => {
    if (file instanceof File) {
        return URL.createObjectURL(file)
    }
    if (file === '') return null
    return file
}