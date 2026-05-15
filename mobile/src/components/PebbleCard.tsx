import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { COLORS, BORDER_RADIUS, SPACING, SHADOWS } from "../lib/theme";
import { Entry } from "../types";

interface PebbleCardProps {
  entry: Entry;
  onPress?: () => void;
}

export const PebbleCard = ({ entry, onPress }: PebbleCardProps) => {
  // Format date as uppercase e.g. "14 MAY 2026"
  const date = new Date(entry.createdAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <TouchableOpacity
      style={[styles.container, SHADOWS.sm]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Text style={styles.date}>{formattedDate}</Text>
      <Text style={styles.snippet} numberOfLines={2}>
        {entry.content}
      </Text>
    </TouchableOpacity>
  );
};

const cardWidth = Dimensions.get("window").width - SPACING.md * 2;

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.pebble,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  date: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.text,
    letterSpacing: 1.5,
    marginBottom: SPACING.xs,
    textTransform: "uppercase",
  },
  snippet: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.8,
    lineHeight: 20,
  },
});
