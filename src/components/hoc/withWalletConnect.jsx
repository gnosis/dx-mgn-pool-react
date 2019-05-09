import React, { useEffect, useState } from 'react'

import Providers, { checkAndSetProviderStatus } from '../../api/providers'

import { connect } from '../StateProvider'

import withConfigDisplay from '../hoc/withConfigDisplay'
import withModal from '../hoc/withModal'
import withPoolSwitching from '../hoc/withPoolSwitching'

/* 
    1. JUST wallet/provider setup
*/

const withWalletConnect = WrappedComponent =>
    function walletConnect(props) {
        const {
            pools,
            changePool,
            selectedPool, 
            dispatchers: { 
                registerProviders, 
                setActiveProvider,
                showModal,
                setPoolTokenInfo,
            }, 
            state: { ACTIVE_PROVIDER }, 
            children,
        } = props

        const [providersDetected, setProvidersDetected] = useState(false)
        const [error, _setError] = useState(undefined)
        const [initialising, _setInitialising] = useState(false)
        const [activeProviderSet, _setActiveProviderState] = useState(undefined)
        // const [disclaimerAccepted, setDisclaimerAccepted] = useState(false)

        /* 
        * MOUNT LOGIC
        * REGISTER PROVIDERS INTO GLOBAL STATE
        */
        useEffect(() => {
            // returns [ Provider{}, ... ]
            const providersArray = Object.values(Providers)
            // register each providerObject into state
            providersArray.forEach(() => { registerProviders(providersArray) })
        }, [])

        /**
         * onChange Event Handler
         * @param { providerInfo } @type { ProviderObject }
         * @memberof withWalletConnect
         */
        async function onChange(providerInfo) {
            // App state subscriptions
            let unsub
            try {
                // Set Modal
                showModal('Loading user data . . .')

                // Gnosis Safe Fix
                const providerStatus = await checkAndSetProviderStatus()
                setProvidersDetected(providerStatus)

                // State setters
                _setError(undefined)
                _setInitialising(true)

                const chosenProvider = Providers[providerInfo]
                // initialize providers and return specific Web3 instances
                await chosenProvider.initialize()

                // Save ACTIVE_PROVIDER to State
                setActiveProvider(providerInfo)
                
                // Save web3 provider + notify state locally
                return _setActiveProviderState(true)
            } catch (err) {
                console.error(err)
                _setError(err)

                // Unsubscribe
                return unsub && unsub()
            } finally {
                _setInitialising(false)
                // Hide Modal
                showModal(undefined)
            }
        }

        const walletSelector = () => (
            <section className="walletChooser">
            <h2>Please select a wallet</h2>
            <div className={initialising || providersDetected ? '' : 'lightBlue'}>
                {Object.keys(Providers).map((provider, i) => {
                const providerObj = Providers[provider]
                return (
                    <div
                    className="poolContainer providerChoiceContainer"
                    role="container"
                    key={i}
                    onClick={() => onChange(provider)}
                    >
                    <h4 className="providerChoice">{`${providerObj.providerName || ''}`}</h4>
                    </div>
                )
                })}
            </div>
            </section>
        )

        if (error) return <h1>An error occurred: {error}</h1>
        
        // if ((ACTIVE_PROVIDER && activeProviderSet) && !initialising) 
            // return <><div>{pools.map(pool => <p onClick={() => changePool(pool.coordinator)} style={{ cursor: 'pointer' }}>{pool.coordinator}</p>)}</div>{children}</>
        
        if (initialising) return walletSelector()

        return <WrappedComponent {...props} />
    }

/* const mapProps = ({
  // state properties
  state: {
    PROVIDER: { ACTIVE_PROVIDER },
    TOKEN_MGN: {
      ADDRESS,
    },
    LOADING,
    SHOW_MODAL,
    INPUT_AMOUNT,
  },
  // dispatchers
  appLoading,
  registerProviders,
  setActiveProvider,
  getDXTokenBalance,
  saveContract,
  showModal,
  setPoolTokenInfo,
}) => ({
  // state properties
  state: {
    "[MGN] Address": ADDRESS,
    ACTIVE_PROVIDER,
    LOADING,
    SHOW_MODAL,
    INPUT_AMOUNT,
  },
  // dispatchers
  dispatchers: {
    appLoading,
    registerProviders,
    setActiveProvider,
    getDXTokenBalance,
    saveContract,
    showModal,
    setPoolTokenInfo,
  },
}) */

export default withWalletConnect
