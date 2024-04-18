import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import { useAuth } from '../../context/authContext'
import "../../global.css"
import { StatusBar } from 'expo-status-bar'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ChatList from '../../components/ChatList'
import Loading from '../../components/Loading'
import { useEffect } from 'react'
import {getDocs, query, where } from 'firebase/firestore'
import { userRef } from '../../firebase'

const Home = () => {
  const {user} = useAuth();
  const [users, setUsers] = useState([]);
 
  
  useEffect(() => {
    if (user?.uid)
      getUser();
  }, [])

  const getUser = async () => {
    const q = query(userRef, where('userId', '!=', user?.uid));
    const querySnapshot = await getDocs(q);
    let data = [];
    querySnapshot.forEach(doc => {
      data.push({ ...doc.data() });
    })

    setUsers(data);
  }

  return (
    <>
    <View className='flex-1 bg-white' >
      <StatusBar style='light' />
      {
        users.length > 0 ? (
          <ChatList users={users} />
        ) : (
          <View className='flex items-center' style={{ top: hp(30) }} >
            <Loading size={hp(20)} />
          </View>
        )
      }
    </View>
    </>
    
  )
}

export default Home