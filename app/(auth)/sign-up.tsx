import { View, Text, SafeAreaView, ScrollView, Image } from 'react-native'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { createUser } from '../../lib/appwrite'
import { useGlobalContext } from '@/context/GlobalProvider'
import { ModalPush } from '@/app/modal'

const SignUp = () => {
    const { setUser, setIsLogged } = useGlobalContext();
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: ''
    })

    const [formCheck, setFormCheck] = useState({
        username: '',
        email: '',
        password: ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false);



    const submit = async () => {
        if (!form.username || !form.email || !form.password) {

            // Alert.alert('Error', 'plese fill in all fields')            
            ModalPush('Error', 'Please fill in all fields')
        }
        else if (form.password != formCheck.password) {
            // Alert.alert('Error', "Passwords don't match")
            ModalPush('Error', "Passwords don't match")

        } else {
            setIsSubmitting(true);

            try {
                const result = await createUser(form.email, form.password, form.username);
                setUser(result);
                setIsLogged(true);
                router.replace('/home');
            } catch (error: any) {
                // Alert.alert('Error1', error.message)
                ModalPush('Error', error.message)
            }
            finally {
                setIsSubmitting(false);
            }
        }

    }


    return (
        <SafeAreaView className="bg-exPrime h-full">
            <ScrollView>

                <View className='w-full justify-center  
                px-4 my-0 min-h-[100vh] '>

                    <View className='items-center '>
                        <Image source={images.hdog} resizeMode='contain'
                            className='w-60 h-60 '
                        />

                        <Text className='text-2xl text-white font-semibold '>
                            Sign-up for <Text className='text-exSec '>OnlyDogs</Text>

                        </Text>
                    </View>

                    <FormField
                        title="Username"
                        value={form.username}
                        handleChangeText={(e: any) => setForm({
                            ...form,
                            username: e
                        })}
                        otherStyles='mt-4'
                        keyboardType='email-address'
                        placeholder='Username'

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
                        placeholder='Email'

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
                        placeholder='Password'

                    />
                    <FormField
                        title='Confirm Password'
                        value={formCheck.password}
                        handleChangeText={(e: any) => setFormCheck({
                            ...formCheck,
                            password: e
                        })}
                        otherStyles='mt-4'
                        keyboardType='password'
                        placeholder='Confirm Password'

                    />

                    <CustomButton
                        title="Sign Up"
                        handlePress={submit}
                        containerStyles="mt-7"
                        isLoading={isSubmitting}
                    />


                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default SignUp;
