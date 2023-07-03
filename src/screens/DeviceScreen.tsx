import React, { useEffect, useRef, useState } from 'react';
import { FlatList, View, ToastAndroid, StatusBar } from 'react-native';
import { Appbar, List, TextInput, useTheme } from 'react-native-paper';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import { useNavigation } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useBluetoothStore } from '../store';

interface Props extends StackScreenProps<RootStackParamList, 'DeviceScreen'> {}

export const DeviceScreen: React.FC<Props> = ({ route }) => {
  const [message, setMessage] = useState<string>('');
  const { device } = route.params;
  const navigator = useNavigation();
  const theme = useTheme();
  const listRef = useRef<FlatList>(null);
  const { entries, entryMode, clearEntries, toggleEntryMode } =
    useBluetoothStore();

  const onToggleEntryMode = () => {
    entryMode === 'ascii'
      ? ToastAndroid.show('Modo Bytes', 3000)
      : ToastAndroid.show('Modo ASCII', 3000);

    toggleEntryMode();
  };

  const onSentMessage = async (message: string) => {
    try {
      if (message.length === 0) return;

      await RNBluetoothClassic.writeToDevice(device.address, message, 'ascii');

      ToastAndroid.show('Mensaje enviado', 3000);
      setMessage('');
    } catch (error) {
      if (error instanceof Error) {
        ToastAndroid.show(error.message, 3000);
      }
      console.error({ error });
    }
  };

  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [entries]);

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
        <Appbar.Action icon="toggle-switch" onPress={onToggleEntryMode} />
      </Appbar.Header>

      <View style={{ flex: 1, paddingHorizontal: 12, paddingVertical: 16 }}>
        <FlatList
          ref={listRef}
          data={entries.filter(
            entries => entries.deviceAddress === device.address,
          )}
          renderItem={({ item }) => (
            <List.Item title={item.data} description={item.timestamp} />
          )}
        />

        <View style={{ height: 10 }} />

        <TextInput
          // autoFocus
          onChangeText={value => setMessage(value)}
          value={message}
          placeholder={`Send message to ${device.name}`}
          onSubmitEditing={() => onSentMessage(message)}
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
