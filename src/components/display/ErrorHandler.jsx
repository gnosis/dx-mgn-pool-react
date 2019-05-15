import React from 'react'

const ErrorHandler = ({
    email = 'mgn-pool@slow.trade',
    title = ':( an error occurred!',
    body = 'please try refreshing the page and trying again. if the problem persists, please contact us.',
    render,
}) =>
    <section>
        <pre>
            {
                render
                    ?
                render()
                    :
                <>
                    <h1>{title}</h1>
                    <h5>{body}</h5>
                    <h6><a href={`mailto:${email}`}>{email}</a></h6>
                </>
            }
        </pre>
    </section>

export default ErrorHandler
