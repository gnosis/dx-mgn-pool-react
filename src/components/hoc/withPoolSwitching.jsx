/* eslint-disable brace-style */
/* eslint-disable no-debugger */
import React, { useLayoutEffect, useState } from 'react'
import { unstable_batchedUpdates as batchUpdate } from 'react-dom'

import DataDisplayVisualContainer from '../display/DataDisplay'    
import ErrorHandler from '../display/ErrorHandler'

import { COLOUR_ARRAY } from '../../globals'

// TESTING
// const HardCodedPools = [
//     {
//         tokenA: "Wrapped Ether [WETH]",
//         tokenB: "Gnosis [GNO]",
//         Coordinator: {
//           1: {
//             events: {},
//             links: {},
//             address: "0xD4D3e3Ea73a7370e8e0A0cb5FD24DC13DC1668f4",
//             transactionHash: "0xd9d3792eecf23501549b867a6e9d04a116e985efe15d130d60f1dd3a728061fd",
//           },
//           4: {
//             events: {},
//             links: {},
//             address: "0xC1BE999de97dE9EB87Ef119bAB9dc396e4Eaf70C",
//             transactionHash: "0x975468d49db21f7ea8056c30f014b1f634a1436874179553ebec771a3fff32ff",
//           },
//         },
//       },
//       {
//         tokenA: "Wrapped Ether [WETH]",
//         tokenB: "Raiden [RDN]",
//         Coordinator: {
//           4: {
//             events: {},
//             links: {},
//             address: "0x3E46d875f7E88974117ABFA560c3A7250a39E1bd",
//             transactionHash: "0x975468d49db21f7ea8056c30f014b1f634a1436874179553ebec771a3fff32ff",
//           },
//         },
//       },
// ]
// const fakePromise = async (promResolve, time = 2000) => new Promise(accept => setTimeout(() => accept(promResolve), time))

const PoolPicker = ({
    currentPool,
    customStyle,
    disable,
    handlePoolSelect,
    netID,
    pools,
    startOpen,
    useColourArray,
}) => ( 
    <section className="PoolSwitcher" style={{ height: '68%' }}>
        <DataDisplayVisualContainer
            title="available pools"
            colour="green"
            customStyle={{
                display: 'flex',
                flexFlow: 'column nowrap',
                flex: 1,
                width: "100%",
                ...customStyle,
            }}
            preformatted={false}
            startOpen={startOpen}
            showOverflow={false}
            transition={false}
        >
            {() =>
                <>
                    {currentPool && <h6 style={{ background: '#d0ffeb', textAlign: 'center', padding: 10, margin: 0 }}>current pool: {currentPool.toLowerCase()}</h6>}
                    <div style={{ display: 'flex', flex: 1, height: '100%' }}>
                        <div className="poolSwitcherContainer">
                            {!disable && pools && pools.map(({ Coordinator, tokenA, tokenB }) => {
                                // don't show current selected pool
                                if (!Coordinator[netID] || Coordinator[netID] === currentPool) return null
                                
                                const { [netID]: coordinator } = Coordinator
                                
                                return (
                                    <div 
                                        className={`poolSwitcherPool data-pre-${useColourArray ? chooseRandomColour() : 'yellow'}`}
                                        key={`${coordinator}-${Math.random()}`}
                                        onClick={() => handlePoolSelect(coordinator)}
                                    >
                                        <h5>{coordinator.toLowerCase()}</h5>
                                        <h5>{tokenA.toLowerCase()}-{tokenB.toLowerCase()}</h5>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </>}
        </DataDisplayVisualContainer>
    </section>
)

export const withPoolSwitching = WrappedComponent =>
    function PoolSwitchHOC(props) {
        const { state: { APP_BUSY }, dispatchers: { showModal }, web3API: { getNetworkId } } = props
        
        const [pools, setPools]                         = useState([])
        const [error, setError]                         = useState(undefined)
        const [networkID, setNetworkID]                 = useState(undefined)
        const [poolSelected, setPoolSelected]           = useState(undefined)
        const [noAvailablePools, setNoAvailablePools]   = useState(false)
        const [renderPoolPicker, setRenderPoolPicker]   = useState(false)
        
        // Mount
        useLayoutEffect(() => {
            // reset error
            setError(undefined)

            // grab data async?
            const grabPools = async () => {
                try {
                    const [poolAddresses, id] = await Promise.all([
                        require('@gnosis.pm/dx-mgn-pool/pools.json'), // fakePromise(HardCodedPools), 
                        getNetworkId(),
                    ])
                    
                    // Local coord
                    if (id > 999) {
                        const localCoordinator = require('../../../build/contracts/Coordinator.json')
                        return setPoolSelected(localCoordinator.networks[id].address)
                    }

                    // will only run if expects an array
                    if (Array.isArray(poolAddresses)) {
                        if (!poolAddresses[0].Coordinator[id]) return setNoAvailablePools(true)
                        if (poolAddresses.length === 1) return setPoolSelected(poolAddresses[0])
                        
                        // else as normal, array format, multiple pools               
                        return batchUpdate(() => {
                            setNetworkID(id)
                            setPools(poolAddresses)
                            setRenderPoolPicker(true)
                        })
                    } 
                    
                    // if networks.json from @gnosis.pm/dx-mgn-pool is not an array 
                    return setPoolSelected(poolAddresses.Coordinator[id].address)
                } catch (err) {
                    console.error(err)
                    setError(err)
                }
            }
            
            // Start logic
            showModal('loading available pools')
            grabPools()
            .then(() => showModal(undefined))
        }, [])
        
        if (error) return <ErrorHandler />
        
        if (noAvailablePools) {
            return (
                <ErrorHandler 
                    render={() => 
                        <>
                            <h1>:( no available pools</h1>
                            <h5>please try switching networks.</h5>
                        </>}
                />
            )
        }

        if (!poolSelected) return <PoolPicker useColourArray netID={networkID} pools={pools} handlePoolSelect={setPoolSelected} />
        return (
            <>
                {renderPoolPicker && <PoolPicker customStyle={{ maxHeight: 300, overflowY: 'scroll' }} disable={APP_BUSY} netID={networkID} currentPool={poolSelected} pools={pools} handlePoolSelect={setPoolSelected} />}
                <WrappedComponent {...props} pools={pools} changePool={setPoolSelected} selectedPool={poolSelected} />
            </>
        )
    }

function chooseRandomColour() {
    return COLOUR_ARRAY[Math.round(Math.random() * (COLOUR_ARRAY.length - 1))]
}

export default withPoolSwitching
