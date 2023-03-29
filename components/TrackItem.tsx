import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, useTheme } from "react-native-paper";

export default function TrackItem({ name, length, onEdit, titleLabel }: {name: string, length: {minuets: number, seconds: number}, onEdit: Function, titleLabel: string}) {
  const theme = useTheme();
  let displaylength = <></>;
  if (length.minuets && length.seconds) {
    displaylength = (
      <>
        <Text style={{ paddingHorizontal: 5, textAlign: "right" }}>
          Length:
        </Text>
        <Text>
          {length.minuets}:{length.seconds}
        </Text>
      </>
    );
  }

  return (
    <View
      style={{
        paddingVertical: 12,
        paddingLeft: 5,
        flexDirection: "row",
      }}
    >
      <View style={{ flexDirection: "row", flex: 2 }}>
        <Text style={{ paddingRight: 5 }}>
          {titleLabel ? titleLabel : "Title:"}
        </Text>
        <Text style={{ flex: 1 }}>{name}</Text>
      </View>
      <View style={{ flexDirection: "row", flex: 1 }}>{displaylength}</View>

      {onEdit && (
        <Pressable
          android_ripple={{ color: "#ccc" }}
          style={({ pressed }) => [
            pressed ? styles.pressed : null,
            { justifyContent: "flex-end", paddingRight: 10 },
          ]}
          onPress={onEdit}
        >
          <MaterialIcons name="edit" size={16} color={theme.colors.secondary} />
        </Pressable>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  pressed: {
    opacity: 0.5,
  },
});
