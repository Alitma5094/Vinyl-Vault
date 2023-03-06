import { View, FlatList, StyleSheet } from "react-native";
import RecordItem from "../components/RecordItem";
import { useContext } from "react";
import { RecordContext } from "../store/record-context";

function RecordListScreen({ navigation }) {
  const recordCtx = useContext(RecordContext);

  function renderRecordItem(itemData) {
    return (
      <RecordItem
        album={itemData.item.album}
        artist={itemData.item.artist}
        coverUrl={itemData.item.coverUrl}
        onPress={() =>
          navigation.navigate("RecordDetail", { id: itemData.item.id })
        }
      />
    );
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={recordCtx.records}
        keyExtractor={(item) => item.id}
        renderItem={renderRecordItem}
        numColumns={2}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "left",
        }}
      />
    </View>
  );
}

export default RecordListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});
