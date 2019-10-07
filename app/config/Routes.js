import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import AttendanceRecordScreenNew from '../screens/AttendanceRecordScreenNew';
import SplashInfoScreen from '../screens/SplashInfoScreen';
import WorkOrderScreen from '../screens/WorkOrderScreen';
import React from 'react';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import NotificationScreen from '../screens/NotificationScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import WorkCalendarScreen from '../screens/WorkCalendarScreen';
import WorkOrderDetailScreen from '../screens/WorkOrderDetailScreen';
import { Platform, StatusBar } from 'react-native';
import { createDrawerNavigator, createStackNavigator } from 'react-navigation';
import Drawer from '../components/drawer/Drawer';
import DynamicFormScreen from '../screens/DynamicFormScreen';
import MapScreen from '../screens/MapScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import NewWorkOrderScreen from '../screens/NewWorkOrderScreen';
import NewCustomerScreen from '../screens/NewCustomerScreen';
import NewUserScreen from '../screens/NewUserScreen';


const headerStyle = {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
};

export const AppDrawerNavigator = createDrawerNavigator({
    WorkOrderScreen: {
        screen: WorkOrderScreen
    },
    AttendanceRecordScreenNew: {
        screen: AttendanceRecordScreenNew
    },
    ChangePasswordScreen: {
        screen: ChangePasswordScreen
    },
    NotificationScreen: {
        screen: NotificationScreen
    },
    UserProfileScreen: {
        screen: UserProfileScreen
    },
    WorkCalendarScreen: {
        screen: WorkCalendarScreen
    }
}, {
        initialRouteName: 'WorkOrderScreen',
        contentComponent: Drawer,
        headerStyle
    });

export const AppStackNavigator = createStackNavigator({
    AppStartNavigator: createStackNavigator({
        SplashScreen: {
            screen: SplashScreen,
            initial: true
        },
        LoginScreen: {
            screen: LoginScreen
        },
        ForgotPasswordScreen: {
            screen: ForgotPasswordScreen
        },
        NewUserScreen: {
            screen: NewUserScreen
        },
        SplashInfoScreen: {
            screen: SplashInfoScreen
        },
        WorkOrderDetailScreen: {
            screen: WorkOrderDetailScreen
        },
        DynamicFormScreen: {
            screen: DynamicFormScreen
        },
        MapScreen: {
            screen: MapScreen
        },
        NewWorkOrderScreen: {
            screen: NewWorkOrderScreen
        },
        NewCustomerScreen: {
            screen: NewCustomerScreen
        },
        AppDrawerNavigator: AppDrawerNavigator
    }, {
            headerMode: 'none'
        }),
    // AppStackNavigator: createStackNavigator({
    //     WorkOrderDetailScreen: {
    //         screen: WorkOrderDetailScreen
    //     },
    //     DynamicFormScreen: {
    //         screen: DynamicFormScreen
    //     },
    //     MapScreen: {
    //         screen: MapScreen
    //     }
    // }, {
    //     headerMode: 'none'
    // })
}, {
        headerMode: 'none'
    });

export default AppStackNavigator;
