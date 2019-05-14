import React from 'react'
import { hot } from 'react-hot-loader'

import { withDutchXVerification } from '@gnosis.pm/dutchx-verification-react'

import AppOnlineStatusBar from './components/display/AppOnlineStatus'
import Blocked from './components/display/Modals/Blocked'
import Home from './components/display/Home'
import StateProvider from './components/StateProvider'

import { 
  GlobalSubscription,
  GlobalSub,
} from './subscriptions'

import { LOCALFORAGE_KEYS } from './globals'

const SubscribedApp = () =>
  // App is NOT blocked - render
  <GlobalSubscription source={GlobalSub}>
    {subState =>
      <StateProvider subState={subState}>       
        <AppOnlineStatusBar />
        <Home />
      </StateProvider>
    }
  </GlobalSubscription>

const ModalWrappedApp = withDutchXVerification(SubscribedApp)(LOCALFORAGE_KEYS.VERIFICATION_SETTINGS, LOCALFORAGE_KEYS.COOKIE_SETTINGS)

const App = ({
  disabledReason,
  networkAllowed,
}) => (
  disabledReason 
    ?
  // App is blocked 
  <Blocked disabledReason={disabledReason} networkAllowed={networkAllowed} /> 
    :
  <ModalWrappedApp />
)

export default hot(module)(App)
