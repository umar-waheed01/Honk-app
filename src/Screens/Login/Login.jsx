import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import InputField from "./../../components/UIComponents/InputField/InputField";
import CustomButton from "../../components/UIComponents/CustomButton/CustomButton";
// import { useDispatch, useSelector } from "react-redux";
// import { setToken } from "../../redux/slices/session";
// import { useApiCall } from "../../util/useApiCall";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./style";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../Firebase";

const Login = () => {
  // const translation = useSelector((state) => state.session.translation);
  const navigation = useNavigation();
  const [email, setEmail] = useState("example0009@gmail.com");
  const [password, setPassword] = useState("098098098");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  // const dispatch = useDispatch();
  // const apiCall = useApiCall();

  const validateFields = () => {
    let valid = true;

    if (!email) {
      setEmailError("Email is required!");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Invalid email format!");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required!");
      valid = false;
    } else if (password.length < 8) {
      setPasswordError("Password should be atleast 8 characters long!");
      valid = false;
    } else {
      setPasswordError("");
    }

    return valid;
  };

  const handleLogin = async () => {
    if (!validateFields()) return;

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      Toast.show({
        type: "success",
        text1: "Login successful!",
      });

      navigation.navigate("Dashboard");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Please try again",
      });
    } finally {
      setLoading(false);
    }

    // const requestBody = {
    //   email: email,
    //   password: password,
    // };

    // try {
    //   const result = await apiCall("api/account/signin", "POST", requestBody);
    //   setLoading(false);

    //   if (result.status === 200) {
    //     const authToken = result.headers.get("X-Auth-Token");
    //     dispatch(setToken(authToken));
    //     Toast.show({
    //       type: "success",
    //       text1: "Login successful!",
    //     });
    //     navigation.replace("Dashboard");
    //   } else if (result.status === 500) {
    //     Toast.show({
    //       type: "error",
    //       text1: translation.LOGIN.notfound,
    //     });
    //   } else if (result.status === 400) {
    //     Toast.show({
    //       type: "error",
    //       text1: "Please enter a correct password.",
    //     });
    //   } else if (result.status === 412) {
    //     Toast.show({
    //       type: "error",
    //       text1: translation.LOGIN.notactivated,
    //     });
    //   } else {
    //     Toast.show({
    //       type: "error",
    //       text1: translation.ERRORS.genericerror,
    //     });
    //   }
    // } catch (error) {
    //   setLoading(false);
    //   Toast.show({
    //     type: "error",
    //     text1: translation.ERRORS.genericerror,
    //   });
    // }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image source={require("./../../../assets/images/honk.png")} style={styles.headerImage} />
        </View>

        <Text style={styles.title}>Honk</Text>
        <Text style={styles.subtitle}>Where Connections Speak Louder!</Text>

        <InputField
          label={"Email"}
          placeholder={"Enter your email"}
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          error_msg={emailError}
        />

        <InputField
          label={"Password"}
          placeholder={"Enter your password"}
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
          error_msg={passwordError}
        />

        <TouchableOpacity>
          <Text style={styles.forgotText} onPress={() => navigation.navigate("ForgotPassword")}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <CustomButton
          title={"LOGIN"}
          onPress={handleLogin}
          loading={loading}
          variant="contained"
          style={{ marginTop: 10 }}
        />
        <CustomButton
          title={"SIGN UP"}
          onPress={() => navigation.navigate("SignUp")}
          variant="outlined"
          style={{ marginTop: 10 }}
        />
      </ScrollView>
    </View>
  );
};

export default Login;
