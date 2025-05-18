import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import ModalWrapper from "@/components/ModalWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Typo from "@/components/Typo";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Icons from "phosphor-react-native";
import { ShoppingType } from "@/types";
import { formatNumberInput, getNumberInput } from "@/utils/common";
import {
  createOrUpdateShopping,
  deleteShopping,
} from "@/services/shoppingService";
import { useAuth } from "@/contexts/authContext";

const ShoppingItemModal = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [itemData, setItemData] = useState<ShoppingType>({
    name: "",
    price: 0,
    description: "",
    quantity: 1,
    isUrgent: false,
    bought: false,
  });

  type paramType = {
    id: string;
    name: string;
    price: string;
    description: string;
    quantity: string;
    isUrgent: string;
    bought: string;
    uid: string;
  };

  const oldItem: paramType = useLocalSearchParams();

  useEffect(() => {
    if (oldItem?.id) {
      setItemData({
        id: oldItem.id,
        name: oldItem.name || "",
        price: Number(oldItem.price) || 0,
        description: oldItem.description || "",
        quantity: Number(oldItem.quantity) || 1,
        isUrgent: oldItem.isUrgent === "true",
        bought: oldItem.bought === "true",
        uid: oldItem.uid,
      });
    }
  }, []);

  const handleSubmit = async () => {
    const { name, price, description, quantity } = itemData;
    if (!name.trim() || !quantity || quantity <= 0) {
      Alert.alert("Cảnh báo", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const data: ShoppingType = {
      ...itemData,
      name,
      price,
      description,
      quantity,
      uid: user?.uid,
    };

    if (oldItem?.id) data.id = oldItem.id;

    setLoading(true);
    const res = await createOrUpdateShopping(data);
    setLoading(false);

    if (res.success) {
      router.back();
    } else {
      Alert.alert("Lỗi", res.msg);
    }
  };

  const handleDelete = async () => {
    if (!oldItem?.id) return;

    setLoading(true);
    const res = await deleteShopping(oldItem.id);
    setLoading(false);

    if (res.success) {
      router.back();
    } else {
      Alert.alert("Lỗi", res.msg);
    }
  };

  const showDeleteAlert = () => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa mục mua sắm này?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Xóa",
        style: "destructive",
        onPress: handleDelete,
      },
    ]);
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldItem?.id ? "Cập nhật mục mua sắm" : "Thêm mục mua sắm"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        {/* form */}
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Tên mục</Typo>
            <Input
              placeholder="Nhập tên mục mua sắm"
              value={itemData.name}
              onChangeText={(value) =>
                setItemData({ ...itemData, name: value })
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Đơn giá</Typo>
            <Input
              placeholder="Nhập đơn giá"
              value={formatNumberInput(itemData.price.toString())}
              type="currency"
              keyboardType="numeric"
              onChangeText={(value) =>
                setItemData({
                  ...itemData,
                  price: Number(getNumberInput(value)),
                })
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Số lượng</Typo>
            <Input
              placeholder="Nhập số lượng"
              value={formatNumberInput(itemData.quantity.toString())}
              keyboardType="numeric"
              onChangeText={(value) =>
                setItemData({
                  ...itemData,
                  quantity: Number(getNumberInput(value)),
                })
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
              <Typo color={colors.neutral200}>Mô tả</Typo>
              <Typo color={colors.neutral500} size={16}>
                (optional)
              </Typo>
            </View>
            <Input
              placeholder="VD: Mua đồ ăn sáng, đi taxi, đi chợ..."
              value={itemData.description}
              multiline
              containerStyle={{
                flexDirection: "row",
                height: verticalScale(100),
                alignItems: "flex-start",
                paddingVertical: 10,
              }}
              onChangeText={(value) =>
                setItemData({ ...itemData, description: value })
              }
            />
          </View>

          <View style={styles.urgentContainer}>
            <Typo color={colors.neutral200}>Rất cần mua</Typo>
            <TouchableOpacity
              onPress={() =>
                setItemData({ ...itemData, isUrgent: !itemData.isUrgent })
              }
              style={[
                styles.toggleButton,
                itemData.isUrgent && styles.toggleButtonActive,
              ]}
            >
              <View
                style={[
                  styles.toggleCircle,
                  itemData.isUrgent && styles.toggleCircleActive,
                ]}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        {oldItem?.id && !loading && (
          <Button onPress={showDeleteAlert} style={styles.deleteButton}>
            <Icons.Trash
              size={verticalScale(24)}
              color={colors.white}
              weight="bold"
            />
          </Button>
        )}
        <Button onPress={handleSubmit} loading={loading} style={styles.button}>
          <Icons.FloppyDisk
            color={colors.black}
            size={verticalScale(24)}
            weight="bold"
          />
          <Typo color={colors.black} fontWeight={"700"}>
            {oldItem?.id ? "Cập nhật" : "Thêm"}
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default ShoppingItemModal;

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
    gap: spacingY._20,
    marginTop: spacingY._15,
  },
  inputContainer: {
    gap: spacingY._10,
  },
  descriptionInput: {
    height: verticalScale(80),
    textAlignVertical: "top",
    paddingTop: spacingY._10,
  },
  urgentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacingY._10,
  },
  toggleButton: {
    width: scale(50),
    height: verticalScale(28),
    borderRadius: 20,
    backgroundColor: colors.neutral600,
    padding: 2,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
  },
  toggleCircle: {
    width: verticalScale(24),
    height: verticalScale(24),
    borderRadius: 12,
    backgroundColor: colors.white,
    transform: [{ translateX: 0 }],
  },
  toggleCircleActive: {
    transform: [{ translateX: scale(22) }],
  },
  button: {
    flex: 1,
    flexDirection: "row",
    gap: spacingX._5,
  },
  deleteButton: {
    backgroundColor: colors.rose,
    width: scale(50),
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
  },
});
