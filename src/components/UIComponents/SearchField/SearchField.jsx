import React from "react";
import { View, Text, TextInput } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { styles } from "./style";

const SearchField = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  error_msg,
}) => {
  return (
    <View style={styles.inputContainer}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.inputWrapper, error_msg && styles.errorInputWrapper]}>
        <Feather name="search" size={24} color="black" style={styles.icon} />

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          placeholderTextColor="#8c8c8c"
        />
      </View>

      {error_msg && <Text style={styles.error}>{error_msg}</Text>}
    </View>
  );
};

export default SearchField;
