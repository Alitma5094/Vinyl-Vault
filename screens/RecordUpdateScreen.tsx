import { Button, View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useContext, useState, useLayoutEffect, useEffect } from "react";
import { RecordContext } from "../store/record-context";
import {
  SegmentedButtons,
  Card,
  TextInput,
  Divider,
  Text,
  useTheme,
} from "react-native-paper";
import TrackItem from "../components/TrackItem";
import uuid from "react-native-uuid";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Record } from "../types/Record";

function RecordUpdateScreen({ route, navigation }) {
  const recordCtx = useContext(RecordContext);
  const theme = useTheme();

  const recordItem: Record = recordCtx.records.find(
    (record: Record) => record.id === route.params.id
  )!;

  useEffect(() => {
    if (route.params?.delete) {
      deleteTrack(route.params.delete);
    } else if (route.params?.track) {
      if (route.params?.trackID) {
        trackChangeHandler({
          ...route.params?.track,
          id: route.params?.trackID,
        });
      } else {
        addTrack(route.params?.track.title, route.params?.track.length);
      }
    }
  }, [route.params]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Update ${recordItem.album}`,
    });
  }, [navigation, recordItem.album]);

  const [inputValues, setInputValues] = useState({
    album: { value: recordItem.album, isValid: true },
    artist: { value: recordItem.artist, isValid: true },
    description: {
      value: recordItem.description ? recordItem.description : "",
      isValid: true,
    },
    rpm: { value: recordItem.rpm ? recordItem.rpm : "", isValid: true },
    tracks: recordItem.tracks ? recordItem.tracks : [],
  });

  function inputChangeHandler(inputType: string, enteredValue: string) {
    setInputValues((currentInputs) => {
      return {
        ...currentInputs,
        [inputType]: { value: enteredValue, isValid: true },
      };
    });
  }

  function submitHandler() {
    const recordData: Record = {
      id: recordItem.id,
      album: inputValues.album.value,
      artist: inputValues.artist.value,
      description: inputValues.description.value,
      rpm: inputValues.rpm.value,
      tracks: inputValues.tracks,
    };

    let albumIsValid = inputValues.album.value.length > 0;
    let artistIsValid = inputValues.artist.value.length > 0;

    if (!albumIsValid || !artistIsValid) {
      setInputValues((currentInputs) => {
        return {
          ...currentInputs,
          album: { value: currentInputs.album.value, isValid: albumIsValid },
          artist: { value: currentInputs.artist.value, isValid: albumIsValid },
        };
      });
      return;
    }

    recordCtx.updateRecord(recordData);
    navigation.goBack();
  }

  const formIsInvalid =
    !inputValues.album.isValid || !inputValues.artist.isValid;

  function trackChangeHandler(trackData) {
    setInputValues((currentInputs) => {
      const updatableTrackIndex = currentInputs.tracks.findIndex(
        (track) => track.id === trackData.id
      );
      const updatedTracks = [...currentInputs.tracks];
      updatedTracks[updatableTrackIndex] = trackData;
      return {
        ...currentInputs,
        tracks: updatedTracks,
      };
    });
  }

  function deleteTrack(id: string) {
    setInputValues((currentInputs) => {
      return {
        ...currentInputs,
        tracks: currentInputs.tracks.filter((track) => track.id !== id),
      };
    });
  }

  function addTrack(title: string, length) {
    setInputValues((currentInputs) => {
      currentInputs.tracks.push({
        id: uuid.v4(),
        title: title,
        length: length,
      });
      return {
        ...currentInputs,
      };
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text>Album*</Text>
        <TextInput
          value={inputValues.album.value}
          onChangeText={(text) => inputChangeHandler("album", text)}
          mode="outlined"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text>Artist*</Text>
        <TextInput
          value={inputValues.artist.value}
          onChangeText={(text) => inputChangeHandler("artist", text)}
          mode="outlined"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text>Description</Text>
        <TextInput
          value={inputValues.description.value}
          onChangeText={(text) => inputChangeHandler("description", text)}
          mode="outlined"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text>Record Speed</Text>
        <SegmentedButtons
          value={inputValues.rpm.value}
          onValueChange={(text) => inputChangeHandler("rpm", text)}
          buttons={[
            {
              value: "33 1/3",
              label: "33 1/3",
            },
            {
              value: "45",
              label: "45",
            },
            { value: "78", label: "78" },
          ]}
        />
      </View>

      <Card>
        <Card.Title
          title="Track Listings"
          right={() => (
            <Pressable onPress={() => navigation.navigate("TrackManage")}>
              <MaterialCommunityIcons
                name="plus"
                size={24}
                color={theme.colors.secondary}
              />
            </Pressable>
          )}
        />
        <Card.Content>
          <ScrollView style={{ height: 150 }}>
            {inputValues.tracks.map((track) => (
              <View key={track.id}>
                <TrackItem
                  name={track.title}
                  length={track.length}
                  onDelete={deleteTrack.bind(this, track.id)}
                  onEdit={() =>
                    navigation.navigate("TrackManage", { data: track })
                  }
                />
                <Divider />
              </View>
            ))}
          </ScrollView>
        </Card.Content>
      </Card>

      <Button title="Submit" onPress={submitHandler} />
      {formIsInvalid && <Text>Invalid Input.</Text>}
    </View>
  );
}

export default RecordUpdateScreen;

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  inputContainer: {
    paddingVertical: 5,
  },
  dateInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
  },
  recordSpeedInput: {
    paddingTop: 12,
  },
});
