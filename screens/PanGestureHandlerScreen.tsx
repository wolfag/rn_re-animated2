import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';
import * as React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

const SIZE = 100.0;
const CIRCLE = Dimensions.get('screen').width - 20;

type ContextType = {
  translateX: number;
  translateY: number;
};

export default function PanGestureHandlerScreen({
  navigation,
}: RootStackScreenProps<'PanGestureHandler'>) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (event, context) => {
      context.translateX = translateX.value;
      context.translateY = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = event.translationX + context.translateX;
      translateY.value = event.translationY + context.translateY;
    },
    onEnd: (event) => {
      const distance = Math.sqrt(translateY.value ** 2 + translateX.value ** 2);
      if (distance < CIRCLE / 2 + SIZE / 2) {
        translateY.value = withSpring(0);
        translateX.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <PanGestureHandler onGestureEvent={panGestureEvent}>
          <Animated.View style={[styles.square, animatedStyle]} />
        </PanGestureHandler>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  square: {
    width: SIZE,
    height: SIZE,
    backgroundColor: 'rgba(0,0,256,0.6)',
    borderRadius: 20,
  },
  circle: {
    width: CIRCLE,
    height: CIRCLE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: CIRCLE / 2,
    borderWidth: 5,
    borderColor: 'rgba(0,0,256,0.7)',
  },
});
