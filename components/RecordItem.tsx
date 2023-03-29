import { Pressable, View, StyleSheet, Platform, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "react-native-paper";

function RecordItem({
  album,
  onPress,
  artist,
  coverUrl,
}: {
  album: string;
  onPress: Function;
  artist: string;
  coverUrl: string;
}) {
  function cutText(text: string, chars: number) {
    // Move to utils folder
    if (text.length > chars) {
      return text.slice(0, chars - 1) + "...";
    } else {
      return text;
    }
  }
  // console.log(album, artist);

  return (
    <View style={{ paddingBottom: 10 }}>
      <View style={styles.gridItem}>
        <Pressable
          android_ripple={{ color: "#ccc" }}
          style={({ pressed }) => [
            styles.button,
            pressed ? styles.buttonPressed : null,
          ]}
          onPress={onPress}
        >
          {coverUrl ? (
            <Image
              source={{ uri: coverUrl }}
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <View style={[styles.innerContainer, { backgroundColor: "grey" }]}>
              <MaterialCommunityIcons
                name="music-circle"
                size={124}
                color="lightgrey"
              />
            </View>
          )}
        </Pressable>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{cutText(album, 18)}</Text>
        <Text style={styles.subTitle}>{cutText(artist, 22)}</Text>
      </View>
    </View>
  );
}

export default RecordItem;

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    margin: 14,
    marginBottom: 7,
    height: 160,
    width: 160,
    borderRadius: 8,
    elevation: 4,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOpacity: 0.25,
    overflow: Platform.OS === "android" ? "hidden" : "visible",
  },
  button: {
    flex: 1,
  },
  buttonPressed: {
    opacity: 0.5,
  },
  innerContainer: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  subTitle: {
    fontSize: 14,
  },
  textContainer: {
    marginLeft: 14,
  },
});
