import React, { useEffect } from 'react'

const withAPIConnect = WrappedComponent =>
    function APIConnect(props) {
        /* 
        * MOUNT LOGIC
        * 
        */
        useEffect(() => {

        }, [])

        /* 
        * POOL SWITCHING DETECTION 
        */
        /* useEffect(() => {
            console.debug('Change detected in selectedPool: ', selectedPool)

            if (ACTIVE_PROVIDER) {
            console.debug('Firing wallet integration setup with new address')
            onChange(ACTIVE_PROVIDER)
            } else {
            console.debug('No ACTIVE_PROVIDER, skipping onChange call')
            }
        }, [selectedPool]) */

        async function APIInitialisation() {
            let unsubscribe
            try {
            // interface with contracts & connect entire DX API
            await getAppContracts(selectedPool, 'FORCE')
            console.debug('Got app contracts')
            // INIT main API
            await getAPI()
            console.debug('Got app API')

            // Start socket state subscriptions
            unsubscribe = await startSubscriptions()
            console.debug('restarted subs')

            // Lazy load pool token info
            setPoolTokenInfo()
            } catch (initError) {
                console.error(initError)

                return unsubscribe && unsubscribe()
            }
        }

        return <WrappedComponent {...props} />
    }

export default withAPIConnect
