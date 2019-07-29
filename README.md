# react-native-refreshable
Custom ScrollView's refresh control

## Installation
```sh
npm install --save @smadey/react-native-refreshable
```
If you are using Expo, you are done. Otherwise, continue to the next step.

#### Android specific
Install and link `react-native-gesture-handler`, run:
```sh
npm install --save react-native-gesture-handler
react-native link react-native-gesture-handler
```

and follow [the steps](https://kmagiera.github.io/react-native-gesture-handler/docs/getting-started.html#android)

## Usage

```js
import Refreshable, { useSpinner } from 'react-native-refreshable'

// before
<ScrollView {...props} />

// after
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
const onRefresh = React.useCallback(() => {
  return new Promise(resolve => setTimeout(resolve, 1500))
}, [])
<Refreshable {...props} RefreshComponent={RefreshComponent} onRefresh={onRefresh} />
```

## Properties
*Note: Other properties will be passed down to ScrollView

| Prop | Description | Default |
|---|---|---|
|**`RefreshComponent`**|A component with `status` and `position` props. ||
|**`onRefresh`**|A function that is called when Component has been pull down. ||
