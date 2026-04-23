import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Image, 
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator 
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../services/authService';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const [enrollmentId, setEnrollmentId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!enrollmentId || !password) {
      Alert.alert('Validation Error', 'Please enter both Enrollment ID and Password.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Clean Service Call - No fetch logic, no URLs, no JSON stringifying
      const result = await authService.login(enrollmentId, password);

      // 2. Handle the domain response
      if (result.success) {
        Alert.alert('Success', `Welcome, ${result.employeeName}!`);
        // navigation.replace('Dashboard');
      } else {
        Alert.alert('Login Failed', result.message || 'Invalid credentials.');
      }
    } catch (error: any) {
      Alert.alert('Connection Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-8"
      >
        <View className="items-center mb-6 mt-2">
          <Image 
            source={require('../assets/images/login_screen.png')}
            className="w-[400px] h-[200px]" 
            resizeMode="contain"
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 font-semibold mb-2 ml-1">User Enroll</Text>
          <TextInput
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-black"
            placeholder="Enter your ID (e.g., 527363)"
            placeholderTextColor="#9ca3af"
            keyboardType="numeric"
            value={enrollmentId}
            onChangeText={setEnrollmentId}
            editable={!isLoading}
          />
        </View>

        <View className="mb-8">
          <Text className="text-gray-700 font-semibold mb-2 ml-1">Password</Text>
          <TextInput
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-black"
            placeholder="Enter your password"
            placeholderTextColor="#9ca3af"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            editable={!isLoading}
          />
        </View>

        <TouchableOpacity 
          className={`w-full py-4 rounded-xl items-center shadow-sm ${isLoading ? 'bg-orange-300' : 'bg-orange-500'}`}
          onPress={handleLogin}
          disabled={isLoading}
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