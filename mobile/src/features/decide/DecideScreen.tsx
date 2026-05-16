import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";
import { CardStack } from "../../components/CardStack";
import { PromptCard } from "../../components/PromptCard";
import { usePromptStore } from "../../store/usePromptStore";
import { useUserStore } from "../../store/useUserStore";
import { ChoiceDecision } from "../../types";
import { COLORS, SPACING } from "../../lib/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Decide">;

export default function DecideScreen({ navigation }: Props) {
  const userId = useUserStore((state) => state.currentUserId);
  const {
    prompts,
    currentIndex,
    loading,
    error,
    fetchPrompts,
    handleDecision,
  } = usePromptStore();

  useEffect(() => {
    fetchPrompts(userId);
  }, [userId]);

  const currentPrompt = prompts[currentIndex];

  const handleSwipeRight = async () => {
    if (!currentPrompt) return;
    await handleDecision(userId, currentPrompt.id, ChoiceDecision.ACCEPT);
    navigation.navigate("Journal", { promptId: currentPrompt.id });
  };

  const handleSwipeLeft = async () => {
    if (!currentPrompt) return;
    await handleDecision(userId, currentPrompt.id, ChoiceDecision.REJECT);
  };

  const handleSwipeUp = async () => {
    if (!currentPrompt) return;
    await handleDecision(userId, currentPrompt.id, ChoiceDecision.DELAY);
  };

  if (loading && prompts.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading prompts...</Text>
      </View>
    );
  }

  if (!currentPrompt || prompts.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.title}>All caught up!</Text>
        <Text style={styles.subtitle}>
          Come back tomorrow for more prompts.
        </Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => fetchPrompts(userId)}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pick your moment</Text>
      </View>

      <CardStack
        cards={prompts}
        currentIndex={currentIndex}
        onSwipeRight={handleSwipeRight}
        onSwipeLeft={handleSwipeLeft}
        onSwipeUp={handleSwipeUp}
        renderCard={(prompt) => <PromptCard prompt={prompt} />}
      />

      <View style={styles.footer}>
        <Text style={styles.hint}>← Reject</Text>
        <Text style={styles.hint}>Accept →</Text>
        <Text style={styles.hint}>↑ Not Now</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "space-between",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
  },
  header: {
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text,
    opacity: 0.6,
    marginTop: SPACING.sm,
    textAlign: "center",
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  hint: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.5,
    fontWeight: "500",
  },
  errorContainer: {
    backgroundColor: "#F44336",
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: 8,
  },
  errorText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
  refreshButton: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  buttonText: {
    color: COLORS.text,
    fontWeight: "600",
    textAlign: "center",
  },
});
