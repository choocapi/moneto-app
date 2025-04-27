import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import BackButton from '@/components/BackButton'
import Input from '@/components/Input'
import * as Icons from 'phosphor-react-native'
import Button from '@/components/Button'
import { useRouter } from 'expo-router';
const Login = () => {
  const router = useRouter();

  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert('Đăng nhập', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    console.log('email', emailRef.current, '\npassword', passwordRef.current);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000)
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton iconSize={28} />

        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          {/* <Typo size={30} fontWeight={'800'} >Hey,</Typo> */}
          <Typo size={30} fontWeight={'800'} >Chào mừng bạn trở lại!</Typo>
        </View>

        <View style={styles.form}>
          <Typo size={16} color={colors.textLighter}>Đăng nhập ngay để theo dõi thu chi</Typo>
          <Input placeholder='Nhập email của bạn' onChangeText={(value) => {emailRef.current = value}} icon={<Icons.At size={verticalScale(26)} color={colors.neutral300} weight='fill' /> } />
          <Input placeholder='Nhập mật khẩu của bạn' secureTextEntry={true} onChangeText={(value) => {passwordRef.current = value}} icon={<Icons.Lock size={verticalScale(26)} color={colors.neutral300} weight='fill' /> } />
          <Typo size={14} color={colors.text} style={{alignSelf: 'flex-end'}}>Quên mật khẩu?</Typo>
          <Button onPress={handleSubmit} loading={isLoading}>
            <Typo fontWeight={'700'} color={colors.black} size={21}>Đăng nhập</Typo>
          </Button>
        </View>

        <View style={styles.footer}>
          <Typo size={15}>Bạn chưa có tài khoản?</Typo>
          <Pressable onPress={() => router.navigate('/(auth)/register')}>
            <Typo size={15} color={colors.primary} fontWeight={'700'}>Đăng ký</Typo>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
  },
  welcomeText: {
    fontSize: verticalScale(20),
    fontWeight: 'bold',
    color: colors.text,
  },
  form: {
    gap: spacingY._20,
  },
  forgotPassword: {
    textAlign: 'right',
    fontWeight: '500',
    color: colors.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  footerText: {
    textAlign: 'center',
    color: colors.text,
    fontSize: verticalScale(15),
  }
})