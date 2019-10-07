import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Card } from 'native-base';


export const HistoryComponent = (props) => {
    return (
        <View style={{ backgroundColor: '#FFF', flex: 1 }}>
            {props.HistoryData ?
                <View>    
                    {Object.keys(props.HistoryData).map((data, index) => {
                        return (
                            <View style={styles.container} key={index}>
                                <Card style={styles.cardStyle}>
                                    <Text style={styles.textHeaderStyle}>{props.orderDetails.job_type}</Text>
                                    <Text style={styles.textHeaderStyle}>#{props.orderDetails.work_order_code}</Text>
                                    <Text style={styles.textDateStyle}>{data}</Text>
                                </Card>
                            </View>
                        )
                    })}
                </View>
                :
                <Card style={styles.cardStyle}>
                    <Text style={styles.textHeaderStyle}>No Work History To Show</Text>
                </Card>
            }
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
    }
});