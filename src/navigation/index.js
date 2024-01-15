import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';
import Home from '../screens/kontak';
import Profile from '../screens/profile';
import Login from '../screens/login';
import Inbox from '../screens/inbox';
import Chat from '../screens/chat';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Routes = () => {
    const homeIcon = ({ color, size }) => (
        <Feather name="users" color={color} size={size} />
    );
    const chatIcon = ({ color, size }) => (
        <Feather name="message-circle" color={color} size={size} />
    );

    const profileIcon = ({ color, size }) => (
        <Feather name="user" color={color} size={size} />
    );

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: 'blue',
                tabBarInactiveTintColor: 'black',
            }}>
            <Tab.Screen
                name="Inbox"
                component={Inbox}
                options={{
                    title: '',
                    tabBarIcon: chatIcon,
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    title: '',
                    tabBarIcon: homeIcon,
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    title: '',
                    tabBarIcon: profileIcon,
                    headerShown: false,
                }}
            />
        </Tab.Navigator>
    );
};

const Navigation = () => {
    return (
        <NavigationContainer>

            <Stack.Navigator initialRouteName="HomePage">
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Home"
                    component={Routes}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Chat"
                    component={Chat}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
