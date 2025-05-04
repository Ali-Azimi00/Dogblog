import { View, Text, Image } from 'react-native'
import React from 'react'
import { images } from '../constants'
import CustomButton from './CustomButton'
import { router } from 'expo-router'

const EmptyState = ({ title, subtitle, hideButton }: any) => {
    return (
        <View className='justify-center items-center px-4  '>
            <Image source={images.empty}
                className="h-[200px] w-[200px] "
                resizeMode='contain'
            />
            <Text className="text-xl mt-2 font-psemibold text-white text-center">
                {title}
            </Text>
            <Text className="font-pmedium text-sm text-gray-400">
                {subtitle}
            </Text>

            {hideButton ?
                <View />
                : <CustomButton
                    title='Create Video'
                    handlePress={() => { router.push('/create') }}
                    containerStyles='w-full my-5 '
                />}


        </View>
    )
}

export default EmptyState