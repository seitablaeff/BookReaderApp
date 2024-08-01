import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabTwoScreen from '@/app/(tabs)/two';
import TXTViewer from './TXTViewer';
import FB2Viewer from './FB2Viewer';

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="TabTwoScreen"
          component={TabTwoScreen}
          options={{ title: 'Tab Two' }}
        />
        <Stack.Screen
          name="text"
          component={TXTViewer}
          options={{ title: 'Окно просмотра txt', presentation: 'modal' }}
        />
        <Stack.Screen
          name="fb2"
          component={FB2Viewer}
          options={{ title: 'Окно просмотра fb2', presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MyStack;
