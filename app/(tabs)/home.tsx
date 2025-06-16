import { View, Text, FlatList, Image, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import SearchInput from '@/components/SearchInput'
import EmptyState from '@/components/EmptyState'
import { getAllPosts, getCurrentUser, getLatestPostFromUser } from '@/lib/appwrite'
import useAppwrite from '@/lib/useAppwrite'
import VideoCard from '@/components/VideoCard'
import { useGlobalContext } from '@/context/GlobalProvider'
import LoadingScreen from "@/components/LoadingScreen";
import Following from '@/components/Following'
import '../../components/component.css'

const Home = () => {
  const { user, refreshUser } = useGlobalContext();

  const [followers, setFollowers] = useState(user.following)
  const [followerLatest, setFollowerLatest] = useState<any[]>([]);
  const [updateBookmarks, setUpdateBookMarks] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const { data: posts, refetch } = useAppwrite(getAllPosts);

  useEffect(() => {
    setFollowerLatest([])
    followers.forEach(async (element: any) => {
      let followerPost = await getLatestPostFromUser(element);

      setFollowerLatest((prevState: any[]) => {
        return [...prevState, followerPost];
      });
    });

  }, [user])


  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, [])


  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    await refreshUser();
    setUpdateBookMarks(true);
    setFollowers(user.following)
    setRefreshing(false);
  }


  return loading ?
    (<LoadingScreen message={'TIP: tap the picture'} />)
    : (
      <SafeAreaView className='bg-exPrime  '>

        <FlatList
          data={posts}
          keyExtractor={(item: any) => item.$id}

          ListHeaderComponent={() => (
            <View className='flex mt-6 px-0'>
              <View className="flex justify-between 
            items-start flex-row mb-0">
                <View className='px-4'>
                  <Text className="font-pmedium text-sm 
                text-gray-400 mt-4">
                    Welcome Back
                  </Text>
                  <Text className="text-2xl font-psemibold
                text-white">
                    {user?.username}
                  </Text>
                </View>

                {/* Search bar */}
                <View className='mt-0 '>
                  <Image
                    source={images.hdog}
                    className='w-20 h-20'
                    resizeMode='contain'
                  />
                </View>
              </View>

              {/* Search */}
              <View className="px-2">
                <SearchInput searchPlaceholder="Dog's name" />
              </View>

              {/* Lates videos */}
              <View className='w-full flex-1 mt-4 mb-0 px-2 '>
                <Text className='text-lg font-pregular 
              text-gray-400 mb-0'>
                  Following
                </Text>
                <Following posts={followerLatest} />
              </View>

              <Text className='text-lg font-pregular 
            text-gray-400 px-4 mb-2 '>
                Latest Posts
              </Text>


            </View>
          )}

          // Video cards
          renderItem={({ item }: any) => (
            <View className='w-full  '>
              <VideoCard
                videoItem={item}
                page='home'
                updateBookmarks={updateBookmarks}
                setUpdateBookMarks={setUpdateBookMarks}
              />
            </View>

          )}

          ListEmptyComponent={() => (
            <EmptyState
              title='No posts found'
              subtitle='Be the first one to upload a post'
            />
          )}

          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />

      </SafeAreaView>
    )
}

export default Home