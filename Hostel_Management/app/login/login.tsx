import { icons } from '@/constants/icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from "react-native";

const Input = ({ text, icon, value, onChangeText }: { text: string; icon?: any; value?: string; onChangeText?: (text: string) => void }) => {
  return (
    <View className='flex flex-row items-center justify-center p-2 w-11/12' style={{ backgroundColor: '#F3F4F6', borderRadius: 10 }}>
      <Image className='ml-7 mr' source={icon}></Image>
      <TextInput
        className=" p-2 w-4/5 text-base text-gray-700 ml-4"
        placeholder={text}
        value={value}
        onChangeText={onChangeText}
        keyboardType="phone-pad"
        maxLength={10}
      />
    </View>
  );
}

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValidPhone, setIsValidPhone] = useState(true);

  const validatePhoneNumber = (phone: string): boolean => {

    const cleanPhone = phone.replace(/[^\d]/g, '');

    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(cleanPhone);
  };

  const handlePhoneChange = (text: string) => {
    // Only allow digits
    const numericText = text.replace(/[^\d]/g, '');
    setPhoneNumber(numericText);
    
    // Reset validation state when user starts typing
    if (!isValidPhone) {
      setIsValidPhone(true);
    }
  };

  const handleSendOTP = () => {
    if (validatePhoneNumber(phoneNumber)) {
      setIsValidPhone(true);
      router.push('/login/otp');
    } else {
      setIsValidPhone(false);
      Alert.alert(
        'Invalid Phone Number',
        'Please enter a valid 10-digit mobile number',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View className='flex-1 bg-white justify-center items-center' style={{ marginTop: -50 }}>
      <View className='items-center bg-white p-4 mb-8'>
        <Text className='text-4xl font-semibold'>Login</Text>
        <Text className='text-lg m-4 text-center'>Login to manage your hostel efficiently.</Text>
      </View>
      <View className='w-full items-center gap-4 px-4'>
        <Input 
          text="Enter your mobile number" 
          icon={icons.phone}
          value={phoneNumber}
          onChangeText={handlePhoneChange}
        />
        {!isValidPhone && (
          <Text className='text-red-500 text-sm mt-2'>Please enter a valid 10-digit mobile number</Text>
        )}
        <TouchableOpacity onPress={handleSendOTP} className='mt-6 w-11/12'>
          <View className={`p-4 rounded-lg items-center ${phoneNumber.length === 10 ? 'bg-[#636AE8]' : 'bg-gray-400'}`}>
            <Text className='text-white text-lg font-semibold'>Send OTP</Text>
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