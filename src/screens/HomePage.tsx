import React, { useEffect } from 'react';
import { FlatList, StatusBar, View } from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  Button,
  Text,
  useTheme,
} from 'react-native-paper';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import { useBluetooth } from '../hooks/bluetooth';
import { BluetoothItem } from '../components/bluetooth';
import { BluetoothDisabledScreen } from './BluetoothDisabledScreen';

export const HomePage = () => {
  const theme = useTheme();
  const {
    startScanning,
    cancelScanning,
    isScanning,
    devices,
    onChangeBluetoothStatus,
    isBluetoothEnabled,
  } = useBluetooth();

  useEffect(() => {
    RNBluetoothClassic.isBluetoothEnabled()
      .then(value =>
        onChangeBluetoothStatus(value),
      );
  }, []);

  useEffect(() => {
    const listener = RNBluetoothClassic.onStateChanged(event => {
      console.log(event);
      onChangeBluetoothStatus(event.enabled);
    });

    return () => listener.remove();
  }, []);

  return (
    <View
      style={{
        paddingHorizontal: 12,
        paddingVertical: 16,
        flex: 1,
        backgroundColor: theme.colors.background,
      }}>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
      />
      <Appbar.Header mode="center-aligned">
        <Appbar.Content title="Bluetooth App" />
      </Appbar.Header>
      <>
        {isBluetoothEnabled ? (
          <>
            {isScanning ? (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <ActivityIndicator size={50} />
              </View>
            ) : (
              <FlatList
                data={Array.from(devices)}
                renderItem={({ item }) => <BluetoothItem device={item} />}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                ListEmptyComponent={
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text>The list is empty</Text>
                  </View>
                }
              />
            )}

            {!isScanning ? (
              <Button
                onPress={startScanning}
                disabled={isScanning}
                mode="contained">
                Start Scanning
              </Button>
            ) : (
              <Button
                onPress={cancelScanning}
                mode="contained"
                buttonColor={theme.colors.error}
                textColor="white">
                Cancel Scanning
              </Button>
            )}
          </>
        ) : (
          <BluetoothDisabledScreen />
        )}
      </>
    </View>
  );
};
