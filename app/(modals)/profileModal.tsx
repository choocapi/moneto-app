import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import ModalWrapper from "@/components/ModalWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Header from "@/components/Header";
import Typo from "@/components/Typo";
import { useAuth } from "@/contexts/authContext";
import { Image } from "expo-image";
import { getProfileImage } from "@/services/imageService";
import * as Icons from "phosphor-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { OptionType } from "@/types";
import BackButton from "@/components/BackButton";

const ProfileModal = () => {
  const { user, logout, isGoogleSignIn } = useAuth();
  const router = useRouter();

  const accountOptions: OptionType[] = [
    {
      title: "Cập nhật hồ sơ",
      icon: <Icons.User size={26} color={colors.white} weight="fill" />,
      routeName: "/(modals)/editProfileModal",
      bgColor: "#6366f1",
    },
    {
      title: "Đổi mật khẩu",
      icon: <Icons.Lock size={26} color={colors.white} weight="fill" />,
      routeName: "/(modals)/changePasswordModal",
      bgColor: "#f59e0b",
    },
    {
      title: "Đăng xuất",
      icon: <Icons.Power size={26} color={colors.white} weight="fill" />,
      // routeName: "",
      bgColor: "#e11d48",
    },
  ];

  const handleLogout = async () => {
    await logout();
  };

  const showLogoutAlert = () => {
    Alert.alert("Xác nhận", "Bạn chắc chắn muốn đăng xuất?", [
      {
        text: "Hủy",
        style: "cancel",
        onPress: () => {
          // console.log("cancel logout")
        },
      },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: () => handleLogout(),
      },
    ]);
  };

  const handlePress = (item: OptionType) => {
    if (item.title == "Đăng xuất") {
      showLogoutAlert();
    }

    if (item.routeName) router.push(item?.routeName as any);
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={"Tài khoản"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        {/* user info */}
        <View style={styles.userInfo}>
          {/* avatar */}
          <View>
            <Image
              source={getProfileImage(user?.image)}
              style={styles.avatar}
              contentFit="cover"
              transition={100}
            />
          </View>

          {/* name & email */}
          <View style={styles.nameContainer}>
            <Typo size={24} fontWeight={"600"} color={colors.neutral100}>
              {user?.name}
            </Typo>
            <Typo size={15} color={colors.neutral400}>
              {user?.email}
            </Typo>
          </View>
        </View>

        {/* account options */}
        <View style={styles.cardContainer}>
          {accountOptions
            .filter((item) => !isGoogleSignIn || item.title !== "Đổi mật khẩu")
            .map((item, index) => {
              return (
                <Animated.View
                  key={index.toString()}
                  entering={FadeInDown.delay(index * 50)
                    .springify()
                    .damping(14)}
                >
                  {index > 0 && <View style={styles.divider} />}
                  <TouchableOpacity
                    onPress={() => handlePress(item)}
                    style={styles.settingItem}
                  >
                    {/* icon */}
                    <View
                      style={[
                        styles.listIcon,
                        { backgroundColor: item?.bgColor },
                      ]}
                    >
                      {item.icon && item.icon}
                    </View>
                    <Typo size={16} style={{ flex: 1 }} fontWeight="500">
                      {item.title}
                    </Typo>
                    <Icons.CaretRight
                      size={verticalScale(20)}
                      weight="bold"
                      color={colors.white}
                    />
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
        </View>
      </View>
    </ModalWrapper>
  );
};

export default ProfileModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  userInfo: {
    marginTop: verticalScale(30),
    alignItems: "center",
    gap: spacingY._15,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
    alignSelf: "center",
    backgroundColor: colors.neutral300,
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 8,
    borderRadius: 50,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: 5,
  },
  nameContainer: {
    gap: verticalScale(4),
    alignItems: "center",
  },
  cardContainer: {
    backgroundColor: colors.neutral800,
    borderRadius: radius._15,
    marginTop: spacingY._35,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
    paddingVertical: spacingY._12,
  },
  listIcon: {
    height: verticalScale(44),
    width: verticalScale(44),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral700,
  },
});
