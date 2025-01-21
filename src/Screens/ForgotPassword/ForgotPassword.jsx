import React, { useState } from "react";
import { View, Text, ScrollView, Image } from "react-native";
import CustomButton from "../../components/UIComponents/CustomButton/CustomButton";
import InputField from "../../components/UIComponents/InputField/InputField";
import { useApiCall } from "../../util/useApiCall";
import Toast from "react-native-toast-message";
import { styles } from "./styles";
import { useSelector } from "react-redux";

const ForgotPassword = ({ navigation }) => {
  const translation = useSelector((state) => state.session.translation);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const apiCall = useApiCall();

  const handleForgot = async () => {
    // setLoading(true);
    setEmailError("");

    if (!validateEmail(email)) {
      setEmailError(translation.PROFILE.EDIT.emailrequired);
      // setLoading(false);
      return;
    }

    // try {
    //   const result = await apiCall(`api/account/forgot/${email}`, "GET");
    //   if (result.status === 200) {
    //     Toast.show({
    //       type: "success",
    //       text1: "Email sent successfully!",
    //     });
    //   } else if (result.status === 404) {
    //     Toast.show({
    //       type: "error",
    //       text1: "Email not found!",
    //     });
    //   } else {
    //     Toast.show({
    //       type: "error",
    //       text1: "Something went wrong. Try again later!",
    //     });
    //   }
    // } catch (error) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Something went wrong. Try again later!",
    //   });
    // } finally {
    //   setLoading(false);
    // }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <ScrollView style={styles.container}>
      <View contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Image source={require("../../../assets/images/honk.png")} style={styles.headerImage} />
        </View>

        <Text style={styles.title}>Forgot your password?</Text>
        <Text style={styles.subtitle}>Enter your email to reset your password.</Text>

        <InputField
          placeholder={"Email"}
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          error_msg={emailError}
        />

        <CustomButton title="Send Reset Link" onPress={handleForgot} loading={loading} />

        <CustomButton
          title="Back to Login"
          onPress={() => navigation.navigate("Login")}
          variant="outlined"
          style={{ marginTop: 10 }}
        />
      </View>
    </ScrollView>
  );
};

export default ForgotPassword;
