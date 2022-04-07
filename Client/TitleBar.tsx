import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function TitleBar() {
  const styles = StyleSheet.create({
    container: {
      width: "100%",
      height: 0.055 * innerWidth,
      backgroundColor: "#1B8E99",
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      color: "#fff",
      textAlign: "center",
      fontSize: 0.05 * innerWidth,
      width: "100%",
    },
  });

  return (
    <View style={styles.container}>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={styles.text}
      >
        Door Opener
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}


