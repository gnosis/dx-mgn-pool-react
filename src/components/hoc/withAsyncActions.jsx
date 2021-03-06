/* eslint-disable no-unused-expressions */
import React, { useState } from 'react'

import InfoShower from '../display/InfoShower'

import { delay } from '../../api/utils'

import mgnSVG from '../../assets/MGN_token_white_on_blue.svg'

export const withAsyncActions = Component => ({
    asyncAction,
    buttonText = 'subMit',
    buttonOnly,
    forceDisable,
    info,
    title,
    useGlobalAppBlocker,
}) => {
    // State - button blocked disables use of butotn
    // e.g on blockchain action - released on receipt
    const [buttonBlocked, setButtonBlocked] = useState(false)
    const [inputAmount, setInputAmount] = useState(undefined)
    const [error, setError] = useState(undefined)


    const handleChange = ({ target }) => {
        setError(undefined)
        let { value } = target
        
        // replace commas w/periods
        value = value.replace(/[,]/g, '.')
        
        const validValue = !!(+value)
        if (!validValue && value) {
            setError('Please enter a valid amount')
        }
        
        return setInputAmount(value)
    }

    const handleClick = async () => {
        try {
            if (!buttonOnly && !inputAmount) throw new Error('Please enter a valid amount')
            // disable button
            setButtonBlocked(true)
            // set app busy state
            useGlobalAppBlocker && useGlobalAppBlocker(true)

            // fire action
            const asyncRec = !buttonOnly ? await asyncAction({ amount: inputAmount }) : await asyncAction()
            console.debug('Async Action successful: ', asyncRec)
            
            // For blockchain MM delay
            await delay(10000)
        } catch (err) {
			console.error('withAsyncActions ERROR: ', err)
            setError(err.message || err)

            await delay(4000)
        } finally {
            setError(undefined)
            setInputAmount('0')
            // reEnable button
            setButtonBlocked(false)
            // disable app busy state
            useGlobalAppBlocker && useGlobalAppBlocker(false)
        }
    }

    return (
        <div className="asyncActionContainer">  
            <InfoShower 
                info={info}
                render={props => <h5>{title} {info && <span className="info" title="Click for more info" onClick={props.handleClick}>info</span>}</h5>}
            />
            {Component && 
                <Component
                    disabled={forceDisable || buttonBlocked}
                    onChange={handleChange}
                    value={inputAmount}
                />}
            {error 
                ? 
                    // Show error if error
                    <pre className="data-pre-error">{error}</pre> 
                :
                    // Show img SVG spinning loader if loading/blocked
                    // Else show button
                    buttonBlocked 
                        ? 
                    // eslint-disable-next-line jsx-a11y/alt-text
                    <img src={mgnSVG} className="loadingSVG" /> 
                        :
                    <button
                        className="ctaButton"
                        disabled={forceDisable || error || buttonBlocked}
                        onClick={handleClick}
                    >
                        {buttonText}
                    </button>
            }
        </div>
    )
}

export default withAsyncActions
