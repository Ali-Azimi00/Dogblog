import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { icons } from '../constants'
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet } from 'react-native';
import { clickBookMark, isBookmarked, isFollowing } from '@/lib/appwrite'
import ImageRender from './ImageRender';
import ModalDropdown from './ModalDropDown';

interface mediaForm {
    title: string,
    thumbnail: string,
    video: string,
    image: string,
    prompt: string,
}


const VideoCard = ({ videoItem:
    { $id,
        title,
        thumbnail,
        video,
        mediatype,
        image,
        prompt,
        cartoon,
        creator
    },
    page
}: any) => {

    const currentCard: mediaForm = {
        title: title,
        thumbnail: thumbnail,
        video: video,
        image: image,
        prompt: prompt,
    }

    const [play, setPlay] = useState(false);
    const videoSource = video;

    const [userFollowingPoster, setUserFollowingPoster] = useState('')
    const [bookmarkSelect, setBookMarkSelect] = useState(false);
    useEffect(() => {
        const checkBookmark = async () => {
            const bookmarked = await isBookmarked($id);
            setBookMarkSelect(bookmarked);
        };
        checkBookmark();
        const checkFollowing = async () => {
            const following = await isFollowing(creator.$id);
            following ? setUserFollowingPoster("Unfollow") : setUserFollowingPoster("Follow")
        };
        checkFollowing()
    }, [])

    const player = useVideoPlayer(videoSource, player => {
        // player.loop = false;
        player.pause();
    });

    const { isPlaying } = useEvent(
        player,
        'playingChange',
        { isPlaying: player.playing }
    );


    //was async await clickBk in a try/catch; tried undoing it to see effect
    const bookmarkPost = () => {
        setBookMarkSelect(!bookmarkSelect);
        clickBookMark($id)
    }

    // const getImageSize = (uri: string) => {
    //     Image.getSize(uri, (width, height) => {
    //         return (24 * width / height)
    //     })
    // }

    const modalOptions = page == 'profile' ? ['Update'] : ['See Profile', 'Download Image', 'Download AI image']

    return (
        <View className="flex flex-col items-center px-4 mb-12">
            <View className='flex flex-row gap-0 items-start'>
                <View className='flex justify-center items-center 
                flex-row flex-1'>

                    <View className='w-12 h-12 rounded-lg border 
                    flex justify-center items-center p-0.5 '>
                        <Image source={{ uri: creator.avatar }}
                            className='w-full h-full rounded-lg'
                            resizeMode='cover' />

                    </View>

                    <View className="justify-center flex-1 ml-3 gap-y-1">

                        <Text className='text-sm text-white'
                            numberOfLines={1}
                        >
                            {title}
                        </Text>

                        <Text className="text-sm text-gray-400"
                            numberOfLines={1}
                        >
                            {/* <Text className="text-sm text-exSec-200 "> */}
                            {prompt}
                            {/* </Text>  | {creator.username} */}
                        </Text>

                    </View>

                </View>


                <TouchableOpacity
                // onPress={() => {
                //     router.push({
                //         pathname: '/update/updatePost',
                //         params: { formDataString: JSON.stringify(currentCard), cardId: $id }
                //     });

                //     // getImageSize(image)
                // }}
                >
                    <View className='pt-2 '>
                        <ModalDropdown
                            modalIcon={icons.whitedots}
                            classStyles='w-8 h-8 pr-2 '
                            currentCard={currentCard}
                            cardId={$id}
                            imageUrl={image}
                            cartoon={cartoon}
                            modalOptions={modalOptions}
                            postUserId={creator.$id}
                            passFunction={setUserFollowingPoster}
                        />
                        {/* <Image source={icons.whitedots} className='w-8 h-8 pr-2 '
                            resizeMode='contain' /> */}
                    </View>
                </TouchableOpacity>

                <View className='mt-0 '
                // style={styles.videoBar}
                >
                    <View >
                        <TouchableOpacity
                            onPress={() => { bookmarkPost() }}
                        >
                            {
                                bookmarkSelect ? (
                                    <Image
                                        source={icons.bookmark}
                                        className='w-6 h-12 mr-2'
                                        resizeMode='contain'
                                        tintColor='orange'
                                    />
                                ) :
                                    (
                                        <Image
                                            source={icons.bookmark}
                                            className='w-6 h-12 mr-2'
                                            resizeMode='contain'

                                        />
                                    )
                            }
                        </TouchableOpacity>
                    </View>
                </View>


            </View>

            {image ?
                (<ImageRender image={image} cartoon={cartoon} />)
                :
                (
                    <>
                        {play ? (
                            <View style={styles.contentContainer}
                                className="mt-0 rounded-xl overflow-hidden 
                                w-full" >

                                <VideoView style={styles.video}

                                    player={player}
                                    allowsFullscreen
                                    allowsPictureInPicture
                                    contentFit="contain"

                                />
                            </View>
                        ) : (
                            <TouchableOpacity
                                className='w-full h-60 rounded-xl 
                                            relative justify-center items-center '
                                activeOpacity={0.7}
                                onPress={() => {
                                    setPlay(true)
                                    if (isPlaying) {
                                        player.pause();
                                    } else {
                                        player.play();
                                    }
                                }
                                }
                            >
                                <Image className="w-full h-full rounded-xl mt-3"
                                    resizeMode="cover"
                                    source={{ uri: thumbnail }}
                                />

                                {/* {renderThumbnail(thumbnail)} */}

                                <Image
                                    source={icons.play}
                                    className='w-12 h-12 absolute'
                                    resizeMode='contain'

                                />
                            </TouchableOpacity>
                        )
                        }
                    </>
                )
            }
        </View>
    )
}

export default VideoCard


const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // overflow: 'hidden',
        width: '100%',
        // height: '100%',
    },
    video: {
        backgroundColor: 'black',
        borderRadius: 10,
        width: '100%',
        height: 190,
    },
    controlsContainer: {
        padding: 10,
    },
    image: {
        backgroundColor: 'black',
        borderRadius: 10,
        width: '100%',
        minHeight: 220,
    },
    videoBar: {
        // borderWidth: 1,
        // borderColor: 'red',
        alignItems: 'flex-end'
    }
})