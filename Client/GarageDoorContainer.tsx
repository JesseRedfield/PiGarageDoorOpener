import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} from "react-native";
import React from "react";
import { GarageDoor } from "./garageDoor";

export default function GarageDoorContainer() {
  const [data, setData] = React.useState<GarageDoor[]>([]);
  const [recheck, setRecheck] = React.useState(true);
  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let interval = null;
    if (!isLoading && !recheck) {
      console.log("starting interval");
      interval = setInterval(() => {
        setRecheck(true);
      }, 60 * 1000);
    } else if (interval != null) {
      clearInterval(interval);
    }
  }, [isLoading, recheck]);

  React.useEffect(() => {
    if (isLoading || recheck) {
      console.log("fetching");
      fetch("https://garage.jred840.net/api/doors/0000-0000-0000-0000")
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

  return <View style={styles.container}>{GetDoors(data)}</View>;
}

function buildDoorRow(doors: GarageDoor[]) {
  return doors.map((door) => (
    <View style={styles.doorItem}>
      <TouchableHighlight
        onPress={() => {

          fetch(
            `https://garage.jred840.net/api/trigger/0000-0000-0000-0000/${door.doorName}`
          );
        }}
      >
        <Image
          source={require("./assets/GarageDoorClosed.png")}
          style={{
            alignSelf: "center",
            width: 0.25 * innerWidth,
            height: 0.25 * innerWidth,
          }}
        />
      </TouchableHighlight>
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.text}>
        {door.doorDescription}
      </Text>
    </View>
  ));
}

function GetDoors(doors: GarageDoor[]) {
  const rows: JSX.Element[] = [];

  for (var i = 0; i < doors.length; i += 3) {
    rows.push(
      <View style={styles.row}>{buildDoorRow(doors.slice(i, i + 3))}</View>
    );
  }
  return rows;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "stretch",
    backgroundColor: "#232629",
  },
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "flex-start",
    alignSelf: "stretch",
    backgroundColor: "#232629",
  },
  doorItem: {
    flex: 1,
    alignSelf: "stretch",
  },
  text: {
    color: "#fff",
    fontSize: 0.03 * innerWidth,
    textAlign: "center",
  },
});
