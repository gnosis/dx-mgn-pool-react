import React, { useEffect, useState } from 'react'
import { connect } from '../StateProvider'

// const formatTime = time => (time > 0 ? time > 24 ? `${(time / 24).toFixed()} day(s)` : `${time} hours` : 'now')
/* const formatTime = time => 
    `${Number(time)
        .toFixed(2)
        .split('.')
        .map((t, i) => (i === 0 ? t : (60 * (t / 100)).toFixed()))
        .join('h ')}m` */

const formatTime = time => 
    `${Number(time)
        .toFixed(2)
        .split('.')
        .map((t, i) => {
            if (i === 0) {
                if (t > 48) return `${(t / 24).toFixed()} days`

                return `${t} hours`
            }
            
            return `${(60 * (t / 100)).toFixed()} minutes`
        })
        .join(' and ')
        }`

function Countdown({
    BLOCK_TIMESTAMP,
    POOLING_PERIOD_END,
}) { 
    const [timeDifference, setTimeDifference] = useState(undefined)

    useEffect(() => {
        if (BLOCK_TIMESTAMP && POOLING_PERIOD_END) {
            const newDiff = POOLING_PERIOD_END - BLOCK_TIMESTAMP
            // Set hours until PoolingEnds + 24 hours + 8 hours (for even auctions)
            setTimeDifference((newDiff / 3600 + 32).toFixed(2))
        }
    }, [BLOCK_TIMESTAMP, POOLING_PERIOD_END])

    // dont show negative time
    if (timeDifference <= 0) return null

    return (
        <div>
            {(timeDifference && timeDifference > 0) && <h6>CLAIM & WITHDRAW IN APPROX. {formatTime(timeDifference)}</h6>}
        </div>
    )
}

const mapState = ({ 
    state: {
        PROVIDER: { BLOCK_TIMESTAMP },
    },
}) => ({ BLOCK_TIMESTAMP })

export default connect(mapState)(Countdown)
