import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { COLORS, SPACING } from "../lib/theme";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ScrollView style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.subtitle}>
              We encountered an unexpected error. Please try again.
            </Text>
            {__DEV__ && (
              <View style={styles.errorDetails}>
                <Text style={styles.errorText}>
                  {this.state.error?.toString()}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text,
    opacity: 0.7,
    textAlign: "center",
  },
  errorDetails: {
    marginTop: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.text + "20",
    borderRadius: 8,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.text,
    fontFamily: "Courier",
  },
});
