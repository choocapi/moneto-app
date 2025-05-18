import { AuthProvider } from "@/contexts/authContext";
import { Stack } from "expo-router";
import React from "react";

const StackLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="(modals)/profileModal"
        options={{
          presentation: "transparentModal",
          animation: "default",
        }}
      />
      <Stack.Screen
        name="(modals)/editProfileModal"
        options={{
          presentation: "transparentModal",
          animation: "default",
        }}
      />
      <Stack.Screen
        name="(modals)/changePasswordModal"
        options={{
          presentation: "transparentModal",
          animation: "default",
        }}
      />
      <Stack.Screen
        name="(modals)/walletModal"
        options={{
          presentation: "transparentModal",
          animation: "default",
        }}
      />
      <Stack.Screen
        name="(modals)/transactionModal"
        options={{
          presentation: "transparentModal",
          animation: "default",
        }}
      />
      <Stack.Screen
        name="(modals)/searchModal"
        options={{
          presentation: "transparentModal",
          animation: "default",
        }}
      />
      <Stack.Screen
        name="(modals)/shoppingListModal"
        options={{
          presentation: "transparentModal",
          animation: "default",
        }}
      />
      <Stack.Screen
        name="(modals)/shoppingItemModal"
        options={{
          presentation: "transparentModal",
          animation: "default",
        }}
      />
      <Stack.Screen
        name="(modals)/exchangeRateModal"
        options={{
          presentation: "transparentModal",
          animation: "default",
        }}
      />
      <Stack.Screen
        name="(modals)/settingsModal"
        options={{
          presentation: "transparentModal",
          animation: "default",
        }}
      />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <StackLayout />
    </AuthProvider>
  );
}
