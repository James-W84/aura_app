import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";
import { PebbleCard } from "../../components/PebbleCard";
import { useEntryStore } from "../../store/useEntryStore";
import { useUserStore } from "../../store/useUserStore";
import { COLORS, SPACING } from "../../lib/theme";

type Props = NativeStackScreenProps<RootStackParamList, "History">;

export default function HistoryScreen({ navigation }: Props) {
  const userId = useUserStore((state) => state.currentUserId);
  const { entries, loading, page, hasMore, fetchEntries } = useEntryStore();

  useEffect(() => {
    fetchEntries(userId, 0);
  }, [userId]);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchEntries(userId, page + 1);
    }
  };

  const handleEntryPress = (entryId: number) => {
    // TODO: Navigate to EntryDetailScreen
    console.log("Entry pressed:", entryId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Journey</Text>
      </View>

      {entries.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Your journey starts here</Text>
          <Text style={styles.emptySubtitle}>
            Write your first entry to begin
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate("Decide")}
          >
            <Text style={styles.ctaButtonText}>Start Writing</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PebbleCard entry={item} onPress={() => handleEntryPress(item.id)} />
          )}
          contentContainerStyle={styles.list}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            loading ? <ActivityIndicator size="large" color={COLORS.primary} /> : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.text + "10",
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  list: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.text,
    opacity: 0.6,
    marginBottom: SPACING.lg,
    textAlign: "center",
  },
  ctaButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: COLORS.text,
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
});
