import { useEffect, useState } from "react";
import { View, TextInput } from "react-native";

const UploadFormField = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }: any) => {

    const [focused, setFocused] = useState(false);
    const [cStyle, setCStyle] = useState("")

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

            <View className={`w-full h-16 px-4 bg-gray-800 rounded-2xl 
            border-0 border-black-200 
            flex flex-row items-center   ${cStyle} `}
            >
                <TextInput
                    className="flex-1 text-white text-sm text-base"
                    value={value}
                    onFocus={() => { setFocused(true) }}
                    onBlur={() => { setFocused(false) }}
                    placeholder={placeholder}
                    placeholderTextColor="#7B7B8B"
                    onChangeText={handleChangeText}
                    secureTextEntry={false}
                />


            </View>
        </View>
    );
};

export default UploadFormField;


