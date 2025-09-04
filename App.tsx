import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './src/store';
import './web.css';

import PostsScreen from './src/components/PostsScreen';
import UserForm from './src/components/userForm';

const Stack = createStackNavigator();

export default function App() {
  return (
    <ReduxProvider store={store}>
      <PaperProvider>
        {/* Contenedor principal que ocupa toda la altura del viewport */}
        <View style={styles.appContainer}>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Formulario" component={UserForm} />
              <Stack.Screen name="Posts" component={PostsScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </PaperProvider>
    </ReduxProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1, // ocupa toda la altura disponible en React Native
    width: '100%',
  },
});



