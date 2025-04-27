import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View, ViewStyle } from 'react-native'
import React from 'react'
import { colors, radius } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import Loading from './Loading';

interface CustomButtonProps extends TouchableOpacityProps {
    style?: ViewStyle;
  onPress?: () => void;
  loading?: boolean;
  children: React.ReactNode;
}

const Button = ({style, onPress, loading = false, children}: CustomButtonProps) => {
    if (loading) {
        return (
            <View style={[styles.button, style, {backgroundColor: 'transparent'}]}>
                <Loading />
            </View>
        )
    }
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
        {children}
    </TouchableOpacity>
  )
}

export default Button

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary,
        borderRadius: radius._17,
        borderCurve: 'continuous',
        height: verticalScale(52),
        justifyContent: 'center',
        alignItems: 'center',
    }
})