import React, { useRef, useMemo, useCallback } from 'react'
import {
  ScrollView,
} from 'react-native'
import {
  NativeViewGestureHandler,
  PanGestureHandler,
  State,
} from 'react-native-gesture-handler'

import createRefreshableComponent from './createRefreshableComponent'

export default createRefreshableComponent({
  usePanResponder({ onPanRespond, onPanMove, onPanRelease }) {
    const [wrapper, setWrapperEnabled] = useGestureHandler()
    const [scroller, setScrollerEnabled] = useGestureHandler()

    const onWrapperGestureEvent = useCallback(({ nativeEvent }) => {
      const { translationX: dx, translationY: dy } = nativeEvent
      if (!onPanRespond(dx, dy)) return
      onPanMove(dx, dy)
      setScrollerEnabled(false)
    }, [])
    const onWrapperHandlerStateChange = useCallback((event) => {
      if (event.nativeEvent.oldState !== State.ACTIVE) return
      onPanRelease()
    }, [])

    const renderWrapper = props => (
      <PanGestureHandler
        ref={wrapper}
        simultaneousHandlers={scroller}
        maxPointers={1}
        onGestureEvent={onWrapperGestureEvent}
        onHandlerStateChange={onWrapperHandlerStateChange}
        {...props}
      />
    )
    const renderScroller = props => (
      <NativeViewGestureHandler
        ref={scroller}
        simultaneousHandlers={wrapper}
        maxPointers={1}
      >
        <ScrollView {...props} />
      </NativeViewGestureHandler>
    )
    const setEnabled = (enabled) => {
      setWrapperEnabled(enabled)
      setScrollerEnabled(enabled)
    }

    return [
      renderWrapper,
      renderScroller,
      setEnabled,
    ]
  },
})

function useGestureHandler() {
  const ref = useRef()
  const state = useMemo(() => ({ enabled: true }), [])
  const setEnabled = useCallback((enabled) => {
    if (state.enabled !== enabled) {
      state.enabled = enabled
      ref.current && ref.current.setNativeProps(state) // eslint-disable-line no-unused-expressions
    }
  }, [])
  return [ref, setEnabled]
}
