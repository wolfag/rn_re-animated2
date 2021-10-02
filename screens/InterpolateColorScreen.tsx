import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Dimensions } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { RootStackScreenProps } from '../types';

const SIZE = Dimensions.get('screen').width * 0.7;

const Colors = {
  dark: {
    background: '#1e1e1e',
    circle: '#252525',
    text: '#f8f8f8',
  },
  light: {
    background: '#f8f8f8',
    circle: '#fff',
    text: '#1e1e1e',
  },
};

const SWITCH_TRACK_COLOR = {
  true: 'rgba(256,0,256,0.2)',
  false: 'rgba(0,0,0,0.1)',
};

type Theme = 'light' | 'dark';

const InterpolateColorScreen = (
  props: RootStackScreenProps<'InterpolateColorScreen'>
) => {
  const [theme, setTheme] = useState<Theme>('light');
  const progress = useDerivedValue(() => {
    return theme == 'dark' ? withTiming(1) : withTiming(0);
  }, [theme]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [Colors.light.background, Colors.dark.background]
    );

    return {
      backgroundColor,
    };
  });

  const circleAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [Colors.light.circle, Colors.dark.circle]
    );

    return {
      backgroundColor,
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      [Colors.light.text, Colors.dark.text]
    );

    return {
      color,
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Animated.Text style={[styles.text, textAnimatedStyle]}>
        Theme
      </Animated.Text>
      <Animated.View style={[styles.circle, circleAnimatedStyle]}>
        <Switch
          value={theme === 'dark'}
          onValueChange={(v) => {
            setTheme(v ? 'dark' : 'light');
          }}
          trackColor={SWITCH_TRACK_COLOR}
          thumbColor='violet'
        />
      </Animated.View>
    </Animated.View>
  );
};

export default InterpolateColorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    elevation: 8,
  },
  text: {
    fontSize: 70,
  },
});
