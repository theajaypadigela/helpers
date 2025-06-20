import { icons } from '@/constants/icons';
import Checkbox from 'expo-checkbox';
import React, { useState } from 'react';
import { Image, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

const Input = ({ text, icon }: { text: string; icon?: any }) => {
  return (
    <View className='flex flex-row items-center justify-center p-2' style={{ backgroundColor: '#F3F4F6', borderRadius: 10 }}>
      <Image className='ml-7 mr' source={icon}></Image>
      <TextInput
        className=" p-2 w-4/5 text-base text-gray-700 ml-4"
        placeholder= {text}
      />
    </View>
  );
}

export default function CreateAccount() {
  const [isSelected, setSelection] = useState(false);

  return (
    <View className='flex-1 bg-white'>      <View className='items-center mt-20 bg-white p-4'>
        <Text className='text-4xl font-semibold'>Create Account</Text>
        <Text className='text-lg m-4 text-center'>Create your account to manage your hostel efficiently.</Text>
      </View>
      <View className='flex-1 bg-white p-4 gap-4'>
        <Input text={"Enter your phone number"} icon ={icons.phone} ></Input>
        <Input text={"Enter the name of your hostel"} icon ={icons.office}></Input>
        <Input text={"Enter your hostels location"} icon ={icons.map}></Input>
        <View className="flex flex-row items-center mt-2">
          <Checkbox
            value={isSelected}
            onValueChange={setSelection}
            color={isSelected ? '#636AE8' : undefined}
            style={{ width: 20, height: 20, marginLeft: 7 }}
          />
          <Text className="ml-2">I agree with terms and conditions</Text>
        </View>

        <TouchableOpacity  onPress={() => console.log("Create Account Pressed")} className='mt-3'>
          <View className='bg-[#636AE8] p-4 rounded-lg items-center'>
            <Text className='text-white text-lg font-semibold'>Create Account</Text>
          </View>
        </TouchableOpacity>

        <View className='flex flex-row items-center justify-center mt-2'>
          <Text>Already registerd? </Text>
            <Link href={'./login'} className='text-[#636AE8]'>login</Link>
        </View>

      </View>
    </View>
  );
}
