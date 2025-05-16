import { Image, View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { router } from 'expo-router'
import { updateProfile } from '@/lib/appwrite'
import { ModalPush } from '../modal'

interface profileForm {
    username: string,
    email: string,
    password: string,
    oldPassword: string,
    confirmPassword: string,
    confirmDelete: boolean
}

const UpdateProfile = () => {
    const [showPersonalInfo, setShowPersonalInfo] = useState(false)
    const [showPasswordInfo, setShowPasswordInfo] = useState(false)
    const [showDeleteAccount, setShowDeleteAccount] = useState(false)

    const handleShowPersonalInfo = () => {
        setShowPersonalInfo((prev) => {
            const newState = !prev;
            if (newState) {
                setShowPasswordInfo(false);
                setShowDeleteAccount(false);
            }
            return newState;
        });
    };

    const handleShowPasswordInfo = () => {
        setShowPasswordInfo((prev) => {
            const newState = !prev;
            if (newState) {
                setShowPersonalInfo(false);
                setShowDeleteAccount(false);
            }
            return newState;
        });
    };

    const handleShowDeleteAccount = () => {
        setShowDeleteAccount((prev) => {
            const newState = !prev;
            if (newState) {
                setShowPersonalInfo(false);
                setShowPasswordInfo(false);
            }
            return newState;
        });
    };

    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState<profileForm>({
        username: '',
        email: '',
        oldPassword: '',
        password: '',
        confirmPassword: '',
        confirmDelete: false
    })

    useEffect(() => {
        if (!showPersonalInfo) {
            setForm((prev) => {
                let pd = { ...prev }
                pd.oldPassword = ""
                pd.password = ""
                pd.confirmPassword = ""
                return pd;
            })
        }

        if (!showPasswordInfo) {
            setForm((prev) => {
                let pd = { ...prev }
                pd.username = ""
                pd.email = ""
                return pd;
            })
        }

        if (!showPasswordInfo) {
            setForm((prev) => {
                let pd = { ...prev }
                pd.confirmDelete = false
                return pd;
            })
        }

    }, [showPersonalInfo, showPasswordInfo, showDeleteAccount])


    const renderUpdateBtn = () => {
        const disabled = !(
            (showPersonalInfo && (form.username.trim() !== '' || form.email.trim() !== '')) ||
            (showPasswordInfo && (form.oldPassword.trim() !== '' && form.password.trim() !== '' && form.confirmPassword.trim() !== ''))
        );
        return (
            <CustomButton
                title="Update"
                handlePress={disabled ? undefined : submit}
                containerStyles={`mt-7 ${disabled ? ' opacity-50' : ''}`}
                isLoading={uploading}
                disabled={disabled}
                textStyles="font-pmedium "
            />
        );
    }

    const renderDeleteBtn = () => {
        const disabled = !(form.confirmDelete);
        return (
            <CustomButton
                title="Delete"
                handlePress={disabled ? undefined : submitDelete}
                containerStyles={`mt-3 border-2 border-exSec bg-gray-900  ${disabled ? ' opacity-50' : ''}`}
                isLoading={uploading}
                disabled={disabled}
                textStyles=" text-exSec  font-pmedium "

            />
        );
    }

    const submitDelete = () => {
        console.log('delete, but not really')
    }


    const submit = async () => {

        if (form.password != form.confirmPassword) {
            ModalPush('Error', "Passwords don't match");
        }
        else {
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
                            Account Settings
                        </Text>
                    </View>
                </View>

                <View>
                    <TouchableOpacity
                        onPress={() => handleShowPersonalInfo()}
                        className="flex-row justify-between items-center 
                        py-2 pt-3 border-b border-gray-300"
                    >
                        <Text className={showPersonalInfo ?
                            'ext-md text-exSec font-psemibold' :
                            'ext-md text-white font-psemibold'}
                        >
                            Update Personal Info
                        </Text>
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
                        onPress={() => handleShowPasswordInfo()}
                        className="flex-row justify-between items-center 
                        py-2 pt-3 border-b border-gray-300"
                    >
                        <Text className={showPasswordInfo ?
                            'ext-md text-exSec font-psemibold' :
                            'ext-md text-white font-psemibold'}
                        >
                            Update Password
                        </Text>
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
                <View>

                    <TouchableOpacity
                        onPress={() => handleShowDeleteAccount()}
                        className="flex-row justify-between items-center 
                        py-2 pt-3 border-b border-gray-300"
                    >

                        <Text className={showDeleteAccount ?
                            'ext-md text-exSec font-psemibold' :
                            'ext-md text-white font-psemibold'}
                        >
                            Delete Account
                        </Text>
                        <Text className="text-lg text-white">{showDeleteAccount ? '-' : '+'}</Text>
                    </TouchableOpacity>
                    {showDeleteAccount && (
                        <View className='pt-2'>

                            <View className={`w-full h-16 px-3  rounded-2xl border-0 border-black-200 
                            flex flex-row items-center `}>

                                {/* <Text className="text-sm text-red-500 font-pregular">Delete Account</Text> */}
                                <TouchableOpacity
                                    onPress={() => setForm({ ...form, confirmDelete: !form.confirmDelete })}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginLeft: 10,
                                    }}
                                >
                                    <View
                                        style={{
                                            height: 20,
                                            width: 20,
                                            borderRadius: 4,
                                            borderWidth: 2,
                                            borderColor: 'white',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: 16,
                                            backgroundColor: form.confirmDelete ? '#FF9C01' : 'transparent',
                                        }}
                                    >
                                        {form.confirmDelete && (
                                            <View
                                                style={{
                                                    width: 10,
                                                    height: 10,
                                                    backgroundColor: '#FF9C01',
                                                    borderRadius: 2,
                                                }}
                                            />
                                        )}
                                    </View>
                                    <Text style={{ color: 'white', fontSize: 12 }}
                                        className='font-pregular text-sm'>
                                        I understand this action is permanent
                                    </Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    )}
                </View>

                {showDeleteAccount ? renderDeleteBtn() : renderUpdateBtn()}

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
