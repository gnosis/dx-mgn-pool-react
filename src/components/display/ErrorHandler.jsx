import React from 'react'

const ErrorHandler = ({
    email = 'mgn-pool@slow.trade',
}) =>
    <section>
        <pre>
            <h1>:( an error occurred!</h1>
            <h5>please try refreshing the page and trying again. if the problem persists, please contract us: <a href={`mailto:${email}`}>mgn-pool@slow.trade</a></h5>
        </pre>
    </section>

export default ErrorHandler
