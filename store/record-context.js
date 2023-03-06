import { createContext, useReducer, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

export const RecordContext = createContext({
  records: [],
  addRecord: ({ album, artist, description, date_published, rpm }) => {},
  deleteRecord: ({ id }) => {},
  updateRecord: (id, { album, artist, description, date_published, rpm }) => {},
  setRecords: () => {},
});

function recordsReducer(state, action) {
  switch (action.type) {
    case "add": {
      const newState = [{ ...action.data, id: action.id }, ...state];
      AsyncStorage.setItem("records", JSON.stringify(newState));
      return newState;
    }
    case "update": {
      const updatableExpenseIndex = state.findIndex(
        (expense) => expense.id === action.data.id
      );
      const updatableExpense = state[updatableExpenseIndex];
      const updatedItem = { ...updatableExpense, ...action.data.data };
      const updatedExpenses = [...state];
      updatedExpenses[updatableExpenseIndex] = updatedItem;
      AsyncStorage.setItem("records", JSON.stringify(updatableExpense));
      return updatedExpenses;
    }
    case "delete": {
      const newState = state.filter((expense) => expense.id !== action.data);
      AsyncStorage.setItem("records", JSON.stringify(newState));
      return newState;
    }
    case "set":
      return action.data;
    default:
      return state;
  }
}

export function RecordContextProvider({ children }) {
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

  async function addRecord(recordData) {
    console.log(recordData);
    const id = uuid.v4();
    dispatch({ type: "add", data: recordData, id: id });
    navigation.navigate("RecordDetail", { id: id });
  }

  function deleteRecord(id) {
    dispatch({ type: "delete", data: id });
  }

  function updateRecord(id, recordData) {
    dispatch({ type: "update", data: { id: id, data: recordData } });
  }

  function setRecords(expenseData) {
    dispatch({ type: "set", data: expenseData });
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
