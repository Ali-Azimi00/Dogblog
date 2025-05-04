import { View, Text, FlatList, Image, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import SearchInput from '@/components/SearchInput'
import Trending from '@/components/Trending'
import EmptyState from '@/components/EmptyState'
import { getAllPosts, getLatestPosts } from '@/lib/appwrite'
import useAppwrite from '@/lib/useAppwrite'
import VideoCard from '@/components/VideoCard'
import { useGlobalContext } from '@/context/GlobalProvider'
import LoadingScreen from "@/components/LoadingScreen";

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts } = useAppwrite(getLatestPosts);
  const { user } = useGlobalContext();

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [])

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  const loadVideoCards = () => {
    return posts.map((item: any) => (
      <View key={item.$id}>
        <VideoCard videoItem={item} page='home' />
      </View>
    ))
  }

  const loadLatesVideos = () => {
    return (
      <Trending posts={latestPosts} />
    )
  }

  return loading ? (<LoadingScreen message={'TIP: double tap the picture'} />) : (
    <SafeAreaView className='bg-exPrime  '>

      <FlatList
        data={posts}
        keyExtractor={(item: any) => item.$id}

        ListHeaderComponent={() => (
          <View className='flex mt-6 px-0'>
            <View className="flex justify-between items-start flex-row mb-0">
              <View className='px-4'>
                <Text className="font-pmedium text-sm text-gray-400 mt-4">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
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
              <SearchInput searchPlaceholder="Search" />
            </View>

            {/* Lates videos */}
            <View className='w-full flex-1 mt-4 mb-0 px-2 '>
              <Text className='text-lg font-pregular text-gray-400 mb-1'>
                Following
              </Text>
              {loadLatesVideos()}
            </View>

            <View className='w-full  '>
              <Text className='text-lg font-pregular text-gray-400 px-4 mb-4'>
                Latest Posts
              </Text>
              {loadVideoCards()}
            </View>
          </View>
        )}

        // Video cards
        renderItem={({ item }: any) => (
          <View></View>
        )}

        ListEmptyComponent={() => (
          <EmptyState
            title='No videos found'
            subtitle='Be the first one to upload a video'
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