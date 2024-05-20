import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { Image } from 'expo-image';
import userImg from '../assets/images/user.png'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useAuth } from '../context/authContext';
import { router } from 'expo-router';

const HomeHeader = () => {
  const { user} = useAuth();

  const openEdit = () =>{
    router.push({ pathname: '/userEdit', params: user });
  }
  return (
    <View style={{ display: "flex", flexDirection: "row",alignItems:"center", justifyContent: "space-between", paddingHorizontal: 20, backgroundColor: '#3B0764', paddingTop: hp(6), paddingBottom: hp(2), borderBottomLeftRadius: 24, borderBottomRightRadius: 24, }}>
      <View>
        <Text style={{ fontSize: hp(5), fontWeight: '500', color: 'white' }} >Hi, {user?.username && user.username.split(' ')[0].charAt(0).toUpperCase() + user.username.split(' ')[0].slice(1)}</Text>
      </View>
      <Pressable android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: true }}  onPress={openEdit}>
        <View >
          <Image
            style={{ height: hp(7), aspectRatio: 1, borderRadius: 100 }}
            source={user?.profileUrl}
            placeholder={userImg}
            contentFit="cover"
            transition={500}
          />
        </View>
      </Pressable>
    </View>
  )
}

export default HomeHeader