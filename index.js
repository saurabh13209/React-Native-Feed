import { AppRegistry } from 'react-native';
import App from './src/HomeScreen';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react'
import CreateFeed from './src/CreateFeed';

const Stack = createStackNavigator();


export const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen component={App} name="Home Screen" />
                <Stack.Screen component={CreateFeed} name="Create Feed" />
            </Stack.Navigator>
        </NavigationContainer>
    )
}


AppRegistry.registerComponent(appName, () => Navigation);
