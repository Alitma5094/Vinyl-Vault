import { View, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useContext, useState, useCallback } from "react";
import { RecordContext } from "../store/record-context";
import { SegmentedButtons, TextInput, Text, Divider } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { Button } from "react-native-paper";
import { Record } from "../types/Record";

function RecordCreateScreen({ navigation }) {
  const recordCtx = useContext(RecordContext);

  const [inputValues, setInputValues] = useState({
    album: { value: "", isValid: true },
    artist: { value: "", isValid: true },
    description: { value: "", isValid: true },
    date_published: { value: new Date(), isValid: true },
    date_collected: { value: new Date(), isValid: true },
    rpm: { value: "", isValid: true },
  });

  useFocusEffect(
    useCallback(() => {
      return () => {
        setInputValues({
          album: { value: "", isValid: true },
          artist: { value: "", isValid: true },
          description: { value: "", isValid: true },
          date_published: { value: new Date(), isValid: true },
          date_collected: { value: new Date(), isValid: true },
          rpm: { value: "", isValid: true },
        });
      };
    }, [])
  );

  function inputChangeHandler(
    inputType: string,
    enteredValue: string | Date | undefined
  ) {
    setInputValues((currentInputs) => {
      return {
        ...currentInputs,
        [inputType]: { value: enteredValue, isValid: true },
      };
    });
  }

  function submitHandler() {
    const data = {
      album: inputValues.album.value,
      artist: inputValues.artist.value,
      description: inputValues.description.value,
      date_published: inputValues.date_published.value,
      rpm: inputValues.rpm.value,
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

    recordCtx.addRecord(data);
  }

  const formIsInvalid =
    !inputValues.album.isValid || !inputValues.artist.isValid;

  return (
    <View style={styles.container}>
      <View style={{ paddingVertical: 12, paddingHorizontal: 30 }}>
        <Button
          onPress={() => navigation.navigate("RecordFind", { mode: "scan" })}
          mode="contained"
        >
          Scan Barcode
        </Button>
      </View>

      <View style={{ paddingVertical: 5 }}>
        <Divider style={{ height: 3 }} />
      </View>

      <View style={{ paddingVertical: 12, paddingHorizontal: 30 }}>
        <Button
          onPress={() => navigation.navigate("RecordFind", { mode: "search" })}
          mode="contained"
        >
          Search Database
        </Button>
      </View>

      <View style={{ paddingVertical: 5 }}>
        <Divider style={{ height: 3 }} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          value={inputValues.album.value}
          onChangeText={(text) => inputChangeHandler("album", text)}
          mode="outlined"
          error={!inputValues.album.isValid}
          label="Album"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          value={inputValues.artist.value}
          onChangeText={(text) => inputChangeHandler("artist", text)}
          mode="outlined"
          error={!inputValues.artist.isValid}
          label="Artist"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          value={inputValues.description.value}
          onChangeText={(text) => inputChangeHandler("description", text)}
          mode="outlined"
          label="Description"
        />
      </View>
      <View style={[styles.inputContainer, styles.dateInputContainer]}>
        <Text>Date Published</Text>
        <DateTimePicker
          value={inputValues.date_published.value}
          onChange={(event, selectedDate) =>
            inputChangeHandler("date_published", selectedDate)
          }
        />
      </View>
      <View style={styles.inputContainer}>
        <Text>Record Speed</Text>
        <SegmentedButtons
          value={inputValues.rpm.value}
          onValueChange={(text) => inputChangeHandler("rpm", text)}
          style={styles.recordSpeedInput}
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
      <View style={styles.submitButton}>
        <Button onPress={submitHandler}>Submit</Button>
      </View>
    </View>
  );
}

export default RecordCreateScreen;

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
  submitButton: {
    paddingTop: 12,
  },
});
