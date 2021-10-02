import React from 'react';
import { Image, StyleSheet, Dimensions } from 'react-native';
import {
  PanGestureHandler,
  PinchGestureHandlerEventPayload,
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { RootStackScreenProps } from '../types';
import carrotImg from '../assets/images/carrot.png';

const { width, height } = Dimensions.get('screen');

const AnimatedImg = Animated.createAnimatedComponent(Image);

const PinchGestureHandlerScreen = (
  props: RootStackScreenProps<'PinchGestureHandlerScreen'>
) => {
  const scale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  const pinchHandler =
    useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
      onStart: (event, context) => {},
      onActive: (event, context) => {
        scale.value = event.scale;
        focalX.value = event.focalX;
        focalY.value = event.focalY;
      },
      onEnd: (event, context) => {
        scale.value = withTiming(1);
      },
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: focalX.value },
        { translateY: focalY.value },
        { translateX: -width / 2 },
        { translateY: -height / 2 },
        { scale: scale.value },
        { translateX: -focalX.value },
        { translateY: -focalY.value },
        { translateX: width / 2 },
        { translateY: height / 2 },
      ],
    };
  });

  const focalPointStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: focalX.value }, { translateY: focalY.value }],
  }));

  return (
    <PinchGestureHandler onGestureEvent={pinchHandler}>
      <Animated.View style={{ flex: 1 }}>
        <AnimatedImg
          source={carrotImg}
          style={[{ flex: 1 }, animatedStyle]}
          resizeMode='contain'
        />
        <Animated.View style={[styles.focalPoint, focalPointStyle]} />
      </Animated.View>
    </PinchGestureHandler>
  );
};

export default PinchGestureHandlerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
  focalPoint: {
    ...StyleSheet.absoluteFillObject,
    width: 20,
    height: 20,
    backgroundColor: 'blue',
    borderRadius: 10,
  },
});
