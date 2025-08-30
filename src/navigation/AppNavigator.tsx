import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import LaunchStack from './LaunchStack';
import { NAVIGATION_ROUTES } from '../constants/navigation';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'rocket-outline';

            if (route.name === NAVIGATION_ROUTES.Launches) {
              iconName = focused ? 'rocket' : 'rocket-outline';
            } else {
              iconName = focused
                ? 'information-circle'
                : 'information-circle-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name={NAVIGATION_ROUTES.Launches} component={LaunchStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
