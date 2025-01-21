const colors = {
  primary: "#7f0f82",
  secondary: "#f5f5f5",
  text: "#333",
  muted: "#aab2bd",
  error: "#ff0000",
  white: "#fff",
  blue: "#07b1ff",
  blueBackground: "#e6f7ff",
  blueBorder: "#c1ecff",
  black: "#000",
};

export const theme = {
  colors,

  typography: {
    heading: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
      textTransform: "uppercase",
      color: colors.text,
      marginVertical: 10,
      fontFamily: "Sofia-Pro-Bold",
    },

    subHeading: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      fontFamily: "Sofia-Pro-Medium",
    },

    text: {
      fontSize: 16,
      fontWeight: "normal",
      color: colors.text,
      fontFamily: "Sofia-Pro-Regular",
    },

    caption: {
      fontSize: 14,
      color: colors.muted,
      marginVertical: 10,
      fontFamily: "Sofia-Pro-Regular",
      lineHeight: 18,
    },
  },

  container: {
    backgroundColor: colors.secondary,
    padding: 20,
  },

  button: {
    disabled: {
      opacity: 0.5,
    },
    contained: {
      backgroundColor: colors.primary,
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
    },

    outlined: {
      borderWidth: 1,
      borderColor: colors.primary,
      backgroundColor: "transparent",
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
    },

    textContained: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.white,
      textTransform: "capitalize",
      textAlign: "center",
      fontFamily: "Sofia-Pro-Bold",
    },

    textOutlined: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.primary,
      textTransform: "capitalize",
      textAlign: "center",
      fontFamily: "Sofia-Pro-Bold",
    },
  },
};
