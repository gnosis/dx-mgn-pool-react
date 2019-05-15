import React, { useEffect, useState } from 'react'
import startSubscriptions from '../../subscriptions'

/* function useUserStateSubscription() {
    const [a, setA] = useState(null)

    useEffect(() => () => {

        }, [])

    return ''
} */

const withSubscriptions = WrappedComponent =>
    function SubscriptionsHOCLogic(props) {
        const [subscriptions, setSubscriptions] = useState(false)
		console.warn("SubscriptionsHOCLogic -> props", props)

        /* MOUNT LOGIC - SETUP SUBS */
        useEffect(() => {
            let unsubscribe
            startSubscriptions()
            .then((unsubFunction) => {
				console.debug("TCL: SubscriptionsHOCLogic -> unsubFunction", unsubFunction)
                unsubscribe = unsubFunction
                setSubscriptions(true)
            })
            .catch((reason) => {
                console.error(reason)
            })

            return () => unsubscribe && unsubscribe()
        }, [])

        return subscriptions ? <WrappedComponent {...props} /> : <h1>loading subscriptions</h1>
    }

export default withSubscriptions
