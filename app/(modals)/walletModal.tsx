import { Alert, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import ModalWrapper from "@/components/ModalWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import * as Icons from "phosphor-react-native";
import Typo from "@/components/Typo";
import Input from "@/components/Input";
import { WalletType } from "@/types";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/authContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import ImageUpload from "@/components/ImageUpload";
import { createOrUpdateWallet, deleteWallet } from "@/services/walletService";
import { decodeImageUrl } from "@/services/imageService";
import { formatNumberInput, getNumberInput } from "@/utils/common";

const WalletModal = () => {
  const { user, updateUserData } = useAuth();
  const router = useRouter();
  const [wallet, setWallet] = useState<WalletType>({
    name: "",
    amount: 0,
    image: null,
  });
  const [loading, setLoading] = useState(false);

  type paramType = {
    name: string;
    amount: string;
    image: any;
    id: string;
  };

  const oldWallet: paramType = useLocalSearchParams();

  useEffect(() => {
    if (oldWallet?.id) {
      setWallet({
        name: oldWallet?.name,
        image: decodeImageUrl(oldWallet?.image),
        amount: Number(oldWallet?.amount),
      });
    }
  }, []);

  const handleSubmit = async () => {
    let { name, amount, image } = wallet;
    if (!name.trim() || !amount || !image) {
      Alert.alert("Cảnh báo", "Bạn cần nhập đầy đủ thông tin");
      return;
    }

    const data: WalletType = {
      name,
      amount,
      image,
      uid: user?.uid,
    };
    if (oldWallet?.id) data.id = oldWallet.id;
    setLoading(true);
    const res = await createOrUpdateWallet(data);
    setLoading(false);
    // console.log("result wallet: ", res);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Lỗi", res.msg || "Thêm ví thất bại");
    }
  };

  const onDelete = async () => {
    if (!oldWallet?.id) return;
    setLoading(true);
    const res = await deleteWallet(oldWallet?.id);
    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Lỗi", res.msg);
    }
  };

  const showDeleteAlert = () => {
    Alert.alert(
      "Xác nhận",
      "Bạn chắc chắn muốn xóa ví này?\nViệc xóa ví này sẽ đồng thời xóa các lịch sử ghi liên quan",
      [
        {
          text: "Hủy",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Xóa",
          onPress: () => onDelete(),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldWallet?.id ? "Cập nhật tài khoản" : "Thêm tài khoản"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        {/* form */}
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Tên ví</Typo>
            <Input
              placeholder="Tên tài khoản"
              value={wallet.name}
              onChangeText={(value) => setWallet({ ...wallet, name: value })}
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Số dư</Typo>
            <Input
              placeholder="Số dư ban đầu"
              keyboardType="numeric"
              type="currency"
              value={formatNumberInput(wallet?.amount?.toString() || "")}
              onChangeText={(value) => {
                const numericValue = getNumberInput(value);
                setWallet({ ...wallet, amount: Number(numericValue) });
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Hình ảnh</Typo>
            <ImageUpload
              file={wallet.image}
              onClear={() => setWallet({ ...wallet, image: null })}
              onSelect={(file) => setWallet({ ...wallet, image: file })}
              placeholder="Chọn ảnh"
            />
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        {oldWallet?.id && !loading && (
          <Button
            onPress={showDeleteAlert}
            style={{
              backgroundColor: colors.rose,
              paddingHorizontal: spacingX._15,
            }}
          >
            <Icons.Trash
              color={colors.white}
              size={verticalScale(24)}
              weight="bold"
            />
          </Button>
        )}
        <Button
          onPress={handleSubmit}
          loading={loading}
          style={styles.buttonContainer}
        >
          <Icons.FloppyDisk
            color={colors.black}
            size={verticalScale(24)}
            weight="bold"
          />
          <Typo color={colors.black} fontWeight={"700"}>
            Lưu
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default WalletModal;

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
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
    borderWidth: 1,
    borderColor: colors.neutral500,
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._7,
    borderRadius: 100,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: spacingY._7,
  },
  inputContainer: {
    gap: spacingY._10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    gap: spacingX._5,
  },
});
