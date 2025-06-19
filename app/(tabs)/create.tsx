import { Image, View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import UploadFormField from '@/components/UploadFormField'
import { icons } from '../../constants'
import CustomButton from '@/components/CustomButton'
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import { router } from 'expo-router'
import { createVideo, createImage } from '@/lib/appwrite'
import { useGlobalContext } from '@/context/GlobalProvider'
import * as ImagePicker from 'expo-image-picker'
import * as DocumentPicker from 'expo-document-picker'
import LoadingScreen from '@/components/LoadingScreen'
import { ModalPush } from '@/app/modal'

interface createForm {
  title: string,
  video: any,
  image: any,
  thumbnail: any,
  prompt: string,
  cartoon: string,
}

const Create = () => {
  const [uploading, setUploading] = useState(false);
  const [prediction, setPrediction] = useState(false);
  const [form, setForm] = useState<createForm>({
    title: '',
    video: null,
    image: null,
    thumbnail: null,
    prompt: '',
    cartoon: '',
  })
  const { user } = useGlobalContext();


  const submit = async () => {

    if (form.prompt === "") {
      // return Alert.alert('Please fill the prompt field');
      ModalPush('Error', "Please give the dog's name");
      return;
    }


    if (form.title === "") {
      ModalPush('Error', 'Please fill the title field');
      return
      //  Alert.alert('Please fill the title field');
    }

    if (!form.thumbnail && !mTypeImg) {
      ModalPush('Error', 'Please upload a thumbnail image');
      return
      // Alert.alert('Please upload a thumbnail image')
    }

    if (!form.video && !mTypeImg) {
      ModalPush('Error', 'Please upload a video');
      return
      // Alert.alert('Please upload a video');
    }

    setUploading(true);

    try {
      if (mTypeImg) {
        await createImage(
          {
            ...form, userId: user.$id
          },
          setUploading, setPrediction
        )
      } else {
        await createVideo(
          {
            ...form, userId: user.$id
          },
          setUploading
        )
      }

    } catch (error: any) {
      // Alert.alert('Error', error.message)
      ModalPush('Error', error.message);
    }
  }

  useEffect(() => {
    if (!uploading && prediction) {
      // Alert.alert('Success', 'Post uploaded')
      // router.push('/home')

      router.push({
        pathname: '/modal',
        params: { title: 'Success', message: 'Post uploaded', nextScreen: '/home' }
      })

      setForm({
        title: '',
        video: null,
        image: null,
        thumbnail: null,
        prompt: '',
        cartoon: ''
      })
    }

  }, [uploading])


  const [mTypeImg, setMTypeImg] = useState(true);

  const videoSource = form.video;

  const player = useVideoPlayer(videoSource, player => {
    // player.loop = false;
    player.pause();
  });

  const { isPlaying } = useEvent(
    player,
    'playingChange',
    { isPlaying: player.playing }
  );


  //TODO allow editing?
  const openPicker = async (selectType: string) => {
    let result = await ImagePicker.
      launchImageLibraryAsync({
        // mediaTypes: ['images', 'videos'],
        mediaTypes: (selectType === 'image' || selectType === 'thumbnail')
          ? ['images']
          : ['videos'],
        allowsEditing: true,
        aspect: [12, 9],
        quality: 1,
      })


    if (!result.canceled) {
      if (selectType === "image") {
        setForm({
          ...form,
          image: result.assets[0],
        });
      }
      if (selectType === "thumbnail") {
        setForm({
          ...form,
          thumbnail: result.assets[0],
        });
      }
      if (selectType === "video") {
        setForm({
          ...form,
          video: result.assets[0],
        });
      }
    } else {
      // setTimeout(() => {
      //   Alert.alert("Document NOT picked", JSON.stringify(result, null, 2));
      // }, 100);
    }
  }


  return uploading ? (<LoadingScreen animation={true} />) : (
    <SafeAreaView className='bg-exPrime h-full'>
      <ScrollView className="px-4 my-6 ">

        <View className="flex-row items-center justify-between mt-4">
          <View className="flex-row">
            <Text className='text-2xl  text-white font-psemibold '>
              Upload
            </Text>
            <Text className="text-2xl  text-white
             font-psemibold ">
              {mTypeImg ? " Image " : " Video"}
            </Text>
          </View>

          <View className='justify-end items-end'>
            <TouchableOpacity
              onPress={() => setMTypeImg(!mTypeImg)}
              className={`w-12 h-6 rounded-full bg-gray-600 
                p-1 justify-end`
              }
            >
              <View
                className={`w-4 h-4  bg-exSec rounded-2xl 
                  ${mTypeImg ? '' : 'ml-auto'}`}
              />
            </TouchableOpacity>
          </View>
        </View>


        <UploadFormField
          title="Video Title"
          value={form.title}
          placeholder="Give a catchy title"
          handleChangeText={
            (e: any) => {
              setForm({ ...form, title: e })
            }
          }
          otherStyles="mt-2"
          hideIcon={true}
        />

        <View className="mt-4 space-y-2">
          <Text className="text-base mb-1 text-gray-100 font-pmedium">
            Upload File
          </Text>

          <TouchableOpacity onPress={() => openPicker(`${mTypeImg ? "image" : "video"}`)}>

            {
              mTypeImg ?
                (
                  <View>
                    {form.image ? (
                      <Image
                        source={{ uri: form.image.uri }}
                        resizeMode='contain'
                        className='w-full h-64 rounded-2xl'
                      />
                    ) :
                      (
                        <View className='w-full h-40 px-4 bg-gray-800 rounded-2xl items-center justify-center'>
                          <View className="w-14 h-14 border border-dashed border-exSec justify-center items-center">
                            <Image
                              source={icons.upload}
                              resizeMode='contain'
                              className='h-1/2 w-1.2'
                            />
                          </View>
                        </View>
                      )
                    }
                  </View>
                )
                :
                (
                  <View>

                    {form.video ? (

                      <VideoView style={styles.video}

                        player={player}
                        allowsFullscreen
                        allowsPictureInPicture
                        contentFit="contain"
                      />
                    ) :
                      (
                        <View className='w-full h-40 px-4 bg-gray-800 rounded-2xl items-center justify-center'>
                          <View className="w-14 h-14 border border-dashed border-exSec justify-center items-center">
                            <Image
                              source={icons.upload}
                              resizeMode='contain'
                              className='h-1/2 w-1.2'


                            />

                          </View>
                        </View>
                      )
                    }


                  </View>

                )
            }

          </TouchableOpacity>

        </View>

        {
          mTypeImg ? (<></>) : (
            <View className="mt-4 space-y-2">
              <Text className="text-base mb-1 text-gray-100 font-pmedium">
                Thumbnail Image
              </Text>

              <TouchableOpacity onPress={() => openPicker('thumbnail')}>
                {form.thumbnail ? (
                  <Image
                    source={{ uri: form.thumbnail.uri }}
                    resizeMode='cover'
                    className='w-full h-64 rounded-2xl'

                  />
                ) :
                  (
                    <View className="w-full h-16 px-4 bg-gray-800 
                rounded-2xl flex justify-center items-center flex-row"
                      style={styles.spacing}
                    >
                      <Image
                        source={icons.upload}
                        resizeMode='contain'
                        alt="upload"
                        className='h-5 w-5'
                      />
                      <Text className="text-sm text-[#7B7B8B] font-pmedium">
                        Choose a file
                      </Text>
                    </View>
                  )
                }
              </TouchableOpacity>
            </View>
          )
        }
        <UploadFormField
          title="AI Prompt"
          value={form.prompt}
          placeholder={`Dog's name`}
          handleChangeText={(e: any) => { setForm({ ...form, prompt: e }) }}
          otherStyles="mt-7"
          hideIcon={true}
        />
        <CustomButton
          title="Submit & Publish"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />

      </ScrollView>
    </SafeAreaView>
  )
}

export default Create


const styles = StyleSheet.create({
  spacing: {
    gap: 8,
  },
  video: {
    backgroundColor: 'black',
    borderRadius: 10,
    width: '100%',
    height: 150,
  },
})
