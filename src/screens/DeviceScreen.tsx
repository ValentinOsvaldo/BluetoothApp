import React, { useState } from 'react';
import { FlatList, View, ToastAndroid } from 'react-native';
import { Appbar, List, Text, TextInput, useTheme } from 'react-native-paper';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import { useNavigation } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useBluetoothStore } from '../store';

interface Props extends StackScreenProps<RootStackParamList, 'DeviceScreen'> {}

export const DeviceScreen: React.FC<Props> = ({ route }) => {
  const [message, setMessage] = useState<string>('Hola Mundo');
  const { address } = route.params;
  const navigator = useNavigation();
  const theme = useTheme();
  const { entries } = useBluetoothStore();

  const onSentMessage = async (message: string) => {
    try {
      if (message.length === 0) return;

      await RNBluetoothClassic.writeToDevice(address, message, 'binary');

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
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigator.goBack()} />
        <Appbar.Header>
          <Text variant="titleLarge">Dispositivo</Text>
        </Appbar.Header>
      </Appbar.Header>

      <View style={{ flex: 1, paddingHorizontal: 12, paddingVertical: 16 }}>
        <FlatList
          data={entries.filter(entries => entries.deviceAddress === address)}
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
