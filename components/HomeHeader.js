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
    <View className='flex-row justify-between px-5 bg-violet-950 pt-14 pb-2 rounded-b-3xl shadow ' >
      <View>
        <Text style={{ fontSize: hp(4) }} className='font-medium p-2 text-white shadow '>Hi, {user?.username && user.username.split(' ')[0].charAt(0).toUpperCase() + user.username.split(' ')[0].slice(1)}</Text>
      </View>
      <Pressable android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: true }}  onPress={openEdit}>
        <View className='p-2 shadow' >
          <Image
            style={{ height: hp(6), aspectRatio: 1, borderRadius: 100 }}
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