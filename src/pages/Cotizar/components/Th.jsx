import React from 'react'

const Th = ({ text, className }) => {
    let styles = `flex items-center justify-center p-2 text-sm text-emerald-800 ${className}`
    return (
        <div className={styles}>
            {text}
        </div>
    )
}

export default Th