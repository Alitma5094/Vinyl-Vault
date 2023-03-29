import {
  View,
  FlatList,
  Pressable,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import {
  searchDiscogsBarcode,
  fetchDiscogsRecord,
  searchDiscogs,
} from "../utils/http";
import RecordScanner from "../components/RecordScanner";
import { RecordContext } from "../store/record-context";
import TrackItem from "../components/TrackItem";
import { TextInput, Text, Button } from "react-native-paper";

function RecordFindPage({ navigation, route }) {
  const [showScan, setShowScan] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showList, setShowList] = useState(false);

  const [album, setAlbum] = useState("");
  const [artist, setArtist] = useState("");

  const [fetchedRecords, setFetchedRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState({});
  const recordCtx = useContext(RecordContext);

  const debounceDelay = 1000;
  let debounceTimer;

  useEffect(() => {
    async function getReocrds() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        setFetchedRecords(await searchDiscogs(album, artist));
      }, debounceDelay);
    }
    getReocrds();
  }, [album, artist]);

  useEffect(() => {
    if (route.params.mode == "scan") {
      setShowScan(true);
    } else if (route.params.mode == "search") {
      setShowSearch(true);
      setShowList(true);
    }
  }, []);

  function previewPage() {
    function saveHandler() {
      recordCtx.addRecord({ ...selectedRecord });
      navigation.goBack();
    }

    return (
      <View>
        <View style={{ flexDirection: "row", padding: 16 }}>
          <View style={styles.albumArt}>
            <View style={{ flex: 1 }}>
              <Image
                source={{ uri: selectedRecord.coverUrl }}
                style={{ width: "100%", height: "100%" }}
              />
            </View>
          </View>
          <View style={{ paddingRight: 16, flex: 2 }}>
            <Text style={styles.albumText}>{selectedRecord.album}</Text>
            <Text style={styles.artistText}>{selectedRecord.artist}</Text>
            {selectedRecord.rpm && <Text>RPM: {selectedRecord.rpm}</Text>}
          </View>
        </View>

        <View>
          {selectedRecord.date_published instanceof Date &&
            !isNaN(selectedRecord.date_published.valueOf()) && (
              <Text>
                Date Published:
                {selectedRecord.date_published.toLocaleDateString()}
              </Text>
            )}
        </View>
        <View style={{ flexDirection: "row" }}>
          <Button onPress={() => navigation.goBack()}>Cancel</Button>
          <Button onPress={saveHandler} mode="text">
            Save
          </Button>
        </View>
        <ScrollView style={{ height: 400 }}>
          {selectedRecord.tracks.map((track) => (
            <TrackItem
              name={track.title}
              length={track.length}
              key={track.id}
            />
          ))}
        </ScrollView>
      </View>
    );
  }

  function recordList() {
    async function recordPressedHandler(recordId) {
      setSelectedRecord(await fetchDiscogsRecord(recordId));
      setShowSearch(false);
      setShowList(false);
      setShowPreview(true);
    }

    function recordOptionItem(itemData) {
      return (
        <Pressable
          android_ripple={{ color: "#ccc" }}
          style={({ pressed }) => [
            pressed ? { opacity: 0.5 } : null,
            {
              borderBottomWidth: 1,
              flexDirection: "row",
              paddingVertical: 15,
            },
          ]}
          onPress={async () => recordPressedHandler(itemData.item.id)}
        >
          <View style={{ paddingRight: 10 }}>
            <Image
              source={{ uri: itemData.item.coverUrl }}
              style={{
                width: 150,
                height: 150,
              }}
            />
          </View>
          <View>
            <Text>{itemData.item.title}</Text>
            <Text>{itemData.item.artist}</Text>
            <Text>{itemData.item.year}</Text>
            <Text>{itemData.item.country}</Text>
          </View>
        </Pressable>
      );
    }
    return (
      <FlatList
        data={fetchedRecords}
        keyExtractor={(item) => item.id}
        renderItem={recordOptionItem}
      />
    );
  }

  function scanPage() {
    async function scanHandler(barcode) {
      const result = await searchDiscogsBarcode(barcode);
      setFetchedRecords(result);
      setShowScan(false);
      setShowList(true);
    }

    return (
      <View>
        <View style={{ padding: 16, alignItems: "center" }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              justifyContent: "center",
            }}
          >
            Point your camera at the barcode found on your record sleeve.
          </Text>
        </View>
        <RecordScanner onScan={scanHandler} />
      </View>
    );
  }
  function searchPage() {
    return (
      <View>
        <Text>Search Screen</Text>
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "50%", paddingRight: 6 }}>
            <TextInput
              placeholder="Album"
              onChangeText={(input) => setAlbum(input)}
              value={album}
            />
          </View>
          <View style={{ width: "50%", paddingLeft: 6 }}>
            <TextInput
              placeholder="Artist"
              onChangeText={(input) => setArtist(input)}
              value={artist}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ padding: 16 }}>
      {showScan && scanPage()}
      {showSearch && searchPage()}
      {showList && recordList()}
      {showPreview && previewPage()}
    </View>
  );
}

export default RecordFindPage;

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
    fontSize: 32,
  },
  artistText: {
    fontSize: 24,
  },
});
