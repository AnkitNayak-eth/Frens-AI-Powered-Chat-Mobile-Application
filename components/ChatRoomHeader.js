import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import userImg from '../assets/images/user.png'
import { Image } from 'expo-image';


const ChatRoomHeader = ({ user, router }) => {
    const urlParts = user.profileUrl ? user.profileUrl.split('?') : [];
    const encodedPath = urlParts.length > 0 ? urlParts[0].replace(/\/([^\/]+)$/, '%2F$1') : '';
    const encodedUrl = encodedPath && urlParts.length > 1 ? encodedPath + '?' + urlParts[1] : null;

    return (
        <Stack.Screen
            options={{
                title: '',
                headerLeft: () => (
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 12, paddingVertical: 12 }}>
                            <Pressable android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: true }} onPress={() => router.back()}>
                                <Ionicons name="chevron-back-outline" size={hp(3)} color="black" />
                            </Pressable>
                            {encodedUrl ? (
                                <Image
                                    style={{ height: hp(6), aspectRatio: 1, borderRadius: 100 }}
                                    source={{ uri: encodedUrl }}
                                    placeholder={userImg}
                                    contentFit="cover"
                                    transition={500}
                                />
                            ) : (
                                <Image
                                    style={{ height: hp(6), aspectRatio: 1, borderRadius: 100 }}
                                    source={userImg}
                                    contentFit="cover"
                                />
                            )}
                            <Text style={{
                                fontSize: hp(3), fontWeight: '500', color: '#6B7280'}} >
                                {user?.username}
                            </Text>
                        </View>
                    </View>
                ),
                headerRight: () => (
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 32 }}>
                        <Ionicons name="call" size={hp(3)} color={'#737373'} />
                        <Ionicons name="videocam" size={hp(3)} color={'#737373'} />
                    </View>
                )
            }}
        />
    );
};

export default ChatRoomHeader;