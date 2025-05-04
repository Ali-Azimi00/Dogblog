import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { icons } from '../../constants'


const TabIcon = ({ icon, color, name, focused }: any) => {
  return (
    <View className='items-center  w-screen ' >
      <Image source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      <Text className={`${focused ? 'font-bold' : ''} mb-0`} style={{ fontSize: 8, color: color }}>
        {name}
      </Text>
    </View>
  )
}

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#FFA001',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarStyle: {
            paddingTop: "3%",
            backgroundColor: '#161622',
            borderTopWidth: 1,
            borderTopColor: '#FFA001',
            height: 55,
          }
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                name="Home"
                icon={icons.home}
                color={color}
                focused={focused}
              />
            )
          }}
        />

        <Tabs.Screen
          name='bookmark'
          options={{
            title: 'Bookmark',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                name="BookMark"
                icon={icons.bookmark}
                color={color}
                focused={focused}
              />
            )
          }}
        />

        <Tabs.Screen
          name="create"
          options={{
            title: 'Create',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                name='Create'
                icon={icons.plus}
                color={color}
                focused={focused}

              />
            )
          }}
        />

        <Tabs.Screen
          name='profile'
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                name='Profile'
                color={color}
                focused={focused}
                icon={icons.profile}

              />
            )
          }}
        />





      </Tabs>

    </>
  )
}

export default TabsLayout

const styles = StyleSheet.create({
  back: {

  }
})