import { CategoryType, ExpenseCategoriesType } from "@/types";
import { colors } from "./theme";

import * as Icons from "phosphor-react-native"; // Import all icons dynamically

export const expenseCategories: ExpenseCategoriesType = {
  groceries: {
    label: "Tạp hóa",
    value: "groceries",
    icon: Icons.ShoppingCart,
    bgColor: "#4B5563", // Deep Teal Green
  },
  rent: {
    label: "Nhà ở",
    value: "rent",
    icon: Icons.House,
    bgColor: "#075985", // Dark Blue
  },
  utilities: {
    label: "Dịch vụ",
    value: "utilities",
    icon: Icons.Lightbulb,
    bgColor: "#ca8a04", // Dark Golden Brown
  },
  transportation: {
    label: "Giao thông",
    value: "transportation",
    icon: Icons.Car,
    bgColor: "#b45309", // Dark Orange-Red
  },
  entertainment: {
    label: "Giải trí",
    value: "entertainment",
    icon: Icons.FilmStrip,
    bgColor: "#0f766e", // Darker Red-Brown
  },
  dining: {
    label: "Ăn uống",
    value: "dining",
    icon: Icons.ForkKnife,
    bgColor: "#be185d", // Dark Red
  },
  health: {
    label: "Sức khỏe",
    value: "health",
    icon: Icons.Heart,
    bgColor: "#e11d48", // Dark Purple
  },
  insurance: {
    label: "Bảo hiểm",
    value: "insurance",
    icon: Icons.ShieldCheck,
    bgColor: "#404040", // Dark Gray
  },
  savings: {
    label: "Tiết kiệm",
    value: "savings",
    icon: Icons.PiggyBank,
    bgColor: "#065F46", // Deep Teal Green
  },
  clothing: {
    label: "Quần áo",
    value: "clothing",
    icon: Icons.TShirt,
    bgColor: "#7c3aed", // Dark Indigo
  },
  personal: {
    label: "Cá nhân",
    value: "personal",
    icon: Icons.User,
    bgColor: "#a21caf", // Deep Pink
  },
  others: {
    label: "Khác",
    value: "others",
    icon: Icons.DotsThreeOutline,
    bgColor: "#525252", // Neutral Dark Gray
  },
};

export const incomeCategory: CategoryType = {
  label: "Thu nhập",
  value: "income",
  icon: Icons.CurrencyDollarSimple,
  bgColor: "#16a34a", // Dark
};

export const transactionTypes = [
  { label: "Chi tiêu", value: "expense" },
  { label: "Thu nhập", value: "income" },
];
