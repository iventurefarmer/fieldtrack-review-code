/* eslint-disable global-require */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Content, Tab, Tabs, TabHeading, Icon, Text, ListItem } from 'native-base';
import ToolbarHeaderMenuBar from '../components/drawer/ToolbarHeaderMenuBar';
import { DrawerActions, NavigationActions } from 'react-navigation';
import moment from 'moment';
import { Confirm, Loader } from '../components/common';
import { Calendar } from 'react-native-calendars';
import WorkCalendarCard from '../container/work-calendar/WorkCalendarTabCount';
import { getCustomeQueryData, syncDataToServer } from '../service/database';

class WorkCalendarScreen extends React.Component {

    state = {
        loading: false,
        orderlist: [],
        markedCal: {},
        todayData: {
            All: [],
            Completed: [],
            Started: [],
            Hold: [],
            NotStarted: []
        },
        weeklyData: {
            All: [],
            Completed: [],
            Started: [],
            Hold: [],
            NotStarted: []
        },
        monthData: []
    };

    componentDidMount(){
        this.getData();
        console.log(moment().startOf('isoWeek').format('D MMM'));
        console.log(moment().endOf('isoWeek').format('D MMM'));
    }

    syncDataFromServer() {

        this.setState({ loading: true });
        syncDataToServer()
        .then((result) => {
            this.setState({ loading: false });
            this.getData();
        })
        .catch((error) => {
            this.setState({ loading: false });
        });
    }

