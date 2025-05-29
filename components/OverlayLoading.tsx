import React from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { colors } from "@/constants/theme";

const OverlayLoading = ({ text }: { text?: string }) => (
  <View style={styles.overlay}>
    <View style={styles.box}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>{text || "Đang tải..."}</Text>
    </View>
  </View>
);

export default OverlayLoading;

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  box: {
    backgroundColor: colors.neutral800,
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  text: {
    color: colors.white,
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
  },
});
