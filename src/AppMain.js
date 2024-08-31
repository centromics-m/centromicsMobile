import React, { useEffect, useState } from "react";
import { ThemeContext, themes } from "./ThemeContext";
import {
  Alert,
  Appearance,
  AppState,
  Linking,
  PermissionsAndroid,
  Platform,
  NativeModules,
  NativeEventEmitter,
  Settings,
  StatusBar,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import DeviceInfo from "react-native-device-info";

import { NavigationContainer } from "@react-navigation/native";
import DiscourseWebScreen from "./screens/DiscourseWebScreen";
import * as RNLocalize from "react-native-localize";
import { I18n } from "i18n-js";
import { translations } from "./shared";
import Screens from "./screens";
import Site from "./site";
import SiteManager from './site_manager';

const Stack = createStackNavigator();

const i18n = new I18n(translations);

const { languageTag } = RNLocalize.findBestLanguageTag(
  Object.keys(translations)
) || { languageTag: "en", isRTL: false };

i18n.locale = languageTag;
i18n.fallbacks = true;

const AppMain = (props) => {
  let _siteManager = null;
  const [state, setState] = useState({
    hasNotch: false,
    deviceId: null,
    largerUI: false,
    theme: themes.light,
  });

  useEffect(() => {
    const colorScheme = Appearance.getColorScheme();
    const largerUI =
      DeviceInfo.getDeviceType() === "Tablet" ||
      DeviceInfo.getDeviceType() === "Desktop";
    _siteManager = new SiteManager();

    setState({
      hasNotch: DeviceInfo.hasNotch(),
      deviceId: DeviceInfo.getDeviceId(),
      largerUI: largerUI,
      theme: colorScheme === "dark" ? themes.dark : themes.light,
    });

    //console.log('theme', state.theme);
  }, []);

  const openUrl = (url, supportsDelegatedAuth = true) => {
    // if (Platform.OS === 'ios') {
    //   if (!supportsDelegatedAuth) {
    //     this.safariViewTimeout = setTimeout(() => SafariView.show({url}), 400);
    //   } else {
    //     SafariView.dismiss();
    //     this._navigation.navigate('WebView', {
    //       url: url,
    //     });
    //   }
    // }
    // if (Platform.OS === 'android') {
    //   AsyncStorage.getItem('@Discourse.androidCustomTabs').then(value => {
    //     if (value) {
    //       CustomTabs.openURL(url, {
    //         enableUrlBarHiding: true,
    //         showPageTitle: false,
    //       }).catch(err => {
    //         console.error(err);
    //       });
    //     } else {
    //       Linking.openURL(url);
    //     }
    //   });
    // }
  };

  const _toggleTheme = (newTheme) => {
    setState({
      theme: newTheme === "dark" ? themes.dark : themes.light,
    });
  };

  // TODO: pass only relevant props to each screen component
  const screenProps = {
    openUrl: this.openUrl,
    // _handleOpenUrl: this._handleOpenUrl,
    // seenNotificationMap: this._seenNotificationMap,
    // setSeenNotificationMap: map => {
    //   this._seenNotificationMap = map;
    // },
    siteManager: _siteManager,
    hasNotch: state.hasNotch,
    deviceId: state.deviceId,
    largerUI: state.largerUI,
    toggleTheme: _toggleTheme,
  };

  return (
    <NavigationContainer>
      <ThemeContext.Provider value={state.theme}>
        <StatusBar barStyle={state.theme.barStyle} />
        <Stack.Navigator
          initialRouteName="Home"
          presentation="modal"
          screenOptions={({ navigation }) => {
            this._navigation = navigation;
            return {
              headerShown: false,
              ...TransitionPresets.ModalSlideFromBottomIOS,
            };
          }}
        >
          <Stack.Screen name="Home">
            {(props) => <DiscourseWebScreen />}
          </Stack.Screen>
          <Stack.Screen name="Notifications">
            {(props) => (
              <Screens.Notifications
                {...props}
                screenProps={{ ...screenProps }}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name={i18n.t("settings")}
            options={{
              headerShown: true,
            }}
          >
            {(props) => (
              <Screens.Settings {...props} screenProps={{ ...screenProps }} />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </ThemeContext.Provider>
    </NavigationContainer>
  );
};

export default AppMain;
