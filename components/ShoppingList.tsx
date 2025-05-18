import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { ShoppingType } from "@/types";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Typo from "./Typo";
import { FlashList } from "@shopify/flash-list";
import Loading from "./Loading";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import { formatCurrency } from "@/utils/common";

type ShoppingListProps = {
  data: ShoppingType[];
  title?: string;
  loading?: boolean;
  emptyListMessage?: string;
  onToggleBought?: (item: ShoppingType) => void;
};

const ShoppingList = ({
  data,
  title,
  loading,
  emptyListMessage = "Chưa có mục nào",
  onToggleBought,
}: ShoppingListProps) => {
  const router = useRouter();

  const handleEdit = (item: ShoppingType) => {
    router.push({
      pathname: "/(modals)/shoppingItemModal",
      params: {
        id: item.id,
        name: item.name,
        price: item.price.toString(),
        description: item.description,
        quantity: item.quantity.toString(),
        isUrgent: item.isUrgent.toString(),
        bought: item.bought.toString(),
        uid: item.uid,
      },
    });
  };

  return (
    <View style={styles.container}>
      {title && (
        <Typo size={20} fontWeight={"500"}>
          {title}
        </Typo>
      )}

      <View style={styles.list}>
        <FlashList
          data={data}
          renderItem={({ item, index }) => (
            <>
              {index < data.length && <View style={styles.divider} />}
              <ShoppingItem
                item={item}
                index={index}
                onEdit={handleEdit}
                onToggleBought={onToggleBought}
              />
            </>
          )}
          estimatedItemSize={60}
        />
      </View>

      <View>
        {loading ? (
          <Loading />
        ) : (
          data.length === 0 && (
            <Typo
              size={15}
              color={colors.neutral400}
              style={{ textAlign: "center", marginTop: spacingY._15 }}
            >
              {emptyListMessage}
            </Typo>
          )
        )}
      </View>
    </View>
  );
};

type ShoppingItemProps = {
  item: ShoppingType;
  index: number;
  onEdit: (item: ShoppingType) => void;
  onToggleBought?: (item: ShoppingType) => void;
};

const ShoppingItem = ({
  item,
  index,
  onEdit,
  onToggleBought,
}: ShoppingItemProps) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50)
        .springify()
        .damping(14)}
    >
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => onToggleBought?.(item)}
        >
          {item.bought && (
            <Icons.Check
              size={verticalScale(20)}
              color={colors.primary}
              weight="bold"
            />
          )}
        </TouchableOpacity>

        <View style={styles.itemInfo}>
          <View style={styles.nameContainer}>
            <Typo size={17} style={item.bought ? styles.boughtText : undefined}>
              {item.name}
            </Typo>
            {item.isUrgent && (
              <Icons.Star
                size={verticalScale(16)}
                color={colors.rose}
                weight="fill"
              />
            )}
            <Typo
              size={14}
              color={colors.neutral400}
              style={item.bought ? styles.boughtText : undefined}
            >
              {` (x${item.quantity})`}
            </Typo>
          </View>
          <Typo
            size={12}
            color={colors.neutral400}
            textProps={{ numberOfLines: 1 }}
            style={item.bought ? styles.boughtText : undefined}
          >
            {item.description}
          </Typo>
        </View>

        <View style={styles.rightSection}>
          <Typo fontWeight={"500"} color={colors.neutral200}>
            {formatCurrency(item.price * item.quantity, "vi-VN", "VND")}
          </Typo>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => onEdit(item)}
          >
            <Icons.PencilSimple
              size={verticalScale(20)}
              color={colors.neutral200}
              weight="fill"
            />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

export default ShoppingList;

const styles = StyleSheet.create({
  container: {
    gap: spacingY._17,
  },
  list: {
    minHeight: 3,
    backgroundColor: colors.neutral700,
    borderBottomLeftRadius: radius._15,
    borderBottomRightRadius: radius._15,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._12,
    padding: spacingY._10,
    paddingHorizontal: spacingY._10,
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral600,
    marginHorizontal: spacingX._10,
  },
  checkbox: {
    width: verticalScale(24),
    height: verticalScale(24),
    borderRadius: radius._6,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  itemInfo: {
    flex: 1,
    gap: 2.5,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
  },
  rightSection: {
    alignItems: "flex-end",
    gap: spacingY._5,
  },
  editButton: {
    padding: spacingX._5,
  },
  boughtText: {
    textDecorationLine: "line-through",
    color: colors.neutral500,
  },
});
