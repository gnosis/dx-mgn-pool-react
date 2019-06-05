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
        backgroundColor="#f7aaaa"
        customStyle={{
          marginTop: '70px',
        }}
        render={() => 
          <>
            please note that this pool has the sole purpose to easily generate Magnolia tokens by taking part in every auction on your behalf. 
            you may only claim back your deposited funds at the end of the pooling period. 
            by taking part in the pool, you understand that you might incur severe losses of your token.
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
