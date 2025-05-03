import { StyleSheet, Text } from "react-native";
import React from "react";
import { colors } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { TypoProps } from "@/types";

const Typo = ({
  size,
  color = colors.text,
  fontWeight = "400",
  children,
  style,
  textProps = {},
}: TypoProps) => {
  const textStyle = {
    fontSize: size ? verticalScale(size) : verticalScale(18),
    color,
    fontWeight,
  };
  return (
    <Text style={[textStyle, style]} {...textProps}>
      {children}
    </Text>
  );
};

export default Typo;

const styles = StyleSheet.create({});
