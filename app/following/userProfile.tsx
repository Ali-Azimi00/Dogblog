import { View, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import EmptyState from '@/components/EmptyState'
import useAppwrite from '@/lib/useAppwrite'
import VideoCard from '@/components/VideoCard'
import { getUserPosts, signOut } from '../../lib/appwrite'
import InfoBox from '@/components/InfoBox'
import { router, useLocalSearchParams } from 'expo-router'
import CustomButton from '@/components/CustomButton'
import { isFollowing, updateFollowing } from '@/lib/appwrite'
import GlobalProvider, { useGlobalContext } from '@/context/GlobalProvider'


const UserProfile = () => {

    const { user } = useGlobalContext();
    const { postUserId, followDataString }: any = useLocalSearchParams();
    const { data: posts } = useAppwrite(() => getUserPosts(postUserId))
    const followData: any = JSON.parse(followDataString.toString());

    const [userFollowingPoster, setUserFollowingPoster] = useState(followData)


    const postUserNotCurrentUser: boolean = postUserId != user.$id

    useEffect(() => {
        const checkFollowing = async () => {
            const following: boolean = await isFollowing(postUserId);
            setUserFollowingPoster(following)
        };
        checkFollowing()
    }, [])

    const renderFollowBtn = () => {

        if (userFollowingPoster) {
            return (
                <CustomButton
                    title="Unfollow"
                    handlePress={handleFollowPress}
                    containerStyles="  border-2 border-exSec bg-gray-900 px-4 py-4"
                    textStyles=" text-exSec  font-pmedium "
                />
            )
        }
        else {
            return (
                <CustomButton
                    title="Follow"
                    handlePress={handleFollowPress}
                    containerStyles="  border-2 border-exSec bg-gray-900 px-4 py-4"
                    textStyles=" text-exSec  font-pmedium "
                />
            )
        }
    }

    const handleFollowPress = () => {
        if (userFollowingPoster) {
            updateFollowing(posts[0]?.creator.$id, true);
            setUserFollowingPoster(false)

        }
        else {
            updateFollowing(posts[0]?.creator.$id, false);
            setUserFollowingPoster(true)

        }

    }



    return (
        <SafeAreaView className='bg-exPrime h-full '>
            <FlatList
                data={posts}
                keyExtractor={(item: any) => item.$id}

                ListHeaderComponent={() => (
                    <View className=' mb-0 pb-0'>
                        <View className='mb-0 px-4'>
                            <View className="w-full justify-start 
                                items-start mt-6 flex flex-row gap-2 "
                            >
                                <View className='w-16 h-16 flex-col  
                                     rounded-lg justify-center items-center'>
                                    <Image source={{ uri: posts[0]?.creator.avatar }}
                                        resizeMode='contain'
                                        className="w-[100%] h-[100%] " />
                                </View>

                                <View className='flex-1 items-start justify-start '>
                                    <InfoBox
                                        title={posts[0]?.creator.username}
                                        subtitle={`Posts: ` + posts.length || 0}
                                        containerStyles='mt-0 place-content-evenly items-start '
                                        titleStyles='text-3xl font-psemibold  '
                                        subtitleStyles='text-xl font-pregular  '
                                    />
                                </View>

                                <TouchableOpacity className=' '>
                                    {
                                        postUserNotCurrentUser ? (
                                            renderFollowBtn()
                                        ) : (
                                            <></>
                                        )
                                    }
                                </TouchableOpacity>

                            </View>
                        </View>

                        <View className='justify-center items-center'>
                            {/* <View className='w-[100%] border border h-0 my-4 '
                                style={{
                                    borderBottomColor: 'rgba(139, 139, 139, 0.69)',
                                }}
                            /> */}
                            <View className='w-[100%] border h-0 my-5 '
                                style={{
                                    boxShadow: '0px -4px 10px 0px rgba(196, 196, 196, 0.38);',
                                    borderBottomColor: '#161622',
                                    borderBottomWidth: 1
                                }}
                            >
                            </View>
                        </View>
                    </View>
                )
                }

                // Video cards
                renderItem={({ item }: any) => (
                    <View className='px-0'
                    >
                        <VideoCard videoItem={item} />
                    </View>
                )}

                ListEmptyComponent={() => (
                    <EmptyState
                        title='No videos found'
                        subtitle='No results for this search query'
                    />
                )}
            />
        </SafeAreaView >
    )
}

export default UserProfile


// const styles = StyleSheet.create({
//     spacing: {
//         justifyContent: 'space-between'
//     },

// })
