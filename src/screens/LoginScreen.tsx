import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  // State Management for our input fields
  const [enrollmentId, setEnrollmentId] = useState('');
  const [password, setPassword] = useState('');

  // Placeholder function for our future API call
  const handleLogin = () => {
    console.log('Attempting login with:', enrollmentId, password);
    // navigation.replace('Dashboard'); // We will activate this after API integration
  };

  return (
    // SafeAreaView respects the notch, bg-white sets your requested background
    <SafeAreaView className="flex-1 bg-white">
      
      {/* KeyboardAvoidingView prevents the keyboard from hiding the inputs */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-8"
      >
        
        {/* Centered Image */}
        <View className="items-center mb-4 mt-2">
          <Image 
            source={require('../assets/images/login_screen.png')}
            className="w-[500px] h-[200px]"
            resizeMode="contain"
          />
        </View>

        {/* Username / Enrollment Field */}
        <View className="mb-4">
          <Text className="text-gray-700 font-semibold mb-2 ml-1">Enrollment ID</Text>
          <TextInput
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-black"
            placeholder="Enter your ID (e.g., 527363)"
            placeholderTextColor="#9ca3af"
            keyboardType="numeric" // Forces the number pad for ID
            value={enrollmentId}
            onChangeText={setEnrollmentId}
          />
        </View>

        {/* Password Field */}
        <View className="mb-8">
          <Text className="text-gray-700 font-semibold mb-2 ml-1">Password</Text>
          <TextInput
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-black"
            placeholder="Enter your password"
            placeholderTextColor="#9ca3af"
            secureTextEntry={true} // Hides the text as dots
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Orange Sign In Button */}
        <TouchableOpacity 
          className="w-full bg-orange-500 py-4 rounded-xl items-center shadow-sm"
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-lg">Sign In</Text>
        </TouchableOpacity>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;