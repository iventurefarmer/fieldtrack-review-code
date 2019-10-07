import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Card, CardItem, Badge, Right, Body } from 'native-base';
import moment from 'moment';


const WorkCalendarCard = (props) => {
    return (
        <TouchableOpacity onPress={() => props.orderClick(props.dataArray)}>
            <Card style={{borderRadius: 10, borderColor: '#ff6600', margin: 3 }} >
                <CardItem style={{ margin: 5 }}>
                    <Body>
                        <Text style={{ color: '#000', fontWeight: 'bold' }}>
                            Customer Name: {props.dataArray.customer_name}
                        </Text>
                        <Text>
                            #{props.dataArray.work_order_code}
                        </Text>
                    </Body>
                    <Right>
                        <Badge style={{ justifyContent: 'center' }}>
                            <Text style={{ color: '#fff', marginLeft: 10, marginRight: 10 }}>
                                {props.dataArray.work_status}
                            </Text>
                        </Badge>
                        <Text>
                            {moment(props.dataArray.repeat_date).format('DD-MMM-YY')}
                        </Text>
                    </Right>
                </CardItem>
            </Card>
        </TouchableOpacity>
    );
};

export default WorkCalendarCard;