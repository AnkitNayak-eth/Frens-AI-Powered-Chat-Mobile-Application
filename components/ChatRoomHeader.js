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
    const urlParts = user.profileUrl.split('?');
    const encodedPath = urlParts[0].replace(/\/([^\/]+)$/, '%2F$1');
    const encodedUrl = encodedPath + '?' + urlParts[1];
    return (
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
                                source={encodedUrl}
                                placeholder={userImg}
                                contentFit="cover"
                                transition={500}
                            />
                            <Text style={{ fontSize: hp(3) }} className="text-neutral-700 font-medium" >
                                {user?.username}
                            </Text>
                        </View>
                    </View>
                ),
                headerRight: () => (
                    <View className="flex-row items-center gap-8 " >
                        <Ionicons name="call" size={hp(3)} color={'#737373'} />
                        <Ionicons name="videocam" size={hp(3)} color={'#737373'} />
                    </View>
                )
            }}

        />
    )
}

export default ChatRoomHeader