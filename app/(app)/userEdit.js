import { View, Text, TextInput, Pressable, Alert } from "react-native";
import React, { useEffect, useRef, useState } from "react";
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
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { storage } from '../../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';




const userEdit = () => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [newUsername, setNewUsername] = useState(user.username);
    const { updateUsername } = useAuth();
    const { updateProfileUrl } = useAuth();
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (image) {
            uploadMedia();
        }
    }, [image]);

    const handleSave = async () => {
        setLoading(true);
        const { success } = await updateUsername(user.userId, newUsername);
        if (success) {
            Alert.alert("Success", "Username updated successfully");
        } else {
            Alert.alert("Error", "Failed to update username");
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await logout();
    };

    const uploadMedia = async () => {
        setLoading(true);
        try {
            const response = await fetch(image);
            const blob = await response.blob();
            const fileInfo = await FileSystem.getInfoAsync(image);
            const filename = fileInfo.uri.split('/').pop();

            const storageRef = ref(storage, `/items/${filename}`);
            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);
            const { success } = await updateProfileUrl(user.userId,downloadURL);
            if (success) {
                Alert.alert("Success", "Profile updated successfully");
            } else {
                Alert.alert("Error", "Failed to update profile");
            }
            setLoading(false);

        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const pickImage = async () => {
        
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            width: 500,
            height: 500,
            quality: 1,
        });

        

        if (!result.cancelled) {
            setImage(result.uri);
        } else {
            console.log('No image selected');
        }
    };


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
                                    Profile
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
                            <Pressable android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: true }} onPress={pickImage} >
                                <Image
                                    style={{ height: hp(30), width: wp(30), aspectRatio: 1, borderRadius: hp(15) }}
                                    source={user?.profileUrl}
                                    placeholder={require('../../assets/images/user1.png')}
                                    contentFit="cover"
                                    transition={500}
                                />
                            </Pressable>
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
                                        style={{ fontSize: hp(2.5), color: 'black' }}
                                        className="flex-1 font-semibold "
                                        value={newUsername}
                                        onChangeText={setNewUsername}
                                    />
                                    {loading ? (
                                        <View className="flex-row justify-center  " >
                                            <Loading size={hp(2)} />
                                        </View >
                                    ) : (
                                        <View>
                                            <Pressable android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: true }}
                                                onPress={handleSave}
                                                style={{ height: hp(5), width: wp(20) }}
                                                className="bg-green-800 rounded-xl justify-center items-center"  >
                                                <Text style={{ fontSize: hp(1.5) }}
                                                    className="text-white font-bold tracking-wider" >
                                                    Save
                                                </Text>
                                            </Pressable>
                                        </View >
                                    )}
                                </View>
                                <View className="gap-2">
                                    <View
                                        style={{ height: hp(7) }}
                                        className="flex-row gap-4 px-4  items-center bg-neutral-100 rounded-2xl"
                                    >
                                        <Octicons name="mail" size={hp(2.5)} color="gray" />
                                        <TextInput

                                            style={{ fontSize: hp(2), color: 'black' }}
                                            className="flex-1 font-bold "
                                            value={user.email}
                                            editable={false}
                                        />
                                        {loading ? (
                                            <View className="flex-row justify-center  " >
                                                <Loading size={hp(2)} />
                                            </View >
                                        ) : (
                                            <View>
                                                <Pressable android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: true }}
                                                    style={{ height: hp(5), width: wp(20) }}
                                                    className="bg-green-800 rounded-xl justify-center items-center"  >
                                                    <Text style={{ fontSize: hp(1.5), textAlign: "center" }}
                                                        className="text-white font-bold tracking-wider" >
                                                        Change
                                                    </Text>
                                                </Pressable>
                                            </View >
                                        )}
                                    </View>
                                </View>
                                <View className="gap-2">
                                    <View
                                        style={{ height: hp(7) }}
                                        className="flex-row gap-4 px-4  items-center bg-neutral-100 rounded-2xl"
                                    >
                                        <Octicons name="lock" size={hp(3)} color="gray" />
                                        <TextInput
                                            style={{ fontSize: hp(2), color: 'black' }}
                                            className="flex-1 font-bold "
                                            value={user.password}
                                            editable={false}
                                        />
                                        {loading ? (
                                            <View className="flex-row justify-center  " >
                                                <Loading size={hp(2)} />
                                            </View >
                                        ) : (
                                            <View>
                                                <Pressable android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: true }}
                                                    style={{ height: hp(5), width: wp(20) }}
                                                    className="bg-green-800 rounded-xl justify-center items-center"  >
                                                    <Text style={{ fontSize: hp(1.5), textAlign: "center" }}
                                                        className="text-white font-bold tracking-wider" >
                                                        Change
                                                    </Text>
                                                </Pressable>
                                            </View >
                                        )}
                                    </View>
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