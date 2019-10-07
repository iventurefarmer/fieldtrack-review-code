/* eslint-disable global-require */
import React from 'react';
import { Image, StyleSheet, View, Platform } from 'react-native';
import { NavigationActions } from 'react-navigation';
// import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType, NotificationActionType, NotificationActionOption, NotificationCategoryOption } from "react-native-fcm";
import firebase from 'react-native-firebase';
import { retrieveItem } from '../service/AsyncStorageUtil';
import { createDatabase } from '../service/database';

class SplashScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            navigation: props.navigation
        };
        createDatabase()
            .then((result) => {
                //console.log(result);
            })
            .catch((error) => {
                //console.log(error);
            });
    }

    componentWillMount() {
        const { navigation } = this.state;
        setTimeout(() => {
            retrieveItem('IS_LOGIN').then((result) => {
                if (result) {
                    navigation.replace('AppDrawerNavigator')
                } else {
                    navigation.replace('LoginScreen');
                }
            }).catch((error) => {
                navigation.replace('LoginScreen');
            });
        }, 1000);
    }

    componentDidMount() {
        this.checkPermission();
        this.createNotificationListeners();
        // FCM.requestPermissions();
        // // initially user get InitialNotification frim the app if any pending
        // FCM.getInitialNotification().then(notif => {
        //     console.log("getInitialNotification Notification : => ", notif);
        //     // this.sendRemote(notif);
        //     if (notif) {
        //         if (notif.opened_from_tray) {
        //             if (notif.targetScreen === "NotificationScreen") {
        //                 setTimeout(() => {
        //                     this.props.navigation.navigate("NotificationScreen");
        //                     // FCM.removeAllDeliveredNotifications();
        //                 }, 500);
        //             }
        //         }
        //     }
        // });

        // FCM.on(FCMEvent.Notification, notif => {
        //     console.log("Notification", notif);
        //     this.sendRemote(notif);
        //     if (Platform.OS === 'android' && notif._notificationType === NotificationType.WillPresent && !notif.local_notification) {
        //         notif.finish(WillPresentNotificationResult.All)
        //         return;
        //     }

        //     if (notif.opened_from_tray) {
        //         if (notif.targetScreen === 'NotificationScreen') {
        //             setTimeout(() => {
        //                 this.props.navigation.navigate('NotificationScreen');
        //                 // FCM.removeAllDeliveredNotifications();
        //             }, 500)
        //         }
        //         setTimeout(() => {
        //             console.log(`User tapped notification\n${JSON.stringify(notif)}`)
        //             // this.props.navigation.navigate('NotificationScreen');
        //             const navigateAction = NavigationActions.navigate({
        //                 routeName: 'NotificationScreen'
        //             });
        //             this.props.navigation.dispatch(navigateAction);
        //         }, 1000);
        //         return;
        //     }
        // });

        // // // This method give received notifications to mobile to display.
        // // this.notificationUnsubscribe = FCM.on("notification", notif => {
        // //     console.log("a", notif);
        // //     if (notif && notif.local_notification) {
        // //         return;
        // //     }
        // //     this.sendRemote(notif);
        // // });

        // // // this method call when FCM token is update(FCM token update any time so will get updated token from this method)
        // // this.refreshUnsubscribe = FCM.on("refreshToken", token => {
        // //     console.log("TOKEN (refreshUnsubscribe)", token);
        // //     this.props.onChangeToken(token);
        // // });
    }

    async checkPermission() {
        firebase.messaging().hasPermission()
            .then(enabled => {
                if (enabled) {
                    this.getToken();
                    // user has permissions
                } else {
                    this.requestPermission();
                    // user doesn't have permission
                }
            });
    }

    async requestPermission() {
        firebase.messaging().requestPermission()
            .then(() => {
                this.getToken();
                // User has authorised  
            })
            .catch(error => {
                // User has rejected permissions  
            });
    }

    async getToken() {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            // user has a device token
            console.log(fcmToken);
            this.setState({ token: fcmToken });
        }
    }

    async createNotificationListeners() {
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            console.log(notification);
            firebase.notifications().displayNotification(notification);
        });


        /*
        * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
        * */
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            console.log(notificationOpen.notification);
            const { title, body, data, targetUrl } = notificationOpen.notification;
            console.log(data)
            setTimeout(() => {
                this.setState({ webUrl: data.targetUrl });
                console.log(this.state);
                // this.props.navigation.navigate("NotificationScreen");
            }, 500);
        });

        /*
          * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
          * */
        const notificationOpen = await firebase.notifications().getInitialNotification();
        console.log(notificationOpen)
        if (notificationOpen) {
            //const { title, body, targetUrl, data } = notificationOpen.notification;
            //alert('When initial : ',JSON.stringify(data));
            const { title, body, data } = notificationOpen.notification;
            //this.sendRemote(notification);
            setTimeout(() => {
                this.setState({ webUrl: data.targetUrl });
                // this.props.navigation.navigate("NotificationScreen");
            }, 500);
        }

        // firebase.notifications().getInitialNotification().then((notification) => {
        //     const { title, body, data, targetUrl } = notification;
        //     setTimeout(() => {
        //           alert('data ',data.targetUrl, 'rargeturl', targetUrl)
        //           this.setState({ webUrl: data.targetUrl });
        //           console.log(this.state);
        //         // this.props.navigation.navigate("NotificationScreen");
        //     }, 500);
        // });
        /*
        * Triggered for data only payload in foreground
        * */
        this.messageListener = firebase.messaging().onMessage((message) => {
            //process data message
            this.sendRemote(message._data);
            console.log(JSON.stringify(message));
        });
    }

    // This method display the notification on mobile screen.
    sendRemote(notif) {
        console.log('send');
        console.log('notif>>>>>>', notif);
        console.log('notif>>>>>>', notif.fcm.title);
        console.log('notif>>>>>>', notif.fcm.body);
        FCM.presentLocalNotification({
            title: notif.fcm.title,
            body: notif.fcm.body,
            priority: "high",
            click_action: notif.action,
            show_in_foreground: true,
            local: true
        });
    }
    
    componentWillUnmount() {
        this.notificationListener();
        this.notificationOpenedListener();
    }

    render() {

        return <View style={styles.container
        } >
            <Image
                style={styles.app_logo}
                source={require('../assets/splash.png')}
                resizeMode="cover"
            />
        </View >;

    }
}

SplashScreen.navigationOptions = {
    header: null
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    app_logo: {
        flex: 1,
        height: undefined,
        width: undefined
    }
});

export default SplashScreen;
