import { View, Text, KeyboardAvoidingView, ScrollView } from 'react-native'
import React from 'react'

const KeyboardView = ({ children, inChat }) => {
    let keyConfig = {};
    let scrollViewConfig = {};
    if(inChat){
        keyConfig={keyboardVerticalOffset:90};
        scrollViewConfig={contentContainerStyle:{flex:1}};
    }
    return (
        <KeyboardAvoidingView
            behavior='padding'
            style={{ flex: 1 }}
            {...keyConfig}>
            <ScrollView
                style={{ flex: 1 }}
                bounces={false}
                showsVerticalScrollIndicator={false}
                {...scrollViewConfig} >
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default KeyboardView
