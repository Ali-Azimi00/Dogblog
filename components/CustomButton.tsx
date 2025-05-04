import { TouchableOpacity, Text } from 'react-native'
import React from 'react'

const CustomButton = ({ handlePress, title, containerStyles, isLoading, textStyles }: any) => {
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            className={
                `bg-exSec min-h-[62px] justify-center items-center rounded-xl py-2 
                ${containerStyles} 
                ${isLoading ? 'opacity-50' : ''}`
            }
            disabled={isLoading}
        >
            <Text className={`text-exPrime font-psemibold text-lg ${textStyles}`}>
                {title}
            </Text>

        </TouchableOpacity>
    )
}

export default CustomButton