import { isBN, toBN, toWei, fromWei } from 'web3-utils'
import { DATA_LOAD_STRING, FIXED_DECIMAL_AMOUNT, WEBSOCKET_URLS, POOL_STATES } from '../../globals'

// eslint-disable-next-line import/prefer-default-
const windowLoaded = new Promise((resolve) => {
  if (typeof window === 'undefined') {
    resolve()
    return
  }

  if (typeof window.addEventListener !== 'function') {
    throw new Error('Expected to use event listener')
  }

  window.addEventListener('load', function loadHandler(event) {
    window.removeEventListener('load', loadHandler, false)

    return resolve(event)
  })
})

export const web3CompatibleNetwork = async () => {
  await windowLoaded
  // blocks access via load
  if (typeof window === 'undefined' || !window.web3) return (console.error('No Provider detected. Returning UNKNOWN network.'), 'UNKNOWN')

  let { web3 } = window
  let netID

  // irregular APIs - Opera, new MM, some other providers
  if (web3.currentProvider && !web3.version) {
    const Web3 = require('web3')
    console.warn('Non-Metamask or Gnosis Safe Provider injected web3 API detected')

    window.web3 = web3 = new Web3(web3.currentProvider)
  }

  // 1.X.X API
  if (typeof web3.version === 'string') {
    netID = await new Promise((accept, reject) => {
      web3.eth.net.getId((err, res) => {
        if (err) {
          reject(new Error(`UNKNOWN ${err}`))
        } else {
          accept(res)
        }
      })
    })
  } else {
    // 0.XX.xx API
    // without windowLoaded web3 can be injected but network id not yet set
    netID = await new Promise((a, r) => {
      web3.version.getNetwork((e, res) => {
        if (e) return r(new Error(`UNKNOWN ${e}`))

        return a(res)
      })
    })
  }

  return netID
}

const zeroDecimalsRegEx = /\.?0+$/
const decimalChecker = (n) => {
  const indOfDecimal = n.indexOf('.')
  // no decimal point or there are fewer decimal digits than 17
  if (indOfDecimal === -1 || n.length - indOfDecimal < 17) return n

  const shortened = Number(n).toFixed(4)

  // 5.0700 => 5.07
  return shortened.replace(zeroDecimalsRegEx, '')
}

const timeValidator = (t, now) => t > now

// TODO: consider different formatting, not with .toLocaleString
const displayTime = (sec, locale = 'de-DE', timeZone = 'Europe/Berlin') => (sec === 0 ? null : new Date(sec * 1000).toLocaleString(locale, {
  hour: 'numeric',
  minute: 'numeric',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  timeZone,
}))

const netIdToName = (id) => {
  switch (id) {
    case 1:
      return 'Mainnet'

    case 2:
      return 'Morden'

    case 3:
      return 'Ropsten'

    case 4:
      return 'Rinkeby'

    case 42:
      return 'Kovan'

    case null:
    case undefined:
      return 'No network detected'

    default:
      return 'Local Network'
  }
}

const netIdToWebsocket = (id) => {
  switch (id) {
    case 1:
      return WEBSOCKET_URLS.MAIN

    case 2:
      return WEBSOCKET_URLS.MORDEN

    case 3:
      return WEBSOCKET_URLS.ROPSTEN

    case 4:
      return WEBSOCKET_URLS.RINKEBY

    case 42:
      return WEBSOCKET_URLS.KOVAN

    case null:
    case undefined:
      return 'No network detected'

    default:
      return WEBSOCKET_URLS.LOCAL
  }
}

