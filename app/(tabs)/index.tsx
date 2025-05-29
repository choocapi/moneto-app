import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { useAuth } from "@/contexts/authContext";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import * as Icons from "phosphor-react-native";
import HomeCard from "@/components/HomeCard";
import TransactionList from "@/components/TransactionList";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { limit, orderBy, where } from "firebase/firestore";
import useFetchData from "@/hooks/useFetchData";
import { TransactionType } from "@/types";
import * as ImagePicker from "expo-image-picker";
import { scanReceiptAndParse } from "@/services/imageService";
import OverlayLoading from "@/components/OverlayLoading";

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isVisionLoading, setIsVisionLoading] = React.useState(false);

  const constraints = user?.uid
    ? [where("uid", "==", user.uid), orderBy("date", "desc"), limit(15)]
    : [];

  const {
    data: recentTransactions,
    error: transactionError,
    loading: transactionLoading,
  } = useFetchData<TransactionType>("transactions", constraints);

  const handleScanReceipt = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        base64: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets[0]) {
        setIsVisionLoading(true);
        const image = result.assets[0];
        const scanRes = await scanReceiptAndParse(image);
        setIsVisionLoading(false);
        if (!scanRes.success) {
          alert(scanRes.msg || "Không nhận diện được hóa đơn");
          return;
        }
        const { amount, date, description, image: imageUrl } = scanRes.data;
        router.push({
          pathname: "/(modals)/transactionModal",
          params: {
            id: "",
            type: "expense",
            amount: amount ? amount.toString() : "",
            date: date || new Date().toISOString(),
            description: description || "",
            image: imageUrl,
          },
        });
      }
    } catch (e) {
      setIsVisionLoading(false);
      alert("Có lỗi khi scan hóa đơn");
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* header  */}
        <View style={styles.header}>
          <View style={{ gap: 4 }}>
            <Typo size={16} color={colors.neutral400}>
              Xin chào,
            </Typo>
            <Typo size={20} fontWeight={"500"}>
              {user?.name}
            </Typo>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(modals)/searchModal")}
            style={styles.searchIcon}
          >
            <Icons.MagnifyingGlass
              size={verticalScale(22)}
              color={colors.neutral200}
              weight="bold"
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollViewStyle}
          showsVerticalScrollIndicator={false}
        >
          {/* card */}
          <View>
            <HomeCard />
          </View>

          {/* transaction list */}
          <TransactionList
            data={recentTransactions}
            loading={transactionLoading}
            emptyListMessage="Chưa có ghi chép nào!"
            title="Lịch sử thu chi"
          />
        </ScrollView>

        {/* Floating buttons group */}
        <View style={styles.buttonContainer}>
          <Button
            style={StyleSheet.flatten([
              styles.floatingButton,
              styles.scanButton,
            ])}
            onPress={handleScanReceipt}
          >
            <Icons.Camera
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
            onPress={() => {
              router.push("/(modals)/transactionModal");
            }}
          >
            <Icons.Plus
              color={colors.black}
              weight="bold"
              size={verticalScale(24)}
            />
          </Button>
        </View>
        {isVisionLoading && <OverlayLoading text="Đang nhận diện hóa đơn..." />}
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    marginTop: verticalScale(8),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  searchIcon: {
    backgroundColor: colors.neutral700,
    padding: spacingX._10,
    borderRadius: 50,
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30),
    gap: spacingY._10,
    flexDirection: "column",
  },
  addButton: {
    backgroundColor: colors.primary,
  },
  scanButton: {
    backgroundColor: colors.primaryLight,
  },
  scrollViewStyle: {
    marginTop: spacingY._10,
    paddingBottom: verticalScale(100),
    gap: spacingY._25,
  },
});
