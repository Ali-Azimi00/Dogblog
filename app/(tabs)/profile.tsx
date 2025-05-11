import { View, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import EmptyState from '@/components/EmptyState'
import useAppwrite from '@/lib/useAppwrite'
import VideoCard from '@/components/VideoCard'
import { getUserPosts, signOut } from '../../lib/appwrite'
import { useGlobalContext } from '@/context/GlobalProvider'
import { icons } from '../../constants'
import InfoBox from '@/components/InfoBox'
import ModalDropdown from '../../components/ModalDropDown'
import { router, useLocalSearchParams } from 'expo-router'



const Profile = () => {
  const { update } = useLocalSearchParams();

  const { user, setUser, setIsLogged, refreshUser } = useGlobalContext();
  const { data: posts } = useAppwrite(() => getUserPosts(user.$id))
  const [userUpdated, setUserUpdated] = useState(false);

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);
    router.replace("/sign-in");
  };

  const onRefresh = async () => {
    await refreshUser();
  }

  useEffect(() => {
    if (update) {
      setUserUpdated(true)
    }
  }, [])

  useEffect(() => {
    if (userUpdated) {
      onRefresh();
      setUserUpdated(false)
    }
  }, [userUpdated])



  return (
    <SafeAreaView className='bg-exPrime h-full '>

      <FlatList
        data={posts}
        keyExtractor={(item: any) => item.$id}

        ListHeaderComponent={() => (

          <View className="w-full justify-center items-center 
          mt-6 mb-12 px-2">

            <View className="flex flex-row justify w-full"
              style={styles.spacing}>

              <TouchableOpacity className=''
                onPress={() => { router.push('/update/updateProfile') }}
              >
                <Image source={icons.gear}
                  resizeMode='contain'
                  className='w-10 h-10' />
              </TouchableOpacity>

              <TouchableOpacity className=''>
                <ModalDropdown
                  modalIcon={icons.logout}
                  classStyles='w-8 h-10'
                  modalOptions={['LogOut']}
                  passFunction={logout}
                />
              </TouchableOpacity>

            </View>


            <View className="w-16 h-16 border border-exSec 
            rounded-lg flex justify-center items-center"
            >
              <Image source={{ uri: user?.avatar }}
                resizeMode='contain'
                className="w-[90%] h-[90%]"
              />
            </View>

            <InfoBox
              title={user?.username}
              containerStyles='mt-5'
              titleStyles='text-lg'
            />

            <View className="mt-0 flex flex-row">
              <InfoBox
                title={posts.length || 0}
                subtitle='Posts'
                containerStyles='mr-8'
                titleStyles='text-xl'
              />
              <InfoBox
                title="1.2k"
                subtitle="Followers"
                titleStyles='text-xl'
              />
            </View>

          </View>
        )}

        // Video cards
        renderItem={({ item }: any) => (
          <View className='px-2'>
            <VideoCard videoItem={item} page='profile' />
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

export default Profile


const styles = StyleSheet.create({
  spacing: {
    justifyContent: 'space-between'
  },

})
