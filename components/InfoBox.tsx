import { View, Text } from 'react-native'
import React from 'react'

const InfoBox = ({ title, subtitle, titleStyles, containerStyles, subtitleStyles }: any) => {
    return (
        <View className={containerStyles}>
            <Text className={`text-white text-center  ${titleStyles}`}>
                {title}
            </Text>
            <Text className={`text-gray-100 text-center ${subtitleStyles}`}>
                {subtitle}
            </Text>
        </View>
    )
}

export default InfoBox