import { View, Text, TextInput, Pressable, Alert, Modal } from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Feather, Octicons, MaterialIcons, AntDesign } from "@expo/vector-icons";
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
import { auth } from '../../firebase';
import Toast from 'react-native-toast-message';



const userEdit = () => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [newUsername, setNewUsername] = useState(user.username);
    const { updateUsername } = useAuth();
    const { updateProfileUrl } = useAuth();
    const { updateEmailAndVerify } = useAuth();
    const [image, setImage] = useState(null);
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const { sendPasswordResetEmail } = useAuth();
    const [editable, setEditable] = useState(false);
    const [editable1, setEditable1] = useState(false);


    useEffect(() => {

        const fetchUserEmail = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                setUserEmail(currentUser.email);
            }
        };

        fetchUserEmail();

        if (image) {
            uploadMedia();
        }
    }, [user, image]);

    const handleToggleEdit = () => {
        setEditable(!editable);
    };

    const handleToggleEdit1 = () => {
        setEditable1(!editable1);
    };


    const handleSave = async () => {
        setEditable(editable);
        setLoading(true);
        const { success } = await updateUsername(user.userId, newUsername);
        if (success) {
            // Alert.alert("Success", "Username updated successfully");
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: "Username updated successfully",
                visibilityTime: 5000,
                text1Style: { fontSize: 22 },
                text2Style: { fontSize: 18 },
            });
        } else {
            // Alert.alert("Error", "Failed to update username");
            Toast.show({
                type: 'error',
                text1: 'error',
                text2: 'Failed to update username',
                visibilityTime: 5000,
                text1Style: { fontSize: 22 },
                text2Style: { fontSize: 18 },
            });
        }
        setLoading(false);
        setEditable(!editable);
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
            const { success } = await updateProfileUrl(user.userId, downloadURL);
            if (success) {
                // Alert.alert("Success", "Profile updated successfully");
                Toast.show({
                    type: 'success',
                    text1: 'success',
                    text2: 'Profile updated successfully',
                    visibilityTime: 5000,
                    text1Style: { fontSize: 22 },
                    text2Style: { fontSize: 18 },
                });
            } else {
                // Alert.alert("Error", "Failed to update profile");
                Toast.show({
                    type: 'error',
                    text1: 'error',
                    text2: 'Failed to update profile',
                    visibilityTime: 5000,
                    text1Style: { fontSize: 22 },
                    text2Style: { fontSize: 18 },
                });
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

        console.log('Image picker result:', result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            console.log('Image selected:', result.assets[0].uri);
        } else {
            console.log('No image selected');
        }
    };

    const handleEmailSave = async () => {
        setEditable1(editable1);
        setLoading(true);
        setShowPasswordModal(true);
    };

    const handlePassCancel = async () => {
        setLoading(false);
        setShowPasswordModal(false);
    }

    const handleEmailSaveWithPassword = async () => {
        setShowPasswordModal(false);
        setLoading(true);
        const { success } = await updateEmailAndVerify(userEmail, password);
        if (success) {
            // Alert.alert("Success", "Email updated successfully. Please verify your new email address.");
            Toast.show({
                type: 'success',
                text1: 'success',
                text2: 'Email updated successfully',
                text3: 'Please verify your new email address',
                visibilityTime: 5000,
                text1Style: { fontSize: 22 },
                text2Style: { fontSize: 18 },
            });
            handleLogout();
        } else {
            // Alert.alert("Error", "Failed to update email");
            Toast.show({
                type: 'error',
                text1: 'error',
                text2: 'Failed to update email',
                visibilityTime: 5000,
                text1Style: { fontSize: 22 },
                text2Style: { fontSize: 18 },
            });
        }
        setLoading(false);
        setEditable1(!editable1);
    };

    const handleForgotPassword = async () => {
        const email = userEmail;
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
    <>
        <Stack.Screen
            options={{
                title: '',
                headerLeft: () => (
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 6, paddingHorizontal: 4 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
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
                            <Text style={{ fontSize: hp(3), color: '#333', fontWeight: 600, paddingLeft: 6 }} >
                                Profile
                            </Text>
                        </View>
                    </View>
                )
            }}
        />
        <KeyboardView>
            <View style={{ flex: 1 }}>
                <StatusBar style="dark" />
                <View style={{ padding: hp(2), flex: 1 }}>
                    <View style={{ alignItems: "center", paddingTop:hp(4) }}>
                        <Pressable android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: true }} onPress={pickImage} >
                                <Image
                                    style={{ height: hp(28), width: wp(28), aspectRatio: 1, borderRadius: hp(14), borderWidth: 2, borderColor: "black" }}
                                    source={user?.profileUrl}
                                    placeholder={require('../../assets/images/user.png')}
                                    contentFit="cover"
                                    transition={500}
                                />

                            <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#0E007A", borderRadius: 100, position: 'absolute', bottom: hp(1), right: wp(1), width: 70, height: 70 }}>
                                <Feather
                                    name="camera"
                                    size={40}
                                    color="white"
                                />
                            </View>
                        </Pressable>
                            <View style={{ marginTop: hp(4) }} >
                                <Text style={{ fontSize: hp(4), color: '#333', fontWeight: 600 }}>Hi, {user?.username && user.username.split(' ')[0].charAt(0).toUpperCase() + user.username.split(' ')[0].slice(1)}</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: hp(8)}}>
                        <View style={{ marginBottom: 20 }}>
                            <View
                                    style={{ height: hp(7), flexDirection: "row", alignItems: "center", paddingHorizontal: 10, backgroundColor: "#f0f0f0", borderRadius: 16, borderWidth: 2, borderColor: 'gray' }}
                            >
                                <Feather name="user" size={hp(2.5)} color="gray" />
                                <TextInput
                                        style={{ flex: 1, fontSize: hp(2.5), color: 'black', fontWeight: '600', paddingLeft: 6 }}
                                    value={newUsername}
                                    onChangeText={setNewUsername}
                                    editable={editable}
                                />
                                <View>
                                    <Pressable android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: true }} onPress={editable ? handleSave : handleToggleEdit} >
                                        {editable ? (
                                            <AntDesign name="checkcircleo" size={24} color="black" />
                                        ) : (
                                            <MaterialIcons name="edit" size={30} color="black" />
                                        )}
                                    </Pressable>
                                </View >
                            </View>
                        </View>
                        <View style={{ marginBottom: 20 }}>
                            <View
                                    style={{ height: hp(7), flexDirection: "row", alignItems: "center", paddingHorizontal: 10, backgroundColor: "#f0f0f0", borderRadius: 16, borderWidth: 2, borderColor: 'gray' }}
                            >
                                <Octicons name="mail" size={hp(2.5)} color="gray" />
                                <TextInput
                                    style={{ flex: 1, fontSize: hp(2), color: 'black', fontWeight: '700', paddingLeft:6 }}
                                    value={userEmail}
                                    onChangeText={setUserEmail}
                                    editable={editable1}
                                />
                                <View>
                                    <Pressable android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: true }} onPress={editable1 ? handleEmailSave : handleToggleEdit1} >
                                        {editable1 ? (
                                            <AntDesign name="checkcircleo" size={24} color="black" />
                                        ) : (
                                            <MaterialIcons name="edit" size={30} color="black" />
                                        )}
                                    </Pressable>
                                </View >
                            </View>
                        </View>
                        <View style={{ marginBottom: 4 }}>
                            <View
                                    style={{ height: hp(7), flexDirection: "row", alignItems: "center", paddingHorizontal: 10, backgroundColor: "#f0f0f0", borderRadius: 16, borderWidth: 2, borderColor: 'gray' }}
                            >
                                <Octicons name="lock" size={24} color="gray" />
                                <TextInput
                                    style={{ flex: 1, fontSize: hp(2), color: 'black', fontWeight: '700', paddingLeft: 6 }}
                                    placeholder="Change Your Password"
                                    placeholderTextColor="black"
                                    editable={false}
                                />
                                <View>
                                    <Pressable android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: true }} onPress={handleForgotPassword}>
                                        <MaterialIcons name="edit" size={30} color="black" />
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                            <View style={{ marginTop: hp(6) }} >
                            {loading ? (
                                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                    <Loading size={hp(16)} />
                                </View >
                            ) : (
                                <View>
                                    <Pressable onPress={handleLogout} style={{ height: hp(7), backgroundColor: '#4b0082', borderRadius: 20, justifyContent: "center", alignItems: "center" }}  >
                                        <Text style={{ fontSize: hp(3), color: 'white', fontWeight: 'bold', textTransform: "uppercase" }}>
                                            Logout
                                        </Text>
                                    </Pressable>
                                </View >
                            )}
                        </View>
                    </View>
                </View>
            </View>
        </KeyboardView>
        <Modal
            animationType="slide"
            transparent={true}
            visible={showPasswordModal}
            onRequestClose={() => setShowPasswordModal(false)}
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <View style={{ backgroundColor: 'white', borderRadius: 20, padding: 20, width: wp(80) }}>
                    <Text style={{ fontSize: hp(2.5), fontWeight: 'bold', marginBottom: hp(2) }}>Enter Your Password</Text>
                    <TextInput
                        style={{ fontSize: hp(2), backgroundColor: '#f0f0f0', paddingVertical: hp(1.5), paddingHorizontal: wp(3), borderRadius: 10 }}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                        placeholder="Password"
                        placeholderTextColor="#666"
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: hp(2) }}>
                        <Pressable onPress={handlePassCancel}>
                            <Text style={{ fontSize: hp(2), color: '#666', fontWeight: 'bold' }}>Cancel</Text>
                        </Pressable>
                        <Pressable onPress={handleEmailSaveWithPassword}>
                            <Text style={{ fontSize: hp(2), color: '#4b0082', fontWeight: 'bold' }}>Change</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
        <Toast />
    </>
);

};

export default userEdit;