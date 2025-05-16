import { StyleSheet, TouchableOpacity, View, Alert } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Typo from "@/components/Typo";
import { useAuth } from "@/contexts/authContext";
import { Image } from "expo-image";
import { getProfileImage } from "@/services/imageService";
import * as Icons from "phosphor-react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { optionType } from "@/types";

const features: optionType[] = [
  {
    title: "Danh sách mua sắm",
    icon: <Icons.ShoppingBag size={26} color={colors.white} weight="fill" />,
    bgColor: "#8b5cf6",
    // routeName: "/(modals)/shoppingListModal",
  },
  {
    title: "Hạng mục thu/chi",
    icon: <Icons.Folders size={26} color={colors.white} weight="fill" />,
    bgColor: "#ec4899",
    // routeName: "/(modals)/categoryTransactionModal",
  },
  {
    title: "Xuất dữ liệu",
    icon: <Icons.FileArrowUp size={26} color={colors.white} weight="fill" />,
    bgColor: "#0ea5e9",
    // routeName: "/(modals)/exportDataModal",
  },
];

const utilities: optionType[] = [
  {
    title: "Tra cứu tỷ giá",
    icon: (
      <Icons.CurrencyCircleDollar
        size={26}
        color={colors.white}
        weight="fill"
      />
    ),
    bgColor: "#f59e0b",
    // routeName: "/(modals)/exchangeRateModal",
  },
  {
    title: "Tính lãi vay",
    icon: <Icons.Percent size={26} color={colors.white} weight="fill" />,
    bgColor: "#10b981",
    // routeName: "/(modals)/loanCalculatorModal",
  },
  {
    title: "Chia tiền",
    icon: <Icons.UsersThree size={26} color={colors.white} weight="fill" />,
    bgColor: "#6366f1",
    // routeName: "/(modals)/splitBillModal",
  },
];

const settings: optionType[] = [
  {
    title: "Cài đặt chung",
    icon: <Icons.GearSix size={26} color={colors.white} weight="fill" />,
    // routeName: "/(modals)/settingsModal",
    bgColor: "#6366f1",
  },
  {
    title: "Cài đặt dữ liệu",
    icon: <Icons.HardDrives size={26} color={colors.white} weight="fill" />,
    // routeName: "/(modals)/dataSettingsModal",
    bgColor: colors.neutral600,
  },
];

const More = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handlePress = (item: optionType) => {
    if (item.routeName) router.push(item.routeName);
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* User info */}
        <Animated.View
          entering={FadeInDown.springify().damping(14)}
          style={styles.cardContainer}
        >
          <TouchableOpacity
            style={styles.userInfo}
            onPress={() => router.push("/(modals)/profileModal")}
          >
            <Image
              source={getProfileImage(user?.image)}
              style={styles.avatar}
              contentFit="cover"
              transition={100}
            />
            <View style={styles.nameContainer}>
              <Typo size={20} fontWeight={"600"} color={colors.neutral100}>
                {user?.name}
              </Typo>
              <Typo size={14} color={colors.neutral400}>
                {user?.email}
              </Typo>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Features */}
        <View style={styles.cardContainer}>
          <Typo
            size={16}
            fontWeight="700"
            color={colors.neutral300}
            style={styles.sectionTitle}
          >
            Tính năng
          </Typo>
          <View style={styles.gridRow}>
            {features.map((item, index) => (
              <Animated.View
                key={index.toString()}
                entering={FadeInRight.delay(index * 50)
                  .springify()
                  .damping(14)}
              >
                <TouchableOpacity
                  style={{ flexDirection: "column" }}
                  onPress={() => handlePress(item)}
                >
                  <View style={styles.iconContainer}>
                    <View
                      style={[
                        styles.listIcon,
                        { backgroundColor: item.bgColor },
                      ]}
                    >
                      {item.icon && item.icon}
                    </View>
                    <View style={styles.textContainer}>
                      <Typo
                        size={16}
                        style={{ textAlign: "center" }}
                        fontWeight={"500"}
                      >
                        {item.title}
                      </Typo>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Utilities */}
        <View style={styles.cardContainer}>
          <Typo
            size={15}
            fontWeight="700"
            color={colors.neutral300}
            style={styles.sectionTitle}
          >
            Tiện ích
          </Typo>
          <View style={styles.gridRow}>
            {utilities.map((item, index) => (
              <Animated.View
                key={index.toString()}
                entering={FadeInRight.delay(index * 50)
                  .springify()
                  .damping(14)}
              >
                <TouchableOpacity
                  style={{ flexDirection: "column" }}
                  onPress={() => handlePress(item)}
                >
                  <View style={styles.iconContainer}>
                    <View
                      style={[
                        styles.listIcon,
                        { backgroundColor: item.bgColor },
                      ]}
                    >
                      {item.icon && item.icon}
                    </View>
                    <View style={styles.textContainer}>
                      <Typo
                        size={16}
                        style={{ textAlign: "center" }}
                        fontWeight={"500"}
                      >
                        {item.title}
                      </Typo>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.cardContainer}>
          <View style={styles.settingsSection}>
            {settings.map((item, index) => (
              <Animated.View
                key={index.toString()}
                entering={FadeInDown.delay(index * 50)
                  .springify()
                  .damping(14)}
              >
                <TouchableOpacity
                  onPress={() => handlePress(item)}
                  style={styles.flexRow}
                >
                  <View
                    style={[styles.listIcon, { backgroundColor: item.bgColor }]}
                  >
                    {item.icon && item.icon}
                  </View>
                  <Typo size={16} style={{ flex: 1 }} fontWeight={"500"}>
                    {item.title}
                  </Typo>
                  <Icons.CaretRight
                    size={verticalScale(20)}
                    weight="bold"
                    color={colors.white}
                  />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default More;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  cardContainer: {
    backgroundColor: colors.neutral800,
    borderRadius: radius._15,
    padding: spacingX._10,
    marginBottom: verticalScale(10),
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._15,
  },
  avatar: {
    height: verticalScale(60),
    width: verticalScale(60),
    borderRadius: 100,
    backgroundColor: colors.neutral300,
  },
  nameContainer: {
    flex: 1,
    gap: verticalScale(2),
  },
  sectionTitle: {
    marginBottom: verticalScale(15),
  },
  gridRow: {
    flexDirection: "row",
    gap: spacingX._15,
    justifyContent: "space-around",
    marginBottom: verticalScale(10),
  },
  settingsSection: {
    gap: verticalScale(18),
  },
  listIcon: {
    height: verticalScale(44),
    width: verticalScale(44),
    backgroundColor: colors.neutral500,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
  iconContainer: {
    alignItems: "center",
    gap: 6,
  },
  textContainer: {
    width: verticalScale(80),
    alignItems: "center",
  },
});
