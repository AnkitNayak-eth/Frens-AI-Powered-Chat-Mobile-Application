import { View, FlatList, Pressable, ScrollView } from 'react-native'
import React from 'react'
import ChatItem from './ChatItem'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import LottieView from 'lottie-react-native';
import { router } from 'expo-router';

const ChatList = ({ users,currentUser }) => {

  const openAi = () => {
    router.push({ pathname: '/ChatAi' });
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView nestedScrollEnabled={true} >
        <FlatList
          scrollEnabled={false}
          data={users}
          contentContainerStyle={{ flex: 1, paddingVertical: 25 }}
          keyExtractor={item => item.userId}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => <ChatItem item={item} index={index} currentUser={currentUser} />}
        />
      </ScrollView>


      <View style={{ position: 'absolute', bottom: hp(8), right: wp(1), display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#0E007A", borderRadius: 100, position: 'absolute', bottom: hp(5), right: wp(5), width: 70, height: 70 }}>
        <Pressable android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: true }} onPress={openAi} >
          <LottieView
            style={{ width: 150, height: 150 }}
            source={require("../assets/images/bot.json")}
            autoPlay
            loop
          />
        </Pressable>
      </View>

    </View>
  )
}

export default ChatList
