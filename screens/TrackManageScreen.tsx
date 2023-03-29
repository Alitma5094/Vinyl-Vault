import { View, StyleSheet, Pressable } from "react-native";
import { useState, useLayoutEffect } from "react";
import { TextInput, useTheme, Divider, Text, Button } from "react-native-paper";
import { Entypo, MaterialIcons } from "@expo/vector-icons";

function TrackManageScreen({ navigation, route }) {
  const theme = useTheme();
  const [trackValues, setTrackValues] = useState({
    title: route.params?.data ? route.params.data.title : "",
    length: {
      minuets: route.params?.data.length
        ? route.params.data.length.minuets
        : "",
      seconds: route.params?.data.length
        ? route.params.data.length.seconds
        : "",
    },
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params?.data ? "Update Track" : "Add Track",
    });
  }, [navigation, route.params?.data]);

  function cancelHandler() {
    navigation.goBack();
  }

  function submitHandler() {
    if (route.params?.data) {
      navigation.navigate({
        name: "RecordUpdate",
        params: { track: trackValues, trackID: route.params?.data.id },
        merge: true,
      });
    } else {
      navigation.navigate({
        name: "RecordUpdate",
        params: { track: trackValues },
        merge: true,
      });
    }
  }

  return (
    <View style={styles.container}>
      <Text>Title:</Text>
      <TextInput
        placeholder="New Track"
        value={trackValues.title}
        mode="outlined"
        onChangeText={(text) =>
          setTrackValues((currentValues) => {
            return { ...currentValues, title: text };
          })
        }
      />
      <Text>Length:</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TextInput
          placeholder="00"
          mode="outlined"
          maxLength={2}
          keyboardType="number-pad"
          style={styles.timeInput}
          value={trackValues.length.minuets}
          onChangeText={(text) =>
            setTrackValues((currentValues) => {
              return {
                ...currentValues,
                length: { ...currentValues.length, minuets: text },
              };
            })
          }
        />
        <Entypo name="dots-two-vertical" size={24} color="black" />
        <TextInput
          mode="outlined"
          style={styles.timeInput}
          placeholder="00"
          maxLength={2}
          keyboardType="number-pad"
          value={trackValues.length.seconds}
          onChangeText={(text) =>
            setTrackValues((currentValues) => {
              return {
                ...currentValues,
                length: { ...currentValues.length, seconds: text },
              };
            })
          }
        />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Button onPress={cancelHandler}>Cancel</Button>
        <Button onPress={submitHandler}>Save</Button>
      </View>
      {route.params?.data && (
        <View>
          <Divider style={{ height: 3 }} />
          <Pressable
            style={({ pressed }) => [
              pressed ? styles.pressed : null,
              { alignItems: "center" },
            ]}
            onPress={() => {
              navigation.navigate({
                name: "RecordUpdate",
                params: { delete: route.params.data.id },
                merge: true,
              });
            }}
          >
            <MaterialIcons
              name="delete"
              size={36}
              color={theme.colors.error}
              style={{ paddingTop: 15 }}
            />
          </Pressable>
        </View>
      )}
    </View>
  );
}

export default TrackManageScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  timeInput: {
    width: 55,
  },
  pressed: {
    opacity: 0.5,
  },
});
