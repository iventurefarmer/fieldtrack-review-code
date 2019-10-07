import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Card, Right, Icon } from 'native-base';
import moment from 'moment';


const WorkOrderItem = (props) => {
    const { item, cutomerCall, locationClick, orderClick } = props;
    const date = moment(item.repeat_date.replace(' ', 'T')).format('DD MMM YYYY HH:mm A');
    return (
        <View style={styles.container}>
            <Card style={styles.cardStyle}>
                <TouchableOpacity onPress={orderClick}>
                    <Text style={[styles.textHeaderStyle, { fontSize: 14, fontWeight: 'bold' }]}>{(item.customer_name !== null || item.customer_name !== "") ? item.customer_name : 'No Customer'}</Text>
                    <Text style={styles.textHeaderStyle}>{item.job_type}</Text>
                    <Text style={styles.textHeaderStyle}>#{item.work_order_code}</Text>
                    <Text style={styles.textDateStyle}>{date}</Text>
                </TouchableOpacity>
                <Right style={{ flex: 1, flexDirection: 'row', alignSelf: 'flex-end', position: 'absolute', top: 10, right: 10 }}>
                    <Icon 
                        name="phone-in-talk" type="MaterialIcons" 
                        style={styles.iconStyle} 
                        onPress={() => cutomerCall(item.mobile_no)}
                    />
                    <Icon 
                        name="location-on" type="MaterialIcons" 
                        style={styles.iconStyle} 
                        onPress={() => locationClick(item.lat, item.longi)}
                    />
                </Right>
            </Card>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        marginLeft: 10,
        marginRight: 10  
    },
    cardStyle: {
        borderRadius: 10,
        padding: 14,
        borderColor: '#ff6600'
    },
    textHeaderStyle: {
        color: '#1F7392',
        fontSize: 12
    },
    textDateStyle: {
        color: '#000',
        fontSize: 14
    },
    iconStyle: {
        color: '#1F7392',
        borderWidth: 1,
        borderRadius: 50,
        margin: 2,
        padding: 3,
        fontSize: 20,
        borderColor: '#1F7392'
    }

});
export default WorkOrderItem;