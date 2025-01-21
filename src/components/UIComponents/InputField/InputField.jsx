import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { theme } from "../../../util/theme";
import { styles } from "./style";

const InputField = ({
  title,
  description,
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  error_msg,
  multiline = false,
  numberOfLines = 1,
  style,
}) => {
  return (
    <View style={styles.inputContainer}>
      {title && <Text style={theme.typography.heading}>{title}</Text>}
      {description && <Text style={theme.typography.caption}>{description}</Text>}
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        style={[multiline ? styles.multiLineText : styles.input, style]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        placeholderTextColor="#8c8c8c"
        borderColor={error_msg ? "red" : "#ddd"}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        selectionColor={theme.colors.primary}
      />

      {error_msg && <Text style={styles.error}>{error_msg}</Text>}
    </View>
  );
};

export default InputField;
