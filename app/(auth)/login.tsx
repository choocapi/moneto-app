import { Alert, Image, Pressable, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Input from "@/components/Input";
import * as Icons from "phosphor-react-native";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/authContext";

const Login = () => {
  const router = useRouter();
  const { login: loginUser, googleSignIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Cảnh báo", "Vui lòng nhập đầy đủ thông tin");
      return;
    }
    setLoading(true);
    const res = await loginUser(email, password);
    setLoading(false);
    if (!res.success) {
      Alert.alert("Lỗi", res.msg);
    }
  };

  const handleGoogleSignIn = async () => {
    const res = await googleSignIn();
    if (!res.success) {
      Alert.alert("Lỗi", res.msg);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/splashImage.png")}
            style={styles.logo}
          />
          <Typo size={30} fontWeight={"700"}>
            Moneto
          </Typo>
        </View>

        <View style={styles.form}>
          <Input
            placeholder="Nhập email của bạn"
            onChangeText={(value) => {
              setEmail(value);
            }}
            icon={
              <Icons.At
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
          />
          <Input
            placeholder="Nhập mật khẩu của bạn"
            type="password"
            onChangeText={(value) => {
              setPassword(value);
            }}
            icon={
              <Icons.Lock
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
          />
          <Button onPress={handleSubmit} loading={loading}>
            <Typo fontWeight={"700"} color={colors.black} size={21}>
              Đăng nhập
            </Typo>
          </Button>
          <View style={styles.authOptions}>
            <Pressable onPress={() => router.navigate("/(auth)/register")}>
              <Typo size={15} color={colors.primary} fontWeight={"700"}>
                Đăng ký
              </Typo>
            </Pressable>
            <Pressable
              onPress={() => router.navigate("/(auth)/forgotPassword")}
            >
              <Typo size={15} color={colors.primary} fontWeight={"700"}>
                Quên mật khẩu?
              </Typo>
            </Pressable>
          </View>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Typo size={15}>Hoặc đăng nhập bằng</Typo>
          <View style={styles.dividerLine} />
        </View>
        <View style={styles.socialButtonContainer}>
          <Pressable onPress={handleGoogleSignIn}>
            <Image
              source={require("@/assets/images/google.png")}
              style={styles.socialButton}
            />
          </Pressable>
          <Pressable>
            <Image
              source={require("@/assets/images/facebook.png")}
              style={styles.socialButton}
            />
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
  },
  logoContainer: {
    gap: 5,
    marginTop: spacingY._30,
    marginBottom: spacingY._10,
    alignItems: "center",
  },
  logo: {
    width: verticalScale(100),
    height: verticalScale(100),
  },
  form: {
    gap: spacingY._20,
  },
  authOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  divider: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dividerLine: {
    height: 1,
    flex: 1,
    backgroundColor: colors.neutral700,
    marginHorizontal: spacingX._10,
  },
  socialButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
  },
  socialButton: {
    width: verticalScale(40),
    height: verticalScale(40),
  },
});
