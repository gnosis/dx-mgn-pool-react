import React, { useLayoutEffect, useState } from 'react'

// import { connect } from '../StateProvider'
import Providers, { checkAndSetProviderStatus } from '../../api/providers'

export const withWalletConnect = WrappedComponent =>
    function WalletConnectHOC(props) {
        const {
            dispatchers: { 
                registerProviders, 
                setActiveProvider,
                showModal,
            }, 
            state: { ACTIVE_PROVIDER }, 
        } = props

        const [providersDetected, setProvidersDetected] = useState(false)
        const [error, setError] = useState(undefined)
        const [bootingUp, setBootingUp] = useState(true)
        // const [activeProviderSet, setActiveProviderSet] = useState(undefined)
        // const [disclaimerAccepted, setDisclaimerAccepted] = useState(false)

        /* 
        * MOUNT LOGIC
        * REGISTER PROVIDERS INTO GLOBAL STATE
        */
        useLayoutEffect(() => {
            // returns [ Provider{}, ... ]
            const providersArray = Object.values(Providers)
            // register each providerObject into state
            providersArray.forEach(() => { registerProviders(providersArray) })
        }, [])

        /**
         * onWalletSelect Event Handler
         * @param { providerInfo } @type { ProviderObject }
         * @memberof withWalletConnect
         */
        async function onWalletSelect(providerInfo) {
            // App state subscriptions
            let unsub

            // State setters
            setBootingUp(true)
            setError(undefined)
            
            // Set Modal
            showModal('connecting wallet')

            try {                
                // Gnosis Safe Fix + Provider Enable
                const providerStatus = await checkAndSetProviderStatus()
                setProvidersDetected(providerStatus)

                const chosenProvider = Providers[providerInfo]
                // initialize providers and return specific Web3 instances
                await chosenProvider.initialize()

                // Save ACTIVE_PROVIDER to State
                setActiveProvider(providerInfo)
                
                // Save web3 provider + notify state locally
                // return setActiveProviderSet(true)
            } catch (err) {
                console.error(err)
                setError(err)
                // Unsubscribe
                return unsub && unsub()
            } finally {
                // Hide Modal
                showModal(undefined)
                // Stop boot up
                // called here so showModal close doesnt interrupt possible child
                // modals
                setBootingUp(false)
            }
        }

        const walletSelector = () => (
            <section className="walletChooser">
            <h2>Please select a wallet</h2>
            <div className={bootingUp || providersDetected ? '' : 'lightBlue'}>
                {Object.keys(Providers).map((provider, i) => {
                const providerObj = Providers[provider]
                return (
                    <div
                    className="poolContainer providerChoiceContainer"
                    role="container"
                    key={i}
                    onClick={() => onWalletSelect(provider)}
                    >
                    <h4 className="providerChoice">{`${providerObj.providerName || ''}`}</h4>
                    </div>
                )
                })}
            </div>
            </section>
        )
        if (error) return <h1>An error occurred: {error}</h1>
        if (!ACTIVE_PROVIDER) return walletSelector()
        
        return !bootingUp && <WrappedComponent {...props} />
    }

export default withWalletConnect
