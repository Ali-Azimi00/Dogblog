import { View, Text, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '@/components/SearchInput'
import EmptyState from '@/components/EmptyState'
import useAppwrite from '@/lib/useAppwrite'
import VideoCard from '@/components/VideoCard'
import { searchPosts } from '../../lib/appwrite'
import { useLocalSearchParams } from 'expo-router'

const Search = () => {
  const { query } = useLocalSearchParams();

  const { data: posts, refetch } = useAppwrite(() => searchPosts(query))


  //reloading/refreshing
  useEffect(() => {
    refetch();
  }, [query])


  const loadVideoCards = () => {
    return posts.map((item: any) => (
      <View key={item.$id}>
        <VideoCard video={item} />
      </View>
    ))
  }

  return (
    <SafeAreaView className='bg-exPrime h-full '>

      <FlatList
        data={posts}
        keyExtractor={(item: any) => item.$id}

        ListHeaderComponent={() => (
          <View className='my-6 px-4'>
            <View>
              <Text className="font-pmedium text-sm text-gray-400 mb-1">
                Search Results
              </Text>
              <Text className="text-2xl font-psemibold text-white">
                {query}
              </Text>
            </View>

            {/* Search bar */}

            <View className="mt-6 mb-8">
              <SearchInput
                title="Search"
                initialQuery={query}
              />
            </View>

          </View>
        )}



        // Video cards
        renderItem={({ item }: any) => (
          <View>
            {loadVideoCards()}
          </View>
        )}


        ListEmptyComponent={() => (
          <EmptyState
            title='No videos found'
            subtitle='No results for this search query'
          />
        )}
      />

    </SafeAreaView>
  )
}

export default Search