import React from 'react';
import { Platform } from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import TabBarIcon from 'react-native-vector-icons/Ionicons';

//Screens
import AuthScreen from '../app/index';
import LoginScreen from '../app/auth/signin';
import SignupScreen from '../app/auth/signup';
import HomeScreen from '../app/general/home';


let LoginStack = createStackNavigator({
    LoginHomePage: LoginScreen,
    SignupPage: SignupScreen
});

let GeneralStack = createStackNavigator({
    HomePage: HomeScreen,
});

let AuthStack = createStackNavigator({
    AuthPage: AuthScreen,
});

export default createAppContainer(
    createSwitchNavigator(
        {
            LoggedChecker: AuthStack,
            LoginPage: LoginStack,
            General: GeneralStack
        },
        {
            initialRouteName: 'LoggedChecker'
        }
    )
)