    getData(){
        this.setState({
            orderlist: [],
            markedCal: {},
            todayData: {
                All: [],
                Completed: [],
                Started: [],
                Hold: [],
                NotStarted: []
            },
            weeklyData: {
                All: [],
                Completed: [],
                Started: [],
                Hold: [],
                NotStarted: []
            },
            monthData: [],
            loading: true
        })
        getCustomeQueryData(`select a.status as work_status, a.*, customer.*, work_order.*, contact_person.* from work_order_repeat as a LEFT JOIN work_order ON work_order.worder_id=a.work_order_id LEFT JOIN customer ON customer.customer_id=work_order.customer_id LEFT JOIN contact_person ON contact_person.customer_id=work_order.customer_id`)
        .then((res3) => {
            if(res3.length > 0){
                let markedCal = {};
                let obj = [];
                for(let i = 0; i < res3.length; i++){
                    obj.push(res3.item(i));
                    markedCal[moment(res3.item(i).repeat_date).format('YYYY-MM-DD')] = {
                        data: res3.item(i),
                        marked: true,
                        selected: moment(res3.item(i).repeat_date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD'),
                        dotColor: '#ff6600'
                    };

                    // For Todays data

                    if(moment(res3.item(i).repeat_date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')){
                        if(res3.item(i).work_status === "Started"){
                            this.state.todayData.Started.push(res3.item(i));
                        }else if(res3.item(i).work_status === "Hold"){
                            this.state.todayData.Hold.push(res3.item(i));
                        }else if(res3.item(i).work_status === "Not Started"){
                            this.state.todayData.NotStarted.push(res3.item(i));
                        }else if(res3.item(i).work_status === "Completed" || res3.item(i).work_status === "Finished"){
                            this.state.todayData.Completed.push(res3.item(i));
                        }
                        this.state.todayData.All.push(res3.item(i));
                    }
                   
                    if(moment(res3.item(i).repeat_date).isBetween(moment().startOf('isoWeek'),moment().endOf('isoWeek'))){
                        if(res3.item(i).work_status === "Started"){
                            this.state.weeklyData.Started.push(res3.item(i));
                        }else if(res3.item(i).work_status === "Hold"){
                            this.state.weeklyData.Hold.push(res3.item(i));
                        }else if(res3.item(i).work_status === "Not Started"){
                            this.state.weeklyData.NotStarted.push(res3.item(i));
                        }else if(res3.item(i).work_status === "Completed" || res3.item(i).work_status === "Finished"){
                            this.state.weeklyData.Completed.push(res3.item(i));
                        }
                        this.state.weeklyData.All.push(res3.item(i));
                    }
                }
                this.setState({ orderlist: obj, loading: false, markedCal: markedCal });
                this.MonthDateChange({dateString: moment().format('YYYY-MM-DD') });
            }else{
                this.setState({ loading: false });
            }
        })
        .catch((error) => {
            this.setState({ loading: false });
        });
    }

    MonthDateChange(date) { 
        if(date.dateString in this.state.markedCal){
            let newMap = {};
            Object.entries(this.state.markedCal).forEach(([key, value]) => {
                newMap[key] = {
                    data: value.data,
                    marked: value.marked,
                    selected: key === date.dateString,
                    dotColor: '#ff6600'
                };
            });
            this.setState({markedCal: newMap });
        }else{
            let newMap = {};
            Object.entries(this.state.markedCal).forEach(([key, value]) => {
                newMap[key] = {
                    data: value.data,
                    marked: value.marked,
                    selected: key === date.dateString,
                    dotColor: '#ff6600'
                };
            });
            newMap[date.dateString] = {
                data: {},
                marked: false,
                selected: true,
                dotColor: '#ff6600'
            };
            this.setState({markedCal: newMap });
        }
        this.setState({ monthData: [] });
        let array = [];
        this.state.orderlist.map(item => {
            if(moment(item.repeat_date).format('YYYY-MM-DD') === date.dateString){
                array.push(item);
            }
        });
        this.setState({ monthData: array });
        // console.log(this.state);
    }

    openHomeDrawer() {
        this.props.navigation.dispatch(DrawerActions.openDrawer());
    }

    orderClick(value) {
        this.props.navigation.navigate('WorkOrderDetailScreen', [value]);
    }

    render() {
        return (
            <View style={styles.container}>
                <ToolbarHeaderMenuBar
                    headerText="Work Calendar"
                    call={this.openHomeDrawer.bind(this)}
                    notificationScreen={() => {
                        this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'NotificationScreen' }));
                    }}
                    syncData={() => {
                        this.syncDataFromServer();
                        // this.setState({ confirmToSync: true });
                    }}
                    navigation={this.props}
                />
                <Loader loading={this.state.loading} />
                <Tabs>
                    <Tab 
                        tabStyle={{ backgroundColor: '#fff' }} 
                        textStyle={{ color: '#000' }} 
                        activeTabStyle={{ backgroundColor: '#fff' }} 
                        activeTextStyle={{ color: '#000' }}
                        heading={<TabHeading style={{ backgroundColor: '#fff', flex: 1, flexDirection: 'column' }}><Icon name='edit' type="FontAwesome" style={{color: '#000'}} /><Text style={{ color: '#000', fontSize: 12, fontWeight: 'normal' }}>Daily</Text></TabHeading>}
                    >
                        <ListItem style={{ borderBottomWidth: 0, alignSelf: 'center' }}>
                            <Text> Today, {moment().format('D MMMM, YYYY dddd')} </Text>
                        </ListItem>
                        <Tabs>
                            <Tab 
                                tabStyle={{ backgroundColor: '#ddd', borderRightWidth: 1, borderColor: '#999' }} 
                                textStyle={{ color: '#333', fontSize: 10 }} 
                                activeTabStyle={{ backgroundColor: '#ddd', borderRightWidth: 1, borderColor: '#999' }} 
                                activeTextStyle={{ color: '#333', fontSize: 10 }}
                                heading={`All(${this.state.todayData.All.length})`}
                            >
                                <Content>
                                    {this.state.todayData.All.map((item, index) => {
                                        return(
                                            <WorkCalendarCard 
                                                key={index}
                                                dataArray={item}
                                                orderClick={(value) => this.orderClick(value)}
                                            />
                                        )
                                    })}
                                </Content>
                            </Tab>
                            <Tab 
                                tabStyle={{ backgroundColor: '#ddd', borderRightWidth: 1, borderColor: '#999' }} 
                                textStyle={{ color: '#333', fontSize: 10 }} 
                                activeTabStyle={{ backgroundColor: '#ddd', borderRightWidth: 1, borderColor: '#999' }} 
                                activeTextStyle={{ color: '#333', fontSize: 10 }}
                                heading={`Completed(${this.state.todayData.Completed.length})`}
                            >
                                <Content>
                                    {this.state.todayData.Completed.map((item, index) => {
                                        return(
                                            <WorkCalendarCard 
                                                key={index}
                                                dataArray={item}
                                                orderClick={(value) => this.orderClick(value)}
                                            />
                                        )
                                    })}
                                </Content>
                            </Tab>
                            <Tab 
                                tabStyle={{ backgroundColor: '#ddd', borderRightWidth: 1, borderColor: '#999' }} 
                                textStyle={{ color: '#333', fontSize: 10 }} 
                                activeTabStyle={{ backgroundColor: '#ddd', borderRightWidth: 1, borderColor: '#999' }} 
                                activeTextStyle={{ color: '#333', fontSize: 10 }}
                                heading={`Hold(${this.state.todayData.Hold.length})`}
                            >
                                <Content>
                                    {this.state.todayData.Hold.map((item, index) => {
                                        return(
                                            <WorkCalendarCard 
                                                key={index}
                                                dataArray={item}
                                                orderClick={(value) => this.orderClick(value)}
                                            />
                                        )
                                    })}
                                </Content>
                            </Tab>
                            <Tab 
                                tabStyle={{ backgroundColor: '#ddd', borderRightWidth: 1, borderColor: '#999' }} 
                                textStyle={{ color: '#333', fontSize: 10 }} 
                                activeTabStyle={{ backgroundColor: '#ddd', borderRightWidth: 1, borderColor: '#999' }} 
                                activeTextStyle={{ color: '#333', fontSize: 10 }}
                                heading={`Not Started(${this.state.todayData.NotStarted.length})`}
                            >
                                <Content>
                                    {this.state.todayData.NotStarted.map((item, index) => {
                                        return(
                                            <WorkCalendarCard 
                                                key={index}
                                                dataArray={item}
                                                orderClick={(value) => this.orderClick(value)}
                                            />
                                        )
                                    })}
                                </Content>
                            </Tab>
                            <Tab 
                                tabStyle={{ backgroundColor: '#ddd' }} 
                                textStyle={{ color: '#333', fontSize: 10 }} 
                                activeTabStyle={{ backgroundColor: '#ddd' }} 
                                activeTextStyle={{ color: '#333', fontSize: 10 }}
                                heading={`Started(${this.state.todayData.Started.length})`}
                            >
                                <Content>
                                    {this.state.todayData.Started.map((item, index) => {
                                        return(
                                            <WorkCalendarCard 
                                                key={index}
                                                dataArray={item}
                                                orderClick={(value) => this.orderClick(value)}
                                            />
                                        )
                                    })}
                                </Content>
                            </Tab>
                        </Tabs>
                    </Tab>
                    <Tab 
                        tabStyle={{ backgroundColor: '#fff' }} 
                        textStyle={{ color: '#ddd' }} 
                        activeTabStyle={{ backgroundColor: '#fff' }} 
                        activeTextStyle={{ color: '#000' }}
                        heading={<TabHeading style={{ backgroundColor: '#fff', flex: 1, flexDirection: 'column' }}><Icon name='md-clipboard' type="Ionicons" style={{color: '#000'}} /><Text style={{ color: '#000', fontSize: 12, fontWeight: 'normal' }}>Weekly</Text></TabHeading>}
                    >
                        <ListItem style={{ borderBottomWidth: 0, alignSelf: 'center' }}>
                            <Text>{moment().startOf('isoWeek').format('D MMM')} to {moment().endOf('isoWeek').format('D MMM, YYYY')} </Text>
                        </ListItem>
                        <Tabs>
                            <Tab 
                                tabStyle={{ backgroundColor: '#ddd', borderRightWidth: 1, borderColor: '#999' }} 
                                textStyle={{ color: '#333', fontSize: 10 }} 
                                activeTabStyle={{ backgroundColor: '#ddd', borderRightWidth: 1, borderColor: '#999' }} 
                                activeTextStyle={{ color: '#333', fontSize: 10 }}
                                heading={`All(${this.state.weeklyData.All.length})`}
                            >
                                <Content>
                                    {this.state.weeklyData.All.map((item, index) => {
                                        return(
                                            <WorkCalendarCard 
                                                key={index}
                                                dataArray={item}
                                                orderClick={(value) => this.orderClick(value)}
                                            />
                                        )
                                    })}
                                </Content>
                            </Tab>
                            <Tab 
                                tabStyle={{ backgroundColor: '#ddd', borderRightWidth: 1, borderColor: '#999' }} 
                                textStyle={{ color: '#333', fontSize: 10 }} 
                                activeTabStyle={{ backgroundColor: '#ddd', borderRightWidth: 1, borderColor: '#999' }} 
                                activeTextStyle={{ color: '#333', fontSize: 10 }}
                                heading={`Completed(${this.state.weeklyData.Completed.length})`}
                            >
                                <Content>
                                    {this.state.weeklyData.Completed.map((item, index) => {
                                        return(
                                            <WorkCalendarCard 
                                                key={index}
                                                dataArray={item}
                                                orderClick={(value) => this.orderClick(value)}
                                            />
                                        )
                                    })}
                                </Content>
                            </Tab>
                            <Tab 
                                tabStyle={{ backgroundColor: '#ddd', borderRightWidth: 1, borderColor: '#999' }} 
                                textStyle={{ color: '#333', fontSize: 10 }} 
                                activeTabStyle={{ backgroundColor: '#ddd', borderRightWidth: 1, borderColor: '#999' }} 
                                activeTextStyle={{ color: '#333', fontSize: 10 }}
                                heading={`Hold(${this.state.weeklyData.Hold.length})`}
                            >
                                <Content>
                                    {this.state.weeklyData.Hold.map((item, index) => {
                                        return(
                                            <WorkCalendarCard 
                                                key={index}
                                                dataArray={item}
                                                orderClick={(value) => this.orderClick(value)}
                                            />
                                        )
                                    })}
                                </Content>
                            </Tab>
                            <Tab 
                                tabStyle={{ backgroundColor: '#ddd', borderRightWidth: 1, borderColor: '#999' }} 
                                textStyle={{ color: '#333', fontSize: 10 }} 
                                activeTabStyle={{ backgroundColor: '#ddd', borderRightWidth: 1, borderColor: '#999' }} 
                                activeTextStyle={{ color: '#333', fontSize: 10 }}
                                heading={`Not Started(${this.state.weeklyData.NotStarted.length})`}
                            >
                                <Content>
                                    {this.state.weeklyData.NotStarted.map((item, index) => {
                                        return(
                                            <WorkCalendarCard 
                                                key={index}
                                                dataArray={item}
                                                orderClick={(value) => this.orderClick(value)}
                                            />
                                        )
                                    })}
                                </Content>
                            </Tab>
                            <Tab 
                                tabStyle={{ backgroundColor: '#ddd' }} 
                                textStyle={{ color: '#333', fontSize: 10 }} 
                                activeTabStyle={{ backgroundColor: '#ddd' }} 
                                activeTextStyle={{ color: '#333', fontSize: 10 }}
                                heading={`Started(${this.state.weeklyData.Started.length})`}
                            >
                                <Content>
                                    {this.state.weeklyData.Started.map((item, index) => {
                                        return(
                                            <WorkCalendarCard 
                                                key={index}
                                                dataArray={item}
                                                orderClick={(value) => this.orderClick(value)}
                                            />
                                        )
                                    })}
                                </Content>
                            </Tab>
                        </Tabs>
                    </Tab>
                    <Tab
                        tabStyle={{ backgroundColor: '#fff', }} 
                        textStyle={{ color: '#000' }} 
                        activeTabStyle={{ backgroundColor: '#fff' }} 
                        activeTextStyle={{ color: '#000' }}
                        heading={<TabHeading style={{ backgroundColor: '#fff', flex: 1, flexDirection: 'column' }}><Icon name='calendar' type="FontAwesome" style={{color: '#000'}} /><Text style={{ color: '#000', fontSize: 12, fontWeight: 'normal' }}>Monthly</Text></TabHeading>}
                    >
                        <Calendar
                            // Initially visible month. Default = Date()
                            //current={'2012-03-01'}
                            // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                            //minDate={'2012-05-10'}
                            // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                            //maxDate={'2012-05-30'}
                            // Handler which gets executed on day press. Default = undefined
                            onDayPress={(day) => {
                                this.MonthDateChange(day);
                            }}
                            // Handler which gets executed on day long press. Default = undefined
                            onDayLongPress={(day) => {
                                this.MonthDateChange(day);
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

                            markedDates={
                                this.state.markedCal
                            }
                            style={styles.calender}
                            theme={{
                                currentDayCircle: 'blue',
                                textSectionTitleColor: '#b6c1cd',
                                selectedDayBackgroundColor: '#ff6600',
                                selectedDayTextColor: 'red',
                                todayTextColor: '#ff6600',
                                dayTextColor: '#2d4150',
                                textDisabledColor: '#d9e1e8',
                                dotColor: '#00adf5',
                                selectedDotColor: '#ffffff',
                                arrowColor: '#ff6600',
                                monthTextColor: '#000',
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
                            {this.state.monthData.map((item, index) => {
                                return(
                                    <WorkCalendarCard 
                                        key={index}
                                        dataArray={item}
                                        orderClick={(value) => this.orderClick(value)}
                                    />
                                )
                            })}
                        </Content>
                    </Tab>
                </Tabs>
                {this.state.confirmToSync && <Confirm
                    onAccept={() => {
                        this.setState({ confirmToSync: false });
                        this.syncDataFromServer();
                    }}
                    onDecline={() => {
                        this.setState({ confirmToSync: false });
                    }}
                >{'Do you want to Refresh page?'}</Confirm>}
            </View>
        )
    }
}

WorkCalendarScreen.navigationOptions = {
    header: null
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    scene: {
        flex: 1
    },
    tabBar: {
        flexDirection: 'row'
    },
    tabItem: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 10
    },
    calender: {
        borderTopWidth: 1,
        paddingTop: 5,
        borderBottomWidth: 1,
        borderColor: '#eee',
        height: 300
    }
});

export default WorkCalendarScreen;
