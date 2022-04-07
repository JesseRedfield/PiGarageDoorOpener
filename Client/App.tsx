import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import TitleBar from "./TitleBar";
import React from "react";
import GarageDoorContainer from "./GarageDoorContainer";

function debounce(fn: () => void, ms:number) {
  let timer:number | null = null;

  return () => {
    if (timer) clearTimeout(timer);

    timer = setTimeout((_) => {
      timer = null;

      fn();
    }, ms);
  };
}

export default function App() {
  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  React.useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }, 1000);

    window.addEventListener("resize", debouncedHandleResize);

    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  });

  return (
    <View style={styles.container}>
      <TitleBar />
      <GarageDoorContainer />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
