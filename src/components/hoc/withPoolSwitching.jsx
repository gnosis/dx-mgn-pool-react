import React, { useEffect, useState } from 'react'

const MockCoordData = [
    {
        tokenA: 'REAL',
        tokenB: 'TOKEN',
        1: {
            address: '0xD4D3e3Ea73a7370e8e0A0cb5FD24DC13DC1668f4',
        },
        4: {
            address: '0x9878669e883DDfC52620a6493b361213444cB974',
        },
    },
    {
        tokenA: 'WETH',
        tokenB: 'GOGO',
        1: {
            address: '0xD4D3e3Ea73a7370e8e0A0cb5FD24DC13DC1668f4',
        },
        4: {
            address: '0x9878669e883DDfC52620a6493b361213444cB974',
        },
    },
    {
        tokenA: 'TEEF',
        tokenB: 'MILK',
        1: {
            address: '0xD4D3e3Ea73a7370e8e0A0cb5FD24DC13DC1668f4',
        },
        4: {
            address: '0x9878669e883DDfC52620a6493b361213444cB974',
        },
    },
    {
        tokenA: 'BEEF',
        tokenB: 'LMAO',
        1: {
            address: '0xD4D3e3Ea73a7370e8e0A0cb5FD24DC13DC1668f4',
        },
        4: {
            address: '0x9878669e883DDfC52620a6493b361213444cB974',
        },
    },
]

const fakePromise = async time => new Promise(accept => setTimeout(() => accept(MockCoordData), time))

const PoolPicker = ({
    handlePoolSelect,
    pools,
}) => {
    console.debug('POOLS = ', pools)
    return (
        <div className="poolSwitcherContainer">
            <h3 style={{ width: '100%', textAlign: 'center' }}>available pools:</h3>
            {pools.map(({ coordinator, tokenA, tokenB }) => 
                <div 
                    style={{ minWidth: '50%' }}
                    onClick={() => handlePoolSelect(coordinator)}
                >
                    <p>{coordinator.toLowerCase()}</p>
                    <p>{tokenA.toLowerCase()}-{tokenB.toLowerCase()}</p>
                </div>)}
        </div>
    )
}

const withPoolSwitching = WrappedComponent =>
    function PoolSwitcher(props) {
        const [error, setError] =               useState(undefined)
        const [pools, setPools] =               useState([])
        const [loading, setLoading] =           useState(false)
        const [poolSelected, setPoolSelected] = useState(undefined)

        // Mount
        useEffect(() => {
            setLoading(true)

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
                } finally {
                    setLoading(false)
                }
            }
            
            grabPools()
        }, [])

        if (loading) return <div className="poolSwitcherContainer"><h1 style={{ margin: 'auto', textAlign: 'center' }}>loading available pools...</h1></div>
        if (error) return <h1>App Error!</h1>

        if (!poolSelected) return <PoolPicker pools={pools} handlePoolSelect={setPoolSelected} />
        
        return <WrappedComponent {...props} pools={pools} changePool={setPoolSelected} selectedPool={poolSelected} />
    }

export default withPoolSwitching
