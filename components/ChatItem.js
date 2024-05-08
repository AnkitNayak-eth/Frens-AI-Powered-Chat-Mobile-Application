import { View, Text, Pressable } from 'react-native'
import React from 'react'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import userImg from '../assets/images/user.png'
import { Image } from 'expo-image';
import { router } from 'expo-router';

const ChatItem = ({ item }) => {
    const openChatRoom = () =>{
        router.push({pathname:'/chatRoom', params:item});
    }
    return (
        <Pressable onPress={openChatRoom} android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: false }} className="flex-row justify-between px-4 items-center gap-3 py-4 border-b border-b-neutral-200 " >
            <Image
                style={{ height: hp(6), aspectRatio: 1, borderRadius: 100 }}
                source={item?.profileUrl}
                placeholder={userImg}
                contentFit="cover"
                transition={500}
            />
            <View className="flex-1 gap-1" >
                <View className="flex-row justify-between" >
                    <Text style={{fontSize: hp(2)}} className="font-semibold text-neutral-800" >{item?.username}</Text>
                    <Text style={{ fontSize: hp(1.5) }} className="font-medium text-neutral-500" >Time</Text>
                </View>
                <Text style={{ fontSize: hp(1.5) }} className="font-medium text-neutral-500" >Last Message</Text>
            </View>
        </Pressable>
    )
}

export default ChatItem 