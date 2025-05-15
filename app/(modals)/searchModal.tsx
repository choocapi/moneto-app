import { ScrollView, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { colors, spacingY } from "@/constants/theme";
import ModalWrapper from "@/components/ModalWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Input from "@/components/Input";
import { TransactionType } from "@/types";
import { useAuth } from "@/contexts/authContext";
import { orderBy, where } from "firebase/firestore";
import useFetchData from "@/hooks/useFetchData";
import TransactionList from "@/components/TransactionList";

const SearchModal = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const constraints = user?.uid
    ? [where("uid", "==", user.uid), orderBy("date", "desc")]
    : [];

  const {
    data: allTransactions,
    error: transactionError,
    loading: transactionLoading,
  } = useFetchData<TransactionType>("transactions", constraints);

  const filteredTransactions = allTransactions?.filter((item) => {
    if (search.length > 1) {
      if (
        item.category?.toLowerCase()?.includes(search?.toLowerCase()) ||
        item.type?.toLowerCase()?.includes(search?.toLowerCase()) ||
        item.description?.toLowerCase()?.includes(search?.toLowerCase())
      ) {
        return true;
      }
      return false;
    }
    return true;
  });

  return (
    <ModalWrapper style={{ backgroundColor: colors.neutral900 }}>
      <View style={styles.container}>
        <Header
          title={"Tìm kiếm"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        {/* form */}
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Input
              placeholder="VD: Xem phim, lương tháng,..."
              value={search}
              placeholderTextColor={colors.neutral400}
              containerStyle={{ backgroundColor: colors.neutral800 }}
              onChangeText={setSearch}
            />
          </View>

          <View>
            <TransactionList
              loading={transactionLoading}
              data={filteredTransactions}
              emptyListMessage="Không có kết quả tìm kiếm tương ứng"
            />
          </View>
        </ScrollView>
      </View>
    </ModalWrapper>
  );
};

export default SearchModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  inputContainer: {
    gap: spacingY._10,
  },
});
