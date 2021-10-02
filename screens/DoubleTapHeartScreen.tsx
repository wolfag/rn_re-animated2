import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
} from 'react-native';
import { TapGestureHandler } from 'react-native-gesture-handler';
import carrotImg from '../assets/images/carrot.png';
import likeImg from '../assets/images/like.png';
import { AntDesign } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('screen');

const AnimatedIcon = Animated.createAnimatedComponent(Image);

const DoubleTapHeartScreen = () => {
  const doubleTabRef = useRef();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: Math.max(scale.value, 0) }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const onDoubleTap = useCallback(() => {
    scale.value = withSpring(1, undefined, (isFinished) => {
      if (isFinished) {
        scale.value = withDelay(500, withSpring(0));
      }
    });
  }, []);

  const onSingleTap = useCallback(() => {
    opacity.value = withSpring(0, undefined, (isFinished) => {
      if (isFinished) {
        opacity.value = withDelay(500, withSpring(1));
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <TapGestureHandler waitFor={doubleTabRef} onActivated={onSingleTap}>
        <TapGestureHandler
          ref={doubleTabRef}
          // maxDelayMs={250}
          numberOfTaps={2}
          onActivated={onDoubleTap}
        >
          <Animated.View>
            <ImageBackground
              source={carrotImg}
              resizeMode='contain'
              style={styles.img}
            >
              <AnimatedIcon
                source={likeImg}
                style={[styles.icon, animatedStyle]}
                resizeMode='center'
              />
            </ImageBackground>
            <Animated.Text style={[styles.turtles, textAnimatedStyle]}>
              🐢🐢🐢🐢
            </Animated.Text>
          </Animated.View>
        </TapGestureHandler>
      </TapGestureHandler>
    </View>
  );
};

export default DoubleTapHeartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width,
    height: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width,
    height: width,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.35,
    shadowRadius: 35,
  },
  turtles: {
    fontSize: 30,
  },
});
