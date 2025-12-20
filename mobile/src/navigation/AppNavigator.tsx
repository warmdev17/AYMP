import React, { useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuthStore } from "../store/authStore";
import { useCoupleStore } from "../store/coupleStore";

// Screens
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import PairingScreen from "../screens/pairing/PairingScreen";
import TimerScreen from "../screens/timer/TimerScreen";
import SlideshowScreen from "../screens/slideshow/SlideshowScreen";
import QuickMessageScreen from "../screens/messages/QuickMessageScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#e91e63",
        tabBarInactiveTintColor: "#999",
      }}
    >
      <Tab.Screen
        name="Timer"
        component={TimerScreen}
        options={{
          tabBarLabel: "Timer",
          tabBarIcon: ({ color }) => (
            <Icon name="clock" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Slideshow"
        component={SlideshowScreen}
        options={{
          tabBarLabel: "Photos",
          tabBarIcon: ({ color }) => (
            <Icon name="image" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={QuickMessageScreen}
        options={{
          tabBarLabel: "Messages",
          tabBarIcon: ({ color }) => (
            <Icon name="message-circle" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated, isLoading, loadUser } = useAuthStore();
  const { status, fetchStatus } = useCoupleStore();
  const navigationRef = useRef<any>(null);
  const [isNavigationReady, setIsNavigationReady] = React.useState(false);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStatus().catch(console.error);
    }
  }, [isAuthenticated]);

  // Navigate when pairing status changes (backup to key prop)
  useEffect(() => {
    if (!isLoading && isAuthenticated && isNavigationReady && navigationRef.current && status) {
      const currentRoute = navigationRef.current.getCurrentRoute();
      const currentRouteName = currentRoute?.name;
      
      if (status.isPaired && currentRouteName !== 'Main') {
        // Reset navigation stack to Main when paired
        setTimeout(() => {
          if (navigationRef.current) {
            navigationRef.current.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            });
          }
        }, 200);
      }
    }
  }, [status?.isPaired, isAuthenticated, isLoading, isNavigationReady]);

  if (isLoading) {
    return null; // Or a loading screen
  }

  // Determine initial route based on auth and pairing status
  const getInitialRouteName = () => {
    if (!isAuthenticated) return 'Login';
    if (!status?.isPaired) return 'Pairing';
    return 'Main';
  };

  return (
    <NavigationContainer 
      ref={navigationRef}
      onReady={() => setIsNavigationReady(true)}
    >
      <Stack.Navigator 
        key={`${isAuthenticated}-${status?.isPaired}`}
        initialRouteName={getInitialRouteName()}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Pairing" component={PairingScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Simple icon component - replace with react-native-vector-icons in production
const Icon = ({
  name,
  size,
  color,
}: {
  name: string;
  size: number;
  color: string;
}) => {
  return null; // Placeholder - use react-native-vector-icons
};

export default AppNavigator;
