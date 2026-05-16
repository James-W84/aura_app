import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { COLORS, BORDER_RADIUS, SPACING, SHADOWS } from "../lib/theme";
import { Prompt } from "../types";

interface PromptCardProps {
  prompt: Prompt;
  onPress?: () => void;
}

export const PromptCard = ({ prompt, onPress }: PromptCardProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, SHADOWS.md]}
      onPress={onPress}
      activeOpacity={0.95}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          {prompt.category && (
            <Text style={styles.category}>{prompt.category.toUpperCase()}</Text>
          )}
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.text} numberOfLines={8}>
            {prompt.content}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width - SPACING.lg * 2,
    height: 500,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.glass,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: SPACING.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
  header: {
    marginBottom: SPACING.lg,
    alignItems: "center",
  },
  category: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.accent,
    letterSpacing: 2,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    fontSize: 22,
    fontWeight: "500",
    color: COLORS.text,
    textAlign: "center",
    lineHeight: 32,
    letterSpacing: 0.3,
  },
});
