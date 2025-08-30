import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LaunchListScreen from '../screens/LaunchListScreen';
import LaunchDetailScreen from '../screens/LaunchDetailScreen';
import { RootStackParamList } from './types';
import { NAVIGATION_ROUTES } from '../constants/navigation';

const Stack = createStackNavigator<RootStackParamList>();

const LaunchStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={NAVIGATION_ROUTES.LAUNCH_LIST}
        component={LaunchListScreen}
      />
      <Stack.Screen
        name={NAVIGATION_ROUTES.LAUNCH_DETAIL}
        component={LaunchDetailScreen}
      />
    </Stack.Navigator>
  );
};

export default LaunchStack;
