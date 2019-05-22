import React, { useMemo, useRef, useEffect } from 'react'
import {
  ActivityIndicator,
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native'

const createAnimation = (animatedValue, duration) => (
  Animated.timing(animatedValue, {
    toValue: 100,
    duration,
    easing: Easing.linear,
    useNativeDriver: true,
  })
)

function Spinner({
  status,
  animating,
  duration,
  render,
}) {
  const ref = useRef(animating)
  const progress = useMemo(() => new Animated.Value(0), [])
  const animation = useMemo(() => Animated.loop(createAnimation(progress, duration)), [])
  useEffect(() => {
    /* eslint-disable no-underscore-dangle */
    if (ref.current !== animating) {
      if (animating) {
        animation.start()
        progress._startListeningToNativeValueUpdates() // 由于使用了 useNativeDriver, 必须有监听才能获取到正确的值
      } else {
        animation.stop()
        createAnimation(progress, duration * (100 - progress._value) / 100).start()
      }
      ref.current = animating
    }
  }, [animating])
  return render({ status, progress })
}

Spinner = React.memo(Spinner)

const defaultStatusMap = {
  1: '下拉刷新',
  2: '释放刷新',
  3: '刷新中...',
  4: '刷新完成!',
}

export default function createRenderRefresher({
  spinner,
  text,
} = {}) {
  /* eslint-disable no-nested-ternary */
  const renderSpinner = spinner === true
    ? props => <ActivityIndicator {...props} />
    : spinner && typeof spinner.duration === 'number' && typeof spinner.render === 'function'
      ? props => <Spinner {...spinner} {...props} />
      : null

  if (text === true || (!renderSpinner && !text)) {
    text = { map: defaultStatusMap }
  }
  const renderText = text
    ? typeof text.render === 'function'
      ? status => text.render({ status, statusTxt: (text.map || defaultStatusMap)[status] })
      : typeof text.map === 'object'
        ? status => <Text>{text.map[status]}</Text>
        : null
    : null

  /* eslint-disable react/prop-types */
  return ({
    status,
    visible,
    refreshable,
    refreshing,
  }) => {
    if (!visible) return null
    return (
      <View style={styles.container}>
        {
          renderSpinner && renderSpinner({
            status,
            animating: renderText ? refreshing : (refreshable || refreshing),
          })
        }
        {
          renderSpinner && renderText && <View style={styles.sep} />
        }
        {
          renderText && renderText(status)
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
  },
  sep: {
    height: 4,
    width: 4,
  },
})
