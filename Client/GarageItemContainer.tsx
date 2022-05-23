import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Dimensions,
  Image,
} from "react-native";
import React from "react";
import { GarageDoor, Item, Light } from "./garageItems";

const URI = "http://localhost:9000";
const API_KEY = "0000-0000-0000-0000";

export default function GarageDoorContainer() {
  const [data, setData] = React.useState<Item[]>([]);
  const [recheck, setRecheck] = React.useState(true);
  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let interval = null;
    if (!isLoading) {
      console.log("starting interval");
      interval = setInterval(() => {
        setRecheck(true);
      }, 10 * 1000);
    } else if (interval != null) {
      clearInterval(interval);
    }
  }, [isLoading]);

  React.useEffect(() => {
    if (isLoading || recheck) {
      console.log("fetching");
      fetch(`${URI}/api/status/${API_KEY}`)
        .then((response) => response.json())
        .then((json) => {
          setData(json);
          console.log(JSON.stringify(json));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          setLoading(false);
          setRecheck(false);
        });
    }
  }, [recheck]);

  return <View style={styles.container}>{GetItems(data)}</View>;

  function buildItemRow(items: Item[]) {
    return items.map((item) => (
      <View style={styles.doorItem}>
        <TouchableHighlight
          onPress={() => {
            fetch(
              item.type == "door"
                ? `${URI}/api/trigger/${API_KEY}/${item.name}`
                : `${URI}/api/switch/${API_KEY}/${item.name}`
            );
            setRecheck(true);
          }}
        >
          {item.type == "door" ? (
            <Image
              source={
                (item as GarageDoor).isOpen
                  ? require("./assets/GarageDoorOpen.png")
                  : require("./assets/GarageDoorClosed.png")
              }
              style={styles.image}
            />
          ) : (
            <Image
              source={
                (item as Light).isOn
                  ? require("./assets/LightOn.png")
                  : require("./assets/LightOff.png")
              }
              style={styles.image}
            />
          )}
        </TouchableHighlight>
        <Text numberOfLines={1} adjustsFontSizeToFit style={styles.text}>
          {item.description}
        </Text>
      </View>
    ));
  }

  function GetItems(items: Item[]) {
    const rows: JSX.Element[] = [];

    for (var i = 0; i < items.length; i += 2) {
      rows.push(
        <View style={styles.row}>{buildItemRow(items.slice(i, i + 2))}</View>
      );
    }
    return rows;
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    backgroundColor: "#232629",
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#232629",
    alignItems: "flex-start",
    height:
      0.03 * Dimensions.get("window").width +
      0.45 * Dimensions.get("window").width,
  },
  doorItem: {
    flexDirection: "column",
    backgroundColor: "#232629",
    width: 0.5 * Dimensions.get("window").width,
    height:
      0.035 * Dimensions.get("window").width +
      0.4 * Dimensions.get("window").width,
  },
  text: {
    flex: 1,
    color: "#fff",
    fontSize: 0.03 * Dimensions.get("window").width,
    textAlign: "center",
    textAlignVertical: "top",
    width: 0.5 * Dimensions.get("window").width,
  },
  image: {
    alignSelf: "center",
    width: 0.4 * Dimensions.get("window").width,
    height: 0.4 * Dimensions.get("window").width,
  },
});
