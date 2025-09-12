import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './src/store';
import './web.css';

import PostsScreen from './src/components/PostsScreen';
import UserForm from './src/components/userForm';

export type RootStackParamList = {
  Posts: undefined;
  UserForm: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ReduxProvider store={store}>
      <PaperProvider>
        <View style={styles.appContainer}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Posts">
              <Stack.Screen
                name="Posts"
                component={PostsScreen}
                options={({ navigation }) => ({
                  title: 'Posts',
                  headerRight: () => (
                    <IconButton
                      icon="account-plus" // ícono de react-native-paper
                      size={30}
                      onPress={() => navigation.navigate('UserForm')}
                    />
                  ),
                })}
              />
              <Stack.Screen
                name="UserForm"
                component={UserForm}
                options={{ title: 'Nuevo usuario' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </PaperProvider>
    </ReduxProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    width: '100%',
  },
});
