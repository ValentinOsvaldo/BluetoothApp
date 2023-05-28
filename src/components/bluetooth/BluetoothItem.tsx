import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { BluetoothDevice } from 'react-native-bluetooth-classic';
import { Button, List, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useBluetooth } from '../../hooks/bluetooth';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

interface Props {
  device: BluetoothDevice;
}

export const BluetoothItem: React.FC<Props> = ({ device }) => {
  const { colors } = useTheme();
  const navigator = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {
    connectDevice,
    disconnectDevice,
    getIsDeviceConnected,
    connectedDevices,
  } = useBluetooth();
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

  const onPressItem = () => {
    navigator.navigate('DeviceScreen', {
      device: {
        address: device.address,
        name: device.name,
      },
    });
  };

  useEffect(() => {
    getIsDeviceConnected(device).then(isConnected => setIsConnect(isConnected));
  }, [isConnecting, connectedDevices]);

  return (
    <List.Item
      title={device.name}
      description={device.address}
      // onPress={onPressItem}
      right={() => (
        <>
          {isConnect ? (
            <View style={{ flexDirection: 'row-reverse' }}>
              <Button
                onPress={() => onDisconnectDevice(device)}
                loading={isConnecting}
                buttonColor={colors.error}
                disabled={isConnecting}
                textColor="white">
                Disconnect
              </Button>
              <View style={{ width: 16 }} />
              <Button mode="contained" onPress={onPressItem}>
                View
              </Button>
            </View>
          ) : (
            <Button
              mode="contained-tonal"
              onPress={() => onConnectDevice(device)}
              loading={isConnecting}
              disabled={isConnecting}>
              Connect
            </Button>
          )}
        </>
      )}
    />
  );
};
