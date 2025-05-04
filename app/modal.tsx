import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { router, useLocalSearchParams } from 'expo-router'

export default function Modal() {


    const { title, message, nextScreen } = useLocalSearchParams();


    return (
        <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                // backdropFilter: 'blur(10)',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                // backgroundColor: 'black'
            }}
        >

            {/* Dismiss modal when pressing outside */}
            {/* <Link href={'/home'} asChild>
                <Pressable style={StyleSheet.absoluteFill} />
            </Link> */}


            <Animated.View
                entering={SlideInDown}
                exiting={SlideOutDown}
                className=' rounded-xl'
                style={{
                    width: '90%',
                    height: 'auto',
                    paddingHorizontal: '7%',
                    paddingVertical: '5%',
                    backgroundColor: '#161622',
                    borderColor: '#FF9C01',
                    borderWidth: 1,
                    shadowColor: 'white',
                    boxShadow: ' 0 0px 50px -5px rgba(255, 255, 255, 0.25)'
                }}
            >
                <View
                    style={{

                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        marginBottom: 10

                    }}  >
                    <Text className='text-xl' style={{ fontWeight: 'bold', marginBottom: 10, color: 'white' }}>
                        {title}
                    </Text>

                    <Text className='text-sm font-pregular' style={{ marginBottom: 10, color: 'white' }}>
                        {message}
                    </Text>


                </View>

                <TouchableOpacity onPress={() => {
                    nextScreen ? router.replace(nextScreen) : router.dismiss(1)
                }}
                    style={{
                        alignItems: 'flex-end',
                    }}
                >

                    <View className="bg-exSec p-2 px-6 rounded-xl">
                        <Text className='text-exPrime text-sm font-psemibold'>Ok</Text>

                    </View>
                </TouchableOpacity>

            </Animated.View>
        </Animated.View >
    );
}

