import React, { useState } from 'react';
import { FlatList, View, ToastAndroid, StatusBar } from 'react-native';
import { Appbar, List, Text, TextInput, useTheme } from 'react-native-paper';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import { useNavigation } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useBluetoothStore } from '../store';

interface Props extends StackScreenProps<RootStackParamList, 'DeviceScreen'> {}

export const DeviceScreen: React.FC<Props> = ({ route }) => {
  const [message, setMessage] = useState<string>('Hola Mundo');
  const { device } = route.params;
  const navigator = useNavigation();
  const theme = useTheme();
  const { entries, entryMode, clearEntries, toggleEntryMode } = useBluetoothStore();

  const onToggleEntryMode = () => {
    (entryMode === 'ascii')
      ? ToastAndroid.show('Modo Bytes', 3000)
      : ToastAndroid.show('Modo ASCII', 3000)
    
    toggleEntryMode();
  }

  const onSentMessage = async (message: string) => {
    try {
      if (message.length === 0) return;

      await RNBluetoothClassic.writeToDevice(device.address, message, 'binary');

      ToastAndroid.show('Mensaje enviado', 3000);
      setMessage('');
    } catch (error) {
      if (error instanceof Error) {
        ToastAndroid.show(error.message, 3000);
      }
      console.error({ error });
    }
  };

  return (
    <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
      />
      <Appbar.Header mode="center-aligned">
        <Appbar.BackAction onPress={() => navigator.goBack()} />
        <Appbar.Content title={device.name} />
        <Appbar.Action
          icon="delete"
          onPress={() => clearEntries(device.address)}
        />
        <Appbar.Action
          icon="toggle-switch"
          onPress={onToggleEntryMode}
        />
      </Appbar.Header>

      <View style={{ flex: 1, paddingHorizontal: 12, paddingVertical: 16 }}>
        <FlatList
          data={entries.filter(
            entries => entries.deviceAddress === device.address,
          )}
          renderItem={({ item }) => <List.Item title={item.data} />}
        />

        <View style={{ height: 10 }} />

        <TextInput
          autoFocus
          onChangeText={value => setMessage(value)}
          value={message}
          right={
            <TextInput.Icon
              icon="send"
              onPress={() => onSentMessage(message)}
            />
          }
        />
      </View>
    </View>
  );
};
