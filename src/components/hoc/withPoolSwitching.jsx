/* eslint-disable no-debugger */
import React, { useLayoutEffect, useState } from 'react'

import DataDisplayVisualContainer from '../display/DataDisplay'    

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
    pools,
    startOpen,
}) => ( 
    <section className="Home" style={{ height: '68%' }}>
        <DataDisplayVisualContainer
            title="available pools"
            colour="green"
            customStyle={{
                display: 'flex',
                flexFlow: 'column nowrap',
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
                        {pools.map(({ 1: { address: coordinator }, tokenA, tokenB }) => {
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
        const { dispatchers: { showModal } } = props
        
        const [error, setError] =               useState(undefined)
        const [pools, setPools] =               useState([])
        const [poolSelected, setPoolSelected] = useState(undefined)
        
        // Mount
        useLayoutEffect(() => {
            // grab data async?
            const grabPools = async () => {
                try {
                    const poolAddresses = await fakePromise(300)
                    // eslint-disable-next-line no-unused-expressions
                    poolAddresses.length === 1 && setPoolSelected(true) && setPoolSelected(poolAddresses[0])

                    setPools(poolAddresses)
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
        
        if (error) return <h1>App Error!</h1>
        
        if (!poolSelected) return <PoolPicker pools={pools} handlePoolSelect={setPoolSelected} />
        
        return (
            <>
                <PoolPicker currentPool={poolSelected} pools={pools} handlePoolSelect={setPoolSelected} />
                <WrappedComponent {...props} pools={pools} changePool={setPoolSelected} selectedPool={poolSelected} />
            </>
        )
    }

export default withPoolSwitching