// const cleanData = data => (data && isBN(data) ? fromWei(data) : data)
const cleanDataFromWei = data => (data && data !== DATA_LOAD_STRING) && Number(data.toString() / (10 ** 18)).toFixed(FIXED_DECIMAL_AMOUNT)
// const cleanDataFromWei = data => (data && data !== DATA_LOAD_STRING) && Number(fromWei(data.toString())).toFixed(FIXED_DECIMAL_AMOUNT)
// TODO: broken in 4.11.6 BN - precision is wrong
// const cleanDataNative = (data, dec) => (data && data !== DATA_LOAD_STRING) && Number(toBN(data).div(toBN(10).pow(toBN(dec)))).toFixed(FIXED_DECIMAL_AMOUNT)
const cleanDataNative = (data, dec) => (data && data !== DATA_LOAD_STRING) && Number(data.toString() / 10 ** dec).toFixed(FIXED_DECIMAL_AMOUNT)
const mapTS = (arr, type) => (Array.isArray(arr) ? arr : [arr]).map(item => (type === 'fromWei' && isBN(item) ? fromWei(item) : item).toString())

/**
 * checkLoadingOrNonZero
 * @description Function that takes an arbitrary amount of args and returns whether the cummulative reduced sum is truthy
 * @param  {...any} args
 */
const checkLoadingOrNonZero = (...args) => {
  // if any arguments = 'LOADING...' returns false
  if (args.some(i => (i === DATA_LOAD_STRING || i === '...'))) return false
  return !!args.reduce((acc, i) => ((+acc) + (+i)))
}

const flattener = obj => Object.assign(
  {},
  ...(function _flatten(o) {
      return [].concat(...Object.keys(o)
          .map(k =>
              (typeof o[k] === 'object' ?
                  _flatten(o[k]) :
                  ({ [k]: o[k] }))))
  }(obj)),
)

const shallowDifferent = (obj1, obj2) => {
  if (Object.is(obj1, obj2)) return false

  if (!obj1 || !obj2) return true
  
  const flatObj1 = flattener(obj1)
  const flatObj2 = flattener(obj2)

  const keys1 = Object.keys(flatObj1)
  const keys2 = Object.keys(flatObj2)

  if (keys1.length !== keys2.length) return true
  
  return keys1.some(key => !Object.is(flatObj1[key], flatObj2[key]))
}

const splitAddress = (addr) => {
	const { length } = addr
	return `${addr.slice(0, 6)}...${addr.slice(length - 4)}`
}

const poolStateIdToName = (id) => {
  switch (id) {
    case '0':
    case 0:
      return POOL_STATES.POOLING
    case '1':
    case 1:
      return POOL_STATES.POOLING_ENDED
    case '2':
    case 2:
      return POOL_STATES.DEPOSIT_WITHDRAW_FROM_DX
    case '3':
    case 3:
      return POOL_STATES.MGN_UNLOCKED
    default: 
      return 'Unknown Contract State' 
  }
}

const delay = async (time = 1000) => new Promise(acc => setTimeout(() => acc('Delay done'), time))

const makeCancelable = (promise) => {
  let hasCanceled_ = false

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      // eslint-disable-next-line prefer-promise-reject-errors
      val => (hasCanceled_ ? reject({ isCanceled: true }) : resolve(val)),
      // eslint-disable-next-line prefer-promise-reject-errors
      error => (hasCanceled_ ? reject({ isCanceled: true }) : reject(error)),
    )
  })

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true
    },
  }
}

const poolTimeFormat = (time) => {
	const now = new Date(time).toGMTString()
	const nowSplit = now.split(' ')	

	const dateNow = nowSplit.slice(0, 4).join(' ')
	const fixedTime = nowSplit[4].split(':').splice(0, 2).join(':')

	return `${dateNow} ${fixedTime} GMT`
}

export {
  delay,
  toBN,
  isBN,
  toWei,
  fromWei,
  cleanDataNative,
  cleanDataFromWei,
  mapTS,
  displayTime,
  timeValidator,
  decimalChecker,
  netIdToName,
  netIdToWebsocket,
  windowLoaded,
  flattener,
  shallowDifferent,
  poolStateIdToName,
  splitAddress,
  checkLoadingOrNonZero,
  makeCancelable,
  poolTimeFormat,
}
