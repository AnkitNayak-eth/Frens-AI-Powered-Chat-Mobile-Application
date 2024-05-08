import { View, Text, StatusBar, TextInput, Pressable, Alert} from 'react-native'
import React, { useRef, useState } from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import ChatRoomHeader from '../../components/ChatRoomHeader';
import MessageList from '../../components/MessageList';
import LottieView from 'lottie-react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Feather, Ionicons } from '@expo/vector-icons';
import KeyboardView from "../../components/KeyboardView";
import { useEffect } from 'react';
import { Timestamp, addDoc, collection, doc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import { getRoomId } from '../../utils/common';
import { useAuth } from '../../context/authContext';
import { db } from '../../firebase';
import bot from '../../assets/images/bot.png'
import { Image } from 'expo-image';

const ChatAi = () => {
    const { user } = useAuth();
    const item = useLocalSearchParams();
    const router = useRouter();
    const [message, setMessage] = useState([]);
    const textRef = useRef('');
    const inputRef = useRef(null);

    useEffect(() => {
        createRoom();
        let roomId = getRoomId(user?.userId, item?.userId);
        const docRef = doc(db, "rooms", roomId);
        const messageRef = collection(docRef, "messages");
        const q = query(messageRef, orderBy('createdAt', 'asc'));

        let unsub = onSnapshot(q, (snapshot) => {
            let allMessages = snapshot.docs.map(doc => {
                return doc.data();
            });
            setMessage([...allMessages]);
        });

        return unsub;
    }, []);

    const createRoom = async () => {
        let roomId = getRoomId(user?.userId, item?.userId);
        await setDoc(doc(db, "rooms", roomId), {
            roomId,
            createdAt: Timestamp.fromDate(new Date())
        });
    }

    const handleSendMsg = async () => {
        let message = textRef.current.trim();
        if (!message) return;
        try {
            let roomId = getRoomId(user?.userId, item?.userId);
            const docRef = doc(db, 'rooms', roomId);
            const messageRef = collection(docRef, "messages");
            textRef.current = "";
            if (inputRef) inputRef?.current?.clear();
            const newDoc = await addDoc(messageRef, {
                userId: user?.userId,
                text: message,
                senderName: user?.username,
                createdAt: Timestamp.fromDate(new Date())
            });
        } catch (err) {
            Alert.alert('Message', err.message);
        }
    }


    return (
        <KeyboardView inChat={true} >
            <View className="flex-1 bg-white" >
                <StatusBar style="dark" />
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
                                        source={bot}
                                        contentFit="cover"
                                        transition={500}
                                    />
                                    <Text style={{ fontSize: hp(3) }} className="text-neutral-700 font-medium" >
                                        Fren AI
                                    </Text>
                                </View>
                            </View>
                        )
                    }}

                />
                <View className="flex-1 justify-between bg-neutral-100 overflow-visible" >
                    <View className="flex-1 justify-center items-center" >
                        <LottieView
                            style={{ width: 400, height: 400 }}
                            source={require("../../assets/images/bot.json")}
                            autoPlay
                            loop
                        />
                        <Text style={{ fontSize: hp(3), textAlign:"center" }} className="text-neutral-700 font-medium" >
                            Hi, I am Fren{"\n"}
                            How can I help you.
                        </Text>
                    </View>
                    <View style={{ marginBottom: hp(2) }} className="pt-2" >

                        <View className="flex-row mx-3 justify-between bg-white border-neutral-300 rounded-full " >
                            <TextInput
                                ref={inputRef}
                                onChangeText={value => textRef.current = value}
                                placeholder='Type message...'
                                style={{ fontSize: hp(2) }}
                                className="flex-1 m-2"
                            />
                            <Pressable onPress={handleSendMsg} className=" bg-neutral-200 p-3 m-1 rounded-full " android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: true }} >
                                <Feather name="send" size={hp(3)} color="#737373" />
                            </Pressable>
                        </View>

                    </View>
                </View>
            </View>
        </KeyboardView>
    )
}

export default ChatAi