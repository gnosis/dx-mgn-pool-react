import { GAS_PRICE, GAS_STATION_URLS } from '../../globals'
import { NetworkSub, BlockSub } from '../../subscriptions'

let ESTIMATED_GAS_PRICE = GAS_PRICE
let GAS_STATION_URL = null
let lastTimestamp = 0
const getSetEstimatedGasPrice = async (gasStationURL = GAS_STATION_URL) => {
  const currentTimestamp = BlockSub.getState().timestamp || 0
  // don't update price during the same block
  if (currentTimestamp === lastTimestamp) return ESTIMATED_GAS_PRICE

  lastTimestamp = currentTimestamp

  // network without corresponding price relay
  if (!gasStationURL) {
    ESTIMATED_GAS_PRICE = GAS_PRICE
    if (process.env.FE_CONDITIONAL_ENV === 'development') console.log('Set default ESTIMATED_GAS_PRICE', ESTIMATED_GAS_PRICE)
    return ESTIMATED_GAS_PRICE
  }
  try {
    // price from relay
    ESTIMATED_GAS_PRICE = (await (await fetch(gasStationURL)).json()).standard
    if (process.env.FE_CONDITIONAL_ENV === 'development') console.log('Set ESTIMATED_GAS_PRICE from gas station', ESTIMATED_GAS_PRICE)
  } catch (error) {
    console.warn('Safe gas estimation error: ', error, 'Defaulting to global gas price')
    // fallback to globals
    ESTIMATED_GAS_PRICE = GAS_PRICE
    if (process.env.FE_CONDITIONAL_ENV === 'development') console.log('Set default ESTIMATED_GAS_PRICE', ESTIMATED_GAS_PRICE)
  }
  return ESTIMATED_GAS_PRICE
}

// gets initial estimate when we discover the network
NetworkSub.subscribe(async ({ network }) => {
  if (network === 'Mainnet') {
    GAS_STATION_URL = GAS_STATION_URLS.MAIN_GAS_STATION
  } else if (network === 'Rinkeby') {
    GAS_STATION_URL = GAS_STATION_URLS.RINKEBY_GAS_STATION
  }

  await getSetEstimatedGasPrice(GAS_STATION_URL)
})

const isTxOptions = maybeOptions => typeof maybeOptions === 'object'
  && ('value' in maybeOptions
    || 'from' in maybeOptions
    || 'to' in maybeOptions
    || 'gas' in maybeOptions
    || 'gasPrice' in maybeOptions)

export const wrapFuncInEstimation = func => async function wrapped(...args) {
  const passedTxOptions = isTxOptions(args[args.length - 1])

  let params, txOptions
  if (passedTxOptions) {
    txOptions = args[args.length - 1]
    params = args.slice(0, -1)
  } else {
    params = args
  }

  // give preference to gasPrice passed directly
  const gasPrice = (passedTxOptions && txOptions.gasPrice) || await getSetEstimatedGasPrice()

  const txOptionsWithGas = { ...txOptions, gasPrice }
  if (process.env.FE_CONDITIONAL_ENV === 'development') console.log(`Calling ${func.name}(${params.join(',')}, ${JSON.stringify(txOptionsWithGas)}) with gasPrice ${ESTIMATED_GAS_PRICE}`)

  return func.call(this, ...params, txOptionsWithGas)
}

export const wrapAPIobjectInEstimation = obj => Object.keys(obj).reduce((accum, key) => {
  const func = obj[key]
  if (typeof func === 'function') {
    accum[key] = wrapFuncInEstimation(func)
  }
  return accum
}, {})
