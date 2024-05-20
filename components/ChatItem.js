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
    const openChatRoom = () => {
        router.push({ pathname: '/chatRoom', params: item });
    }
    return (
        <Pressable onPress={openChatRoom} android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: false }} style={{display: "flex", flexDirection: "row", padding: 16, alignItems: "center", gap: 12, borderBottomWidth: 1,borderBottomColor: '#E5E7EB'}} >
            <Image
                style={{ height: hp(6), aspectRatio: 1, borderRadius: 100 }}
                source={item?.profileUrl}
                placeholder={userImg}
                contentFit="cover"
                transition={500}
            />
            <View style={{flex:1,gap:1}}>
                <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}} >
                    <Text style={{ fontSize: hp(2), fontWeight: '600',color: '#1F2937'}} >{item?.username}</Text>
                    <Text style={{ fontSize: hp(1.5), fontWeight: '500', color: '#6B7280' }} >Time</Text>
                </View>
                <Text style={{ fontSize: hp(1.5), fontWeight: '500', color: '#6B7280' }}  >Last Message</Text>
            </View>
        </Pressable>
    )
}

export default ChatItem 