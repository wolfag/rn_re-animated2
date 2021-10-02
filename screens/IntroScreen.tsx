import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  ImageProps,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { RootStackScreenProps } from '../types';
import { AntDesign } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const BACKGROUND_COLOR = '#F1F1F1';

export interface PageInterface extends Pick<ImageProps, 'source'> {
  title: string;
  description: string;
}

export const PAGES: PageInterface[] = [
  {
    title: 'Samurai',
    description:
      'A durable deck featured with a menacing face of a samurai at the center of the underside accompanied with a large red sun motif.',
    source: require('../assets/images/skates/01.png'),
  },
  {
    title: 'Reject',
    description:
      "You don't have time to consider wheter the graphic on your CSS board would be considered modernist.",
    source: require('../assets/images/skates/02.png'),
  },
  {
    title: 'Great Wave',
    description:
      'The top of the deck has the same matching graphic in black outline and embodies an overall mellow concave.',
    source: require('../assets/images/skates/03.png'),
  },
];

export default function IntroScreen(
  props: RootStackScreenProps<'IntroScreen'>
) {
  const translateX = useSharedValue(0);
  const scrollRef = useRef<ScrollView>(null);

  const onScroll = useAnimatedScrollHandler((event) => {
    translateX.value = event.contentOffset.x;
  });

  const activeIndex = useDerivedValue(() => {
    return Math.round(translateX.value / SCREEN_WIDTH);
  });

  const onNext = useCallback(() => {
    scrollRef.current?.scrollTo({ x: (activeIndex.value + 1) * SCREEN_WIDTH });
  }, []);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Animated.ScrollView
        ref={scrollRef as any}
        horizontal
        pagingEnabled
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
      >
        {PAGES.map((item, index) => {
          return (
            <Page
              key={index}
              index={index}
              data={item}
              translateX={translateX}
            />
          );
        })}
      </Animated.ScrollView>
      <View
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          marginHorizontal: 20,
          marginBottom: 20,
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          {PAGES.map((_, idx) => (
            <Dot key={idx} index={idx} activeIndex={activeIndex} />
          ))}
        </View>
        <View>
          <Text
            style={{
              letterSpacing: 0.8,
            }}
          >
            VIEW BOARD
          </Text>
        </View>
        <View>
          <AntDesign name='right' size={60} onPress={onNext} />
        </View>
      </View>
    </View>
  );
}

interface PageProps {
  index: number;
  data: PageInterface;
  translateX: Animated.SharedValue<number>;
}
function Page({ data, translateX, index }: PageProps) {
  const inputRange = [
    (index - 1) * SCREEN_WIDTH,
    index * SCREEN_WIDTH,
    (index + 1) * SCREEN_WIDTH,
  ];

  const rSkateStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      inputRange,
      [-1, 0, 1],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        {
          rotate: `${rotate * Math.PI}rad`,
        },
      ],
    };
  }, []);

  const rCircleScale = useAnimatedStyle(() => {
    const scale = interpolate(
      translateX.value,
      inputRange,
      [2, 1, 2],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ scale }],
    };
  }, []);

  const rOpacityText = useAnimatedStyle(() => {
    const scale = interpolate(
      translateX.value,
      inputRange,
      [0, 1, 0],
      Extrapolate.CLAMP
    );
    const opacity = interpolate(
      translateX.value,
      inputRange,
      [0, 1, 0],
      Extrapolate.CLAMP
    );
    return {
      opacity,
      transform: [
        {
          scale,
        },
      ],
    };
  }, []);

  return (
    <View style={[{ flex: 1, width: SCREEN_WIDTH }]}>
      <View
        style={{
          marginVertical: 100,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Animated.View
          style={[
            {
              width: SCREEN_WIDTH * 0.5,
              height: SCREEN_WIDTH * 0.5,
              borderRadius: (SCREEN_WIDTH * 0.5) / 2,
              backgroundColor: '#fff',
            },
            rCircleScale,
          ]}
        />
        <Animated.View
          style={[
            {
              width: SCREEN_WIDTH * 0.2,
              height: SCREEN_WIDTH,
              position: 'absolute',
            },
            rSkateStyle,
          ]}
        >
          <Image
            source={data.source}
            style={{
              width: '100%',
              height: '100%',
            }}
            resizeMode='contain'
          />
        </Animated.View>
      </View>
      <Animated.View
        style={[
          {
            paddingHorizontal: 20,
          },
          rOpacityText,
        ]}
      >
        <Text
          style={{
            fontSize: 50,
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          {data.title}
        </Text>
        <Text
          style={{
            textAlign: 'center',
            marginTop: 10,
          }}
        >
          {data.description}
        </Text>
      </Animated.View>
    </View>
  );
}

interface DotProps {
  index: number;
  activeIndex: Animated.SharedValue<number>;
}
function Dot({ index, activeIndex }: DotProps) {
  const rStyle = useAnimatedStyle(() => {
    const isActive = index === activeIndex.value;
    return {
      backgroundColor: withTiming(isActive ? 'black' : 'white', {
        duration: 150,
      }),
    };
  });
  return (
    <Animated.View
      style={[
        {
          width: 20,
          height: 20,
          borderRadius: 10,
          marginRight: 5,
          borderColor: 'black',
          borderWidth: 1,
        },
        rStyle,
      ]}
    ></Animated.View>
  );
}
