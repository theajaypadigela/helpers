import { icons } from '@/constants/icons';
import { router } from 'expo-router';
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

const Input = ({ text, icon }: { text: string; icon?: any }) => {
  return (
    <View className='flex flex-row items-center justify-center p-2 w-11/12' style={{ backgroundColor: '#F3F4F6', borderRadius: 10 }}>
      <Image className='ml-6' source={icon}></Image>
      <TextInput
        className=" p-2 w-4/5 text-base text-gray-700 ml-0"
        placeholder= {text}
        keyboardType="numeric"
        maxLength={6}
        textAlign="center"
      />
    </View>
  );
}

export default function Login() {
  return (
    <View className='flex-1 bg-white justify-center items-center' style={{ marginTop: -50 }}>      <View className='items-center bg-white p-4 mb-6'>
        <Text className='text-4xl font-semibold'>Enter your OTP</Text>
        <Text className='text-lg m-4 text-center'>Enter Your OTP sent to your mobile</Text>
      </View>
      <View className='w-full items-center gap-2 px-4'>
        <Input text = {"Enter OTP"} icon={icons.lock}></Input>
            <TouchableOpacity onPress={() => router.replace('/(tabs)')} className='mt-6 w-11/12'>
          <View className='bg-[#636AE8] p-4 rounded-lg items-center'>
            <Text className='text-white text-lg font-semibold'>Login</Text>
          </View>
        </TouchableOpacity>
        <View className='mt-4 flex-row'>
          <Text className='text-gray-600'>New here? </Text>
          <TouchableOpacity onPress={() => router.push('/login/create_account')}>
            <Text className='text-[#636AE8]'>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}