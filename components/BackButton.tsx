import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { CaretLeft } from "phosphor-react-native";
import { verticalScale } from "@/utils/styling";
import { colors, radius } from "@/constants/theme";
import { BackButtonProps } from "@/types";

const BackButton = ({ style, iconSize = 26 }: BackButtonProps) => {
  const router = useRouter();

  const handleBack = () => {
    router.setParams({});
    setTimeout(() => {
      router.back();
    }, 50);
  };

  return (
    <TouchableOpacity
      onPress={handleBack}
      style={[styles.button, style]}
      activeOpacity={0.7}
    >
      <CaretLeft
        size={verticalScale(iconSize)}
        color={colors.text}
        weight="bold"
      />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.neutral600,
    alignSelf: "flex-start",
    borderRadius: radius._12,
    borderCurve: "continuous",
    padding: 5,
  },
});
