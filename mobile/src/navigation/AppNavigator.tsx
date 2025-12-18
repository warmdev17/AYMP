import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useAuthStore} from '../store/authStore';
import {useCoupleStore} from '../store/coupleStore';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import PairingScreen from '../screens/pairing/PairingScreen';
import TimerScreen from '../screens/timer/TimerScreen';
import SlideshowScreen from '../screens/slideshow/SlideshowScreen';
import QuickMessageScreen from '../screens/messages/QuickMessageScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#e91e63',
        tabBarInactiveTintColor: '#999',
      }}>
      <Tab.Screen
        name="Timer"
        component={TimerScreen}
        options={{
          tabBarLabel: 'Timer',
          tabBarIcon: ({color}) => (
            <Icon name="clock" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Slideshow"
        component={SlideshowScreen}
        options={{
          tabBarLabel: 'Photos',
          tabBarIcon: ({color}) => (
            <Icon name="image" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={QuickMessageScreen}
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({color}) => (
            <Icon name="message-circle" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const {isAuthenticated, isLoading, loadUser} = useAuthStore();
  const {status, fetchStatus} = useCoupleStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStatus().catch(console.error);
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return null; // Or a loading screen
  }

  const {status} = useCoupleStore();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : !status?.isPaired ? (
          <Stack.Screen name="Pairing" component={PairingScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Simple icon component - replace with react-native-vector-icons in production
const Icon = ({name, size, color}: {name: string; size: number; color: string}) => {
  return null; // Placeholder - use react-native-vector-icons
};

export default AppNavigator;

