import React, { useState } from "react";
import { View, Text, ScrollView, Image } from "react-native";
import InputField from "../../components/UIComponents/InputField/InputField.jsx";
import CustomButton from "../../components/UIComponents/CustomButton/CustomButton.jsx";
// import DatePicker from "../../components/UIComponents/DatePicker/Datepicker.jsx";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useApiCall } from "../../util/useApiCall";
import { styles } from "./style.js";
import { useSelector } from "react-redux";
import { replaceName } from "./../../util/functions.jsx";
import { auth } from "../../../Firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";

const SignUp = () => {
  const db = getFirestore();
  const translation = useSelector((state) => state.session.translation);
  const apiCall = useApiCall();
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // const [date, setDate] = useState({
  //   day: new Date().getDate(),
  //   month: new Date().getMonth(),
  //   year: new Date().getFullYear(),
  // });

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  // const [dateError, setDateError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!validateFields()) return;
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;

      await setDoc(doc(db, "appUsers", user.uid), {
        name,
        email,
        uid: user.uid,
        // dob: `${date.day}-${date.month + 1}-${date.year}`,
        createdAt: new Date().toISOString(),
      });

      Toast.show({
        type: "success",
        text1: "Signup successful!",
      });
      navigation.navigate("Dashboard");
    } catch (error) {
      console.log("error+++++++++++++", error);
      Toast.show({
        type: "error",
        text1: "Please try again",
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const validateFields = () => {
    let isValid = true;
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    // setDateError("");

    if (!name) {
      setNameError(translation.WIZARD.nameerror);
      isValid = false;
    }
    if (!email) {
      setEmailError(translation.WIZARD.emailerror);
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email.");
      isValid = false;
    }

    if (!password) {
      setPasswordError(translation.WIZARD.passworderror);
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError(translation.WIZARD.passworderrorlength);
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError(translation.WIZARD.confirmpassword);
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError(translation.WIZARD.confirmpassworderrormatch);
      isValid = false;
    }

    // if (!date.day || !date.month || !date.year) {
    //   setDateError("Please select the date.");
    //   isValid = false;
    // } else if (!validateAge()) {
    //   setDateError(replaceName(translation.DATEDROPDOWNS.minage, { year: 16 }));
    //   isValid = false;
    // }

    return isValid;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // const validateAge = () => {
  //   const birthDate = new Date(date.year, date.month, date.day);
  //   const age = new Date().getFullYear() - birthDate.getFullYear();
  //   return age >= 16;
  // };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <View style={styles.header}>
          <Image source={require("../../../assets/images/honk.png")} style={styles.headerLogo} />
        </View>

        <Text style={styles.title}>Create an account</Text>
        <Text style={styles.subtitle}>
          Before you can continue, we need some basic information.
        </Text>

        <InputField
          label={"Name"}
          placeholder={"Enter your name"}
          value={name}
          onChangeText={setName}
          error_msg={nameError}
        />
        <InputField
          label={"Email"}
          placeholder={"Enter your email"}
          value={email}
          onChangeText={setEmail}
          error_msg={emailError}
        />
        <InputField
          label={"Password"}
          placeholder={"Enter password"}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          error_msg={passwordError}
        />
        <InputField
          label={"Confirm password"}
          placeholder={"Please confirm your password"}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
          error_msg={confirmPasswordError}
        />

        {/* <DatePicker
          date={date}
          setDate={setDate}
          validateAge={validateAge}
          label={"Date of birth"}
        />
        {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null} */}

        <CustomButton
          loading={loading}
          title={"Signup"}
          onPress={handleSignUp}
          style={{ marginTop: 20 }}
        />
      </View>
    </ScrollView>
  );
};

export default SignUp;
