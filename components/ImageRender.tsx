import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useRef, useState } from 'react'

import {
    GestureHandlerRootView,
    HandlerStateChangeEvent,
    State,
    TapGestureHandler,
    TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';

const ImageRender = ({ image, cartoon }: any) => {

    const [showCartoon, setShowCartoon] = useState(false);


    const doubleTapRef = useRef();
    const handleSingleTap = (
        e: HandlerStateChangeEvent<TapGestureHandlerEventPayload>,
    ) => {
        if (e.nativeEvent.state === State.ACTIVE) {
            console.log('single tapped');
            setShowCartoon(!showCartoon);
        }
    };
    const handleDoubleTap = (
        e: HandlerStateChangeEvent<TapGestureHandlerEventPayload>,
    ) => {
        if (e.nativeEvent.state === State.ACTIVE) {
            console.log('double tapped');
        }
    };


    return (
        <View className="w-full" >
            <GestureHandlerRootView>
                <TapGestureHandler
                    onHandlerStateChange={handleSingleTap}
                    waitFor={doubleTapRef}>
                    <TapGestureHandler
                        onHandlerStateChange={handleDoubleTap}
                        numberOfTaps={2}
                        ref={doubleTapRef}>
                        {
                            showCartoon ? (<Image className=" rounded-xl mt-3 w-full"
                                style={styles.image}
                                resizeMode="cover"
                                source={{ uri: cartoon }}
                            />) :
                                (<Image className=" rounded-xl mt-3 w-full"
                                    style={styles.image}
                                    resizeMode="cover"
                                    source={{ uri: image }}
                                />)
                        }
                    </TapGestureHandler>
                </TapGestureHandler>
            </GestureHandlerRootView>
        </View>
    )
}

export default ImageRender



const styles = StyleSheet.create({
    image: {
        backgroundColor: 'black',
        borderRadius: 10,
        width: '100%',
        minHeight: 220,
    },
})