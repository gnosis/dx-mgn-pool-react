import React, { useRef, useState } from 'react'

import { useComponentSizeFinder } from '../../api/hooks'

const helpShowerContainer = {
    margin: '-10px 0 20px',
    overflowX: 'hidden', 
    overflowY: 'scroll',
    transition: 'all 0.5s ease-in-out',
}

const InfoShower = ({
    info,
    render,
}) => {
    const pre = useRef()
    const [showHelp, setShowHelp] = useState(false)

    const elemHeightInPx = useComponentSizeFinder(pre)

    const handleClick = () => setShowHelp(!showHelp)

    return (
        <>
            {render && render({ handleClick })}
            <div style={{ height: showHelp ? elemHeightInPx : 0, ...helpShowerContainer }}>
                <pre className="data-pre-help" ref={pre} >
                    {info}
                </pre>
            </div>
        </>
    )
}

export default InfoShower
