import { Alert, ScrollView, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale } from "@/utils/styling";
import ModalWrapper from "@/components/ModalWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Typo from "@/components/Typo";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import { verticalScale } from "@/utils/styling";

const ChangePasswordModal = () => {
  const { updatePassword } = useAuth();
  const router = useRouter();
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const { oldPassword, newPassword, confirmPassword } = passwords;

    if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert("Cảnh báo", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Cảnh báo", "Mật khẩu mới không khớp");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Cảnh báo", "Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);
    const res = await updatePassword(oldPassword, newPassword);
    setLoading(false);

    if (res.success) {
      Alert.alert("Thành công", "Mật khẩu đã được cập nhật", [
        {
          text: "OK",
          onPress: () => {
            router.back();
          },
        },
      ]);
    } else {
      Alert.alert("Lỗi", res.msg || "Cập nhật mật khẩu thất bại");
    }
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title="Đổi mật khẩu"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Mật khẩu cũ</Typo>
            <Input
              placeholder="Nhập mật khẩu cũ"
              value={passwords.oldPassword}
              onChangeText={(value) =>
                setPasswords({ ...passwords, oldPassword: value })
              }
              type="password"
              icon={
                <Icons.Lock
                  size={verticalScale(26)}
                  color={colors.neutral300}
                  weight="fill"
                />
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Mật khẩu mới</Typo>
            <Input
              placeholder="Nhập mật khẩu mới"
              value={passwords.newPassword}
              type="password"
              onChangeText={(value) =>
                setPasswords({ ...passwords, newPassword: value })
              }
              icon={
                <Icons.Lock
                  size={verticalScale(26)}
                  color={colors.neutral300}
                  weight="fill"
                />
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Xác nhận mật khẩu mới</Typo>
            <Input
              placeholder="Nhập lại mật khẩu mới"
              value={passwords.confirmPassword}
              type="password"
              onChangeText={(value) =>
                setPasswords({ ...passwords, confirmPassword: value })
              }
              icon={
                <Icons.Lock
                  size={verticalScale(26)}
                  color={colors.neutral300}
                  weight="fill"
                />
              }
            />
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <Button onPress={handleSubmit} loading={loading} style={{ flex: 1 }}>
          <Typo color={colors.black} fontWeight={"700"}>
            Cập nhật
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default ChangePasswordModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  inputContainer: {
    gap: spacingY._10,
  },
});
