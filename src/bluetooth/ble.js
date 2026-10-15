import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { BleManager } from "react-native-ble-plx";
import {
  requestMultiple,
  PERMISSIONS,
  RESULTS,
} from "react-native-permissions";
import { Buffer } from "buffer";
import { fromByteArray } from "base64-js";

const manager = new BleManager();


const serviceUUID = "00000000-0001-11e1-9ab4-0002a5d5c51b";
const characteristicUUID = "001d0000-0001-11e1-ac36-0002a5d5c51b";


const writeUUID = "00000000-000f-11e1-9ab4-0002a5d5c51b";
const characteristicwriteUUID = "00000002-000f-11e1-ac36-0002a5d5c51b";


const b64toHexString = (base64) => {
  const buffer = Buffer.from(base64, "base64");
  return Array.from(buffer)
    .map((byte) => byte.toString(16).padStart(2, "0").toUpperCase())
    .join("-");
};

const hexToB64 = (hex) => {
  const cleanHex = hex.replace(/[^0-9a-fA-F]/g, "");

  const bytes = cleanHex.match(/.{1,2}/g).map((byte) => {
    return parseInt(byte, 16);
  });

  return fromByteArray(Uint8Array.from(bytes));
};

export function BLE() {
  const [connectedDeviceId, setConnectedDeviceId] = useState(null);
  const [conectado, setConectado] = useState(false);
  const [ledState, setLedState] = useState(false);
  const [angulo, setAngulo] = useState("0");
  const [deviceID, setDeviceID] = useState(null);

 
  const verificarPermissaoBLE = async () => {
    try {
      if (Platform.OS === "android") {
        const perms =
          Platform.Version >= 31
            ? [
                PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
                PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
                PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
              ]
            : [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];

        const result = await requestMultiple(perms);
        const granted = Object.values(result).every(
          (v) => v === RESULTS.GRANTED,
        );
        if (!granted) console.warn("Permissões BLE negadas:", result);
        return granted;
      } else {
        const result = await requestMultiple([
          PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        ]);
        const granted = Object.values(result).every(
          (v) => v === RESULTS.GRANTED,
        );
        return granted;
      }
    } catch (e) {
      console.error("Erro ao pedir permissões BLE:", e);
      return false;
    }
  };


  useEffect(() => {
    const sub = manager.onStateChange((state) => {
      console.log("onStateChange:", state);
    }, true);
    return () => sub.remove();
  }, []);



  const monitorAngleCharacteristic = async (deviceIdParam) => {
    const id = deviceIdParam ?? connectedDeviceId ?? deviceID;

    if (!id) {
      console.warn("Sem deviceId para monitorar.");
      return;
    }

    manager.monitorCharacteristicForDevice(
      id,
      serviceUUID,
      characteristicUUID,
      (error, characteristic) => {
        if (error) {
          console.log("Erro no notify:", error);
          return;
        }

        if (!characteristic?.value) {
          console.warn("Characteristic sem valor.");
          return;
        }

        const hexValue = b64toHexString(characteristic.value);

        console.log("HEX recebido via NOTIFY:", hexValue);

        const buffer = Buffer.from(characteristic.value, "base64");
        const valor = buffer.readUInt16LE(10);
        console.log("Valor final (ângulo):", valor);
        setAngulo(valor);
      },
    );
  };

  const calibracao = async (deviceIdParam) => {
    const id = deviceIdParam ?? connectedDeviceId ?? deviceID;
    if (!id) {
      console.warn("Sem deviceId para escrita.");
      return;
    }

    const valorpreset = hexToB64("200000000200");

    try {
      console.log("Base64 enviado:", valorpreset);

      await manager.writeCharacteristicWithoutResponseForDevice(
        id,
        writeUUID,
        characteristicwriteUUID,
        valorpreset,
      );
    } catch (error) {
      console.log("Erro ao escrever dado do BLE:", error);
    }
  };

  const ligarLed = async (deviceIdParam) => {
    const id = deviceIdParam ?? connectedDeviceId ?? deviceID;

    if (!id) {
      console.warn("Sem deviceId para escrita.");
      return;
    }

    const valueB64 = hexToB64("200000000100");

    try {
      console.log("Base64 enviado:", valueB64);

      await manager.writeCharacteristicWithoutResponseForDevice(
        id,
        writeUUID,
        characteristicwriteUUID,
        valueB64,
      );

      setLedState(true);
      console.log("LED LIGADO");
    } catch (error) {
      console.log("Erro ao escrever dado do BLE:", error);
    }
  };

  const desligarLed = async (deviceIdParam) => {
    const id = deviceIdParam ?? connectedDeviceId ?? deviceID;

    if (!id) {
      console.warn("Sem deviceId para escrita.");
      return;
    }

    const valueB64 = hexToB64("200000000000");

    try {
      console.log("Base64 enviado:", valueB64);

      await manager.writeCharacteristicWithoutResponseForDevice(
        id,
        writeUUID,
        characteristicwriteUUID,
        valueB64,
      );

      setLedState(false);
      console.log("LED DESLIGADO");
    } catch (error) {
      console.log("Erro ao escrever dado do BLE:", error);
    }
  };


  const connect = async (deviceId) => {
    try {
      if (!deviceId) {
        console.warn("Sem deviceId para conectar.");
        return;
      }
      console.log("Connecting:", deviceId);

      const connectedDevice = await manager.connectToDevice(deviceId, {
        timeout: 10000,
      });
      console.log(
        "Connected to device:",
        connectedDevice.name || connectedDevice.id,
      );

      setConnectedDeviceId(connectedDevice.id);
      setConectado(true);

      await connectedDevice.discoverAllServicesAndCharacteristics();

      const services = await connectedDevice.services();
      console.log(
        "Serviços:",
        services.map((s) => s.uuid),
      );
      for (const s of services) {
        const chars = await connectedDevice.characteristicsForService(s.uuid);
        console.log(
          `Chars de ${s.uuid}:`,
          chars.map((c) => c.uuid),
        );
      }

      await monitorAngleCharacteristic(connectedDevice.id);
    } catch (error) {
      console.error("Erro durante a conexão:", error);
    }
  };


  const scan = async () => {
    console.log("Iniciando scan...");
    manager.startDeviceScan(null, null, async (error, device) => {
      if (error) {
        console.log("Erro no scan:", error.message);
        return;
      }
      if (!device?.name) return;

      console.log("Dispositivo:", device.name);

      if (device.name === "Embedded Lab") {
        console.log("BLE Encontrado", device.name);
        console.log("Device ID", device.id);

        manager.stopDeviceScan();
        setDeviceID(device.id);

        await connect(device.id);
      }
    });


    setTimeout(() => {
      manager.stopDeviceScan();
    }, 10000);
  };


  const conectar = async () => {
    const ok = await verificarPermissaoBLE();
    if (!ok) {
      console.warn("Conexão cancelada: sem permissões BLE.");
      return;
    }
    await scan();
  };


  const desconectar = async (deviceIdArg) => {
    const deviceIdToDisconnect = deviceIdArg ?? connectedDeviceId ?? deviceID;
    if (!deviceIdToDisconnect) {
      console.warn("Nenhum deviceId para desconectar.");
      return;
    }
    try {
      await manager.cancelDeviceConnection(deviceIdToDisconnect);
      setAngulo(0);
      setConectado(false);
      setConnectedDeviceId(null);
      console.log(`Device ${deviceIdToDisconnect} disconnected successfully.`);
    } catch (error) {
      console.error(
        `Error disconnecting device ${deviceIdToDisconnect}:`,
        error,
      );
    }
  };


  const handlePressConectar = () => {
    conectado ? desconectar() : conectar();
  };

  const handleLed = () => {
    ledState ? desligarLed() : ligarLed();
  };

  return {
  
    angulo,
    conectado,
    ledState,


    conectar,
    desconectar,
    monitorAngleCharacteristic,
    calibracao,
    handlePressConectar,
    handleLed,
  };
}
