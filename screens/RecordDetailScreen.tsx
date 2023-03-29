import { View, StyleSheet, FlatList, Image } from "react-native";
import { useLayoutEffect, useContext, useState, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RecordContext } from "../store/record-context";
import { HeaderBackButton } from "@react-navigation/elements";
import TrackItem from "../components/TrackItem";
import { Divider, Text, Button } from "react-native-paper";
import { SafeAreaView } from "react-native";
import { Record } from "../types/Record";
import { useNavigation, useRoute } from "@react-navigation/native";

function RecordDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const recordCtx = useContext(RecordContext);
  const { record } = route.params;

  // const [recordItem, setRecordItem] = useState(
  //   recordCtx.records.find((record: Record) => record.id === route.params.id)
  // );
  const [recordItem, setRecordItem] = useState(record);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: record.album,
      headerLeft: () => (
        <HeaderBackButton
          label="Back"
          onPress={() => navigation.navigate("RecordList")}
          labelVisible={true}
        />
      ),
    });
  }, [navigation, record.album]);

  useEffect(() => {
    const updatedRecordItem = recordCtx.records.find(
      (record: Record) => record.id === recordItem.id
    );
    setRecordItem(updatedRecordItem);
  }, [recordCtx.records, recordItem.id]);

  function deleteHandler() {
    navigation.goBack();
    recordCtx.deleteRecord(recordItem.id);
  }

  function updateHandler() {
    navigation.navigate("RecordUpdate", { id: recordItem.id });
  }

  return (
    <SafeAreaView>
      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.albumArt}>
            <View style={{ flex: 1 }}>
              {recordItem.coverUrl ? (
                <Image
                  source={{ uri: recordItem.coverUrl }}
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <View style={styles.innerAlbumArt}>
                  <MaterialCommunityIcons
                    name="music-circle"
                    size={124}
                    color="lightgrey"
                  />
                </View>
              )}
            </View>
          </View>
          <View style={{ paddingRight: 16, flex: 2 }}>
            <Text style={styles.albumText}>{recordItem.album}</Text>

            <Text style={styles.artistText}>{recordItem.artist}</Text>
            {recordItem.rpm && <Text>RPM: {recordItem.rpm}</Text>}
          </View>
        </View>
        <View>
          {recordItem.date_published instanceof Date &&
            !isNaN(recordItem.date_published.valueOf()) && (
              <Text>
                Date Published: {recordItem.date_published.toLocaleDateString()}
              </Text>
            )}
          {recordItem.description && <Text>{recordItem.description}</Text>}
        </View>
        <View style={{ flexDirection: "row" }}>
          <Button onPress={deleteHandler} mode="text">
            Delete
          </Button>
          <Button onPress={updateHandler} mode="text">
            Update
          </Button>
        </View>
        <FlatList
          data={recordItem.tracks}
          renderItem={(itemData) => (
            <TrackItem
              name={itemData.item.title}
              length={itemData.item.length}
              titleLabel={itemData.index + 1}
            />
          )}
          keyExtractor={(item) => item.id}
          bounces={false}
          ItemSeparatorComponent={() => <Divider />}
          ListHeaderComponent={() => <Divider />}
        />
      </View>
    </SafeAreaView>
  );
}

export default RecordDetailScreen;

const styles = StyleSheet.create({
  albumArt: {
    marginRight: 14,
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
  innerAlbumArt: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "grey",
  },
  albumText: {
    fontWeight: "bold",
    fontSize: 24,
    flexShrink: 1,
  },
  artistText: {
    fontSize: 24,
  },
});
