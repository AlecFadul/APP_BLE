import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BLE } from "../bluetooth/ble";
import { telaStyles as styles } from "../styles/telaInicial";

export default function Tela() {
  const {
    angulo,
    conectado,
    ledState,
    handlePressConectar,
    handleLed,
    readCharacteristic,
  } = BLE();

  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.Logo}
        source={require("../../assets/logo_embedded_lab_Rev0A.png")}
      />

      <View style={styles.infoBox}>
        <Text style={styles.titleText}>Embedded Lab IFSP</Text>
        <Text style={styles.titleText}>Campus São Paulo</Text>
        <Text style={styles.titleText}>Brasil</Text>

        <View style={styles.angleBox}>
          <Text style={styles.angleText}>{angulo}</Text>
          <Text style={styles.textSup}>o</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handlePressConectar}
          style={[
            styles.botao,
            { backgroundColor: conectado ? "#3e4095" : "#f58634" },
          ]}
        >
          <Text
            style={[
              styles.textoBotao,
              { color: conectado ? "#f58634" : "#3e4095" },
            ]}
          >
            {conectado ? "Desconectar" : "Conectar"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleLed}
          style={[
            styles.botao,
            { backgroundColor: ledState ? "#aaffaa" : "#ffdddd" },
          ]}
        >
          <Text style={[styles.textoBotao, { color: "#3e4095" }]}>
            {ledState ? "Desligar LED" : "Ligar LED"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => readCharacteristic()}
          style={[styles.botao, { backgroundColor: "#ffe100ff" }]}
        >
          <Text style={[styles.textoBotao, { color: "#3e4095" }]}>
            Ler Valor BLE
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
