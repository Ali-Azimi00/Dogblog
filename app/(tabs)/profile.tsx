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
          <View>


            <View className=' '>
              <View className=' '>
                <View className="justify-center items-center mt-4 mx-4"
                >

                  <View className="flex flex-row justify w-full"
                    style={styles.spacing}>

                    <TouchableOpacity className=''
                      onPress={() => { router.push('/update/updateProfile') }}
                    >
                      <Image source={icons.gear}
                        resizeMode='contain'
                        className='w-10 h-10' />
                    </TouchableOpacity>

                    <View className='w-16 h-16 flex-col  border-2 border-exSec 
                                     rounded-lg justify-center items-center my-2'>
                      <Image source={{ uri: user?.avatar }}
                        resizeMode='cover'
                        className="w-[100%] h-[100%] " />
                    </View>


                    <TouchableOpacity className=''>
                      <ModalDropdown
                        modalIcon={icons.logout}
                        classStyles='w-8 h-10'
                        modalOptions={['LogOut']}
                        passFunction={logout}
                      />
                    </TouchableOpacity>

                  </View>


                  <View className='flex-1 items-start justify-start mt-2 '>
                    <InfoBox
                      title={user?.username}
                      // subtitle={`Posts: ` + posts.length || 0}
                      subtitle={`Posts: 100 `}

                      containerStyles='mt-2 place-content-evenly items-center '
                      titleStyles='text-3xl font-psemibold  '
                      subtitleStyles='text-xl font-pregular mt-1 '
                    />
                  </View>


                </View>
              </View>


              <View className='justify-center items-center'>
                <View className='w-[100%] border h-0 my-5  '
                  style={{
                    boxShadow: '0px -4px 10px 0px rgba(196, 196, 196, 0.38);',
                    borderBottomColor: '#161622',
                    borderBottomWidth: 1
                  }}>
                </View>
              </View>

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
            title='No posts found'
            subtitle='You have no posts uploaded'
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
