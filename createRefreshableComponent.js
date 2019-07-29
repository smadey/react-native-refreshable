import React, {
  memo,
  forwardRef,
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

function timing(animatedValue, config) {
  if (typeof config === 'number') {
    config = { toValue: config }
  }
  return new Promise((resolve) => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
      isInteraction: false,
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

function useRefresher(offsetY, getPosition) {
  const ref = useRef()
  const state = useMemo(() => ({ status: STATUS_IDLE }), [])
  const getStatus = useCallback(() => state.status, [])
  const setStatus = useCallback((status) => {
    const refresher = ref.current
    if (state.status !== status) {
      state.status = status
      refresher && refresher.setStatus(status)
    }
  }, [])
  useEffect(() => {
    const subId = offsetY.addListener(({ value }) => {
      ref.current && ref.current.setPosition(getPosition(value))
    })
    return () => {
      offsetY.removeListener(subId)
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
      !callBySetNativeProps && ref.current && ref.current.setNativeProps(state)
    }
  }, [])
  useImperativeHandle(forwardedRef, () => {
    const scrollView = ref.current
    if (scrollView) {
      const setNativeProps = scrollView.setNativeProps.bind(scrollView)
      scrollView.setNativeProps = (props) => {
        if (props && ('scrollEnabled' in props)) {
          setScrollEnabled(props.scrollEnabled, true)
        }
        setNativeProps(props)
      }
    }
    return scrollView
  }, [ref.current])
  useEffect(() => {
    setScrollEnabled(scrollEnabled)
  }, [scrollEnabled])
  return [ref, setScrollEnabled]
}

function createRefreshableComponent({ usePanResponder }) {
  function Refresher({ Component }, forwardedRef) {
    const [status, setStatus] = useState(STATUS_IDLE)
    const position = useMemo(() => new Animated.Value(0), [])

    useImperativeHandle(forwardedRef, () => ({
      setStatus,
      setPosition(value) {
        position.setValue(value)
      },
    }), [])

    return <Component status={status} position={position} />
  }
  Refresher = memo(forwardRef(Refresher))

  function ScrollViewWithRefresher({
    style,
    scrollerStyle,
    RefreshComponent,
    onRefresh,
    ...props
  }, forwardedRef) {
    const state = useMemo(() => ({
      sy: 0,
      rH: 0,
      ptrH: 9999,
    }), [])
    state.onRefresh = onRefresh

    const [aWrapperY, wrapperStyle] = useMemo(() => {
      const translateY = new Animated.Value(0)
      return [translateY, { flex: 1, transform: [{ translateY }] }]
    }, [])

    const [refresher, setRefresherStatus, getRefresherStatus] = useRefresher(aWrapperY, val => Math.floor(val * 100 / state.ptrH))
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
        if (state.sy > 0) return

        const { rH, ptrH } = state
        const wrapperY = dy > rH ? ((dy - rH) * 0.4 + rH * 0.6) : Math.max(dy * 0.6, 0)
        setRefresherStatus(wrapperY >= ptrH ? STATUS_PULL_OK : STATUS_PULLING)
        aWrapperY.setValue(wrapperY)
      },
      onPanRelease() {
        if (state.sy > 0) return

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

    const [scroller, setScrollerScrollEnabled] = useScroller(forwardedRef, props.scrollEnabled, setPanEnabled)

    props = {
      scrollEventThrottle: 16,
      ...props,
      style: [styles.scroller, scrollerStyle],
      ref: scroller,
    }
    props = useEvent(props, 'onScroll', (event) => {
      state.sy = round(event.nativeEvent.contentOffset.y)
    })
    props = useEvent(props, 'onTouchEnd', () => {
      if (state.sy < 0) {
        scroller.current && scroller.current.scrollTo({ x: 0, y: 0, animated: true })
      }
    })
    props = useEvent(props, 'onMomentumScrollBegin', () => {
      setPanEnabled(false)
    })
    props = useEvent(props, 'onMomentumScrollEnd', () => {
      setPanEnabled(true)
    })

    return (
      <View style={[styles.container, style]}>
        {
          renderWrapper({
            horizontal: props.horizontal,
            children: (
              <Animated.View style={wrapperStyle}>
                <View style={styles.refresher} onLayout={onRefresherLayout}>
                  <Refresher ref={refresher} Component={RefreshComponent} />
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
  ScrollViewWithRefresher = forwardRef(ScrollViewWithRefresher)

  function Refreshable(props, forwardedRef) {
    const Component = props.refreshControl == null && props.RefreshComponent && isFunction(props.onRefresh)
      ? ScrollViewWithRefresher
      : ScrollView
    return <Component {...props} ref={forwardedRef} />
  }
  Refreshable = memo(forwardRef(Refreshable))

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
