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

const Register = () => {
  const router = useRouter();
  const { register: registerUser } = useAuth();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password || !name) {
      Alert.alert("Cảnh báo", "Vui lòng nhập đầy đủ thông tin");
      return;
    }
    setLoading(true);
    const res = await registerUser(email, password, name);
    setLoading(false);
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
            placeholder="Nhập tên của bạn"
            onChangeText={(value) => {
              setName(value);
            }}
            icon={
              <Icons.User
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
          />
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
              Đăng ký
            </Typo>
          </Button>
        </View>

        <View style={styles.authOptions}>
          <Typo size={15}>Bạn đã có tài khoản?</Typo>
          <Pressable onPress={() => router.navigate("/(auth)/login")}>
            <Typo size={15} color={colors.primary} fontWeight={"700"}>
              Đăng nhập
            </Typo>
          </Pressable>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Typo size={15}>Hoặc đăng nhập bằng</Typo>
          <View style={styles.dividerLine} />
        </View>
        <View style={styles.socialButtonContainer}>
          <Pressable>
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

export default Register;

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
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
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
