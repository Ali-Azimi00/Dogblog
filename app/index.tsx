import { StatusBar } from "expo-status-bar";
import { Redirect, router } from 'expo-router'
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import '../global.css';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants'
import CustomButton from '../components/CustomButton';
import { useGlobalContext } from '../context/GlobalProvider';


export default function App() {

  const { user, isLoading, isLogged }: any = useGlobalContext();

  if (!isLoading && isLogged) {
    return <Redirect href="/home" />
  }

  return (
    <SafeAreaView className="bg-exPrime h-full" style={styles.container}  >

      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="w-full h-full px-4 justify-center  items-center pt-0">

          <Image source={images.hdog}
            className="w-80 h-80"
            resizeMode="contain"
          />

          <View className="relative mt-0">
            <Text className="text-3xl text-white font-bold text-center">
              The #1 place to find a good-boy{' '}
              <Text className="text-exSec">OnlyDogs</Text>
            </Text>
            <Image source={images.path}
              className="w-[150px] h-[15px] absolute -bottom-2 -right-0"
              resizeMode="contain"
            />
          </View>

          <Text
            className="text-sm text-gray-700 font-pregular mt-4 text-center">
            Where creativity meets innovation: emBARK on a journey
          </Text>

          {
            user ?
              (<CustomButton
                title="Wuff"
                handlePress={() => { router.push('/home'); }}
                containerStyles="w-full mt-7 " />)
              :
              (<CustomButton
                title="Sign-In"
                handlePress={() => router.push('/sign-in')}
                containerStyles="w-full mt-7 " />)
          }

        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  )


}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

})







