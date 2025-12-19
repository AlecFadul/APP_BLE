import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { BleManager } from "react-native-ble-plx";
import { requestMultiple, PERMISSIONS, RESULTS } from "react-native-permissions";
import { Buffer } from "buffer";
import { fromByteArray } from "base64-js";

const manager = new BleManager();

// UUIDs completos
const serviceUUID = "0000181c-0000-1000-8000-00805f9b34fb"; // 181C
const characteristicUUID = "00002c08-0000-1000-8000-00805f9b34fb"; // 2C08

const writeUUID = "00001815-0000-1000-8000-00805f9b34fb"; // 1815
const characteristicwriteUUID = "00001525-1212-efde-1523-785feabcd123";

// helper para montar base64
const toB64 = (n) => fromByteArray(Uint8Array.from([n & 0xff]));

export function BLE() {
  const [connectedDeviceId, setConnectedDeviceId] = useState(null);
  const [conectado, setConectado] = useState(false);
  const [ledState, setLedState] = useState(false);
  const [angulo, setAngulo] = useState(0);
  const [deviceID, setDeviceID] = useState(null);

  // Permissões BLE
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
          (v) => v === RESULTS.GRANTED
        );
        if (!granted) console.warn("Permissões BLE negadas:", result);
        return granted;
      } else {
        const result = await requestMultiple([
          PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        ]);
        const granted = Object.values(result).every(
          (v) => v === RESULTS.GRANTED
        );
        return granted;
      }
    } catch (e) {
      console.error("Erro ao pedir permissões BLE:", e);
      return false;
    }
  };

  // Observa estado do BLE (ligado/desligado no sistema)
  useEffect(() => {
    const sub = manager.onStateChange((state) => {
      console.log("onStateChange:", state);
    }, true);
    return () => sub.remove();
  }, []);

  // Ler characteristic
  const readCharacteristic = async (deviceIdParam) => {
    const id = deviceIdParam ?? connectedDeviceId ?? deviceID;
    if (!id) {
      console.warn("Sem deviceId para leitura.");
      return;
    }
    try {
      const readData = await manager.readCharacteristicForDevice(
        id,
        serviceUUID,
        characteristicUUID
      );
      const rawValue = readData.value; // base64
      const buffer = Buffer.from(rawValue, "base64");
      const valor = buffer.readUInt16BE(0);
      console.log("Valor Recebido:", valor);
      setAngulo(valor);
    } catch (error) {
      console.log("Erro ao ler dado do BLE:", error);
    }
  };

  // Escrever LED ON/OFF
  const ligarLed = async (on, deviceIdParam) => {
    const id = deviceIdParam ?? connectedDeviceId ?? deviceID;
    if (!id) {
      console.warn("Sem deviceId para escrita.");
      return;
    }
    const valueB64 = toB64(on ? 0 : 1);
    try {
      console.log("Base64 enviado:", valueB64);
      await manager.writeCharacteristicWithoutResponseForDevice(
        id,
        writeUUID,
        characteristicwriteUUID,
        valueB64
      );
      setLedState(true);
      console.log("LED", on ? "DESLIGADO" : "LIGADO");
    } catch (error) {
      console.log("Erro ao escrever dado do BLE:", error);
    }
  };

  const desligarLed = async (on, deviceIdParam) => {
    const id = deviceIdParam ?? connectedDeviceId ?? deviceID;
    if (!id) {
      console.warn("Sem deviceId para escrita.");
      return;
    }
    const valueB64 = toB64(on ? 1 : 0);
    try {
      console.log("Base64 enviado:", valueB64);
      await manager.writeCharacteristicWithoutResponseForDevice(
        id,
        writeUUID,
        characteristicwriteUUID,
        valueB64
      );
      setLedState(false);
      console.log("LED", on ? "LIGADO" : "DESLIGADO");
    } catch (error) {
      console.log("Erro ao escrever dado do BLE:", error);
    }
  };

  // Conectar recebendo o id
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
        connectedDevice.name || connectedDevice.id
      );

      setConnectedDeviceId(connectedDevice.id);
      setConectado(true);

      await connectedDevice.discoverAllServicesAndCharacteristics();

      const services = await connectedDevice.services();
      console.log("Serviços:", services.map((s) => s.uuid));
      for (const s of services) {
        const chars = await connectedDevice.characteristicsForService(s.uuid);
        console.log(`Chars de ${s.uuid}:`, chars.map((c) => c.uuid));
      }

      await readCharacteristic(connectedDevice.id);
    } catch (error) {
      console.error("Erro durante a conexão:", error);
    }
  };

  // Scan
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

    // Segurança: parar o scan após 10s
    setTimeout(() => {
      manager.stopDeviceScan();
    }, 10000);
  };

  // Conectar (fluxo completo)
  const conectar = async () => {
    const ok = await verificarPermissaoBLE();
    if (!ok) {
      console.warn("Conexão cancelada: sem permissões BLE.");
      return;
    }
    await scan();
  };

  // Desconectar
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
      console.error(`Error disconnecting device ${deviceIdToDisconnect}:`, error);
    }
  };

  // Handlers que a tela vai usar
  const handlePressConectar = () => {
    conectado ? desconectar() : conectar();
  };

  const handleLed = () => {
    ledState ? desligarLed() : ligarLed();
  };

  return {
    // estados
    angulo,
    conectado,
    ledState,

    // ações
    conectar,
    desconectar,
    readCharacteristic,
    handlePressConectar,
    handleLed,
  };
}
