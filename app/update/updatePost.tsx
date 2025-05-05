import { Image, View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import UploadFormField from '@/components/UploadFormField'
import { icons } from '@/constants'
import CustomButton from '@/components/CustomButton'

import { router, useLocalSearchParams } from 'expo-router'
import { updateMediaInfo, deleteMedia } from '@/lib/appwrite'
import { useGlobalContext } from '@/context/GlobalProvider'
import * as ImagePicker from 'expo-image-picker'
import { ModalPush } from '@/app/modal'

interface mediaForm {
    title: string,
    video: any,
    image: any,
    thumbnail: any,
    prompt: string
}

const UpdateForm = () => {

    const [isImage, setIsImage] = useState(false)

    const { formDataString, cardId } = useLocalSearchParams();
    const formData: any = JSON.parse(formDataString.toString());

    useEffect(() => {
        if (formData.image) {
            setIsImage(true);
        }
    }, [])

    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState<mediaForm>({
        title: formData.title,
        video: formData.video,
        image: formData.image,
        thumbnail: formData.thumbnail,
        prompt: formData.prompt,
    })

    const [picked, setPicked] = useState(false);
    const { user } = useGlobalContext();

    const submit = async () => {

        setUploading(true);

        try {

            let isDog = await updateMediaInfo(cardId, form)

            if (isDog) {
                // Alert.alert('Success', 'Post Updated')
                // router.replace('/home')
                router.push({
                    pathname: '/modal',
                    params: { title: 'Success', message: 'Post Updated', nextScreen: '/home' }
                })
            }

        } catch (error: any) {
            // Alert.alert('Error', error.message)
            ModalPush('Error', error.message);
        }

        setUploading(false);
    }


    // const videoSource = form.video;

    // const player = useVideoPlayer(videoSource, player => {
    //     // player.loop = false;
    //     player.pause();
    // });

    // const { isPlaying } = useEvent(
    //     player,
    //     'playingChange',
    //     { isPlaying: player.playing }
    // );


    //TODO allow editing?
    const openPicker = async (selectType: string) => {
        let result = await ImagePicker.
            launchImageLibraryAsync({
                // mediaTypes: ['images', 'videos'],
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [12, 9],
                quality: 1,
            })

        if (!result.canceled) {
            setForm({
                ...form,
                thumbnail: result.assets[0],
            });
            setPicked(true);
        }
    }


    return (
        <SafeAreaView className='bg-exPrime h-full'>
            <ScrollView className="px-4 my-6 ">

                <View className="flex-row items-center justify-between mt-4">
                    <View className="flex-row">
                        <Text className='text-2xl  text-white font-psemibold '>
                            Update Info
                        </Text>
                    </View>
                </View>


                <Text className="text-base mt-4 mb-1 text-gray-100 font-pmedium">
                    Title
                </Text>
                <UploadFormField
                    title="Video Title"
                    value={form.title}
                    // placeholder="Previous title"
                    handleChangeText={
                        (e: any) => {
                            setForm({ ...form, title: e })
                        }
                    }
                    otherStyles="mt-0"
                    hideIcon={true}
                />

                {
                    !isImage ? (
                        <View className="mt-4 space-y-2">
                            <Text className="text-base mb-1 text-gray-100 font-pmedium">
                                Thumbnail Image
                            </Text>

                            <TouchableOpacity onPress={() => openPicker('thumbnail')}>

                                <View className="flex justify-center items-center flex-row"
                                    style={styles.spacing}>
                                    {
                                        picked ? (
                                            <Image
                                                source={{ uri: form.thumbnail.uri }}
                                                resizeMode='cover'
                                                className='w-full h-64 rounded-2xl'

                                            />
                                        ) :
                                            (
                                                <Image
                                                    source={{ uri: form.thumbnail }}
                                                    resizeMode='cover'
                                                    className='w-full h-64 rounded-2xl'

                                                />
                                            )
                                    }

                                    <View className='absolute  '>

                                        <View className="">
                                            <View className="relative justify-center items-center">

                                                <Image
                                                    source={icons.upload}
                                                    resizeMode='contain'
                                                    alt="upload"
                                                    className='h-8 w-8'
                                                />
                                            </View>

                                            <Text className="text-lg text-white font-pmedium">
                                                Choose a new file
                                            </Text>
                                        </View>

                                    </View>
                                </View>


                            </TouchableOpacity>
                        </View>
                    ) :

                        (
                            <></>
                        )
                }


                <Text className="text-base mt-4 mb-1 text-gray-100 font-pmedium">
                    Dog Name
                </Text>
                <UploadFormField
                    title="AI Prompt"
                    value={form.prompt}
                    // placeholder={`Prompt used to create this image`}
                    handleChangeText={(e: any) => { setForm({ ...form, prompt: e }) }}
                    otherStyles="mt-0"
                    hideIcon={true}


                />
                <CustomButton
                    title="Update & Publish"
                    handlePress={submit}
                    containerStyles="mt-7"
                    isLoading={uploading}
                />
                <CustomButton
                    title="Delete"
                    handlePress={() => { deleteMedia(cardId); router.replace('/home') }}
                    containerStyles="mt-3 border-2 border-exSec bg-gray-900 "
                    isLoading={uploading}
                    textStyles=" text-exSec  font-pmedium "
                />

            </ScrollView>
        </SafeAreaView>
    )
}

export default UpdateForm


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
