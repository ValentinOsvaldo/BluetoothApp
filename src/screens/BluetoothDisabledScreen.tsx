import React from 'react';
import { View } from 'react-native';
import { Button, Title } from 'react-native-paper';
import { useBluetooth } from '../hooks/bluetooth';

export const BluetoothDisabledScreen = () => {
  const { turnOnBluetooth } = useBluetooth();

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        flex: 1,
      }}>
      <Title>Bluetooth is disabled</Title>
      <Button onPress={turnOnBluetooth}>Turn on bluetooth</Button>
    </View>
  );
};
