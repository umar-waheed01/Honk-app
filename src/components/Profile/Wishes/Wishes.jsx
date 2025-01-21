import { View, StyleSheet, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import InputField from "./../../UIComponents/InputField/InputField";
import CustomButton from "./../../UIComponents/CustomButton/CustomButton";
import { useApiCall } from "../../../util/useApiCall";
import { theme } from "../../../util/theme";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

export default function Wishes() {
  const translation = useSelector((state) => state.session.translation);
  const apiCall = useApiCall();
  const [loading, setLoading] = useState(false);
  const DATA = [
    {
      key: "deathMessage",
      title: translation.PROFILE.EDIT.wishesdeathmessage,
      description: translation.PROFILE.EDIT.wishesdeathmessageinfo,
    },
    {
      key: "online",
      title: translation.PROFILE.EDIT.wishesonline,
      description: translation.PROFILE.EDIT.wishesonlineinfo,
    },
    {
      key: "funeral",
      title: translation.PROFILE.EDIT.wishesfuneral,
      description: translation.PROFILE.EDIT.wishesfuneralinfo,
    },
    {
      key: "music",
      title: translation.PROFILE.EDIT.wishesmusic,
      description: translation.PROFILE.EDIT.wishesmusicinfo,
    },
    {
      key: "testament",
      title: translation.PROFILE.EDIT.wishestestament,
      description: translation.PROFILE.EDIT.wishestestamentinfo,
    },
    {
      key: "insurance",
      title: translation.PROFILE.EDIT.wishesinsurance,
      description: translation.PROFILE.EDIT.wishesinsuranceinfo,
    },
    {
      key: "information",
      title: translation.PROFILE.EDIT.wishesinformation,
      description: translation.PROFILE.EDIT.wishesinformationinfo,
    },
  ];

  const [formFields, setFormFields] = useState({
    online: "",
    funeral: "",
    music: "",
    deathMessage: "",
    information: "",
    insurance: "",
    testament: "",
  });

  useEffect(() => {
    getWishes();
  }, []);

  const getWishes = async () => {
    try {
      const result = await apiCall("api/users/me/wishes", "GET");
      const data = await result.json();
      setFormFields(data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: translation.ERRORS.genericerror,
      });
    }
  };

  const updateWishes = async () => {
    setLoading(true);
    try {
      const result = await apiCall("api/users/me/wishes", "PUT", formFields);
      if (result.status == 200) {
        Toast.show({
          type: "success",
          text1: translation.SUCCESS.wishessaved,
        });
      } else {
        Toast.show({
          type: "error",
          text1: translation.ERRORS.genericerror,
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: translation.ERRORS.genericerror,
      });
    } finally {
      setLoading(false);
    }
  };

  const stateSetter = (key, e) => {
    setFormFields((prev) => ({ ...prev, [key]: e }));
  };

  return (
    <View style={theme.container}>
      {DATA.map((obj, index) => {
        return (
          <InputField
            title={obj.title}
            description={obj.description}
            key={index}
            multiline={true}
            numberOfLines={10}
            value={formFields[obj.key]}
            onChangeText={(e) => stateSetter(obj.key, e)}
          />
        );
      })}
      <CustomButton
        title={translation.GLOBAL.save}
        onPress={updateWishes}
        style={{ marginVertical: 10 }}
        loading={loading}
      />
    </View>
  );
}
