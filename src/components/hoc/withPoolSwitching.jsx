/* eslint-disable no-debugger */
import React, { useLayoutEffect, useState } from 'react'
import { unstable_batchedUpdates as batchUpdate } from 'react-dom'

import DataDisplayVisualContainer from '../display/DataDisplay'    
import ErrorHandler from '../display/ErrorHandler'

const MockCoordData = [
    {
        tokenA: 'WETH',
        tokenB: 'GNO',
        1: {
            address: '0xD4D3e3Ea73a7370e8e0A0cb5FD24DC13DC1668f4',
        },
        4: {
            address: '0x9878669e883DDfC52620a6493b361213444cB974',
        },
    },
    {
        tokenA: 'WETH [old]',
        tokenB: 'GNO [old]',
        1: {
            address: '0xE1d2ce6F25Cd8Ef4d02de2d268A9e52b62659E59',
        },
        4: {
            address: '0x9878669e883DDfC52620a6493b361213444cB974',
        },
    },
    {
        tokenA: 'WETH',
        tokenB: 'RDN',
        1: {
            address: '0xf83fF988570d9fb37389DC84a65d09BCF05A4569',
        },
        4: {
            address: '0x9878669e883DDfC52620a6493b361213444cB974',
        },
    },
]
const fakePromise = async time => new Promise(accept => setTimeout(() => accept(MockCoordData), time))

const PoolPicker = ({
    currentPool,
    handlePoolSelect,
    netID,
    pools,
    startOpen,
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
            }}
            preformatted={false}
            startOpen={startOpen}
            showOverflow={false}
            transition={false}
        >
            {() =>
                <>
                    {currentPool && <h6 style={{ background: '#d0ffeb', textAlign: 'center', padding: 10, margin: 0 }}>current pool: {currentPool.toLowerCase()}</h6>}
                    <div className="poolSwitcherContainer">
                        {pools.map(({ [netID]: { address: coordinator }, tokenA, tokenB }) => {
                            // don't show current selected pool
                            if (coordinator === currentPool) return null

                            return (
                                <div 
                                    className="poolSwitcherPool"
                                    key={`${coordinator}-${Math.random()}`}
                                    style={{ minWidth: '50%' }}
                                    onClick={() => handlePoolSelect(coordinator)}
                                >
                                    <p>{coordinator.toLowerCase()}</p>
                                    <p>{tokenA.toLowerCase()}-{tokenB.toLowerCase()}</p>
                                </div>
                            )
                        })}
                    </div>
                </>}
        </DataDisplayVisualContainer>
    </section>
)

export const withPoolSwitching = WrappedComponent =>
    function PoolSwitchHOC(props) {
        const { dispatchers: { showModal }, web3API: { getNetworkId } } = props
        
        const [pools, setPools]                 = useState([])
        const [error, setError]                 = useState(undefined)
        const [networkID, setNetworkID]         = useState(undefined)
        const [poolSelected, setPoolSelected]   = useState(undefined)
        
        // Mount
        useLayoutEffect(() => {
            // reset error
            setError(undefined)

            // grab data async?
            const grabPools = async () => {
                try {
                    const [poolAddresses, id] = await Promise.all([
                        fakePromise(300),
                        getNetworkId(),
                    ])
                    
                    if (poolAddresses.length === 1) setPoolSelected(poolAddresses[0])
                    else {
                        batchUpdate(() => {
                            setNetworkID(id)
                            setPools(poolAddresses)
                        })
                    }                    
                } catch (err) {
                    console.error(err)
                    setError(err)
                }
            }
            
            // Start logic
            showModal('loading available pools')
            grabPools()
            .then(() => showModal(null))
        }, [])
        
        if (error) return <ErrorHandler />
        
        if (!poolSelected) return <PoolPicker netID={networkID} pools={pools} handlePoolSelect={setPoolSelected} />
        
        return (
            <>
                <PoolPicker netID={networkID} currentPool={poolSelected} pools={pools} handlePoolSelect={setPoolSelected} />
                <WrappedComponent {...props} pools={pools} changePool={setPoolSelected} selectedPool={poolSelected} />
            </>
        )
    }

export default withPoolSwitching
