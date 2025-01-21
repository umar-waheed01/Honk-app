import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { theme } from "../../../util/theme";

const CustomButton = ({
  title,
  onPress,
  loading,
  style,
  variant = "contained",
  disabled,
  textTransform = "none",
}) => {
  const buttonStyles = [
    disabled || loading ? theme.button.disabled : "",
    variant === "outlined" ? theme.button.outlined : theme.button.contained,
    style,
  ];
  const textStyles =
    variant === "outlined" ? theme.button.textOutlined : theme.button.textContained;

  return (
    <TouchableOpacity style={buttonStyles} onPress={onPress} disabled={loading || disabled}>
      {loading ? (
        <ActivityIndicator
          color={variant === "outlined" ? theme.colors.primary : theme.colors.white}
        />
      ) : (
        <Text style={[textStyles, { textTransform: textTransform }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
