import React, { useEffect } from 'react'
import LoadingModal from '../display/Modals/LoadingModal'

/**
 * Configuration Displayer HOC
 * @param {*} Component Component to wrap
 */
export const withModal = Component =>
  function ModalHOC(props) {
    useEffect(() => {
      // eslint-disable-next-line no-unused-expressions
      props.state.SHOW_MODAL && document.body.classList.add('noScroll')

      return () => {
        document.body.classList.remove('noScroll')
      }
    }, [props.state.SHOW_MODAL])

    return (
      <>
        {props.state.SHOW_MODAL && <LoadingModal header={props.state.SHOW_MODAL} /* showOrHide={props.state.SHOW_MODAL}  */ />}
        <Component {...props} />
      </>
    )
  }

export default withModal
