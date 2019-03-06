import React, { /* useEffect, */ useState } from 'react'

import DataDisplayVisualContainer from '../display/DataDisplay'

import { delay } from '../../api/utils'

const AsyncActionsHOC = Component => ({
    asyncAction,
    buttonText = 'subMit',
    buttonOnly,
    forceDisable,
    info,
    title,
    ...rest
}) => {
    // State - button blocked disables use of butotn
    // e.g on blockchain action - released on receipt
    const [buttonBlocked, setButtonBlocked] = useState(false)
    const [inputAmount, setInputAmount] = useState(null)
    const [viewInfoStatus, setViewInfoStatus] = useState(false)
    const [error, setError] = useState(null)

    // useEffect()

    const handleInfoButtonClick = () => setViewInfoStatus(!viewInfoStatus)

    const handleChange = ({ target }) => {
        setError(null)
        let { value } = target
        
        // replace commas w/periods
        value = value.replace(/[,]/g, '.')
        
        const validValue = !!(+value)
        if (!validValue && value) {
            return setError('Please enter a valid amount')
        }
        
        return setInputAmount(value)
    }

    const handleClick = async () => {
        try {
            if (!buttonOnly && !inputAmount) throw new Error('Please enter a valid amount')
            // disable button
            setButtonBlocked(true)

            // fire action
            const asyncRec = !buttonOnly ? await asyncAction({ amount: inputAmount }) : await asyncAction()
            console.debug('Async Action successful: ', asyncRec)
            
            // For blockchain MM delay
            await delay(10000)
        } catch (err) {
			console.error('AsyncActionsHOC ERROR: ', err)
            setError(err.message || err)

            await delay(4000)
        } finally {
            setError(null)
            setInputAmount('0')
            // reEnable button
            setButtonBlocked(false)
        }
    }

    return (
        <div className="asyncActionContainer">  
            <h5>{title} {info && <span className="info" title="Click for more info" onClick={handleInfoButtonClick}>info</span>} </h5>
            {info && viewInfoStatus && 
                <DataDisplayVisualContainer
                    colour="info"
                >
                    {() => <span>{info}</span>}
                </DataDisplayVisualContainer>
            }
            {Component && 
                <Component
                    disabled={forceDisable || buttonBlocked}
                    onChange={handleChange}
                    value={inputAmount}
                    {...rest} 
                />}
            <button
                className="ctaButton"
                disabled={forceDisable || error || buttonBlocked}
                onClick={handleClick}
            >
                {buttonText}
            </button>
            {error && <pre className="data-pre-error">{error}</pre>}
        </div>
    )
}

export default AsyncActionsHOC
