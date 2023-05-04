import { createStackNavigator } from '@react-navigation/stack';
import { DeviceScreen, HomePage } from '../screens';
import { BluetoothDevice } from 'react-native-bluetooth-classic';

export type RootStackParamList = {
  HomeScreen: undefined;
  DeviceScreen: {
    device: {
      address: string;
      name: string;
    };
  };
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeScreen" component={HomePage} />
      <Stack.Screen name="DeviceScreen" component={DeviceScreen} />
    </Stack.Navigator>
  );
};
