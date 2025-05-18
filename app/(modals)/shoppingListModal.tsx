import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import React, { useState } from "react";
import ModalWrapper from "@/components/ModalWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import { ShoppingType } from "@/types";
import ShoppingList from "@/components/ShoppingList";
import { useAuth } from "@/contexts/authContext";
import { orderBy, where } from "firebase/firestore";
import useFetchData from "@/hooks/useFetchData";
import Typo from "@/components/Typo";
import Animated, { FadeInDown } from "react-native-reanimated";
import { formatCurrency } from "@/utils/common";
import {
  clearShoppingList,
  createOrUpdateShopping,
} from "@/services/shoppingService";

const ShoppingListModal = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [sections, setSections] = useState([
    { title: "Cần mua", isExpanded: true },
    { title: "Đã mua", isExpanded: true },
  ]);

  const constraints = user?.uid
    ? [
        where("uid", "==", user.uid),
        orderBy("isUrgent", "desc"),
        orderBy("created", "desc"),
      ]
    : [];

  const {
    data: shoppingItems,
    loading: itemsLoading,
    error: itemsError,
  } = useFetchData<ShoppingType>("shoppings", constraints);

  const handleToggleBought = async (item: ShoppingType) => {
    const updatedItem = { ...item, bought: !item.bought };
    const res = await createOrUpdateShopping(updatedItem);
  };

  const toggleSection = (index: number) => {
    setSections(
      sections.map((section, i) =>
        i === index ? { ...section, isExpanded: !section.isExpanded } : section
      )
    );
  };

  const boughtItems = shoppingItems?.filter((item) => item.bought) || [];
  const unboughtItems = shoppingItems?.filter((item) => !item.bought) || [];

  const calculateTotal = (items: ShoppingType[]) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleClearList = async () => {
    if (!user?.uid) {
      Alert.alert("Lỗi", "Vui lòng đăng nhập để sử dụng tính năng này");
      return;
    }

    const uid = user.uid;

    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn xóa toàn bộ danh sách mua sắm?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            setDeleteLoading(true);
            const res = await clearShoppingList(uid);
            setDeleteLoading(false);
            if (!res.success) {
              Alert.alert("Lỗi", res.msg);
            }
          },
        },
      ]
    );
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title="Danh sách mua sắm"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        <ScrollView
          contentContainerStyle={styles.scrollViewStyle}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            entering={FadeInDown.delay(0).springify().damping(14)}
            style={styles.totalCard}
          >
            <View style={styles.totalHeader}>
              <View style={styles.totalTitleContainer}>
                <Icons.Coins
                  size={20}
                  color={colors.neutral200}
                  weight="fill"
                />
                <Typo size={16} fontWeight="600" color={colors.neutral200}>
                  Tổng tiền
                </Typo>
              </View>
              <Typo size={16} fontWeight="500" color={colors.primary}>
                {formatCurrency(calculateTotal(shoppingItems), "vi-VN", "VND")}
              </Typo>
            </View>
          </Animated.View>

          {sections.map((section, index) => (
            <Animated.View
              key={index}
              entering={FadeInDown.delay(index * 50)
                .springify()
                .damping(14)}
              style={styles.sectionContainer}
            >
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggleSection(index)}
                activeOpacity={0.7}
              >
                <View style={styles.sectionTitleContainer}>
                  <Icons.CaretDown
                    size={20}
                    color={colors.neutral200}
                    weight="bold"
                    style={[
                      styles.caretIcon,
                      !section.isExpanded && styles.caretIconCollapsed,
                    ]}
                  />
                  <Typo size={16} fontWeight="600" color={colors.neutral200}>
                    {section.title}
                  </Typo>
                </View>
                <Typo size={16} fontWeight="500" color={colors.neutral300}>
                  {formatCurrency(
                    calculateTotal(index === 0 ? unboughtItems : boughtItems),
                    "vi-VN",
                    "VND"
                  )}
                </Typo>
              </TouchableOpacity>

              {section.isExpanded && (
                <ShoppingList
                  data={index === 0 ? unboughtItems : boughtItems}
                  loading={itemsLoading}
                  onToggleBought={handleToggleBought}
                  emptyListMessage={`Chưa có mục nào ${
                    index === 0 ? "cần mua" : "đã mua"
                  }`}
                />
              )}
            </Animated.View>
          ))}
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Button
            style={StyleSheet.flatten([
              styles.floatingButton,
              styles.clearButton,
            ])}
            onPress={handleClearList}
            loading={deleteLoading}
          >
            <Icons.Trash
              color={colors.white}
              weight="bold"
              size={verticalScale(24)}
            />
          </Button>
          <Button
            style={StyleSheet.flatten([
              styles.floatingButton,
              styles.addButton,
            ])}
            onPress={() => router.push("/(modals)/shoppingItemModal")}
          >
            <Icons.Plus
              color={colors.black}
              weight="bold"
              size={verticalScale(24)}
            />
          </Button>
        </View>
      </View>
    </ModalWrapper>
  );
};

export default ShoppingListModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  scrollViewStyle: {
    gap: spacingY._15,
    paddingBottom: verticalScale(100),
  },
  totalCard: {
    backgroundColor: colors.neutral800,
    borderRadius: radius._15,
    overflow: "hidden",
  },
  totalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacingX._15,
    backgroundColor: colors.neutral700,
  },
  totalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
  sectionContainer: {
    backgroundColor: colors.neutral800,
    borderRadius: radius._15,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacingX._15,
    backgroundColor: colors.neutral700,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
  caretIcon: {
    transform: [{ rotate: "0deg" }],
  },
  caretIconCollapsed: {
    transform: [{ rotate: "-90deg" }],
  },
  buttonContainer: {
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30),
    gap: spacingY._10,
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
  },
  clearButton: {
    backgroundColor: colors.rose,
  },
  addButton: {
    backgroundColor: colors.primary,
  },
});
