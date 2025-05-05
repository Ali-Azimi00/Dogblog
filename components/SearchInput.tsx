import { useEffect, useState } from "react";
import { View, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { icons } from "../constants";
import { usePathname, router } from "expo-router";
import { ModalPush } from '@/app/modal'

const SearchInput = ({ title, value, searchPlaceholder,
    handleChangeText, otherStyles, initialQuery,
    ...props }: any) => {

    const pathname = usePathname();

    const [query, setQuery] = useState(initialQuery || '');
    const [focused, setFocused] = useState(false);
    const [cStyle, setCStyle] = useState("");

    useEffect(() => {
        if (focused) {
            setCStyle('fieldRing')
        }
        else {
            setCStyle('')
        }
    }, [focused])


    return (
        <View className={`space-y-2 ${otherStyles}`}>

            <View className={`w-full h-16 px-4 bg-gray-800 
            rounded-2xl border-0 border-black-200 
            flex flex-row justify-center items-center   
            ${cStyle} `}
            >
                <TextInput
                    className="flex-1 text-white text-sm "
                    value={query}
                    onFocus={() => { setFocused(true) }}
                    onBlur={() => { setFocused(false) }}
                    placeholder={searchPlaceholder}
                    placeholderTextColor="#7B7B8B"
                    onChangeText={(e) => { setQuery(e) }}
                // {...props}
                />

                <TouchableOpacity onPress={() => {
                    if (!query) {
                        // return Alert.alert('Missing query', "Please input something to search results across database")
                        ModalPush('Missing query', "Please input something to search results across database");

                    } else {
                        if (pathname.startsWith('/search')) {
                            router.setParams({ query })
                        }
                        else {
                            router.push(`/search/${query}`)
                        }
                    }
                }}
                >
                    <Image
                        source={icons.search}
                        className="w-6 h-6"
                        resizeMode="contain"
                    />
                </TouchableOpacity>

            </View>
        </View>
    );
};

export default SearchInput;


