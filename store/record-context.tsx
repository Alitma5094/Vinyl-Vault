import { createContext, useReducer, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Record } from "../types/Record";
import uuid from "react-native-uuid";
import { ReactElement } from "react";

export const RecordContext = createContext({
  records: Array<Record>,
  addRecord: (record: {
    album: string;
    artist: string;
    description: string;
    date_published: Date;
    rpm: string;
  }) => {},
  deleteRecord: (id: string) => {},
  updateRecord: (newData: Record) => {},
  setRecords: () => {},
});

function recordsReducer(state, action) {
  switch (action.type) {
    case "add": {
      const newState = [
        { ...action.data.record, id: action.data.id },
        ...state,
      ];
      AsyncStorage.setItem("records", JSON.stringify(newState));
      return newState;
    }
    case "update": {
      const updatableRecordIndex = state.findIndex(
        (record: Record) => record.id === action.data.id
      );
      const updatedRecords = [...state];
      updatedRecords[updatableRecordIndex] = action.data;
      AsyncStorage.setItem("records", JSON.stringify(updatedRecords));
      return updatedRecords;
    }
    case "delete": {
      const newState = state.filter(
        (record: Record) => record.id !== action.data
      );
      AsyncStorage.setItem("records", JSON.stringify(newState));
      return newState;
    }
    case "set":
      // AsyncStorage.setItem("records", JSON.stringify([]));
      return action.data;
    default:
      return state;
  }
}

export function RecordContextProvider({
  children,
}: {
  children: ReactElement;
}) {
  const navigation = useNavigation();
  const [recordState, dispatch] = useReducer(recordsReducer, []);

  useEffect(() => {
    async function getRecords() {
      const storedRecords = await AsyncStorage.getItem("records");
      if (storedRecords) {
        dispatch({ type: "set", data: JSON.parse(storedRecords) });
      }
    }
    getRecords();
  }, []);

  async function addRecord(recordData: {
    album: string;
    artist: string;
    description: string;
    date_published: Date;
    rpm: string;
  }) {
    const id = uuid.v4();
    dispatch({ type: "add", data: { id: id, record: recordData } });
    navigation.navigate("RecordDetail", { id: id });
  }

  function deleteRecord(id: string) {
    dispatch({ type: "delete", data: id });
  }

  function updateRecord(recordData: Record) {
    dispatch({ type: "update", data: recordData });
  }

  function setRecords(recordData: Array<Record>) {
    dispatch({ type: "set", data: recordData });
  }

  const value = {
    records: recordState,
    addRecord: addRecord,
    deleteRecord: deleteRecord,
    updateRecord: updateRecord,
    setRecords: setRecords,
  };

  return (
    <RecordContext.Provider value={value}>{children}</RecordContext.Provider>
  );
}
