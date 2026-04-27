import React, { useState } from 'react';
import { 
  View, Text, Switch, TouchableOpacity, ScrollView, 
  Image, BackHandler, Modal, Alert, StatusBar 
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

const DashboardScreen = ({ navigation }: Props) => {
  // --- UI STATE ---
  const [isSmsServiceEnabled, setIsSmsServiceEnabled] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // --- DYNAMIC INSETS ---
  const insets = useSafeAreaInsets();

  // --- DUMMY DATA ---
  const dummyStats = {
    received: { deposit: 0, delivery: 0, invalid: 0, total: 0 },
    processed: { pending: 0, process: 71, invalid: 3, total: 74 }
  };

  // --- BULLETPROOF SHADOW STYLE (Cross-Platform) ---
  // We use this because white-on-white requires strong, explicit depth.
  const cardShadow = {
    backgroundColor: '#ffffff',
    elevation: 8, // ANDROID: Lifts the card up on the Z-axis
    shadowColor: '#000000', // IOS: Shadow color
    shadowOffset: { width: 0, height: 4 }, // IOS: Pushes shadow slightly down
    shadowOpacity: 0.1, // IOS: Keeps the shadow soft and elegant
    shadowRadius: 6, // IOS: Blurs the shadow edges
  };

  // --- NATIVE ACTIONS ---
  const handleShutdown = () => {
    Alert.alert('Exit App!', 'Hey! Do You Want to close the AFML SMS App?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Exit', style: 'destructive', onPress: () => BackHandler.exitApp() }
    ]);
  };

  const handleProcessSync = () => {
    Alert.alert('Processing', 'Scanning device for pending SMS...');
  };

  return (
    // Changed bg-gray-100 to bg-white for the main background
    <SafeAreaView className="flex-1 bg-white" edges={['left', 'right', 'bottom']}>

      {/* make the status bar seamless */}
      <StatusBar 
        translucent={true}          // Makes the status bar float above the content
        backgroundColor="transparent" // Disables the solid status bar color
        barStyle="light-content"     // Makes the status bar icons (time, wifi) WHITE for good contrast on orange
      />
      
      {/* CUSTOM HEADER WITH ICONS */}
      <View className="bg-[#e86622] flex-row items-center justify-between px-4 py-4" style={{ paddingTop: insets.top + 16 }}>
        <TouchableOpacity onPress={handleShutdown}>
          <Image 
            source={require('../assets/icons/power_icon.png')} 
            className="w-10 h-10 tint-white" 
            resizeMode="contain"
          />
        </TouchableOpacity>
        
        <Text className="text-white text-2xl font-bold">Sunshine App Dashboard</Text>
        
        <TouchableOpacity onPress={() => setIsMenuVisible(true)}>
          <Image 
            source={require('../assets/icons/menu_dots.png')} 
            className="w-10 h-10 tint-white"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* 3-DOT OVERFLOW MENU (MODAL) */}
      <Modal visible={isMenuVisible} transparent={true} animationType="fade">
        <TouchableOpacity 
          className="flex-1 justify-start items-end pt-16 pr-4 bg-black/20"
          activeOpacity={1} 
          onPress={() => setIsMenuVisible(false)}
        >
          <View className="bg-white rounded-lg w-48 p-2" style={cardShadow}>
            <TouchableOpacity className="p-3 border-b border-gray-100" onPress={() => { setIsMenuVisible(false); Alert.alert('Check Memory'); }}>
              <Text className="text-black font-semibold">Check SMS Memory</Text>
            </TouchableOpacity>
            <TouchableOpacity className="p-3" onPress={() => { setIsMenuVisible(false); Alert.alert('SMS Report'); }}>
              <Text className="text-black font-semibold">SMS Report</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* MAIN SCROLLABLE CONTENT */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        
        {/* TOP SERVICE CONTROL CARD WITH REFRESH ICON */}
        <View className="rounded-2xl p-4 flex-row items-center justify-between mb-4" style={cardShadow}>
          <Text className="text-black font-bold text-base">Enable SMS Service</Text>
          <View className="flex-row items-center space-x-4">
            <Switch
              trackColor={{ false: "#d1d5db", true: "#fdba74" }}
              thumbColor={isSmsServiceEnabled ? "#ea580c" : "#f4f3f4"}
              onValueChange={() => setIsSmsServiceEnabled(!isSmsServiceEnabled)}
              value={isSmsServiceEnabled}
            />
            <TouchableOpacity onPress={handleProcessSync}>
              <Image 
                source={require('../assets/icons/refresh_icon.png')} 
                className="w-8 h-8"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* NAVIGATION ACTION CARDS WITH CUSTOM IMAGES */}
        <View className="flex-row justify-between mb-4">
          {/* SMS Not Pass Card */}
          <TouchableOpacity 
            className="w-[48%] rounded-2xl p-4 items-center justify-center"
            style={cardShadow}
            onPress={() => navigation.navigate('SmsNotSync')}
          >
            <View className="h-24 w-24 mb-2 items-center justify-center">
              <Image 
                source={require('../assets/images/sms_not_pass.png')} 
                className="w-full h-full" 
                resizeMode="contain" 
              />
            </View>
            <Text className="text-black font-bold text-center">SMS Not Pass</Text>
          </TouchableOpacity>

          {/* SMS Not Process Card */}
          <TouchableOpacity 
            className="w-[48%] rounded-2xl p-4 items-center justify-center"
            style={cardShadow}
            onPress={() => navigation.navigate('DataNotProcess')}
          >
            <View className="h-24 w-24 mb-2 items-center justify-center">
              <Image 
                source={require('../assets/images/sms_not_process.png')} 
                className="w-full h-full" 
                resizeMode="contain" 
              />
            </View>
            <Text className="text-black font-bold text-center">SMS Not Process</Text>
          </TouchableOpacity>
        </View>

        {/* STATISTICS CARDS */}
        <View className="flex-row justify-between mb-4">
          
          {/* SMS Received Card */}
          <View className="w-[48%] rounded-2xl p-4" style={cardShadow}>
            <Text className="text-[#ff6b6b] font-bold text-sm mb-2 text-center">SMS Received:</Text>
            <View className="h-[1px] bg-black mb-2" />
            
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500 text-xs font-bold">Deposit SMS</Text>
              <Text className="text-[#ff6b6b] font-bold text-xs">{dummyStats.received.deposit}</Text>
            </View>
            <View className="h-[1px] bg-gray-200 mb-2" />
            
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500 text-xs font-bold">Delivery SMS</Text>
              <Text className="text-[#ff6b6b] font-bold text-xs">{dummyStats.received.delivery}</Text>
            </View>
            <View className="h-[1px] bg-gray-200 mb-2" />
            
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500 text-xs font-bold">Invalid SMS</Text>
              <Text className="text-[#ff6b6b] font-bold text-xs">{dummyStats.received.invalid}</Text>
            </View>
            <View className="h-[2px] bg-gray-400 mb-2" />
            
            <View className="flex-row justify-between">
              <Text className="text-[#ff6b6b] text-xs font-bold">Total SMS</Text>
              <Text className="text-black font-bold text-xs">{dummyStats.received.total}</Text>
            </View>
          </View>

          {/* Data Process Card */}
          <View className="w-[48%] rounded-2xl p-4" style={cardShadow}>
            <Text className="text-[#ff6b6b] font-bold text-sm mb-2 text-center">Data Process</Text>
            <View className="h-[1px] bg-black mb-2" />
            
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500 text-xs font-bold">Pending</Text>
              <Text className="text-[#ff6b6b] font-bold text-xs">{dummyStats.processed.pending}</Text>
            </View>
            <View className="h-[1px] bg-gray-200 mb-2" />
            
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500 text-xs font-bold">Process</Text>
              <Text className="text-[#ff6b6b] font-bold text-xs">{dummyStats.processed.process}</Text>
            </View>
            <View className="h-[1px] bg-gray-200 mb-2" />
            
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500 text-xs font-bold">Invalid</Text>
              <Text className="text-[#ff6b6b] font-bold text-xs">{dummyStats.processed.invalid}</Text>
            </View>
            <View className="h-[2px] bg-gray-400 mb-2" />
            
            <View className="flex-row justify-between">
              <Text className="text-[#ff6b6b] text-xs font-bold">Total Process</Text>
              <Text className="text-black font-bold text-xs">{dummyStats.processed.total}</Text>
            </View>
          </View>

        </View>

        {/* BOTTOM STATUS CARD */}
        <View className="rounded-2xl h-48 items-center justify-center mb-10" style={cardShadow}>
          <Text className="text-[#ff6b6b] font-bold text-lg text-center px-4">
            You are connected to WiFi{'\n'}Licence Varified
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;