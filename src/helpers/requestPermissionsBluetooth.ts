import { PermissionsAndroid, Platform } from 'react-native';
import { PERMISSIONS, requestMultiple } from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';

export const requestPermissionsBluetooth = async (): Promise<Boolean> => {
  if (Platform.OS !== 'android') return false;

  const apiLevel = await DeviceInfo.getApiLevel();

  if (apiLevel <= 30) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'Bluetooth Low Energy requires Location',
        buttonNeutral: 'Ask Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  const result = await requestMultiple([
    PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
    PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
    PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  ]);

  return (
    result['android.permission.BLUETOOTH_CONNECT'] ===
      PermissionsAndroid.RESULTS.GRANTED &&
    result['android.permission.BLUETOOTH_SCAN'] ===
      PermissionsAndroid.RESULTS.GRANTED &&
    result['android.permission.BLUETOOTH_ADVERTISE'] ===
      PermissionsAndroid.RESULTS.GRANTED &&
    result['android.permission.ACCESS_FINE_LOCATION'] ===
      PermissionsAndroid.RESULTS.GRANTED
  );
};
