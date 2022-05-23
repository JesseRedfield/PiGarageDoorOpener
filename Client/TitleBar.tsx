import { StyleSheet, Text, View, Dimensions } from "react-native";
import React from "react";

export default function TitleBar() {
  return (
    <View style={styles.container}>
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.text}>
        Door Opener
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 0.12 * Dimensions.get("window").width,
    backgroundColor: "#1B8E99",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    textAlign: "center",
    fontSize: 0.1 * Dimensions.get("window").width,
    width: "100%",
  },
});
