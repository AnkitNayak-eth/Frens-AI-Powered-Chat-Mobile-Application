import { View, Text, StatusBar, TextInput, Pressable, FlatList, ScrollView, } from 'react-native';
import React, { useRef, useState } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/authContext';
import { Image } from 'expo-image';
import axios from 'axios';
import KeyboardView from "../../components/KeyboardView";

const ChatAi = () => {
    const { user } = useAuth();
    const item = useLocalSearchParams();
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const textRef = useRef('');
    const inputRef = useRef(null);

    const sendMessage = async () => {
        const userMessage = textRef.current;
        if (!userMessage.trim()) return;

        // Update UI with user's message
        setMessages(prevMessages => [{ text: userMessage, isUser: true }, ...prevMessages]);
        textRef.current = '';
        inputRef.current.clear();

        try {
            // Make a request to the AI API
            const response = await axios.get(`https://llama-ai.vercel.app/api?content=${encodeURIComponent(userMessage)}`);

            // Extract the AI's response from the API response
            const aiResponse = response.data.message;

            // Update UI with AI's response
            setMessages(prevMessages => [{ text: aiResponse, isUser: false }, ...prevMessages]);
        } catch (error) {
            console.error('Error fetching AI response:', error);
            // Handle error
        }
    };

    const renderItem = ({ item }) => (
        <View style={{ marginVertical: 10, alignSelf: item.isUser ? 'flex-end' : 'flex-start', backgroundColor: item.isUser ? '#DCF8C6' : '#ECECEC', borderRadius: 10, padding: 10 }}>
            <Text style={{ fontSize: hp(2), color: 'black' }}>{item.text}</Text>
        </View>
    );

    return (
        <KeyboardView inChat={true} >
            <View style={{ flex: 1, backgroundColor: "white" }} >
                <StatusBar style="dark" />
                <Stack.Screen
                    options={{
                        title: '',
                        headerLeft: () => (
                            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 4 }}>
                                <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 12, paddingVertical: 12 }}>
                                    <Pressable android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: true }} onPress={() => router.back()}>
                                        <Ionicons name="chevron-back-outline" size={hp(3)} color="black" />
                                    </Pressable>
                                    <Image
                                        style={{ height: hp(6), aspectRatio: 1, borderRadius: 100 }}
                                        source={require("../../assets/images/bot.png")}
                                        contentFit="cover"
                                        transition={500}
                                    />
                                    <Text style={{ fontSize: hp(3), fontWeight: '600', color: 'black' }}  >
                                        Fren AI
                                    </Text>
                                </View>
                            </View>
                        )
                    }}
                />

                <View style={{ flex: 1, justifyContent: "center", overflow: "visible", backgroundColor: "white" }} >
                    {messages.length === 0 ? (
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                            <LottieView
                                style={{ width: 400, height: 400 }}
                                source={require("../../assets/images/bot.json")}
                                autoPlay
                                loop
                            />
                            <Text style={{ fontSize: hp(3), textAlign: "center", fontWeight: '600', color: 'black' }} >
                                Hi, I am Fren{"\n"}
                                How can I help you.
                            </Text>
                        </View>
                    ) : (
                        <ScrollView nestedScrollEnabled={true} >
                            <FlatList
                                scrollEnabled={false}
                                data={messages}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={renderItem}
                                contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 20 }}
                                inverted
                            />
                        </ScrollView>
                    )}

                    <View style={{ marginBottom: hp(2) }}>
                        <View style={{ marginBottom: hp(1), paddingHorizontal: 12 }}>
                            <View style={{ display: "flex", flexDirection: "row", marginVertical: 12, justifyContent: "space-between", backgroundColor: "white", borderColor: "#D1D5DB", borderWidth: 1, borderRadius: 50 }} >
                                <TextInput
                                    ref={inputRef}
                                    onChangeText={value => textRef.current = value}
                                    placeholder='Type message...'
                                    style={{ fontSize: hp(2), flex: 1, margin: 12 }}
                                />
                                <Pressable onPress={sendMessage} style={{ backgroundColor: "#E5E7EB", padding: 12, margin: 4, borderRadius: 50 }} android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: true }} >
                                    <Feather name="send" size={hp(3)} color="#737373" />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </KeyboardView>
    )
}

export default ChatAi;
