import { View, Text, Image, TextInput, Pressable, Alert } from "react-native";
import React, { useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Feather, Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Loading from "../components/Loading";
import LottieView from 'lottie-react-native';
import KeyboardView from "../components/KeyboardView";
import { useAuth } from "../context/authContext";
import Toast from 'react-native-toast-message';


const Signup = () => {
  const router = useRouter();
  const {register} = useAuth();
  const [loading, setLoading] = useState(false);
  const emailRef = useRef("");
  const userRef = useRef("");
  const passRef = useRef("");

  const handleSignup = async () => {
    if (!emailRef.current || !passRef.current || !userRef.current) {
      Toast.show({
        type: 'error',
        text1: 'Sign Up',
        text2: "Please fill all the fields!",
        visibilityTime: 5000,
        text1Style: { fontSize: 22 },
        text2Style: { fontSize: 18 },
      });
      return;
    }
    setLoading(true);
    let response = await register(emailRef.current,passRef.current,userRef.current);
    setLoading(false);

    if(!response.success){
      Toast.show({
        type: 'error',
        text1: 'Sign Up',
        text2: response.msg,
        visibilityTime: 5000,
        text1Style: { fontSize: 22 },
        text2Style: { fontSize: 18 },
      });
    }
  }

  return (
    <KeyboardView>
    <View >
      <StatusBar style="dark" />
        <View style={{ paddingTop: hp(10), gap: 12 }}>
          <View style={{ alignItems: "center", marginBottom: 20 }}>
          <LottieView
            style={{ width: 300, height: 300 }}
            source={require("../assets/images/signup.json")}
            autoPlay
            loop
          />
        </View>
          <View style={{ gap: 10, marginLeft: 16, marginRight: 16 }}>
          <Text
              style={{ marginBottom: 20, fontSize: hp(4), textAlign: "center", fontWeight: "bold", letterSpacing: 1 }}
          >
            Sign Up
          </Text>
            <View style={{ gap: 20 }}>
            <View
                style={{ height: hp(7), flexDirection: "row", gap: 4, paddingLeft: 16, paddingRight: 16, alignItems: "center", backgroundColor: "#f3f4f6", borderRadius: 20, borderWidth: 2, borderColor: 'gray' }}
            >
              
              <Feather name="user" size={hp(3)} color="gray" />
              <TextInput
                onChangeText={value => userRef.current = value}
                  style={{ fontSize: hp(2), fontWeight: 'bold' }}
                placeholder="Username"
                placeholderTextColor={"gray"}
              />
            </View>
              <View style={{ gap: 4 }}>
              <View
                  style={{ height: hp(7), flexDirection: "row", gap: 4, paddingLeft: 16, paddingRight: 16, alignItems: "center", backgroundColor: "#f3f4f6", borderRadius: 20, borderWidth: 2, borderColor: 'gray' }}
              >
                <Octicons name="mail" size={hp(3)} color="gray" />
                <TextInput
                  onChangeText={value => emailRef.current = value}
                    style={{ fontSize: hp(2), fontWeight: 'bold' }}
                  placeholder="E-Mail "
                  placeholderTextColor={"gray"}
                />
              </View>
            </View>
              <View style={{ gap: 4 }}>
              <View
                  style={{ height: hp(7), flexDirection: "row", gap: 4, paddingLeft: 16, paddingRight: 16, alignItems: "center", backgroundColor: "#f3f4f6", borderRadius: 20, borderWidth: 2, borderColor: 'gray' }}
              >
                <Octicons name="lock" size={hp(3)} color="gray" />
                <TextInput
                  onChangeText={value => passRef.current = value}
                    style={{ fontSize: hp(2), fontWeight: 'bold' }}
                  placeholder="Password"
                  secureTextEntry
                  placeholderTextColor={"gray"}
                />
              </View>
            </View>

            <View>
              {loading ? (
                  <View style={{ flexDirection: "row", justifyContent: "center" }} >
                  <Loading size={hp(16)} />
                </View >
              ) : (
                <View>
                      <Pressable onPress={handleSignup} style={{ height: hp(7), backgroundColor: "#4C1D95", borderRadius: 20, justifyContent: "center", alignItems: "center" }}  >
                    <Text 
                          style={{ fontSize: hp(3), color: "white", fontWeight: "bold", letterSpacing: 1 }} >
                      Sign Up
                    </Text>
                  </Pressable>
                </View >
              )}
            </View>

              <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "flex-start" }} >
                <Text style={{ fontSize: hp(2), fontWeight: 600 }} >Already have an account ?</Text>
              <Pressable onPress={() => router.push('Signin')} >
                  <Text style={{ fontSize: hp(2), fontWeight: "bold", color: "#f59e0b" }}> Sign in</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
      <Toast />
    </KeyboardView>
  );
};

export default Signup;