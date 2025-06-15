import { View, FlatList, Image, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import EmptyState from '@/components/EmptyState'
import useAppwrite from '@/lib/useAppwrite'
import VideoCard from '@/components/VideoCard'
import { getBookmarkedPosts } from '../../lib/appwrite'
import InfoBox from '@/components/InfoBox'
import { images } from '../../constants'





const Bookmark = () => {
  const { data: posts, refetch } = useAppwrite(
    () => getBookmarkedPosts()
  )


  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }


  return (
    <SafeAreaView className='bg-exPrime h-full px-0 '>

      <FlatList
        data={posts}
        keyExtractor={(item: any) => item.$id}

        ListHeaderComponent={() => (
          <View className='flex my-6 space-y-6'>
            <View className='items-start flex 
            justify-between flex-row mb-0'>
              <InfoBox
                subtitle="Your saved posts"
                title='BookMarks'
                containerStyles=' px-4 mt-4 text-left '
                subtitleStyles='font-pmedium text-sm text-gray-400'
                titleStyles='text-2xl text-white font-psemibold'
              />
              <View className='mt-0'>
                <Image
                  source={images.hdog}
                  className='w-20 h-20'
                  resizeMode='contain'
                />

              </View>
            </View>
            {/* <InfoBox
              title='Posts: '
              containerStyles='relative items-start mt-0'
              titleStyles='font-pmedium text-sm text-gray-400 mt-0'
            /> */}
          </View>
        )}

        // Video cards
        renderItem={({ item }: any) => (
          <View className='' >
            <VideoCard videoItem={item} />
          </View>
        )}


        ListEmptyComponent={() => (
          <EmptyState
            title='No posts found'
            subtitle='No bookmarked posts'
            hideButton={true}
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

export default Bookmark