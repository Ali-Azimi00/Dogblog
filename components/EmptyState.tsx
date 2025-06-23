import { View, Text, Image } from 'react-native'
import React from 'react'
import { images } from '../constants'
import CustomButton from './CustomButton'
import { router } from 'expo-router'

const EmptyState = ({ title, subtitle, hideButton }: any) => {
    return (
        <View className='justify-center items-center px-2 '>
            <Image source={images.empty}
                className="h-48 w-48 "
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
                : <View className='w-full px-2'>
                    <CustomButton
                        title='Create Post'
                        handlePress={() => { router.push('/create') }}
                        containerStyles='w-full my-5 '
                    />
                </View>
            }


        </View>
    )
}

export default EmptyState