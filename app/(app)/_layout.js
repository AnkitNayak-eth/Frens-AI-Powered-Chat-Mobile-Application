import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import HomeHeader from "../../components/HomeHeader";


const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="Home"
        options={{
          header: () => <HomeHeader />
        }}
      />
    </Stack>
  )
};

export default _layout;
