import { View, Text } from 'react-native'
import React from 'react'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const MessageItem = ({ message, currentUser }) => {
    if (currentUser?.userId == message?.userId) {
        return (
            <View style={{display:"flex",flexDirection:"row",justifyContent:"flex-end",marginBottom:12,marginRight:12}} >
                <View style={{ width: wp(80) }} >
                    <View style={{ display: "flex", alignSelf: 'flex-end', padding: 12, borderRadius: 25, backgroundColor: '#E0E7FF', borderWidth: 1, }} >
                        <Text style={{ fontSize: hp(2) }} >
                            {message?.text}
                        </Text>
                    </View>
                </View>
            </View>
        )
    } else {
        return (
            <View style={{ width: wp(80),marginLeft:12,marginBottom:12 }} >
                <View style={{ display: "flex", alignSelf: 'flex-start', padding: 12, borderRadius: 25, backgroundColor: '#E0E7FF', borderWidth: 1, }} >
                    <Text style={{ fontSize: hp(2) }} >
                        {message?.text}
                    </Text>
                </View>
            </View>
        )
    }
}

export default MessageItem