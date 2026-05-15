import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ErrorBoundary } from "./src/components/ErrorBoundary";

import DecideScreen from "./src/features/decide/DecideScreen";
import JournalScreen from "./src/features/journal/JournalScreen";
import HistoryScreen from "./src/features/history/HistoryScreen";

export type RootStackParamList = {
  Decide: undefined;
  Journal: { promptId: number };
  History: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                animationEnabled: true,
              }}
            >
              <Stack.Screen
                name="Decide"
                component={DecideScreen}
                options={{ animationEnabled: false }}
              />
              <Stack.Screen name="Journal" component={JournalScreen} />
              <Stack.Screen name="History" component={HistoryScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
