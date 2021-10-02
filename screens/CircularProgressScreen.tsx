import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { RootStackScreenProps } from '../types';
import { ReText } from 'react-native-redash';

const BACKGROUND_COLOR = '#444B6F';
const BACKGROUND_STOKE_COLOR = '#303858';
const STROKE_COLOR = '#a6e1fa';

const { width, height } = Dimensions.get('window');
const CIRCLE_LENGTH = 1000; // 2 x PI x R
const R = CIRCLE_LENGTH / (2 * Math.PI);

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgressScreen = (
  props: RootStackScreenProps<'CircularProgressScreen'>
) => {
  const progress = useSharedValue(0);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH * (1 - progress.value),
  }));

  const progressText = useDerivedValue(() => {
    return `${Math.trunc(progress.value * 100)} %`;
  }, [progress]);

  const run = useCallback(() => {
    progress.value = 0;
    progress.value = withTiming(1, { duration: 2000 });
  }, []);

  return (
    <View style={styles.container}>
      <ReText style={styles.text} text={progressText} />

      <Svg style={{ position: 'absolute' }}>
        <Circle
          cx={width / 2}
          cy={height / 2}
          r={R}
          stroke={BACKGROUND_STOKE_COLOR}
          strokeWidth={30}
        />
        <AnimatedCircle
          cx={width / 2}
          cy={height / 2}
          r={R}
          stroke={STROKE_COLOR}
          strokeWidth={15}
          strokeDasharray={CIRCLE_LENGTH}
          animatedProps={animatedProps}
          strokeLinecap='round'
        />
      </Svg>
      <TouchableOpacity style={styles.btn} onPress={run}>
        <Text style={styles.btnTxt}>Run</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CircularProgressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 80,
    color: '#fff',
  },
  btn: {
    position: 'absolute',
    bottom: 80,

    width: width * 0.7,
    height: 60,

    backgroundColor: BACKGROUND_STOKE_COLOR,
    borderRadius: 25,

    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTxt: {
    fontSize: 25,
    color: '#fff',
  },
});
