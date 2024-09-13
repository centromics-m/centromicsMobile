import "@expo/metro-runtime"; // Necessary for Fast Refresh on Web
import "./gesture-handler";

import { Assets } from "@react-navigation/elements";
import { Asset } from "expo-asset";
import React from "react";

import AppMain from "./src/AppMain";

Asset.loadAsync(Assets);

import { AppRegistry } from "react-native";
import { expo } from "./app.json";

AppRegistry.registerComponent(expo.name, () => AppMain);

export default function AppEntry() {
  return (
    <React.StrictMode>
      <AppMain />
    </React.StrictMode>
  );
}
