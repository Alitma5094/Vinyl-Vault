import { TextInput, Text, View, StyleSheet } from "react-native";

function Input({ title, value, valid }) {
  const textStyle = [];

  if (!valid) {
    textStyle.push(styles.errorText);
  }

  return (
    <View>
      <Text>{title}</Text>
      <TextInput value={value} style={textStyle} />
    </View>
  );
}

export default Input;

const styles = StyleSheet.create({
  errorText: {
    color: "red",
  },
});
