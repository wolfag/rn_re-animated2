import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { RootStackScreenProps } from '../types';

const { width, height } = Dimensions.get('screen');

const WORDS = ['hello', 'my', 'friend', 'devs'];
const SIZE = width * 0.7;

const InterpolateScrollScreen = (
  props: RootStackScreenProps<'InterpolateScrollScreen'>
) => {
  const translateX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    translateX.value = event.contentOffset.x;
    console.log({ x: event.contentOffset.x });
  });

  return (
    <Animated.ScrollView
      onScroll={scrollHandler}
      style={styles.container}
      scrollEventThrottle={16}
      horizontal
      pagingEnabled
    >
      {WORDS.map((w, i) => (
        <Page key={i} title={w} index={i} translateX={translateX} />
      ))}
    </Animated.ScrollView>
  );
};

export default InterpolateScrollScreen;

interface PageProps {
  title: string;
  index: number;
  translateX: Animated.SharedValue<number>;
}

function Page({ title, index, translateX }: PageProps) {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateX.value,
      inputRange,
      [0, 1, 0],
      Extrapolate.CLAMP
    );
    const borderRadius = interpolate(
      translateX.value,
      inputRange,
      [0, SIZE / 2, 0],
      Extrapolate.CLAMP
    );
    return { transform: [{ scale }], borderRadius };
  });

  const textWrapperAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      translateX.value,
      inputRange,
      [height / 2, 0, -height / 2],
      Extrapolate.CLAMP
    );
    const opacity = interpolate(
      translateX.value,
      inputRange,
      [-2, 1, -2],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    const fontSize = interpolate(
      translateX.value,
      inputRange,
      [0, 70, 0],
      Extrapolate.CLAMP
    );
    return { fontSize };
  });

  return (
    <View
      style={[styles.page, { backgroundColor: `rgba(0,0,256,0.${index + 2})` }]}
    >
      <Animated.View style={[styles.square, animatedStyle]} />
      <Animated.View
        style={[{ position: 'absolute' }, textWrapperAnimatedStyle]}
      >
        <Animated.Text style={[styles.text, textAnimatedStyle]}>
          {title}
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  page: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  square: {
    width: SIZE,
    height: SIZE,
    backgroundColor: 'rgba(0,0,256,0.4)',
  },
  text: {
    fontSize: 70,
    color: '#fff',
    textTransform: 'uppercase',
    fontWeight: '700',
  },
});
