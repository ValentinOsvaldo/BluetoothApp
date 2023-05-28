import { create } from 'zustand';
import {
  BluetoothDevice,
  BluetoothEventSubscription,
} from 'react-native-bluetooth-classic';

type DeviceEntry = {
  deviceName: string;
  deviceAddress: string;
  data: string;
  timestamp: string;
};

interface BluetoothState {
  devices: BluetoothDevice[];
  entries: DeviceEntry[];
  isScannning: boolean;
  connectedDevices: BluetoothDevice[];
  bluetoothEvents: {
    [address: string]: BluetoothEventSubscription;
  };
  entryMode: 'bytes' | 'ascii';
  isBluetoothEnabled: boolean;
  clearEntries: (address: string) => void;
  removeConnectedDevice: (address: string) => void;
  setConnectedDevice: (device: BluetoothDevice) => void;
  setDevices: (devices: BluetoothDevice[]) => void;
  setEntry: (entry: DeviceEntry) => void;
  setIsScanning: (value: boolean) => void;
  toggleEntryMode: () => void;
  changeBluetoothStatus: (isEnabled: boolean) => void;
  setEvent: (address: string, event: BluetoothEventSubscription) => void;
}

export const useBluetoothStore = create<BluetoothState>(set => ({
  connectedDevices: [],
  devices: [],
  entries: [],
  entryMode: 'bytes',
  bluetoothEvents: {},
  isBluetoothEnabled: false,
  isScannning: false,
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
  toggleEntryMode: () =>
    set(state => ({
      entryMode: state.entryMode === 'bytes' ? 'ascii' : 'bytes',
    })),
  clearEntries: (address: string) =>
    set(state => ({
      entries: state.entries.filter(entry => entry.deviceAddress !== address),
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
  setEvent: (address: string, event: BluetoothEventSubscription) =>
    set(state => ({
      bluetoothEvents: {
        ...state.bluetoothEvents,
        [address]: event,
      },
    })),
  changeBluetoothStatus: (isEnabled: boolean) =>
    set((state) => ({
      isBluetoothEnabled: isEnabled,
    })),
}));
