import React, {
  useRef,
  useState,
  useMemo,
  useCallback,
  useEffect,
  useImperativeHandle,
} from 'react'
import {
  Animated,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'

const STATUS_IDLE = 0
const STATUS_PULLING = 1
const STATUS_PULL_OK = 2
const STATUS_REFRESHING = 3
const STATUS_FINISHED = 4

const isFunction = obj => typeof obj === 'function'
const isVerticalGesture = (x, y) => Math.abs(x) < Math.abs(y)
const isDownGesture = (x, y) => isVerticalGesture(x, y) && y > 0
const round = Math.round

function Refresher({ render }, forwardedRef) {
  const [status, setStatus] = useState(STATUS_IDLE)
  useImperativeHandle(forwardedRef, () => ({ setStatus }), [])
  return render({
    status,
    visible: status !== STATUS_IDLE,
    refreshable: status === STATUS_PULL_OK,
    refreshing: status === STATUS_REFRESHING,
  })
}
Refresher = React.memo(React.forwardRef(Refresher))

function createRefreshableComponent({ usePanResponder }) {
  function ScrollViewWithRefresher({
    style,
    scrollerStyle,
    renderRefresher,
    onRefresh,
    ...props
  }, forwardedRef) {
    const state = useMemo(() => ({
      sy: 0,
      rH: 0,
      ptrH: 999,
    }), [])
    state.onRefresh = onRefresh

    const aWrapperY = useMemo(() => new Animated.Value(0), [])
    const wrapperStyle = useMemo(() => ({ flex: 1, transform: [{ translateY: aWrapperY }] }), [])

    const onRefresherLayout = useCallback((event) => {
      const height = event.nativeEvent.layout.height
      if (height > 0) {
        state.rH = round(height)
        state.ptrH = round(height * 1.2)
      }
    }, [])

    const [renderWrapper, renderScroller, setPanEnabled] = usePanResponder({
      onPanRespond(dx, dy) {
        if (state.sy > 0) return false
        if (!isDownGesture(dx, dy / 2)) return false
        return true
      },
      onPanMove(dx, dy) {
        const rH = state.rH
        const wrapperY = dy > rH ? ((dy - rH) * 0.4 + rH * 0.6) : Math.max(dy * 0.6, 0)
        aWrapperY.setValue(wrapperY)
        setRefresherStatus(wrapperY >= state.ptrH ? STATUS_PULL_OK : STATUS_PULLING)
      },
      onPanRelease() {
        setScrollerScrollEnabled(false) // call setPanEnabled auto
        const restore = () => {
          timing(aWrapperY).then(() => {
            setRefresherStatus(STATUS_IDLE)
            setScrollerScrollEnabled(true) // call setPanEnabled auto
          })
        }

        if (getRefresherStatus() === STATUS_PULL_OK) {
          setRefresherStatus(STATUS_REFRESHING)
          Promise.all([state.onRefresh(), timing(aWrapperY, state.rH)])
            .then(() => setRefresherStatus(STATUS_FINISHED), () => {})
            .then(restore)
        } else {
          restore()
        }
      },
    })

    const [refresher, setRefresherStatus, getRefresherStatus] = useRefresher()
    const [scroller, setScrollerScrollEnabled] = useScroller(forwardedRef, props.scrollEnabled, setPanEnabled) // eslint-disable-line max-len, react/destructuring-assignment

    props = {
      scrollEventThrottle: 16,
      ...props,
      style: [styles.scroller, scrollerStyle],
      ref: scroller,
    }
    props = useEvent(props, 'onScroll', (event) => {
      state.sy = round(event.nativeEvent.contentOffset.y)
    })

    return (
      <View style={[styles.container, style]}>
        {
          renderWrapper({
            children: (
              <Animated.View style={wrapperStyle}>
                <View style={styles.refresher} onLayout={onRefresherLayout}>
                  <Refresher ref={refresher} render={renderRefresher} />
                </View>
                {
                  renderScroller(props)
                }
              </Animated.View>
            ),
          })
        }
      </View>
    )
  }
  ScrollViewWithRefresher = React.forwardRef(ScrollViewWithRefresher)

  function Refreshable(props, forwardedRef) {
    /* eslint-disable max-len, react/destructuring-assignment, react/prop-types */
    const Component = props.refreshControl == null && isFunction(props.renderRefresher) && isFunction(props.onRefresh)
      ? ScrollViewWithRefresher
      : ScrollView
    return <Component {...props} ref={forwardedRef} />
  }
  Refreshable = React.memo(React.forwardRef(Refreshable))

  return Refreshable
}

export default createRefreshableComponent

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  refresher: {
    left: 0,
    position: 'absolute',
    bottom: '100%',
    right: 0,
    zIndex: 10,
  },
  scroller: {
    flex: 1,
  },
})

function timing(animatedValue, config) {
  if (typeof config === 'number') {
    config = { toValue: config }
  }
  return new Promise((resolve) => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
      ...config,
    }).start(resolve)
  })
}

function useEvent(props, name, fn, deps) {
  const handler = props[name]
  return {
    ...props,
    [name]: useCallback((e) => {
      fn(e)
      return handler && handler(e)
    }, [handler].concat(deps || [])),
  }
}

function useRefresher() {
  const ref = useRef()
  const state = useMemo(() => ({ status: STATUS_IDLE }), [])
  const getStatus = useCallback(() => state.status, [])
  const setStatus = useCallback((status) => {
    if (state.status !== status) {
      state.status = status
      ref.current && ref.current.setStatus(status) // eslint-disable-line no-unused-expressions
    }
  }, [])
  return [ref, setStatus, getStatus]
}

function useScroller(forwardedRef, scrollEnabled, onScrollEnabledChange) {
  const ref = useRef()
  const state = useMemo(() => ({ scrollEnabled: scrollEnabled !== false }), [])
  const setScrollEnabled = useCallback((value, callBySetNativeProps) => {
    value = value !== false
    if (state.scrollEnabled !== value) {
      state.scrollEnabled = value
      onScrollEnabledChange(value)
      !callBySetNativeProps && ref.current && ref.current.setNativeProps({ scrollEnabled: value }) // eslint-disable-line max-len, no-unused-expressions
    }
  }, [])
  useImperativeHandle(forwardedRef, () => ({
    ...ref.current,
    setNativeProps(props) {
      if (props && ('scrollEnabled' in props)) {
        setScrollEnabled(props.scrollEnabled, true)
      }
      ref.current && ref.current.setNativeProps(props) // eslint-disable-line no-unused-expressions
    },
  }), [])
  useEffect(() => {
    setScrollEnabled(scrollEnabled)
  }, [scrollEnabled])
  return [ref, setScrollEnabled]
}
