import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

// Define strict props for this specific screen
type Props = NativeStackScreenProps<RootStackParamList, 'Loading'>;

const LoadingScreen = ({ navigation }: Props) => {
  
  // useEffect triggers logic immediately when the screen loads
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login'); 
    }, 3000);

    // Cleanup function to prevent memory leaks if the component unmounts early
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View className="flex-1 items-center justify-center bg-[#F6F09F]">
      
        <Image
            source={require('../assets/icons/splash_icon.png')}
            className="w-40 h-40 mb-6" 
            resizeMode="contain"
        />
      
        <Text className="font-pacifico text-4xl text-center mt-4">
            Afml Sms Syncronization
        </Text>

    </View>
  );
};

export default LoadingScreen;