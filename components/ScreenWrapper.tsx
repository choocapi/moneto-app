import { Dimensions, Platform, StyleSheet, View } from "react-native";
import React from "react";
import { colors } from "@/constants/theme";
import { StatusBar } from "expo-status-bar";
import { ScreenWrapperProps } from "@/types";

const { height } = Dimensions.get("window");

const ScreenWrapper = ({ style, children }: ScreenWrapperProps) => {
  let paddingTop = Platform.OS == "ios" ? height * 0.06 : height * 0.06;
  return (
    <View
      style={[
        {
          paddingTop,
          flex: 1,
          backgroundColor: colors.neutral900,
        },
        style,
      ]}
    >
      <StatusBar style="light" backgroundColor={colors.neutral900} />
      {children}
    </View>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({});
