import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

function Button({ route }: { route: keyof ReactNavigation.RootParamList }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(route);
      }}
      style={{
        backgroundColor: 'rgba(0,0,256,0.8)',
        padding: 20,
        marginBottom: 10,
        borderRadius: 20,
      }}
    >
      <Text style={{ color: '#fff' }}>{route}</Text>
    </TouchableOpacity>
  );
}

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<'TabOne'>) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button route='BasicBall' />
      <Button route='PanGestureHandler' />
      <Button route='InterpolateScrollScreen' />
      <Button route='PinchGestureHandlerScreen' />
      <Button route='InterpolateColorScreen' />
      <Button route='DoubleTapHeartScreen' />
      <Button route='SwipeToDeleteScreen' />
      <Button route='CircularProgressScreen' />
      <Button route='IntroScreen' />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
