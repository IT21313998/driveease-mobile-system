import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { AuthContext } from '../context/AuthContext';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// App Screens
import VehicleListScreen from '../screens/vehicles/VehicleListScreen';
import VehicleDetailScreen from '../screens/vehicles/VehicleDetailScreen';
import BookVehicleScreen from '../screens/vehicles/BookVehicleScreen';
import AddVehicleScreen from '../screens/vehicles/AddVehicleScreen';
import MyBookingsScreen from '../screens/rentals/MyBookingsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const VehicleStack = createStackNavigator();

// Stack for Vehicles Tab (Catalog -> Detail -> Booking)
const VehiclesStackNavigator = () => (
  <VehicleStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#2563EB' },
      headerTintColor: '#FFFFFF',
      headerTitleStyle: { fontWeight: '700' },
    }}
  >
    <VehicleStack.Screen
      name="VehicleCatalog"
      component={VehicleListScreen}
      options={{ title: 'DriveEase Fleet' }}
    />
    <VehicleStack.Screen
      name="VehicleDetail"
      component={VehicleDetailScreen}
      options={{ title: 'Vehicle Specifications' }}
    />
    <VehicleStack.Screen
      name="BookVehicle"
      component={BookVehicleScreen}
      options={{ title: 'Reserve Vehicle' }}
    />
  </VehicleStack.Navigator>
);

// Main Bottom Tab Navigator
const AppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: '#2563EB' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '700' },
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          paddingBottom: 6,
          paddingTop: 6,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused }) => {
          let icon = '🚗';
          if (route.name === 'VehiclesTab') icon = '🚗';
          else if (route.name === 'MyBookingsTab') icon = '📋';
          else if (route.name === 'AddVehicleTab') icon = '➕';
          else if (route.name === 'ProfileTab') icon = '👤';

          return <Text style={{ fontSize: focused ? 20 : 18 }}>{icon}</Text>;
        },
      })}
    >
      <Tab.Screen
        name="VehiclesTab"
        component={VehiclesStackNavigator}
        options={{ headerShown: false, tabBarLabel: 'Fleet' }}
      />
      <Tab.Screen
        name="MyBookingsTab"
        component={MyBookingsScreen}
        options={{ title: 'My Bookings', tabBarLabel: 'Bookings' }}
      />
      <Tab.Screen
        name="AddVehicleTab"
        component={AddVehicleScreen}
        options={{ title: 'Add Vehicle', tabBarLabel: 'Add Fleet' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: 'My Account', tabBarLabel: 'Account' }}
      />
    </Tab.Navigator>
  );
};

// Root Navigator switching between Auth and App Tabs
const RootNavigator = () => {
  const { token, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <Stack.Screen name="App" component={AppTabs} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
