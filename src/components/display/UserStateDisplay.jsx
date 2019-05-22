import React from 'react'
import { connect } from '../StateProvider'

import DataDisplayVisualContainer from './DataDisplay'
import { withAsyncActions } from '../hoc'

import {
  lockAllMgn,
} from '../../api'

import { splitAddress } from '../../api/utils'

import { DATA_LOAD_STRING, FIXED_DECIMAL_AMOUNT } from '../../globals'

const userStateDisplayHeader = {
  backgroundColor: '#fbcaca',
}

const LockMGN = withAsyncActions()

const UserStateDisplay = ({ NETWORK, USER, MGN_BALANCES }) =>
  <DataDisplayVisualContainer
    title="Connected Wallet"
    colour="salmon"
    height="26em"
    startOpen
    transition
  >
    {() =>
      <>
        <h5 style={userStateDisplayHeader}>account & netWork</h5>
        <p><span className="data-title">ACCOUNT:</span> <span title={USER.ACCOUNT}>{USER.ACCOUNT === DATA_LOAD_STRING ? DATA_LOAD_STRING : splitAddress(USER.ACCOUNT)}</span></p>
        <p><span className="data-title">NETWORK:</span> <strong>{NETWORK.toUpperCase()}</strong></p>
        <p><span className="data-title">[ETH] BALANCE:</span> {USER.BALANCE && USER.BALANCE}</p>
        <hr />

        <h5 style={userStateDisplayHeader}>mgn bAlances</h5>
        {Object.keys(MGN_BALANCES).map(key => <p key={key + Math.random()}><span className="data-title">{key.toUpperCase().split('_').join(' ')}:</span> {(MGN_BALANCES[key] && MGN_BALANCES[key] !== DATA_LOAD_STRING) && Number(MGN_BALANCES[key]).toFixed(FIXED_DECIMAL_AMOUNT)}</p>)}
        <hr />
        <LockMGN 
          asyncAction={lockAllMgn}
          buttonText="lock"
          buttonOnly
          forceDisable={MGN_BALANCES['TOTAL LOCKABLE BALANCE'] === DATA_LOAD_STRING || MGN_BALANCES['TOTAL LOCKABLE BALANCE'] <= 0}
          info="Lock your total lockable balance"
          title="lock mgn balance"
        />
      </>
    }
  </DataDisplayVisualContainer>

const mapState = ({ 
  state,
  state: { 
    USER, 
    PROVIDER: { NETWORK }, 
    TOKEN_MGN: {
      MGN_BALANCE,
      LOCKED_MGN_BALANCE,
      // UNLOCKED_MGN_BALANCE,
    },
  }, 
}) => ({
  state,
  NETWORK,
  USER,
  MGN_BALANCES: {
    'TOTAL LOCKABLE BALANCE': MGN_BALANCE,
    'TOTAL LOCKED BALANCE': LOCKED_MGN_BALANCE,
    // UNLOCKED_BALANCE: UNLOCKED_MGN_BALANCE,
  },
})

export default connect(mapState)(UserStateDisplay)
