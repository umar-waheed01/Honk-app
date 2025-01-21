import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { theme } from "../../../util/theme";
import { styles } from "./style";
import { useSelector } from "react-redux";

const DatePicker = ({ date, setDate, validateAge, label }) => {
  const [showPicker, setShowPicker] = useState(false);

  const translation = useSelector((state) => state.session.translation);
  const currentLocale =
    translation === "nl" ? require("date-fns/locale/nl") : require("date-fns/locale/en-US");

  const onChange = (event, selectedDate) => {
    setShowPicker(false);

    if (event.type === "set" && selectedDate) {
      const currentDate = selectedDate;
      setDate({
        day: currentDate.getDate(),
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
      });

      validateAge();
    }
  };

  return (
    <View style={styles.pickerContainer}>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <Text style={styles.buttonText}>{label}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={new Date(date.year, date.month, date.day)}
          mode="date"
          display="spinner"
          onChange={onChange}
          fontFamily="Sofia-Pro-Bold"
          maximumDate={new Date()}
          textColor={theme.colors.primary}
          accentColor={theme.colors.primary}
          locale={currentLocale.code}
        />
      )}
      <Text style={styles.selectedDate}>
        Selected Date: {`${date.day}-${date.month}-${date.year}`}
      </Text>
    </View>
  );
};

export default DatePicker;
