import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  // State Management for our input fields
  const [enrollmentId, setEnrollmentId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // For future API call loading state

  /*const handleLogin = () => {
    setIsLoading(true);
    console.log('Attempting login with:', enrollmentId, password);
    // navigation.replace('Dashboard'); // We will activate this after API integration
  };*/

  const handleLogin = () => {
    if (!enrollmentId || !password) {
      Alert.alert ('Validation Error', 'Please Enter Both UserName And Password!');
      return;
  }

  setIsLoading(true);

  try {
    const apiUrl = 'http://10.0.2.2:7169/api/auth/login';

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          enrollmentId: parseInt(enrollmentId, 10),
          password: password
        })
      });

      // 3. Parse the JSON response from your .NET API
      const data = await response.json();

      // 4. Handle the result
      if (response.ok && data.success) {
        Alert.alert('Success', `Welcome, ${data.employeeName}!`);
        // We will activate the navigation replacement in the next step
        // navigation.replace('Dashboard'); 
      } else {
        // API returned our custom failure message
        Alert.alert('Login Failed', data.message || 'Invalid credentials.');
      }

    } catch (error) {
      // Handles scenarios where the API is turned off or unreachable
      console.error('Network Error:', error);
      Alert.alert('Connection Error', 'Could not reach the authentication server. Ensure the API is running.');
    } finally {
      setIsLoading(false);
    }
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
            editable={!isLoading} // Disable input while loading
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
            editable={!isLoading} // Disable input while loading
          />
        </View>

        {/* Orange Sign In Button with loading state */}
        <TouchableOpacity 
          className="w-full bg-orange-500 py-4 rounded-xl items-center shadow-sm"
          onPress={handleLogin}
          disabled={isLoading} // prevent double click  
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-bold text-lg">Sign In</Text>
          )}
        </TouchableOpacity>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;