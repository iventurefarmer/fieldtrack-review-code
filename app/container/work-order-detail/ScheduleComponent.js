import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Header } from '../../components/common';
import moment from 'moment';
import { Card, Text, Content } from 'native-base';

export const ScheduleComponent = (props) => {
    return (
        <View style={{ backgroundColor: '#FFF', flex: 1 }}>
            <Calendar
                onDayPress={(day) => {
                    props.dateChange(day);
                }}
                // Handler which gets executed on day long press. Default = undefined
                onDayLongPress={(day) => {
                    props.dateChange(day);
                }}
                // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                monthFormat={'MMMM yyyy'}
                // Handler which gets executed when visible month changes in calendar. Default = undefined
                onMonthChange={(month) => {
                    //console.log('month changed', month);
                }}
                // Hide month navigation arrows. Default = false
                hideArrows={false}
                // Replace default arrows with custom ones (direction can be 'left' or 'right')
                //renderArrow={(direction) => (<Arrow/>)}
                // Do not show days of other months in month page. Default = false
                hideExtraDays={true}
                // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
                // day from another month that is visible in calendar page. Default = false
                disableMonthChange={true}
                // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                firstDay={1}
                // Hide day names. Default = false
                hideDayNames={false}
                // Show week numbers to the left. Default = false
                showWeekNumbers={false}
                // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                onPressArrowLeft={substractMonth => substractMonth()}
                // Handler which gets executed when press arrow icon left. It receive a callback can go next month
                onPressArrowRight={addMonth => addMonth()}

                markedDates={props.repeatworderorder}

                // Specify style for calendar container element. Default = {}
                style={{
                    borderTopWidth: 1,
                    paddingTop: 5,
                    borderBottomWidth: 1,
                    borderColor: '#eee',
                    height: 300
                }}
                // Specify theme properties to override specific styles for calendar parts. Default = {}
                theme={{
                    textSectionTitleColor: '#b6c1cd',
                    selectedDayBackgroundColor: '#ff6600',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#00adf5',
                    dayTextColor: '#2d4150',
                    textDisabledColor: '#d9e1e8',
                    dotColor: '#00adf5',
                    selectedDotColor: '#ffffff',
                    arrowColor: 'orange',
                    monthTextColor: '#ff6600',
                    // textDayFontFamily: 'monospace',
                    // textMonthFontFamily: 'monospace',
                    // textDayHeaderFontFamily: 'monospace',
                    textMonthFontWeight: 'bold',
                    textDayFontSize: 14,
                    textMonthFontSize: 14,
                    textDayHeaderFontSize: 14
                }}
            />
            <Content>
                {props.selectedDate_Data.length < 0
                    ?
                    <Header headerText={'No Events'} />
                    :
                    props.selectedDate_Data.map((item, index) => {
                        return (
                            <View key={index}>
                                <Card style={styles.cardStyle}>
                                    <Text style={styles.textHeaderStyle}>{props.orderDetails.job_type}</Text>
                                    <Text style={styles.textHeaderStyle}>#{props.orderDetails.work_order_code}</Text>
                                    <Text style={styles.textDateStyle}>{item.repeat_date}</Text>
                                </Card>
                            </View>
                        )
                    })
                }
            </Content>
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