import React, { useState, useEffect } from 'react';
import { BluetoothDevice } from 'react-native-bluetooth-classic';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useBluetooth } from '../../hooks/bluetooth';
import { View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

interface Props {
  device: BluetoothDevice;
}

export const BluetoothItem: React.FC<Props> = ({ device }) => {
  const { colors } = useTheme();
  const navigator = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { connectDevice, disconnectDevice, getIsDeviceConnected } =
    useBluetooth();
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isConnect, setIsConnect] = useState<boolean>(false);

  const onConnectDevice = async (device: BluetoothDevice) => {
    try {
      setIsConnecting(true);
      await connectDevice(device);
    } catch (error) {
      console.error({ error });
    } finally {
      setIsConnecting(false);
    }
  };

  const onDisconnectDevice = async (device: BluetoothDevice) => {
    try {
      setIsConnecting(true);
      await disconnectDevice(device);
    } catch (error) {
      console.error({ error });
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    getIsDeviceConnected(device).then(isConnected => setIsConnect(isConnected));
  }, []);

  return (
    <Card>
      <Card.Content>
        <Text variant="titleLarge">{device.name}</Text>
        <Text variant="bodySmall">{device.address}</Text>
      </Card.Content>
      <Card.Actions>
        {isConnect ? (
          <>
            <Button
              onPress={() => onDisconnectDevice(device)}
              loading={isConnecting}
              buttonColor={colors.error}
              textColor="white">
              Disconnect
            </Button>
            <View style={{ width: 10 }} />
            <Button
              onPress={() =>
                navigator.navigate('DeviceScreen', { address: device.address })
              }
              mode="contained">
              Go to device
            </Button>
          </>
        ) : (
          <Button
            onPress={() => onConnectDevice(device)}
            loading={isConnecting}>
            Connect
          </Button>
        )}
      </Card.Actions>
    </Card>
  );
};
