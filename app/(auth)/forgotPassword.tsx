import { Alert, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import BackButton from "@/components/BackButton";
import Input from "@/components/Input";
import * as Icons from "phosphor-react-native";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "expo-router";

const ForgotPassword = () => {
  const router = useRouter();
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert("Cảnh báo", "Vui lòng nhập email");
      return;
    }
    setLoading(true);
    const res = await forgotPassword(email);
    setLoading(false);

    if (res.success) {
      Alert.alert(
        "Thành công",
        "Liên kết đặt lại mật khẩu đã được gửi đến email của bạn"
      );
      router.back();
    }
    if (!res.success) {
      Alert.alert("Lỗi", res.msg);
      setEmail("");
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton iconSize={28} />

        <View style={styles.headerContainer}>
          <Typo size={24} fontWeight={"800"}>
            Quên mật khẩu
          </Typo>
          <Typo style={{ textAlign: "center" }}>
            Hãy nhập email mà bạn dùng để đăng ký sử dụng Sổ Thu Chi Moneto,
            chúng tôi sẽ gửi thông tin đặt lại mật khẩu cho bạn.
          </Typo>
        </View>

        <View style={styles.form}>
          <Input
            placeholder="Nhập email của bạn"
            value={email}
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
          <Button onPress={handleSubmit} loading={loading}>
            <Typo fontWeight={"700"} color={colors.black} size={21}>
              Lấy lại mật khẩu
            </Typo>
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
  },
  headerContainer: {
    gap: spacingY._20,
    marginBottom: spacingY._10,
    alignItems: "center",
  },
  form: {
    gap: spacingY._20,
  },
});
