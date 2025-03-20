import { Link } from "expo-router";
import { View } from "react-native";
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import CustomText from '@/components/CustomText';

export default function Index() {
  const [fontsLoaded] = useFonts({
    'Quicksand-Regular': require('@/assets/fonts/Quicksand-Regular.ttf'),
    'Quicksand-Medium': require('@/assets/fonts/Quicksand-Medium.ttf'),
    'Quicksand-Bold': require('@/assets/fonts/Quicksand-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />; // Hoặc return null để chờ font load
  }
  return (
    <View className="flex-1 justify-center items-center"
    >
      <CustomText className="text-5xl text-primary font-bold">Welcome</CustomText>
      <Link style={{fontFamily:'Quicksand-Bold'}} href="/onboarding">onboarding</Link>
    </View>
  );
}
