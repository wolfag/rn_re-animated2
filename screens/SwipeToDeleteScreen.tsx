import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerProps,
} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { RootStackScreenProps } from '../types';
import { FontAwesome } from '@expo/vector-icons';

const TITLES = [
  'Record the dismissible tutorial 🎥',
  'Leave 👍🏼 to the video',
  'Check YouTube comments',
  'Subscribe to the channel 🚀',
  'Leave a ⭐️ on the GitHub Repo',
];

interface TaskInterface {
  title: string;
  index: number;
}

const TASKS: TaskInterface[] = TITLES.map((title, index) => ({ title, index }));

const { width: SCREEN_WIDTH } = Dimensions.get('screen');
const BACKGROUND_COLOR = '#FAFBFF';
const LIST_TITLE_HEIGHT = 70;
const TRANSLATE_X_THRESHOLD = -SCREEN_WIDTH * 0.3;

const SwipeToDeleteScreen = (
  props: RootStackScreenProps<'SwipeToDeleteScreen'>
) => {
  const [tasks, setTasks] = useState(TASKS);
  const scrollRef = useRef(null);

  const onDismiss = useCallback(
    (task: TaskInterface) => {
      setTasks(tasks.filter((item) => item.index !== task.index));
    },
    [tasks]
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Task</Text>
      <ScrollView ref={scrollRef} style={{ flex: 1 }}>
        {tasks.map((item) => {
          return (
            <ListTitle
              simultaneousHandlers={scrollRef}
              key={item.index}
              task={item}
              onDismiss={onDismiss}
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SwipeToDeleteScreen;

interface ListTitleProps
  extends Pick<PanGestureHandlerProps, 'simultaneousHandlers'> {
  task: TaskInterface;
  onDismiss?: (task: TaskInterface) => void;
}

function ListTitle({ task, onDismiss, simultaneousHandlers }: ListTitleProps) {
  const translationX = useSharedValue(0);
  const itemHeight = useSharedValue(LIST_TITLE_HEIGHT);
  const marginVertical = useSharedValue(10);
  const opacity = useSharedValue(1);

  const panHandle = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: (event) => {
      translationX.value = event.translationX;
    },
    onEnd: () => {
      if (translationX.value < TRANSLATE_X_THRESHOLD) {
        translationX.value = withTiming(-SCREEN_WIDTH);
        itemHeight.value = withTiming(0);
        marginVertical.value = withTiming(0);
        opacity.value = withTiming(0, undefined, (isFinished) => {
          if (isFinished && onDismiss) {
            runOnJS(onDismiss)(task);
          }
        });
      } else {
        translationX.value = withTiming(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translationX.value }],
  }));

  const opacityStyle = useAnimatedStyle(() => {
    const opacity = withTiming(
      translationX.value < TRANSLATE_X_THRESHOLD ? 1 : 0
    );

    return { opacity };
  });

  const taskContainerStyle = useAnimatedStyle(() => {
    return {
      height: itemHeight.value,
      marginVertical: marginVertical.value,
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[styles.taskContainer, taskContainerStyle]}>
      <Animated.View style={[styles.iconContainer, opacityStyle]}>
        <FontAwesome name='trash' size={LIST_TITLE_HEIGHT * 0.4} color='red' />
      </Animated.View>
      <PanGestureHandler
        simultaneousHandlers={simultaneousHandlers}
        onGestureEvent={panHandle}
      >
        <Animated.View style={[styles.task, animatedStyle]}>
          <Text style={styles.taskTitle}>{task.title}</Text>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  title: {
    fontSize: 60,
    marginVertical: 20,
    paddingLeft: '5%',
  },
  taskContainer: {
    width: '100%',
    alignItems: 'center',
  },
  task: {
    width: '90%',
    height: LIST_TITLE_HEIGHT,

    justifyContent: 'center',
    paddingLeft: 20,
    backgroundColor: '#fff',
    borderRadius: 10,

    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 10,
    shadowOpacity: 0.05,
    elevation: 5,
  },
  taskTitle: {
    fontSize: 16,
  },
  iconContainer: {
    height: LIST_TITLE_HEIGHT,
    width: LIST_TITLE_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: '10%',
  },
});
