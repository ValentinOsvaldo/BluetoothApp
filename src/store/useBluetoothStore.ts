import { create } from 'zustand';
import { BluetoothDevice } from 'react-native-bluetooth-classic';

type DeviceEntry = {
  deviceName: string;
  deviceAddress: string;
  data: string;
}

interface BluetoothState {
  devices: BluetoothDevice[];
  entries: DeviceEntry[];
  isScannning: boolean;
  connectedDevices: BluetoothDevice[];
  setIsScanning: (value: boolean) => void;
  setDevices: (devices: BluetoothDevice[]) => void;
  setEntry: (entry: DeviceEntry) => void;
  setConnectedDevice: (device: BluetoothDevice) => void;
  removeConnectedDevice: (address: string) => void;
}

export const useBluetoothStore = create<BluetoothState>(set => ({
  connectedDevices: [],
  devices: [],
  isScannning: false,
  entries: [],
  setIsScanning: (value: boolean) =>
    set(() => ({
      isScannning: value,
    })),
  setDevices: (devices: BluetoothDevice[]) =>
    set(() => ({
      devices: devices,
    })),
  setEntry: (entry: DeviceEntry) =>
    set(state => ({
      entries: [...state.entries, entry],
    })),
  setConnectedDevice: (device: BluetoothDevice) =>
    set(state => ({
      connectedDevices: [...state.connectedDevices, device],
    })),
  removeConnectedDevice: (address: string) =>
    set(state => ({
      connectedDevices: state.connectedDevices.filter(
        device => device.address === address,
      ),
    })),
}));
