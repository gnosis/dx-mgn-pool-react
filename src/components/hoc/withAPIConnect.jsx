import React, { useState, useLayoutEffect } from 'react'

import { getAPI, getAppContracts } from '../../api'
import startSubscriptions from '../../subscriptions'
import ErrorHandler from '../display/ErrorHandler'

export const withAPIConnect = WrappedComponent =>
    function APIConnectHOC(props) {
        const {
            state: {
                ACTIVE_PROVIDER,
            },
            dispatchers: {
                setPoolTokenInfo,
                showModal,
            },
            selectedPool,
        } = props

        const [error, setError] = useState(null)

        /* 
        * POOL SWITCHING DETECTION - MOUNT LOGIC
        */
       useLayoutEffect(() => {
            let unsubscribe

            // Make sure app has an ACTIVE_PROVIDER set before running, else do nothing
            if (ACTIVE_PROVIDER) {
                showModal('loading user data')
                // returns unsubscribe method
                APIInitialisation()
                // eslint-disable-next-line no-return-assign
                .then(res => unsubscribe = res)
                // Hide modal
                .then(() => showModal(null))
            }

            return () => unsubscribe && unsubscribe()
        }, [selectedPool])

        async function APIInitialisation() {
            let unsubscribe
            try {
                // interface with contracts & connect entire DX API
                await getAppContracts(selectedPool, 'FORCE')
                // INIT main API
                await getAPI('FORCE')

                unsubscribe = await startSubscriptions()

                // Lazy load pool token info
                await setPoolTokenInfo()
            } catch (initError) {
                console.error(initError)
                setError(initError)
            }

            return unsubscribe
        }

        if (error) return <ErrorHandler />
        
        return <WrappedComponent {...props} />
    }

export default withAPIConnect
