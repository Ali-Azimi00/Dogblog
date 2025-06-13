import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import './component.css';
import Animated, { SlideInLeft, SlideOutRight } from 'react-native-reanimated';

const LoadingAnimation = () => {
    const statements = [
        'Connecting with AI agent',
        'Sending data',
        'Waiting for AI to respond',
        'Still waiting on the AI...',

        'This app is free, you get what you pay for',
        'Almost there',
        'Maybe pay for the PRO version?',
        'AI finally responded',
        'Reconnecting with AI agent',
    ];

    const [stateIndex, setStateIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStateIndex((prevIndex) => (prevIndex + 1) % statements.length);
        }, 25000);

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    return (
        <View className='mt-6 '>
            {statements.map((statement, index) => (
                index === stateIndex && (
                    <Animated.View
                        key={index}
                        entering={SlideInLeft.duration(1000)}
                        exiting={SlideOutRight.duration(1000)}
                        className={'px-2 text-center text-wrap'}
                    >
                        <Text className="text-white font-pthin text-center px-4">{statement}</Text>
                    </Animated.View>
                )
            ))}
        </View>
    );
};

export default LoadingAnimation;
