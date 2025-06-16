import { View, Text, SafeAreaView, ScrollView, StyleSheet, Image } from 'react-native'
import { Link, router } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { getCurrentUser, signIn } from '../../lib/appwrite'
import { useGlobalContext } from '@/context/GlobalProvider'
import { ModalPush } from '@/app/modal'
import LoadingScreen from "@/components/LoadingScreen";

const SignIn = () => {

    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const { setUser, setIsLogged } = useGlobalContext();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = async () => {


        if (!form.email || !form.password) {
            ModalPush('Error', 'Please fill in all fields');
        }

        setIsSubmitting(true);

        try {
            await signIn(form.email, form.password);
            const result = await getCurrentUser();
            handleLoading()

            setUser(result);
            setIsLogged(true);

        } catch (error: any) {
            const errorMessage = error.message.replace(/^AppwriteException:\s*/, '');
            ModalPush('Error', errorMessage);
            setIsSubmitting(false);
            throw new Error(error);
        }
    }
    const [loading, setLoading] = useState(false);
    const handleLoading = () => {
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            router.replace({
                pathname: '/modal',
                params: { title: 'Success', message: 'You have successfully logged in', nextScreen: '/home' }
            })
        }, 3000);

    }

    return loading ?
        (<LoadingScreen message={'TIP: tap the picture'} />)
        : (<SafeAreaView className="bg-exPrime h-full">
            <ScrollView>

                <View className='w-full justify-center  
                px-4 my-0 min-h-[100vh] '>

                    <View className='items-center'>
                        <Image source={images.hdog} resizeMode='contain'
                            className='w-60 h-60'
                        />

                        <Text className='text-2xl text-white font-semibold '>
                            Log into <Text className='text-exSec asdf'>OnlyDogs</Text>

                        </Text>
                    </View>

                    <FormField
                        title="Email"
                        value={form.email}
                        handleChangeText={(e: any) => setForm({
                            ...form,
                            email: e
                        })}
                        otherStyles='mt-7'
                        keyboardType="email-address"
                    />

                    <FormField
                        title='Password'
                        value={form.password}
                        handleChangeText={(e: any) => setForm({
                            ...form,
                            password: e
                        })}
                        otherStyles='mt-7'
                        keyboardType='password'
                    // placeholder='abc123'

                    />

                    <CustomButton
                        title="Sign In"
                        handlePress={submit}
                        containerStyles="mt-7"
                        isLoading={isSubmitting}
                    />

                    <View className='justify-center pt-5 flex-row gap-2'>
                        <Text className='text-sm text-gray-600 font-psemibold'>
                            Don't have an account?
                        </Text>
                        <Link className='text-sm text-exSec'
                            href="/sign-up">
                            Sign-up
                        </Link>
                    </View>

                </View>

            </ScrollView>
        </SafeAreaView>
        )
}

export default SignIn;
