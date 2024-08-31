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
import DeviceInfo from 'react-native-device-info';

import { NavigationContainer } from "@react-navigation/native";
import DiscourseWebScreen from "./screens/DiscourseWebScreen";
import { I18n } from "i18n-js";
import * as RNLocalize from "react-native-localize";

import Screens from "./screens";
import Site from "./site";

// It's not ideal that we have to manually register languages here
// but react-native doesn't make it easy to loop through files in a folder
// there's react-native-fs, but I hesitate to add another dependency just for that
I18n.translations = {
  ar: require("./locale/ar.json"),
  de: require("./locale/de.json"),
  en: require("./locale/en.json"),
  es: require("./locale/es.json"),
  fi: require("./locale/fi.json"),
  fr: require("./locale/fr.json"),
  he: require("./locale/he.json"),
  hu: require("./locale/hu.json"),
  it: require("./locale/it.json"),
  ja: require("./locale/ja.json"),
  ko: require("./locale/ko.json"),
  nl: require("./locale/nl.json"),
  pl: require("./locale/pl_PL.json"),
  "pt-BR": require("./locale/pt_BR.json"),
  ru: require("./locale/ru.json"),
  sv: require("./locale/sv.json"),
  tr: require("./locale/tr_TR.json"),
  "zh-CN": require("./locale/zh_CN.json"),
  "zh-TW": require("./locale/zh_TW.json"),
};

const { languageTag } = RNLocalize.findBestLanguageTag(
  Object.keys(I18n.translations)
) || { languageTag: "en", isRTL: false };

I18n.locale = languageTag;
I18n.fallbacks = true;

const AppMain = () => {
  const [state, setState] = useState({
    theme: themes.light
  });

  useEffect(() => {
    const colorScheme = Appearance.getColorScheme();
    const largerUI = DeviceInfo.getDeviceType() === 'Tablet' || DeviceInfo.getDeviceType() === 'Desktop';
  
    setState({
      hasNotch: DeviceInfo.hasNotch(),
      deviceId: DeviceInfo.getDeviceId(),
      largerUI: largerUI,
      theme: colorScheme === 'dark' ? themes.dark : themes.light,
    });

    //console.log('theme', state.theme);
  }, []);

  const _toggleTheme = (newTheme) => {
    setState({
      theme: newTheme === 'dark' ? themes.dark : themes.light,
    });
  }

  return (
    <NavigationContainer>
      <ThemeContext.Provider value={state.theme}>
        <StatusBar barStyle={state.theme.barStyle} />
        <DiscourseWebScreen />
      </ThemeContext.Provider>
    </NavigationContainer>
  );
};

export default AppMain;
