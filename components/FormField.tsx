import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { icons } from "../constants";

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }: any) => {

  const [showPassword, setShowPassword] = useState(false);
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


  const showText = () => {
    if (placeholder == null) {
      return (
        <Text className="text-base text-gray-100 font-pmedium px-3 pb-1">{title}</Text>
      )
    }
  }



  return (
    <View className={`space-y-2 ${otherStyles}`}>
      {showText()}

      <View className={`w-full h-16 px-4 bg-gray-800 rounded-2xl border-0 border-black-200 
      flex flex-row items-center   ${cStyle} `}
      >
        <TextInput
          className="flex-1 text-white font-medium "
          value={value}
          onFocus={() => { setFocused(true) }}
          onBlur={() => { setFocused(false) }}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          secureTextEntry={(title === "Password" || "Enter Password" || "Re-Enter Password") && !showPassword}
          {...props}
        />

        {(title === "Password" || title === "Confirm Password") && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;


