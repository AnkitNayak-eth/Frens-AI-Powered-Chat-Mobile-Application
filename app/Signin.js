import { View, Text, Image, TextInput, Pressable, Alert } from "react-native";
import React, { useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Loading from "../components/Loading";
import LottieView from 'lottie-react-native';
import KeyboardView from "../components/KeyboardView";
import { useAuth } from "../context/authContext";
import Toast from 'react-native-toast-message';
import { auth } from "../firebase";

const Signin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const emailRef = useRef("");
  const passRef = useRef("");
  const { login, sendPasswordResetEmail } = useAuth();

  const handleSignin = async () => {
    if (!emailRef.current || !passRef.current) {
      // Alert.alert('Sign In', "Please fill all the fields!");
      Toast.show({
        type: 'error',
        text1: 'Sign In',
        text2: 'Please fill all the fields! 😢',
        visibilityTime: 5000,
        text1Style: { fontSize: 22 },
        text2Style: { fontSize: 18 },
      });
      return;
    }
    setLoading(true);
    const response = await login(emailRef.current, passRef.current);
    setLoading(false);
    if (!response.success) {
      // Alert.alert('Sign In', response.msg);
      Toast.show({
        type: 'error',
        text1: 'Sign In',
        text2: response.msg,
        visibilityTime: 5000,
        text1Style: { fontSize: 22 },
        text2Style: { fontSize: 18 },
      });
    }
  }

  const handleForgotPassword = async () => {
    const email = emailRef.current.trim();
    if (!email) {
      // Alert.alert('Forgot Password', 'Please enter your email address.');
      Toast.show({
        type: 'error',
        text1: 'Forgot Password',
        text2: 'Please enter your email address.🤭',
        visibilityTime: 5000,
        text1Style: { fontSize: 22 },
        text2Style: { fontSize: 18 },
      });
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      // Alert.alert('Forgot Password', 'Password reset email sent. Please check your inbox.');
      Toast.show({
        type: 'error',
        text1: 'Forgot Password',
        text2: 'Password reset email sent. Please check your inbox. 😮‍💨',
        visibilityTime: 5000,
        text1Style: { fontSize: 22 },
        text2Style: { fontSize: 18 },
      });
    } catch (error) {
      // Alert.alert('Forgot Password', error.message);
      Toast.show({
        type: 'error',
        text1: 'Forgot Password',
        text2: error.message,
        visibilityTime: 5000,
        text1Style: { fontSize: 22 },
        text2Style: { fontSize: 18 },
      });
      console.log(error.message);
    }
    setLoading(false);
  }

  return (
    <KeyboardView>
      <View >
        <StatusBar style="dark" />
        <View style={{ paddingTop: hp(10), gap: 12 }}>
          <View style={{ alignItems: "center", marginBottom: 100 }}>
            <LottieView
              style={{ width: 300, height: 300 }}
              source={require("../assets/images/signin.json")}
              autoPlay
              loop
            />
          </View>
          <View style={{ gap: 10, marginLeft: 16, marginRight: 16 }}>
            <Text
              style={{ marginBottom: 20, fontSize: hp(4), textAlign: "center", fontWeight: "bold", letterSpacing: 1 }}
            >
              Sign In
            </Text>
            <View style={{ gap: 20 }}>
              <View
                style={{ height: hp(7), flexDirection: "row", gap: 4, paddingLeft: 16, paddingRight: 16, alignItems: "center", backgroundColor: "#f3f4f6", borderRadius: 20, borderWidth: 2, borderColor: 'gray' }}

              >
                <Octicons name="mail" size={hp(3)} color="gray" />
                <TextInput
                  onChangeText={value => emailRef.current = value}
                  style={{ fontSize: hp(2), fontWeight: 'bold' }}
                  placeholder="Enter Your E-Mail "
                  placeholderTextColor={"gray"}
                />
              </View>
              <View style={{ gap: 4 }}>
                <View
                  style={{ height: hp(7), flexDirection: "row", gap: 4, paddingLeft: 16, paddingRight: 16, alignItems: "center", backgroundColor: "#f3f4f6", borderRadius: 20, borderWidth: 2, borderColor: 'gray' }}
                >
                  <Octicons name="lock" size={hp(3)} color="gray" />
                  <TextInput
                    onChangeText={value => passRef.current = value}
                    style={{ fontSize: hp(2), fontWeight: 'bold' }}
                    placeholder="Enter Your Password"
                    secureTextEntry
                    placeholderTextColor={"gray"}
                  />
                </View>
                <Text
                  style={{ fontSize: hp(2), textAlign: "right", fontWeight: "600" }}
                  onPress={handleForgotPassword}
                >
                  Forgot Password ?
                </Text>
              </View>

              <View>
                {loading ? (
                  <View style={{ flexDirection: "row", justifyContent: "center" }}>
                    <Loading size={hp(16)} />
                  </View>
                ) : (
                  <View>
                      <Pressable onPress={handleSignin}  style={{ height: hp(7), backgroundColor: "#4C1D95", borderRadius: 20, justifyContent: "center", alignItems: "center" }}  >
                        <Text style={{ fontSize: hp(3), color: "white", fontWeight: "bold", letterSpacing: 1 }}>
                        Sign In
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>

              <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "flex-start" }} >
                <Text style={{ fontSize: hp(2),fontWeight:600 }} >Don't have an account ?</Text>
                <Pressable onPress={() => router.push('Signup')} >
                  <Text style={{ fontSize: hp(2), fontWeight: "bold", color: "#f59e0b" }} > Sign Up</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>
      <Toast />
    </KeyboardView >
  );


};

export default Signin;