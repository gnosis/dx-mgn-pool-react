import React from 'react'
import { connect } from '../StateProvider'

import { useAppOnlineStatusListener } from '../../api/hooks'

import { CONTENT_URLS } from '../../globals'

const statusBar = {
  display: 'flex',
  flexFlow: 'column nowrap',
  fontFamily: 'Permanent Marker',
}

export const TopBanner = ({
  backgroundColor = '#f6f784',
  borderRadius = 0,
  fontFamily = 'Major Mono Display',
  fontSize = '0.7em',
  customStyle = {
    fontWeight: '800',
    letterSpacing: '-0.2px', 
    lineHeight: 1, 
    margin: 0, 
    textAlign: 'center',
  },
  children,
  render,
}) =>
  <pre 
    style={{ 
      backgroundColor, 
      borderRadius, 
      fontFamily, 
      fontSize,
      ...customStyle, 
    }}
  >
    {render && render()}
    {children}
  </pre>

const AppOnlineStatusBar = ({
  NETWORK = 'UNKNOWN',
}) => {
  const isOnline = useAppOnlineStatusListener()
  return (
    <div style={{ ...statusBar }}>
      {/* Blog Link */}
      <TopBanner 
        borderRadius="0px 0px 0px 25px"
        render={() => <>see how the dutchx mgn pooling app works <a href={CONTENT_URLS.HOW_IT_WORKS} target="_blank" rel="noopener noreferrer">here</a></>}
      />
      {/* App Status */}
      <TopBanner 
        backgroundColor={isOnline ? '#aaffaa' : '#ff7a7a'}
        borderRadius="0px 0px 0px 25px"
        customStyle={{
          display: 'inline-flex',
          fontFamily: 'inherit', 
          fontSize: '0.5em', 
          lineHeight: 1, 
          margin: '0px 0px 0px auto', 
        }}
        render={() => 
          <>
            APP STATUS: {isOnline ? 'ONLINE' : 'OFFLINE'}
            <br />
            NETWORK: {NETWORK}
          </>}
      />
      {/* Warning */}
      <TopBanner 
        backgroundColor="#fffcce"
        customStyle={{
          marginTop: '70px',
        }}
        render={() => 
          <>
            <p>
              <strong className="serious red-serious">
                Due to the mechanism design of the MGN Pools, when participating in the MGN Pools it is very likely that any remaining Pool deposit of tokens will be significantly lower than the tokens initially deposited and may be nil (0). Moreover, where the Pool incurs losses the number of MGN generated decreases proportionally as MGN is generated at a rate of 1 MGN per 1 ETH traded.
              </strong>
            </p>
            <p>
              <strong className="serious red-serious">
                Hence, please only participate in the MGN Pool, if you wish to accrue MGN and you value such MGN high enough to justify the significant risk of losing all your tokens initially deposited into the MGN Pools.
              </strong>
            </p>
            <p>
              <strong className="serious red-serious">
                By taking part in the MGN Pools, you understand that you might incur severe token losses.
              </strong>
            </p>
            <h2 style={{ textAlign: 'left' }}>
              <strong className="serious">
                SINCE THE MGN POOLS HAVE INCREASED IN SIZE CONSIDERABLY, WE HAVE DISABLED THE DEPOSIT FUNCTION ON OUR SITE. YOUR REMAINING POOL SHARE MAY BE RECLAIMED AT THE END OF THE TRADING PERIOD.
              </strong>
            </h2>
          </>}
      />
    </div>
  )
}

const mapUserData = ({
  state: { PROVIDER: { NETWORK } },
}) => ({
  NETWORK,
})

export default connect(mapUserData)(AppOnlineStatusBar)
