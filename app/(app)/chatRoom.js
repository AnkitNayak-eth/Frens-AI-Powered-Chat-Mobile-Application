import { View, Text, StatusBar, TextInput, Pressable, Alert, Keyboard } from 'react-native'
import React, { useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import ChatRoomHeader from '../../components/ChatRoomHeader';
import MessageList from '../../components/MessageList';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Feather } from '@expo/vector-icons';
import KeyboardView from "../../components/KeyboardView";
import { useEffect } from 'react';
import { Timestamp, addDoc, collection, doc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import { getRoomId } from '../../utils/common';
import { useAuth } from '../../context/authContext';
import { db } from '../../firebase';

const chatRoom = () => {
  const { user } = useAuth();
  const item = useLocalSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState([]);
  const textRef = useRef('');
  const scrollViewRef = useRef('');
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

    const KeyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow', updateScrollView
    )

    return () => {
      unsub;
      KeyboardDidShowListener.remove();
    }

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

  useEffect(() => {
    updateScrollView();
  }, [message])

  const updateScrollView = () => {
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd({ animated: true })
    }, 100)
  }


  return (
    <KeyboardView inChat={true} >

      <View style={{ flex: 1, backgroundColor: "white" }} >
        <StatusBar style="dark" />
        <ChatRoomHeader user={item} router={router} />

        <View style={{ flex: 1, justifyContent: "space-between", backgroundColor: "#f5f5f5", overflow: "visible" }}>
          <View style={{ flex: 1 }} >
            <MessageList scrollViewRef={scrollViewRef} message={message} currentUser={user} />
          </View>

          <View style={{ marginBottom: hp(1), paddingHorizontal: 12 }}>
            <View style={{ display: "flex", flexDirection: "row", marginVertical: 12, justifyContent: "space-between", backgroundColor: "white", borderColor: "#D1D5DB", borderWidth: 1, borderRadius: 50 }} >
              <TextInput
                ref={inputRef}
                onChangeText={value => textRef.current = value}
                placeholder='Type message...'
                style={{ fontSize: hp(2), flex: 1, margin: 12 }}
              />
              <Pressable onPress={handleSendMsg} style={{ backgroundColor: "#E5E7EB", padding: 12, margin: 4, borderRadius: 50 }} android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: true }} >
                <Feather name="send" size={hp(3)} color="#737373" />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </KeyboardView>
  )
}

export default chatRoom