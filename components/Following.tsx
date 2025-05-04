import { useState } from "react";
import * as Animatable from "react-native-animatable";
import { StyleSheet, View } from 'react-native';
import {
    FlatList,
    Image,
    ImageBackground,
    TouchableOpacity,
} from "react-native";
// import { icons } from "../constants";

const zoomIn = {
    0: {
        transform: [{ scale: 0.8 }]
    },
    1: {
        transform: [{ scale: 1.0 }]
    },
};

const zoomOut = {
    0: {
        transform: [{ scale: 1.0 }]
    },
    1: {
        transform: [{ scale: 0.8 }]
    },
};

const FollowingItem = ({ activeItem, item }: any) => {

    return (
        <Animatable.View
            key={item.$id}
            className="mr-0"
            animation={activeItem === item.$id ? zoomIn : zoomOut}
            duration={500}
        >

            <View
                className="w-full h-36" >
                <Image className=" my-2 overflow-hidden  shadow-lg "
                    resizeMode="cover"
                    style={{ width: 100, height: 100, borderRadius: 100, shadowColor: 'white' }}
                    source={{ uri: item.url }}
                />
            </View>

        </Animatable.View>
    );
};

const Following = ({ posts }: any) => {
    const [activeItem, setActiveItem] = useState(posts[0]);

    const viewableItemsChanged = ({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setActiveItem(viewableItems[0].key);
        }
    };

    return (
        <FlatList
            data={posts}
            horizontal
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <FollowingItem activeItem={activeItem} item={item} />
            )}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={{
                itemVisiblePercentThreshold: 70,
            }}
        //   contentOffset={{ x: 170 }}
        />
    );
};

export default Following;



const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    video: {
        backgroundColor: 'black',
        borderRadius: 20,
        width: 192,
        height: 256,
    },
    image: {
        backgroundColor: 'black',
        borderRadius: 10,
        width: '100%',
        height: 256,
    },
    controlsContainer: {
        padding: 10,
    },
});