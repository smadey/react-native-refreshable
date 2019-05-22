# react-native-refreshable
Custom ScrollView's refresh control

## Installation
```sh
npm install --save react-native-refreshable
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
import Refreshable, { createRenderRefresher } from 'react-native-refreshable';

// before
<ScrollView {...props} />

// after
const renderRefresher = React.useMemo(() => createRenderRefresher(), [])
const onRefresh = React.useCallback(() => {
  return new Promise(resolve => setTimeout(resolve, 1500))
}, [])
<Refreshable {...props} renderRefresher={renderRefresher} onRefresh={onRefresh} />
```

## Properties
*Note: Other properties will be passed down to ScrollView

| Prop | Description | Default |
|---|---|---|
|**`renderRefresher`**|A function that is called when Refresher render. The function is called with `status`, `visible`, `refreshable` and `refreshing` props. ||
|**`onRefresh`**|A function that is called when Component has been pull down. ||
