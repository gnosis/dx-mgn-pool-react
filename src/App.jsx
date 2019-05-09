import React from 'react'
import { hot } from 'react-hot-loader'

import { DutchXVerificationHOC } from '@gnosis.pm/dutchx-verification-react'

import AppOnlineStatusBar from './components/display/AppOnlineStatus'
import Blocked from './components/display/Modals/Blocked'
import Home from './components/display/Home'
import StateProvider from './components/StateProvider'
import WalletIntegration from './components/controls/WalletIntegration'

import { LOCALFORAGE_KEYS } from './globals'

import { 
  GlobalSubscription,
  GlobalSub,
} from './subscriptions'

const ConnectedApp = () =>
  // App is NOT blocked - render
  <GlobalSubscription source={GlobalSub}>
    {subState =>
      <StateProvider subState={subState}>       
        <AppOnlineStatusBar />
        <WalletIntegration>
          <Home />
        </WalletIntegration>
      </StateProvider>
    }
  </GlobalSubscription>

const ModalWrappedApp = DutchXVerificationHOC(ConnectedApp)(LOCALFORAGE_KEYS.VERIFICATION_SETTINGS, LOCALFORAGE_KEYS.COOKIE_SETTINGS)

const App = ({
  disabledReason,
}) => (
  disabledReason 
    ?
  // App is blocked 
  <Blocked /> 
    :
  <ModalWrappedApp />
)

export default hot(module)(App)
