import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { Card, CardItem, Icon, Right, Badge } from 'native-base';


export const ActivityComponent = ({currentOrder, forms, dynamicForms, openForm}) => {
    return (
        <View style={{ backgroundColor: '#FFF', flex: 1, margin: 10 }}>
            <Text style={{ color: '#1F7392'}}>{`Your work order no: ${currentOrder.work_order_code} (${currentOrder.job_type}). You have assigned ${JSON.parse(currentOrder.form_id).length} Activity`}</Text>
            <FlatList
                data={forms}
                renderItem={({ item }) =>
                    <TouchableOpacity onPress={() => openForm(item)}>
                        <Card style={{ marginTop: 10, borderRadius: 10, borderColor: '#1F7392', padding: 5 }}>
                            <CardItem>
                                <Icon name="note-text" type="MaterialCommunityIcons" style={{ color: '#1F7392', borderWidth: 1, borderRadius: 50, paddingLeft: 5, padding: 2, fontSize: 24, borderColor: '#888'}} />
                                <Text style={{ marginLeft: 10 }}>{item.form_name}</Text>
                                {item.form_status ?
                                    <Right style={{ position: 'absolute', top: 10, right: 0 }}>
                                        <Badge info style={{ justifyContent: 'center' }}>
                                            <Text style={{ paddingLeft: 10, paddingRight: 10, color: '#fff' }}>
                                                {item.form_status}
                                            </Text>
                                        </Badge>
                                    </Right>
                                    : 
                                    <View />
                                }
                            </CardItem>
                        </Card>
                    </TouchableOpacity>
                }
                keyExtractor={(item, index) => item.forms_id ? item.forms_id : item.form_id}
            />
        </View>
    );
};