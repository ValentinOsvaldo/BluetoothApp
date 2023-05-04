import React from 'react';
import { FlatList, View } from 'react-native';
import { ActivityIndicator, Button, Text, useTheme } from 'react-native-paper';
import { useBluetooth } from '../hooks/bluetooth';
import { BluetoothItem } from '../components/bluetooth';

export const HomePage = () => {
  const theme = useTheme();
  const { startScanning, cancelScanning, isScanning, devices } = useBluetooth();

  return (
    <View
      style={{
        paddingHorizontal: 12,
        paddingVertical: 16,
        flex: 1,
        backgroundColor: theme.colors.background,
      }}>
      {isScanning ? (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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
        <Button onPress={startScanning} disabled={isScanning} mode="contained">
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
    </View>
  );
};
