import React from 'react'
import {
  Animated,
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import Refreshable, { useSpinner } from '..'

const RefreshComponent = React.memo(({ status }) => {
  const progress = useSpinner(status === 2 || status === 3)
  return (
    <View style={{ alignItems: 'center', flexDirection: 'row', height: 60, justifyContent: 'center' }}>
      <Animated.Image
        resizeMethod="scale"
        source={{ uri: 'https://readx-her-1252317822.image.myqcloud.com/boss/5322_spinner.png' }}
        style={{ height: 16, width: 16, transform: [{ rotate: progress.interpolate({ inputRange: [0, 100], outputRange: ['0deg', '360deg'] }) }] }}
      />
    </View>
  )
})

function App() {
  const refreshable = React.useRef()
  const [enabled, setEnabled] = React.useState()
  const onRefresh = React.useCallback(() => {
    return new Promise(resolve => setTimeout(resolve, 1500))
  }, [])

  const onToggle = React.useCallback(() => {
    setEnabled(state => !state)
  }, [])
  const onEnable = React.useCallback(() => {
    refreshable.current.setNativeProps({ scrollEnabled: true })
  }, [])
  const onDisable = React.useCallback(() => {
    refreshable.current.setNativeProps({ scrollEnabled: false })
  }, [])

  return (
    <View style={styles.container}>
      <Refreshable
        ref={refreshable}
        style={styles.refreshable}
        scrollEnabled={enabled}
        RefreshComponent={RefreshComponent}
        onRefresh={onRefresh}
      >
        <Button title={`toggle(${enabled !== false ? 'enabled' : 'disabled'})`} onPress={onToggle} />
        <Button title="enable" onPress={onEnable} />
        <Button title="disable" onPress={onDisable} />
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
        <Text style={styles.txt}>Welcome to React Native!</Text>
      </Refreshable>
    </View>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 88,
  },
  refreshable: {
    backgroundColor: '#eee',
  },
  txt: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
})
