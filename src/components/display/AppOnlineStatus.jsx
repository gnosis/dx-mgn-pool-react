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
        render={() => <>read about the dutchx mgn pooling <a href={CONTENT_URLS.HOW_IT_WORKS} target="_blank" rel="noopener noreferrer">here</a></>}
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
              <strong className="serious">
                THE TRADING PERIOD FOR THE POOLS HAS ENDED.
              </strong>
            </p>
            <p>
              <strong className="serious">
                IF YOU ARE A USER WHO PARTICIPATED IN THE POOLS AND YOU HAVE NOT YET CLAIMED YOUR REMAINING BALANCE OF THE DEPOSITED TOKENS OR YOUR MGN, YOU MUST DO SO ASAP.
              </strong>
            </p>
            <p>
              <strong className="serious">
              YOU CAN DO SO HERE. IF YOU HAVE PROBLEMS CLAIMING BACK YOUR DEPOSITED FUNDS, PLEASE GET IN TOUCH WITH OUR SUPPORT TEAM AT <a href="mailto:SUPPORT@SLOW.TRADE">SUPPORT@SLOW.TRADE</a> OR RAISE THE ISSUE IN THE DXDAO’S PUBLIC TELEGRAM CHANNEL AT <a href="https://T.ME/DXDAO" target="_blank" rel="noopener noreferrer">T.ME/DXDAO</a>.
              </strong>
            </p>
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
