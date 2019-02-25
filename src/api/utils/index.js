import { isBN, toBN, toWei, fromWei } from 'web3-utils'
import { WEBSOCKET_URLS } from '../../globals'

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

const mapTS = (arr, type) => (Array.isArray(arr) ? arr : [arr]).map(item => (type === 'fromWei' && isBN(item) ? fromWei(item) : item).toString())

const netIdToName = (id) => {
  switch (id) {
    case 1:
      return 'Ethereum Mainnet'

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

const cleanData = data => (data && isBN(data) ? fromWei(data) : data)
// const cleanData = data => data && fromWei(toBN(data))

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

const poolStateIdToName = (id) => {
  switch (id) {
    case '0':
    case 0:
      return 'Pooling'
    case '1':
    case 1:
      return 'PoolingEnded'
    case '2':
    case 2:
      return 'DepositWithdrawnFromDx'
    case '3':
    case 3:
      return 'MgnUnlocked'
    default: 
      return 'Unknown Contract State' 
  }
}

export {
  toBN,
  isBN,
  toWei,
  fromWei,
  cleanData,
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
}

/**
   * displayTimeDiff(sec, now)
   * @param {number} endSec --> time (in seconds) when lock ENDS
   * @param {number} now    --> time NOW (in seconds)
   */
/*  const displayTimeDiff = (endSec, now) => {
  const diff = endSec - Math.floor(now)

  // if lockTime has passed display nothing
  if (diff < 0) return undefined

  let hours = diff % DAY
  const days = (diff - hours) / DAY

  let minutes = hours % HOUR
  hours = (hours - minutes) / HOUR

  const seconds = minutes % MINUTE
  minutes = (minutes - seconds) / MINUTE

  let res = '[ '
  if (days) res += `${days}D `
  if (hours) res += `${hours}H `
  if (minutes) res += `${minutes}M `
  if (seconds) res += `${seconds}S `

  return `${res}]`
} */
