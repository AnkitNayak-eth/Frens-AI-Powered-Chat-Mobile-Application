import { View, Text, TextInput, Pressable, Alert } from "react-native";
import React, { useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Feather, Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Loading from "../../components/Loading";
import KeyboardView from "../../components/KeyboardView";
import { useAuth } from "../../context/authContext";
import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import userImg from '../../assets/images/user.png'



const userEdit = () => {
    const { user, logout } = useAuth();
    
    const router = useRouter();
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);
    const emailRef = useRef("");
    const userRef = useRef("");
    const passRef = useRef("");

    const handleLogout = async () => {
        await logout();
    };

    const handleSignup = async () => {
        if (!emailRef.current || !passRef.current || !userRef.current) {
            Alert.alert('Sign Up', "Please fill all the fields!");
            return;
        }
        setLoading(true);
        let response = await register(emailRef.current, passRef.current, userRef.current);
        setLoading(false);
        if (!response.success) {
            Alert.alert('Sign up', response.msg);
        }
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: '',
                    headerLeft: () => (
                        <View className="flex-row items-center gap-4" >
                            <View className="flex-row justify-center items-center gap-3 py-6" >
                                <Pressable android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: true }} onPress={() => router.back()} >
                                    <Ionicons name="chevron-back-outline" size={hp(3)} color="black" />
                                </Pressable>
                                <Image
                                    style={{ height: hp(6), aspectRatio: 1, borderRadius: 100 }}
                                    source={user?.profileUrl}
                                    placeholder={userImg}
                                    contentFit="cover"
                                    transition={500}
                                />
                                <Text style={{ fontSize: hp(3) }} className="text-neutral-700 font-medium" >
                                    Edit User
                                </Text>
                            </View>
                        </View>
                    )
                }}

            />
        <KeyboardView>
            <View className="flex-1">
                <StatusBar style="dark" />
                <View style={{ paddingTop: hp(5), paddingBottom: hp(5) }} className="flex-1">
                    <View className="items-center">
                        <Image
                            style={{ width: 150, height: 150 }}
                            source={require('../../assets/images/user.png')}
                        />
                    </View>
                    <View className="gap-10 mx-4 ">
                        <Text
                            style={{ fontSize: hp(4) }}
                            className="text-center font-bold tracking-wider"
                        >
                        </Text>
                        <View className="gap-4">
                            <View
                                style={{ height: hp(7) }}
                                className="flex-row gap-4 px-4 items-center bg-neutral-100 rounded-2xl"
                            >

                                <Feather name="user" size={hp(2.5)} color="gray" />
                                <TextInput
                                    onChangeText={value => userRef.current = value}
                                    style={{ fontSize: hp(2) }}
                                    className="flex-1 font-semibold "
                                    placeholder="Change Username"
                                    placeholderTextColor={"gray"}
                                />
                            </View>
                            <View className="gap-2">
                                <View
                                    style={{ height: hp(7) }}
                                    className="flex-row gap-4 px-4  items-center bg-neutral-100 rounded-2xl"
                                >
                                    <Octicons name="mail" size={hp(2.5)} color="gray" />
                                    <TextInput
                                        onChangeText={value => emailRef.current = value}
                                        style={{ fontSize: hp(2) }}
                                        className="flex-1 font-semibold "
                                        placeholder="Change E-Mail"
                                        placeholderTextColor={"gray"}
                                    />
                                </View>
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
                                        placeholder="New Password"
                                        secureTextEntry
                                        placeholderTextColor={"gray"}
                                    />
                                </View>
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
                                        placeholder="Confirm Password"
                                        secureTextEntry
                                        placeholderTextColor={"gray"}
                                    />
                                </View>
                            </View>

                            <View className="flex-row justify-center gap-6 m-3" >

                                {loading ? (
                                    <View className="flex-row justify-center" >
                                        <Loading size={hp(16)} />
                                    </View >
                                ) : (
                                    <View>
                                            <Pressable onPress={handleLogout} style={{ height: hp(7), width: wp(35) }} className="bg-red-800 rounded-xl justify-center items-center "  >
                                            <Text style={{ fontSize: hp(3) }}
                                                className="text-white font-bold tracking-wider" >
                                                Cancel
                                            </Text>
                                        </Pressable>
                                    </View >
                                )}

                                {loading ? (
                                    <View className="flex-row justify-center  " >
                                        <Loading size={hp(16)} />
                                    </View >
                                ) : (
                                    <View>
                                        <Pressable onPress={handleSignup} 
                                        style={{ height: hp(7), width: wp(35) }} 
                                        className="bg-green-800 rounded-xl justify-center items-center"  >
                                            <Text style={{ fontSize: hp(3) }}
                                                className="text-white font-bold tracking-wider" >
                                                Save
                                            </Text>
                                        </Pressable>
                                    </View >
                                )}

                            </View>

                            <View >
                                {loading ? (
                                    <View className="flex-row justify-center" >
                                        <Loading size={hp(16)} />
                                    </View >
                                ) : (
                                    <View>
                                            <Pressable onPress={handleLogout} 
                                            style={{ height: hp(7) }} className="bg-violet-950 rounded-xl justify-center items-center"  >
                                            <Text style={{ fontSize: hp(3) }}
                                                className="text-white font-bold tracking-wider" >
                                                Logout
                                            </Text>
                                        </Pressable>
                                    </View >
                                )}
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </KeyboardView>
        </>
    );
};

export default userEdit;