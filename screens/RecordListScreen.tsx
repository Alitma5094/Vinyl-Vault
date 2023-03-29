import { View, FlatList, StyleSheet } from "react-native";
import RecordItem from "../components/RecordItem";
import { useContext } from "react";
import { RecordContext } from "../store/record-context";

function RecordListScreen({ navigation }) {
  const recordCtx = useContext(RecordContext);

  console.log(recordCtx.records);

  return (
    <View style={styles.container}>
      <FlatList
        data={recordCtx.records}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
          <RecordItem
            album={itemData.item.album}
            artist={itemData.item.artist}
            coverUrl={itemData.item.coverUrl}
            onPress={() =>
              navigation.navigate("RecordDetail", { record: itemData.item })
            }
          />
        )}
        numColumns={2}
        contentContainerStyle={{
          justifyContent: "space-evenly",
          alignItems: "center",
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
