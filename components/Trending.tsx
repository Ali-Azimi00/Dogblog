import { useState } from "react";
import * as Animatable from "react-native-animatable";
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, View } from 'react-native';
import {
    FlatList,
    Image,
    ImageBackground,
    TouchableOpacity,
} from "react-native";
import { icons } from "../constants";

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

const TrendingItem = ({ activeItem, item }: any) => {

    const [play, setPlay] = useState(false);
    const videoSource = item.video;

    const player = useVideoPlayer(videoSource, player => {
        // player.loop = true;
        player.pause();
    });

    const { isPlaying } = useEvent(
        player,
        'playingChange',
        { isPlaying: player.playing }
    );

    //TODO set up eventlistener to bring back thumbnail after video ends
    return (
        <Animatable.View
            className="mr-0"
            animation={activeItem === item.$id ? zoomIn : zoomOut}
            duration={500}
        >

            {item.image ?
                (
                    <View
                        ///ADJUST HEIGHT ON H-36
                        className="w-full h-36" >
                        <Image className=" my-2 overflow-hidden  shadow-lg "
                            resizeMode="cover"
                            style={{ width: 100, height: 100, borderRadius: 100, shadowColor: 'white' }}
                            source={{ uri: item.image }}
                        />
                    </View>
                )
                : (
                    <>
                        {play ? (
                            <View style={styles.contentContainer}
                                className=" rounded-2xl overflow-hidden  " >

                                <VideoView style={styles.video}

                                    player={player}
                                    allowsFullscreen
                                    allowsPictureInPicture
                                    contentFit="contain"

                                />

                            </View>

                        ) : (
                            <TouchableOpacity
                                className="relative flex justify-center items-center"
                                activeOpacity={0.7}
                                onPress={() => {
                                    setPlay(true)
                                    if (isPlaying) {
                                        player.pause();
                                    } else {
                                        player.play();
                                    }

                                }}
                            >
                                <ImageBackground
                                    source={{
                                        uri: item.thumbnail,
                                    }}
                                    className=" rounded-xl my-5 overflow-hidden"
                                    resizeMode="cover"
                                    style={{ width: 125, height: 125 }}
                                />

                                <Image
                                    source={icons.play}
                                    className="w-12 h-12 absolute"
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        )}
                    </>
                )
            }
        </Animatable.View>
    );
};

const Trending = ({ posts }: any) => {
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
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => (
                <TrendingItem activeItem={activeItem} item={item} />
            )}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={{
                itemVisiblePercentThreshold: 70,
            }}
        //   contentOffset={{ x: 170 }}
        />
    );
};

export default Trending;



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