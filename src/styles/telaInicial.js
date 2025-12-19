import { StyleSheet } from "react-native";

export const telaStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#85C555",
    alignItems: "center",
    justifyContent: "space-between",
  },
  Logo: { width: 350, height: 150, marginTop: 20 },
  infoBox: { alignItems: "center", marginTop: 20 },
  angleBox: { flexDirection: "row", alignItems: "flex-start", marginTop: 10 },
  titleText: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 2,
  },
  angleText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "red",
    lineHeight: 40,
  },
  textSup: {
    fontSize: 20,
    fontWeight: "bold",
    color: "red",
    lineHeight: 18,
    marginLeft: 2,
  },
  footer: { paddingBottom: 20, alignItems: "center", width: "100%" },
  botao: { padding: 10, borderRadius: 10, width: 200 },
  textoBotao: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
});
