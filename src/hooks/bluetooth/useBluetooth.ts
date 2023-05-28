import RNBluetoothClassic, {
  BluetoothDevice,
} from 'react-native-bluetooth-classic';
import { ToastAndroid } from 'react-native';
import { Buffer } from 'buffer';
import { requestPermissionsBluetooth } from '../../helpers';
import { useBluetoothStore } from '../../store';
import { base64ToArrayBuffer } from '../../utilities/base64ToArrayBuffer';

export const useBluetooth = () => {
  const {
    isScanning,
    devices,
    connectedDevices,
    entries,
    entryMode,
    bluetoothEvents,
    isBluetoothEnabled,
  } = useBluetoothStore(state => ({
    isScanning: state.isScannning,
    devices: state.devices,
    connectedDevices: state.connectedDevices,
    entries: state.entries,
    entryMode: state.entryMode,
    bluetoothEvents: state.bluetoothEvents,
    isBluetoothEnabled: state.isBluetoothEnabled,
  }));
  const {
    setIsScanning,
    setDevices,
    setEntry,
    setConnectedDevice,
    removeConnectedDevice,
    clearEntries,
    toggleEntryMode,
    setEvent,
    changeBluetoothStatus,
  } = useBluetoothStore();

  const startScanning = async () => {
    try {
      setIsScanning(true);
      const hasPermissions = await requestPermissionsBluetooth();

      if (!hasPermissions)
        throw Error('No se tiene todos los permisos necesarios');

      const devices = await RNBluetoothClassic.startDiscovery();
      setDevices(devices);
    } catch (error) {
      console.error({ error });
    } finally {
      setIsScanning(false);
    }
  };

  const cancelScanning = async () => {
    try {
      await RNBluetoothClassic.cancelDiscovery();
    } catch (error) {
      console.error({ error });
    }
  };

  const connectDevice = (device: BluetoothDevice): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        const isConnected = await device.connect({
          connectionType: 'binary',
        });

        if (!isConnected)
          throw Error('Error durante la conexión, reintente de nuevo');

        const onDataReceived = device.onDataReceived(({ data, timestamp }) => {
          if (entryMode === 'ascii') {
            setEntry({
              deviceAddress: device.address,
              deviceName: device.name,
              data: Buffer.from(data, 'base64').toString('ascii'),
              timestamp,
            });
            return;
          }

          const arrayBuffer = base64ToArrayBuffer(data);
          const uInt8Array = new Uint8Array(arrayBuffer);

          setEntry({
            deviceAddress: device.address,
            deviceName: device.name,
            data: uInt8Array.toString(),
            timestamp,
          });
        });
        setEvent(device.address, onDataReceived);

        const onDisconnected = RNBluetoothClassic.onDeviceDisconnected(
          (device: any) => {
            onDataReceived.remove();
            onDisconnected.remove();
            removeConnectedDevice(device.address);
            ToastAndroid.show(
              `${device.name} - ${device.address} se ha desconectado`,
              3000,
            );
          },
        );

        setConnectedDevice(device);

        resolve();
      } catch (error) {
        if (error instanceof Error) {
          ToastAndroid.show(error.message, 3000);
          reject(error.message);
        }
      }
    });
  };

  const disconnectDevice = (device: BluetoothDevice): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        const isDisconnected = await device.disconnect();
        bluetoothEvents[device.address].remove();

        removeConnectedDevice(device.address);

        if (!isDisconnected)
          throw Error('Error durante la conexión, reintente de nuevo');

        resolve();
      } catch (error) {
        if (error instanceof Error) {
          ToastAndroid.show(error.message, 3000);
          reject(error.message);
        }
      }
    });
  };

  const getIsDeviceConnected = async (
    device: BluetoothDevice,
  ): Promise<boolean> => {
    try {
      const isConnected = await device.isConnected();

      return isConnected;
    } catch (error) {
      if (error instanceof Error) {
        ToastAndroid.show(error.message, 3000);
      }

      console.error({ error });
      return false;
    }
  };

  const onChangeBluetoothStatus = (enabled: boolean) => {
    changeBluetoothStatus(enabled);
  };

  const turnOnBluetooth = async () => {
    try {
      const hasPermissions = await requestPermissionsBluetooth();

      if (!hasPermissions) throw new Error("Don't have permissions");

      const isBluetoothEnabled = await RNBluetoothClassic.requestBluetoothEnabled();

      if (!isBluetoothEnabled) throw new Error('Permissions denied');

      changeBluetoothStatus(isBluetoothEnabled);
    } catch (error) {
      console.error(error);
    }
  }

  return {
    connectedDevices,
    devices,
    entries,
    entryMode,
    isScanning,
    isBluetoothEnabled,
    startScanning,
    connectDevice,
    cancelScanning,
    disconnectDevice,
    getIsDeviceConnected,
    clearEntries,
    toggleEntryMode,
    onChangeBluetoothStatus,
    turnOnBluetooth
  };
};
