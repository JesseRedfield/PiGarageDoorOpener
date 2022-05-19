import { StyleSheet, Dimensions, View, StatusBar } from "react-native";
import TitleBar from "./TitleBar";
import React from "react";
import GarageItemContainer from "./GarageItemContainer";

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
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  });

  React.useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
      });
    }, 1000);


    Dimensions.addEventListener("change", debouncedHandleResize);
   
    return () => {
      Dimensions.removeEventListener("change", debouncedHandleResize)
    };
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1B8E99" barStyle='light-content' hidden={false}/>
      <TitleBar />
      <GarageItemContainer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF2629",
  },
});
