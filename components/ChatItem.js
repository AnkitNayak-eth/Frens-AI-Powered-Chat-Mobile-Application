import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import userImg from '../assets/images/user.png'
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { formatDate, getRoomId } from '../utils/common';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

const ChatItem = ({ item, currentUser }) => {
    const [lastMessage, setLastMessage] = useState(undefined);

    const openChatRoom = () => {
        router.push({ pathname: '/chatRoom', params: item });
    }

    useEffect(() => {
        let roomId = getRoomId(currentUser?.userId, item?.userId);
        const docRef = doc(db, "rooms", roomId);
        const messageRef = collection(docRef, "messages");
        const q = query(messageRef, orderBy('createdAt', 'desc'));

        let unsub = onSnapshot(q, (snapshot) => {
            let allMessages = snapshot.docs.map(doc => {
                return doc.data();
            });
            setLastMessage(allMessages[0] ? allMessages[0] : null);
        });

        return unsub;
    }, []);

    const renderTime = () => {
        if (lastMessage) {
            let date = lastMessage?.createdAt;
            return formatDate(new Date(date?.seconds * 1000));
        }
        return ' ';
    }

    const renderLastMessage = () => {
        if (typeof lastMessage == 'undefined') return 'Loading...';
        if (lastMessage) {
            if (currentUser?.userId == lastMessage?.userId) return "You: " + lastMessage?.text;
            return lastMessage?.text;
        } else {
            return "Say Hi 👋";
        }
    }


    return (
        <Pressable onPress={openChatRoom} android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: false }} style={{ display: "flex", flexDirection: "row", padding: 16, alignItems: "center", gap: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }} >
            <Image
                style={{ height: hp(6), aspectRatio: 1, borderRadius: 100 }}
                source={item?.profileUrl}
                placeholder={userImg}
                contentFit="cover"
                transition={500}
            />
            <View style={{ flex: 1, gap: 1 }}>
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }} >
                    <Text style={{ fontSize: hp(2), fontWeight: '600', color: '#1F2937' }} >{item?.username}</Text>
                    <Text style={{ fontSize: hp(1.5), fontWeight: '500', color: '#6B7280' }} >{renderTime()}</Text>
                </View>
                <Text style={{ fontSize: hp(1.5), fontWeight: '500', color: '#6B7280' }}  >{renderLastMessage()}</Text>
            </View>
        </Pressable>
    )
}

export default ChatItem 