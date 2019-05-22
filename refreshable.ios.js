import React, { useMemo } from 'react'
import {
  PanResponder,
  ScrollView,
} from 'react-native'

import createRefreshableComponent from './createRefreshableComponent'

export default createRefreshableComponent({
  usePanResponder({ onPanRespond, onPanMove, onPanRelease }) {
    const state = useMemo(() => ({ enabled: true }), [])
    const wrapperHandlers = useMemo(() => (
      PanResponder.create({
        onMoveShouldSetPanResponder: (e, { dx, dy }) => state.enabled && onPanRespond(dx, dy),
        onPanResponderGrant: () => {},
        onPanResponderMove: (e, { dx, dy }) => onPanMove(dx, dy),
        onPanResponderRelease: onPanRelease,
        onPanResponderTerminate: onPanRelease,
      }).panHandlers
    ), [])

    const renderWrapper = props => React.cloneElement(props.children, wrapperHandlers)
    const renderScroller = props => <ScrollView {...props} />
    const setEnabled = (enabled) => {
      state.enabled = enabled
    }

    return [
      renderWrapper,
      renderScroller,
      setEnabled,
    ]
  },
})
