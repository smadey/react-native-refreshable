import React from 'react'
import { Animated, Easing } from 'react-native'

function createAnimation(animatedValue, duration) {
  return Animated.timing(animatedValue, {
    toValue: 100,
    duration,
    easing: Easing.linear,
    useNativeDriver: true,
    isInteraction: false,
  })
}

export function useSpinner(animating) {
  const [progress, prevState] = React.useMemo(() => [new Animated.Value(0), { animating: false }], [])
  React.useEffect(() => {
    let anim
    let subId
    if (prevState.animating !== animating) {
      if (animating) {
        progress.setValue(0)
        anim = Animated.loop(createAnimation(progress, 1000)).start()
        subId = progress.addListener(() => {}) // 由于使用了 useNativeDriver, 必须有监听才能获取到正确的值
      } else {
        anim = createAnimation(progress, 10 * (100 - progress._value)).start() // eslint-disable-line no-underscore-dangle
      }
      prevState.animating = animating
    }
    return () => {
      anim && anim.stop()
      subId && progress.removeListener(subId)
    }
  }, [animating])
  return progress
}

export { default } from './refreshable' // eslint-disable-line import/no-unresolved
