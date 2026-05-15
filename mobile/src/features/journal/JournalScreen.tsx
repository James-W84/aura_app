import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Haptics from "expo-haptics";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";
import { usePromptStore } from "../../store/usePromptStore";
import { useEntryStore } from "../../store/useEntryStore";
import { useUserStore } from "../../store/useUserStore";
import { COLORS, SPACING, TYPOGRAPHY } from "../../lib/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Journal">;

export default function JournalScreen({ route, navigation }: Props) {
  const { promptId } = route.params;
  const userId = useUserStore((state) => state.currentUserId);
  const { prompts } = usePromptStore();
  const {
    currentEntry,
    currentEntryContent,
    autoSaveStatus,
    createEntry,
    updateEntry,
    setCurrentEntryContent,
    clearCurrent,
  } = useEntryStore();

  const prompt = prompts.find((p) => p.id === promptId);

  // Create entry on mount
  useEffect(() => {
    const initEntry = async () => {
      try {
        if (!currentEntry) {
          const entry = await createEntry({
            userId,
            promptId,
            content: "",
          });
          setCurrentEntryContent("");
        }
      } catch (error) {
        console.error("Failed to create entry:", error);
        Alert.alert("Error", "Failed to create journal entry");
      }
    };

    initEntry();

    return () => {
      // Don't clear on unmount - we want to preserve the entry
    };
  }, []);

  const handleContentChange = (text: string) => {
    setCurrentEntryContent(text);

    // Trigger auto-save
    if (currentEntry) {
      updateEntry(currentEntry.id, text, userId);
    }
  };

  const handleFinish = async () => {
    if (!currentEntryContent.trim()) {
      Alert.alert("Empty Entry", "Please write something before finishing.");
      return;
    }

    try {
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );

      // Show success feedback
      setTimeout(() => {
        clearCurrent();
        navigation.navigate("History");
      }, 500);
    } catch (error) {
      console.error("Error finishing entry:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with soft prompt */}
      <View style={styles.header}>
        <Text style={styles.promptLabel}>Writing about</Text>
        {prompt && (
          <Text style={styles.promptText} numberOfLines={2}>
            {prompt.content}
          </Text>
        )}
      </View>

      {/* Main text input */}
      <TextInput
        style={styles.input}
        placeholder="Begin your thoughts..."
        placeholderTextColor={COLORS.text + "80"}
        value={currentEntryContent}
        onChangeText={handleContentChange}
        multiline
        editable={currentEntry !== null}
        textAlignVertical="top"
      />

      {/* Footer with character count and save status */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.charCount}>
            {currentEntryContent.length} characters
          </Text>
        </View>

        <View style={styles.footerCenter}>
          {autoSaveStatus === "saving" && (
            <View style={styles.statusIndicator}>
              <ActivityIndicator
                size="small"
                color={COLORS.text}
                style={{ opacity: 0.5 }}
              />
              <Text style={[styles.statusText, { opacity: 0.5 }]}>
                Saving...
              </Text>
            </View>
          )}
          {autoSaveStatus === "saved" && (
            <Text style={[styles.statusText, { color: "#4CAF50" }]}>
              Saved
            </Text>
          )}
          {autoSaveStatus === "error" && (
            <Text style={[styles.statusText, { color: "#F44336" }]}>
              Save failed
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.finishButton,
            currentEntryContent.trim() === "" && styles.finishButtonDisabled,
          ]}
          onPress={handleFinish}
          disabled={currentEntryContent.trim() === ""}
        >
          <Text style={styles.finishButtonText}>Finish</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
  },
  header: {
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.text + "20",
  },
  promptLabel: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.text,
    opacity: 0.5,
    marginBottom: SPACING.xs,
    letterSpacing: 0.5,
  },
  promptText: {
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.text,
    opacity: 0.7,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 20,
  },
  input: {
    flex: 1,
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.text,
    paddingVertical: SPACING.md,
    marginTop: SPACING.md,
    fontFamily: TYPOGRAPHY.family.sans,
  },
  footer: {
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.text + "20",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLeft: {
    flex: 1,
  },
  footerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  statusText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.text,
    fontWeight: "500",
  },
  charCount: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.text,
    opacity: 0.5,
  },
  finishButton: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  finishButtonDisabled: {
    backgroundColor: COLORS.text + "40",
  },
  finishButtonText: {
    color: COLORS.text,
    fontWeight: "600",
    fontSize: TYPOGRAPHY.size.sm,
  },
});
