import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<'TabOne'>) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('BasicBall');
        }}
      >
        <Text>Basic ball</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('PanGestureHandler');
        }}
      >
        <Text>PanGestureHandlerScreen</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('InterpolateScrollScreen');
        }}
      >
        <Text>InterpolateScrollScreen</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('PinchGestureHandlerScreen');
        }}
      >
        <Text>PinchGestureHandlerScreen</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('InterpolateColorScreen');
        }}
      >
        <Text>InterpolateColorScreen</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('DoubleTapHeartScreen');
        }}
      >
        <Text>DoubleTapHeartScreen</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('SwipeToDeleteScreen');
        }}
      >
        <Text>SwipeToDeleteScreen</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('CircularProgressScreen');
        }}
      >
        <Text>CircularProgressScreen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
