import React from 'react'
import {
  Animated,
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import Refreshable, { createRenderRefresher } from '..'

const renderRefresher = createRenderRefresher({
  spinner: {
    duration: 1000,
    render(props) {
      return (
        <Animated.Image
          style={{ width: 16, height: 16, transform: [{ rotate: props.progress.interpolate({inputRange: [0, 100], outputRange: ['0deg', '360deg']}) }] }}
          source={{uri: 'https://readx-her-1252317822.image.myqcloud.com/boss/5322_spinner.png'}}
          resizeMethod="scale"
        />
      )
    },
  },
  // text: {
  //   render({ statusTxt }) {
  //     return <Text style={{color: 'red'}}>{statusTxt}</Text>
  //   },
  // },
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
        renderRefresher={renderRefresher}
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
