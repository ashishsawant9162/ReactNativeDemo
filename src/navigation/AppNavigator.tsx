import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { NotesListScreen } from '../screens/NotesListScreen';
import { AddNoteScreen } from '../screens/AddNoteScreen';
import { Text } from 'react-native';

const Stack = createStackNavigator();

const linking = {
  prefixes: [],
  config: {
    screens: {
      Notes: '/',
      AddNote: '/add'
    },
  },
};

export const AppNavigator = () => (
  <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#007AFF' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="Notes"
        component={NotesListScreen}
        options={{ title: 'My Notes' }}
      />
      <Stack.Screen
        name="AddNote"
        component={AddNoteScreen}
        options={{ title: 'Add Note' }}
      />
      
    </Stack.Navigator>
  </NavigationContainer>
);
