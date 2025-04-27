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
const Register = () => {
  const router = useRouter();

  const emailRef = useRef("");
  const nameRef = useRef("");
  const passwordRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!emailRef.current || !passwordRef.current || !nameRef.current) {
      Alert.alert('Đăng ký', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    console.log('email', emailRef.current, '\nname', nameRef.current, '\npassword', passwordRef.current);
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
          <Typo size={30} fontWeight={'800'} >Cùng bắt đầu nào!</Typo>
        </View>

        <View style={styles.form}>
          <Typo size={16} color={colors.textLighter}>Tạo tài khoản mới để theo dõi thu chi</Typo>
          <Input placeholder='Nhập tên của bạn' onChangeText={(value) => {nameRef.current = value}} icon={<Icons.User size={verticalScale(26)} color={colors.neutral300} weight='fill' /> } />
          <Input placeholder='Nhập email của bạn' onChangeText={(value) => {emailRef.current = value}} icon={<Icons.At size={verticalScale(26)} color={colors.neutral300} weight='fill' /> } />
          <Input placeholder='Nhập mật khẩu của bạn' secureTextEntry={true} onChangeText={(value) => {passwordRef.current = value}} icon={<Icons.Lock size={verticalScale(26)} color={colors.neutral300} weight='fill' /> } />
          <Button onPress={handleSubmit} loading={isLoading}>
            <Typo fontWeight={'700'} color={colors.black} size={21}>Đăng ký</Typo>
          </Button>
        </View>

        <View style={styles.footer}>
          <Typo size={15}>Bạn đã có tài khoản?</Typo>
          <Pressable onPress={() => router.navigate('/(auth)/login')}>
            <Typo size={15} color={colors.primary} fontWeight={'700'}>Đăng nhập</Typo>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Register

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