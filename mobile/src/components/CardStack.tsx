import React, { useRef, useState } from "react";
import {
  View,
  Animated,
  PanResponder,
  StyleSheet,
  Dimensions,
  ViewStyle,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Prompt } from "../../types";

interface CardStackProps {
  cards: Prompt[];
  onSwipeRight: (card: Prompt) => void;
  onSwipeLeft: (card: Prompt) => void;
  onSwipeUp: (card: Prompt) => void;
  renderCard: (card: Prompt, index: number) => React.ReactNode;
  currentIndex: number;
}

const SWIPE_THRESHOLD = 100;
const SCREEN_WIDTH = Dimensions.get("window").width;

export const CardStack = ({
  cards,
  onSwipeRight,
  onSwipeLeft,
  onSwipeUp,
  renderCard,
  currentIndex,
}: CardStackProps) => {
  const position = useRef(new Animated.ValueXY()).current;
  const rotateValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, { dx, dy }) => {
        position.x.setValue(dx);
        position.y.setValue(dy);

        // Rotate card based on horizontal movement
        const rotate = (dx / SCREEN_WIDTH) * 90;
        rotateValue.setValue(rotate);

        // Scale on vertical movement (for up swipe)
        const scale = 1 + dy / 500;
        scaleValue.setValue(Math.max(0.95, scale));
      },

      onPanResponderRelease: (evt, { dx, dy }) => {
        const currentCard = cards[currentIndex];

        if (!currentCard) {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
          return;
        }

        // Determine swipe direction
        let swiped = false;

        // Right swipe (ACCEPT)
        if (dx > SWIPE_THRESHOLD) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onSwipeRight(currentCard);
          swiped = true;
        }
        // Left swipe (REJECT)
        else if (dx < -SWIPE_THRESHOLD) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onSwipeLeft(currentCard);
          swiped = true;
        }
        // Up swipe (DELAY)
        else if (dy < -SWIPE_THRESHOLD) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onSwipeUp(currentCard);
          swiped = true;
        }

        // Reset position if not swiped far enough
        if (!swiped) {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();

          Animated.spring(rotateValue, {
            toValue: 0,
            useNativeDriver: false,
          }).start();

          Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const rotate = rotateValue.interpolate({
    inputRange: [-90, 0, 90],
    outputRange: ["-15deg", "0deg", "15deg"],
  });

  const animatedStyle = {
    transform: [
      { translateX: position.x },
      { translateY: position.y },
      { rotate },
      { scale: scaleValue },
    ],
  };

  const currentCard = cards[currentIndex];

  if (!currentCard) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Background cards (preview) */}
      {currentIndex + 1 < cards.length && (
        <View style={[styles.cardWrapper, styles.backgroundCard2]}>
          {renderCard(cards[currentIndex + 1], currentIndex + 1)}
        </View>
      )}

      {currentIndex + 2 < cards.length && (
        <View style={[styles.cardWrapper, styles.backgroundCard3]}>
          {renderCard(cards[currentIndex + 2], currentIndex + 2)}
        </View>
      )}

      {/* Main card */}
      <Animated.View
        style={[styles.cardWrapper, animatedStyle]}
        {...panResponder.panHandlers}
      >
        {renderCard(currentCard, currentIndex)}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 450,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  cardWrapper: {
    position: "absolute",
    width: SCREEN_WIDTH - 32,
  },
  backgroundCard2: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }, { translateY: 8 }],
  },
  backgroundCard3: {
    opacity: 0.6,
    transform: [{ scale: 0.96 }, { translateY: 16 }],
  },
});
