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

const Signin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const emailRef = useRef("");
  const passRef = useRef("");
  const { login } = useAuth();

  const handleSignin = async () => {
    if (!emailRef.current || !passRef.current) {
      Alert.alert('Sign In', "Please fill all the fields!");
      return;
    }
    setLoading(true);
    const response = await login(emailRef.current, passRef.current);
    setLoading(false);
    if (!response.success) {
      Alert.alert('Sign In', response.msg);
    }
  }

  return (
    <KeyboardView>
      <View className="flex-1">
        <StatusBar style="dark" />
        <View style={{ paddingTop: hp(10) }} className="flex-1 gap-12">
          <View className="items-center">
            <LottieView
              style={{ width: 300, height: 300 }}
              source={require("../assets/images/signin.json")}
              autoPlay
              loop
            />
          </View>
          <View className="gap-10 mx-4 ">
            <Text
              style={{ fontSize: hp(4) }}
              className="text-center font-bold tracking-wider"
            >
              Sign In
            </Text>
            <View className="gap-4">
              <View
                style={{ height: hp(7) }}
                className="flex-row gap-4 px-4 items-center bg-neutral-100 rounded-2xl"
              >
                <Octicons name="mail" size={hp(3)} color="gray" />
                <TextInput
                  onChangeText={value => emailRef.current = value}
                  style={{ fontSize: hp(2) }}
                  className="flex-1 font-semibold "
                  placeholder="Enter Your E-Mail"
                  placeholderTextColor={"gray"}
                />
              </View>
              <View className="gap-2">
                <View
                  style={{ height: hp(7) }}
                  className="flex-row gap-4 px-4  items-center bg-neutral-100 rounded-2xl"
                >
                  <Octicons name="lock" size={hp(3)} color="gray" />
                  <TextInput
                    onChangeText={value => passRef.current = value}
                    style={{ fontSize: hp(2) }}
                    className="flex-1 font-semibold "
                    placeholder="Enter Your Password"
                    secureTextEntry
                    placeholderTextColor={"gray"}
                  />
                </View>
                <Text
                  style={{ fontSize: hp(2) }}
                  className="text-right font-semibold "
                >
                  Forgot Password ?
                </Text>
              </View>

              <View>
                {loading ? (
                  <View className="flex-row justify-center" >
                    <Loading size={hp(16)} />
                  </View >
                ) : (
                  <View>
                    <Pressable onPress={handleSignin} style={{ height: hp(7) }} className="bg-violet-950 rounded-xl justify-center items-center"  >
                      <Text style={{ fontSize: hp(3) }}
                        className="text-white font-bold tracking-wider" >
                        Sign In
                      </Text>
                    </Pressable>
                  </View >
                )}
              </View>

              <View className="flex-row justify-center items-start " >
                <Text style={{ fontSize: hp(2) }} className="font-semibold">Don't have an account ?</Text>
                <Pressable onPress={() => router.push('Signup')} >
                  <Text style={{ fontSize: hp(2) }} className="font-bold text-yellow-400 "> Sign Up</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>
    </KeyboardView >
  );
};

export default Signin;