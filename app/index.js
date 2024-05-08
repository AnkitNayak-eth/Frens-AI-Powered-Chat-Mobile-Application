import { View } from 'react-native'
import React from 'react'
import Loading from '../components/Loading'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";



const StartPage = () => {
  return (
    <View style={{ flex:1,alignItems:"center",justifyContent:"center" }} >
      <Loading size={hp(20)} /> 
    </View>
  )
}

export default StartPage