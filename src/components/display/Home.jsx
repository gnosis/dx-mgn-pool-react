import React from 'react'

import PoolData from './PoolData'
import UserStateDisplay from './UserStateDisplay'
import Footer from './Footer'

import { connect } from '../StateProvider'

import { withAPIConnect, withConfigDisplay, withModal, withPoolSwitching, withWalletConnect } from '../hoc'

const Home = () => (
  <section className="Home">
    {/* Show User's State */}
    <section className="UserState">
      <UserStateDisplay />
    </section>
    
    {/* DxMgnPool Data */}
    <section className="PoolData">
      <PoolData />
      <Footer />
    </section>
  </section>
)

const mapProps = ({
  // state properties
  state: {
    PROVIDER: { ACTIVE_PROVIDER },
    SHOW_MODAL,
  },
  // DISPATCH FUNCTIONS

  // DxMgnPool
  setPoolTokenInfo,
  // Provider
  registerProviders,
  setActiveProvider,
  // App
  showModal,
}) => ({
  // state properties
  state: {
    ACTIVE_PROVIDER,
    SHOW_MODAL,
  },
  // dispatchers
  dispatchers: {
    registerProviders,
    setActiveProvider,
    showModal,
    setPoolTokenInfo,
  },
})

export default connect(mapProps)(withModal(withWalletConnect(withPoolSwitching(withAPIConnect(process.env.SHOW_APP_DATA ? withConfigDisplay(Home) : Home)))))
