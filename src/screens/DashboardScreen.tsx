import React, { useState, useEffect } from 'react';
import { 
  View, Text, Switch, TouchableOpacity, ScrollView, 
  Image, BackHandler, Modal, Alert, StatusBar, PermissionsAndroid, StyleSheet 
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import SmsAndroid from 'react-native-get-sms-android';
import { getDashboardStats } from '../services/dashboardService';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

const DashboardScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const [isSmsServiceEnabled, setIsSmsServiceEnabled] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // --- LOCAL SMS STATE ("SMS Received" Card) ---
  const [mobileSmsTotal, setMobileSmsTotal] = useState(0);
  const [localSmsStats, setLocalSmsStats] = useState({
    deposit: 0,
    delivery: 0,
    invalid: 0
  });

  // --- DATABASE STATE ("Data Process" Card) ---
  const [dbStats, setDbStats] = useState({
    process: 0,
    invalid: 0,
    totalDbCount: 0
  });

  // --- THE MATH ---
  const pendingCount = mobileSmsTotal - dbStats.totalDbCount;
  const safePendingCount = pendingCount > 0 ? pendingCount : 0; 
  const totalProcessCount = safePendingCount + dbStats.process + dbStats.invalid;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // 1. SILENT PERMISSION CHECK
      const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS);

      if (hasPermission) {
        // 2. READ LOCAL SMS
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        let filter = {
          box: 'inbox', 
          minDate: startOfToday.getTime(), 
        };

        SmsAndroid.list(
          JSON.stringify(filter),
          (fail: any) => { console.log('Failed to read SMS', fail); },
          (count: number, smsList: string) => {
            setMobileSmsTotal(count);
            const messages = JSON.parse(smsList);
            
            let depositCount = 0;
            let deliveryCount = 0;
            let invalidCount = 0;

            messages.forEach((msg: any) => {
              const body = msg.body ? msg.body.trim().toLowerCase() : '';
              // CORRECTED LOGIC: dlv = Delivery, dpz = Deposit
              if (body.startsWith('dlv')) {
                deliveryCount++;
              } else if (body.startsWith('dpz')) {
                depositCount++;
              } else {
                invalidCount++;
              }
            });

            setLocalSmsStats({ deposit: depositCount, delivery: deliveryCount, invalid: invalidCount });

            setLocalSmsStats({ deposit: depositCount, delivery: deliveryCount, invalid: invalidCount });
          }
        );
      } else {
        Alert.alert("Permission Required", "Please go to Settings -> Apps -> Sunshine App -> Permissions and allow SMS access.");
      }

      // 3. FETCH DATABASE STATS VIA API
      const result = await getDashboardStats();
      if (result.success) {
        setDbStats({
          process: result.data.processedCount,
          invalid: result.data.invalidCount,
          totalDbCount: result.data.totalDbCount
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const handleProcessSync = () => {
    Alert.alert('Processing', 'Fetching latest data...');
    fetchDashboardData();
  };

  const handleShutdown = () => {
    Alert.alert('Exit App!', 'Do You Want to close the App?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Exit', style: 'destructive', onPress: () => BackHandler.exitApp() }
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['right', 'bottom', 'left']}>
      <StatusBar translucent={true} backgroundColor="transparent" barStyle="light-content" />

      {/* HEADER */}
      <View className="bg-[#e86622] flex-row items-center justify-between px-4 pb-4" style={{ paddingTop: insets.top + 16 }}>
        <TouchableOpacity onPress={handleShutdown}>
          <Image source={require('../assets/icons/power_icon.png')} className="w-6 h-6 tint-white" resizeMode="contain" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Sunshine App Dashboard</Text>
        <TouchableOpacity onPress={() => setIsMenuVisible(true)}>
          <Image source={require('../assets/icons/menu_dots.png')} className="w-6 h-6 tint-white" resizeMode="contain" />
        </TouchableOpacity>
      </View>

      {/* MODAL */}
      <Modal visible={isMenuVisible} transparent={true} animationType="fade">
        <TouchableOpacity className="flex-1 justify-start items-end pt-16 pr-4 bg-black/20" activeOpacity={1} onPress={() => setIsMenuVisible(false)}>
          <View className="bg-white rounded-lg w-48 p-2" style={styles.cardShadow}>
            <TouchableOpacity className="p-3 border-b border-gray-100" onPress={() => setIsMenuVisible(false)}>
              <Text className="text-black font-semibold">Check SMS Memory</Text>
            </TouchableOpacity>
            <TouchableOpacity className="p-3" onPress={() => setIsMenuVisible(false)}>
              <Text className="text-black font-semibold">SMS Report</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* ENABLE SMS SERVICE */}
        <View className="rounded-2xl p-4 flex-row items-center justify-between mb-4" style={styles.cardShadow}>
          <Text className="text-black font-bold text-base">Enable SMS Service</Text>
          <View className="flex-row items-center space-x-4">
            <Switch trackColor={{ false: "#d1d5db", true: "#fdba74" }} thumbColor={isSmsServiceEnabled ? "#ea580c" : "#f4f3f4"} onValueChange={() => setIsSmsServiceEnabled(!isSmsServiceEnabled)} value={isSmsServiceEnabled} />
            <TouchableOpacity onPress={handleProcessSync}>
              <Image source={require('../assets/icons/refresh_icon.png')} className="w-8 h-8" resizeMode="contain" />
            </TouchableOpacity>
          </View>
        </View>

        {/* NAVIGATION CARDS */}
        <View className="flex-row justify-between mb-4">
          <TouchableOpacity className="w-[48%] rounded-2xl p-4 items-center justify-center" style={styles.cardShadow} onPress={() => navigation.navigate('SmsNotSync')}>
            <View className="h-24 w-24 mb-2 items-center justify-center">
              <Image source={require('../assets/images/sms_not_pass.png')} className="w-full h-full" resizeMode="contain" />
            </View>
            <Text className="text-black font-bold text-center">SMS Not Pass</Text>
          </TouchableOpacity>

          <TouchableOpacity className="w-[48%] rounded-2xl p-4 items-center justify-center" style={styles.cardShadow} onPress={() => navigation.navigate('DataNotProcess')}>
            <View className="h-24 w-24 mb-2 items-center justify-center">
              <Image source={require('../assets/images/sms_not_process.png')} className="w-full h-full" resizeMode="contain" />
            </View>
            <Text className="text-black font-bold text-center">SMS Not Process</Text>
          </TouchableOpacity>
        </View>

        {/* STATS CARDS */}
        <View className="flex-row justify-between mb-4">
          
          {/* SMS RECEIVED CARD (Local) */}
          <View className="w-[48%] rounded-2xl p-4" style={styles.cardShadow}>
            <Text className="text-[#ff6b6b] font-bold text-sm mb-2 text-center">SMS Received:</Text>
            <View className="h-[1px] bg-black mb-2" />
            <View className="flex-row justify-between mb-2"><Text className="text-gray-500 text-xs font-bold">Deposit SMS</Text><Text className="text-[#ff6b6b] font-bold text-xs">{localSmsStats.deposit}</Text></View>
            <View className="h-[1px] bg-gray-200 mb-2" />
            <View className="flex-row justify-between mb-2"><Text className="text-gray-500 text-xs font-bold">Delivery SMS</Text><Text className="text-[#ff6b6b] font-bold text-xs">{localSmsStats.delivery}</Text></View>
            <View className="h-[1px] bg-gray-200 mb-2" />
            <View className="flex-row justify-between mb-2"><Text className="text-gray-500 text-xs font-bold">Invalid SMS</Text><Text className="text-[#ff6b6b] font-bold text-xs">{localSmsStats.invalid}</Text></View>
            <View className="h-[2px] bg-gray-400 mb-2" />
            <View className="flex-row justify-between"><Text className="text-[#ff6b6b] text-xs font-bold">Total SMS</Text><Text className="text-black font-bold text-xs">{mobileSmsTotal}</Text></View>
          </View>

          {/* DATA PROCESS CARD (API + Math) */}
          <View className="w-[48%] rounded-2xl p-4" style={styles.cardShadow}>
            <Text className="text-[#ff6b6b] font-bold text-sm mb-2 text-center">Data Process</Text>
            <View className="h-[1px] bg-black mb-2" />
            <View className="flex-row justify-between mb-2"><Text className="text-gray-500 text-xs font-bold">Pending</Text><Text className="text-[#ff6b6b] font-bold text-xs">{safePendingCount}</Text></View>
            <View className="h-[1px] bg-gray-200 mb-2" />
            <View className="flex-row justify-between mb-2"><Text className="text-gray-500 text-xs font-bold">Process</Text><Text className="text-[#ff6b6b] font-bold text-xs">{dbStats.process}</Text></View>
            <View className="h-[1px] bg-gray-200 mb-2" />
            <View className="flex-row justify-between mb-2"><Text className="text-gray-500 text-xs font-bold">Invalid</Text><Text className="text-[#ff6b6b] font-bold text-xs">{dbStats.invalid}</Text></View>
            <View className="h-[2px] bg-gray-400 mb-2" />
            <View className="flex-row justify-between"><Text className="text-[#ff6b6b] text-xs font-bold">Total Process</Text><Text className="text-black font-bold text-xs">{totalProcessCount}</Text></View>
          </View>

        </View>

        {/* BOTTOM STATUS */}
        <View className="rounded-2xl h-48 items-center justify-center mb-10" style={styles.cardShadow}>
          <Text className="text-[#ff6b6b] font-bold text-lg text-center px-4">You are connected to WiFi{'\n'}Licence Varified</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: { padding: 16 },
  cardShadow: { backgroundColor: '#ffffff', elevation: 8, shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6 },
});

export default DashboardScreen;