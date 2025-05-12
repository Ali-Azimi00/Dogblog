import { Image, View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { router } from 'expo-router'
import { updateProfile } from '@/lib/appwrite'
import { useGlobalContext } from '@/context/GlobalProvider'
import { ModalPush } from '../modal'

interface profileForm {
    username: string,
    email: string,
    password: string,
    oldPassword: string,
    confirmPassword: string
}

const UpdateProfile = () => {
    const [showPersonalInfo, setShowPersonalInfo] = useState(false)
    const [showPasswordInfo, setShowPasswordInfo] = useState(false)

    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState<profileForm>({
        username: '',
        email: '',
        oldPassword: '',
        password: '',
        confirmPassword: '',
    })


    const submit = async () => {

        if (form.password != form.confirmPassword) {
            ModalPush('Error', "Passwords don't match");

        }
        else {
            console.log('starting upload')
            setUploading(true);
            try {
                await updateProfile(form)
                router.push({
                    pathname: '/modal',
                    params: {
                        title: 'Success',
                        message: "Profile Updated",
                        nextScreen: '/profile',
                        nextScreenParams: [1]
                    }
                })

            } catch (error: any) {
                throw new Error(error);
            }

            setUploading(false);
        }

    }


    return (
        <SafeAreaView className='bg-exPrime h-full'>
            <ScrollView className="px-4 my-6 ">

                <View className="flex-row items-center justify-between mt-4 mb-4">
                    <View className="flex-row">
                        <Text className='text-2xl  text-white font-psemibold '>
                            Update Info
                        </Text>
                    </View>
                </View>

                <View>
                    <TouchableOpacity
                        onPress={() => setShowPersonalInfo(!showPersonalInfo)}
                        className="flex-row justify-between items-center py-3 border-b border-gray-300"
                    >
                        <Text className="text-lg text-white font-semibold">Personal Info</Text>
                        <Text className="text-lg text-white">{showPersonalInfo ? '-' : '+'}</Text>
                    </TouchableOpacity>
                    {showPersonalInfo && (
                        <View>
                            <FormField
                                title="Username"
                                value={form.username}
                                handleChangeText={(e: any) => setForm({
                                    ...form,
                                    username: e
                                })}
                                otherStyles='mt-4'
                                keyboardType='email-address'
                                placeholder='New Username'
                            />
                            <FormField
                                title="Email"
                                value={form.email}
                                handleChangeText={(e: any) => setForm({
                                    ...form,
                                    email: e
                                })}
                                otherStyles='mt-4'
                                keyboardType="email-address"
                                placeholder='New Email'
                            />
                        </View>
                    )}
                </View>

                <View>
                    <TouchableOpacity
                        onPress={() => setShowPasswordInfo(!showPasswordInfo)}
                        className="flex-row justify-between items-center py-3 border-b border-gray-300"
                    >
                        <Text className="text-lg text-white font-semibold">Password Info</Text>
                        <Text className="text-lg text-white">{showPasswordInfo ? '-' : '+'}</Text>
                    </TouchableOpacity>
                    {showPasswordInfo && (
                        <View>
                            <FormField
                                title='Password'
                                value={form.oldPassword}
                                handleChangeText={(e: any) => setForm({
                                    ...form,
                                    oldPassword: e
                                })}
                                otherStyles='mt-4'
                                keyboardType='password'
                                placeholder='Old Password'
                            />
                            <FormField
                                title='Password'
                                value={form.password}
                                handleChangeText={(e: any) => setForm({
                                    ...form,
                                    password: e
                                })}
                                otherStyles='mt-4'
                                keyboardType='password'
                                placeholder='New Password'
                            />
                            <FormField
                                title='Confirm Password'
                                value={form.confirmPassword}
                                handleChangeText={(e: any) => setForm({
                                    ...form,
                                    confirmPassword: e
                                })}
                                otherStyles='mt-4'
                                keyboardType='password'
                                placeholder='Confirm New Password'
                            />
                        </View>
                    )}
                </View>

                <CustomButton
                    title="Update"
                    handlePress={submit}
                    containerStyles="mt-7"
                    isLoading={uploading}
                />

            </ScrollView>
        </SafeAreaView>
    )
}

export default UpdateProfile


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
