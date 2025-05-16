import { StyleSheet } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import CustomBottomTabs from "@/components/CustomBottomTabs";
const _layout = () => {
  return (
    <Tabs tabBar={CustomBottomTabs} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="statistics" />
      <Tabs.Screen name="wallet" />
      <Tabs.Screen name="more" />
    </Tabs>
  );
};

export default _layout;

const styles = StyleSheet.create({});
