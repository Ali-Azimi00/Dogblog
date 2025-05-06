import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import './component.css';
import Animated, { SlideInLeft, SlideOutRight } from 'react-native-reanimated';

const LoadingAnimation = () => {
    const statements = [
        'Connecting with AI agent',
        'Sending data',
        'Waiting for AI to respond',
        "I guess AI isn't so great after all",
        'Still waiting on the AI...',
        'Almost there',
        'Humans are better',
    ];

    const [stateIndex, setStateIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStateIndex((prevIndex) => (prevIndex + 1) % statements.length);
        }, 20000);

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
                    >
                        <Text className="text-white font-pthin">{statement}</Text>
                    </Animated.View>
                )
            ))}
        </View>
    );
};

export default LoadingAnimation;
