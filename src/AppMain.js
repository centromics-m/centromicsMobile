import React, { useEffect, useState, useMemo } from "react";
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
import SiteManager from "./site_manager";

const Stack = createStackNavigator();

const i18n = new I18n(translations);

const { languageTag } = RNLocalize.findBestLanguageTag(
  Object.keys(translations)
) || { languageTag: "en", isRTL: false };

i18n.locale = languageTag;
i18n.fallbacks = true;

const AppMain = (props) => {
  
  const [state, setState] = useState({
    hasNotch: false,
    deviceId: null,
    largerUI: false,
    theme: themes.light,
  });

  const _siteManager = useMemo(() => {
    return new SiteManager();
  }, []);

  useEffect(() => {
    const colorScheme = Appearance.getColorScheme();
    const largerUI =
      DeviceInfo.getDeviceType() === "Tablet" ||
      DeviceInfo.getDeviceType() === "Desktop";
    //_siteManager = new SiteManager();

    setState({
      hasNotch: DeviceInfo.hasNotch(),
      deviceId: DeviceInfo.getDeviceId(),
      largerUI: largerUI,
      theme: colorScheme === "dark" ? themes.dark : themes.light,
    });

    //console.log('theme', state.theme);
    console.log('_siteManager1', _siteManager);
  }, []);

  console.log('_siteManager2', _siteManager);

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

  
  const _handleOpenUrl = () => {
    console.log('_handleOpenUrl', vent);

    if (event.url.startsWith('discourse://')) {
      let params = this.parseURLparameters(event.url);
      let site = this._siteManager.activeSite;

      // if (Platform.OS === 'ios' && Settings.get('external_links_svc')) {
      //   SafariView.dismiss();
      // }

      // // initial auth payload
      // if (params.payload) {
      //   this._siteManager.handleAuthPayload(params.payload);
      // }

      // // received one-time-password request from SafariView
      // if (params.otp) {
      //   this._siteManager
      //     .generateURLParams(site, 'full')
      //     .then(generatedParams => {
      //       SafariWebAuth.requestAuth(
      //         `${site.url}/user-api-key/otp?${generatedParams}`,
      //       );
      //     });
      // }

      // // one-time-password received, launch site with it
      // if (params.oneTimePassword) {
      //   const OTP = this._siteManager.decryptHelper(params.oneTimePassword);
      //   this.openUrl(`${site.url}/session/otp/${OTP}`);
      // }

      // // handle site URL passed via app-argument
      // if (params.siteUrl) {
      //   if (this._siteManager.exists({url: params.siteUrl})) {
      //     console.log(`${params.siteUrl} exists!`);
      //     this.openUrl(params.siteUrl);
      //   } else {
      //     console.log(`${params.siteUrl} does not exist, attempt adding`);
      //     this._addSite(params.siteUrl);
      //   }
      // }

      // // handle shared URLs
      // if (params.sharedUrl) {
      //   this._siteManager.setActiveSite(params.sharedUrl).then(activeSite => {
      //     if (activeSite.activeSite !== undefined) {
      //       let supportsDelegatedAuth = false;
      //       if (this._siteManager.supportsDelegatedAuth(activeSite)) {
      //         supportsDelegatedAuth = true;
      //       }
      //       this.openUrl(params.sharedUrl, supportsDelegatedAuth);
      //     } else {
      //       this._addSite(params.sharedUrl);
      //     }
      //   });
      // }
    }
  }

  const _toggleTheme = (newTheme) => {
    setState({
      theme: newTheme === "dark" ? themes.dark : themes.light,
    });
  };

  // TODO: pass only relevant props to each screen component
  const screenProps = {
    openUrl: this.openUrl,
    // _handleOpenUrl: this._handleOpenUrl,
    seenNotificationMap: this._seenNotificationMap,
    setSeenNotificationMap: map => {
      this._seenNotificationMap = map;
    },
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
            {(props) => (
              <DiscourseWebScreen {...props} screenProps={{ ...screenProps }} />
            )}
          </Stack.Screen>
          <Stack.Screen name="Notifications">
            {(props) => (
              <Screens.Notifications {...props} screenProps={{ ...screenProps }} />
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
