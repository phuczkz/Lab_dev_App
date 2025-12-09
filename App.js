import React, { Component } from "react";
import Main from "./components/MainComponent";
import { Provider } from "react-redux";
import { ConfigureStore } from "./redux/ConfigureStore";
import { PersistGate } from "redux-persist/integration/react";
import { LocaleDirContext } from "@react-navigation/native";
import { LogBox } from "react-native";

const { persistor, store } = ConfigureStore();

class App extends Component {
  constructor(props) {
    super(props);
    LogBox.ignoreLogs([
      "expo-notifications: Android Push notifications (remote notifications) functionality provided by expo-notifications was removed from Expo Go with the release of SDK 53. Use a development build instead of Expo Go. Read more at https://docs.expo.dev/develop/development-builds/introduction/.",
    ]);
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Main />
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
