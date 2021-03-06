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

const activeOffset = [-10, 10]

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
        activeOffsetX={props.horizontal ? activeOffset : undefined}
        activeOffsetY={!props.horizontal ? activeOffset : undefined}
        simultaneousHandlers={scroller}
        onGestureEvent={onWrapperGestureEvent}
        onHandlerStateChange={onWrapperHandlerStateChange}
        {...props}
      />
    )
    const renderScroller = props => (
      <NativeViewGestureHandler
        ref={scroller}
        simultaneousHandlers={wrapper}
        disallowInterruption
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
      ref.current && ref.current.setNativeProps(state)
    }
  }, [])
  return [ref, setEnabled]
}
