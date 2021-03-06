import { toBN } from './api/utils'

export const APP_URLS = {
  LOCAL: [
    'localhost', 
    '0.0.0.0', 
    '127.0.0.1',
  ],
  DEV: ['dx-mgn-pool.dev.gnosisdev.com'],
  STAGING: ['dx-mgn-pool.staging.gnosisdev.com'],
  PRODUCTION: {
    MAIN: ['mgn-pool.slow.trade'],
    RINKEBY: ['rinkeby.mgn-pool.slow.trade'],
  },
  PR_REVIEW_TEST: hostname => /^\w+--dxmgnpoolreact.review.gnosisdev.com$/.test(hostname),
}

export const CONTENT_URLS = {
  HOW_IT_WORKS: 'https://medium.com/@slow_trade/how-to-use-the-dutchx-mgn-pool-interface-e151efe7094b',
}

export const ETHEREUM_NETWORKS = {
  MAIN: 'MAIN',
  MORDEN: 'MORDEN',
  ROPSTEN: 'ROPSTEN',
  RINKEBY: 'RINKEBY',
  KOVAN: 'KOVAN',
  UNKNOWN: 'UNKNOWN',
}

export const networkById = {
  1: ETHEREUM_NETWORKS.MAIN,
  2: ETHEREUM_NETWORKS.MORDEN,
  3: ETHEREUM_NETWORKS.ROPSTEN,
  4: ETHEREUM_NETWORKS.RINKEBY,
  42: ETHEREUM_NETWORKS.KOVAN,
}

export const GAS_LIMIT = 400000
export const GAS_PRICE = 15e9

export const GAS_STATION_URLS = {
  MAIN_GAS_STATION: 'https://safe-relay.gnosis.pm/api/v1/gas-station/',
  RINKEBY_GAS_STATION: 'https://safe-relay.staging.gnosisdev.com/api/v1/gas-station/',
}


export const FIXED_DECIMAL_AMOUNT = 4
export const DATA_LOAD_STRING = 'loading...'

export const WEBSOCKET_URLS = {
  MAIN: 'wss://mainnet.infura.io/ws/v3/fb2b930672ff4872bfcad69671f2dfd4',
  RINKEBY: 'wss://rinkeby.infura.io/ws/v3/fb2b930672ff4872bfcad69671f2dfd4',
  KOVAN: 'wss://kovan.infura.io/ws/v3/fb2b930672ff4872bfcad69671f2dfd4',
  MORDEN: 'wss://morden.infura.io/ws/v3/fb2b930672ff4872bfcad69671f2dfd4',
  ROPSTEN: 'wss://ropsten.infura.io/ws/v3/fb2b930672ff4872bfcad69671f2dfd4',
  LOCAL: 'ws://localhost:8545/ws',
}

export const INFURA_URLS = {
  MAIN: 'https://mainnet.infura.io/v3/fb2b930672ff4872bfcad69671f2dfd4',
  RINKEBY: 'https://rinkeby.infura.io/v3/fb2b930672ff4872bfcad69671f2dfd4',
}

export const MAINNET_WETH = require('@gnosis.pm/util-contracts/networks.json').EtherToken['1'].address
export const RINKEBY_WETH = require('@gnosis.pm/util-contracts/networks.json').EtherToken['4'].address

export const BN_4_PERCENT = toBN(104)

export const POOL_STATES = {
  POOLING: 'POOLING',
  POOLING_ENDED: 'POOLINGENDED',
  DEPOSIT_WITHDRAW_FROM_DX: 'DEPOSITWITHDRAWFROMDX',
  MGN_UNLOCKED: 'MGNUNLOCKED',
}

export const POOL_STATES_READABLE = {
  POOLING: 'POOLING',
  POOLINGENDED: 'POOLING ENDED',
  DEPOSITWITHDRAWFROMDX: 'DEPOSIT WITHDRAWN FROM DX',
  MGNUNLOCKED: 'MGN UNLOCKED',
  'loading...': 'loading...',
}

export const POOL_STATES_READABLE_LONG = {
  POOLING: 'Pool is open for participation',
  POOLINGENDED: 'Pooling has finished. Come back in 24/48 hours to withdraw your tokens and lock MGN',
  DEPOSITWITHDRAWFROMDX: 'Pooling has finished.  MGN unlock has been requested; this process takes 24 hours. You will be able to withdraw your share after that',
  MGNUNLOCKED: 'Pooling has finished. Please withdraw your MGN and any available tokens. Once withdrawn, you can lock your MGN in order to receive Reputation for the dxDAO',
  'loading...': 'loading...',
}

export const LOCALFORAGE_KEYS = {
  VERIFICATION_SETTINGS: 'dxMgnPool-VerificationSettings',
  COOKIE_SETTINGS: 'dxMgnPool-CookieSettings',
}

export const COLOUR_ARRAY = [
  'violet',
  'green',
  'yellow',
  'purple',
  'salmon',
  'blue', 
]

export const EMAILS = {
  SUPPORT: 'support@slow.trade',
}
