/* eslint-disable global-require */
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Dimensions, Alert, InteractionManager } from 'react-native';
import BackgroundGeolocation from 'react-native-background-geolocation';
import ToolbarHeaderBackMenu from '../components/drawer/ToobarHeaderBackMenu';
import { CameraView } from '../components/dynamic/CameraView';
import { FormBuilder } from '../components/dynamic/Form/FormBuilder';
import { WorkOrderProduct } from '../components/dynamic/WorkOrderProduct';
import { AddWorkOrderProduct } from '../components/dynamic/AddWorkOrderProduct';
import DateTimePicker from 'react-native-modal-datetime-picker';
import ImagePicker from 'react-native-image-picker';
import { Dialog } from 'react-native-simple-dialogs';
import SignatureCapture from 'react-native-signature-capture';
import { Button as Button1, Loader, InputAlertModal, AlertModal } from '../components/common';
import { retrieveItem, storeItem } from '../service/AsyncStorageUtil';
import moment from 'moment';
import { Card, CardItem, Thumbnail, Icon, Grid, Row, Col, Text, Textarea } from 'native-base';
import { getData, updateData, insertData, syncDataToServer } from '../service/database';
import { sendEmail } from '../service/UploadFormData';

const window = Dimensions.get('window');

class DynamicFormScreen extends React.Component {
    refs = null;
    form;
    lable = {};

    constructor(props) {
        super(props);
        const { params } = props.navigation.state;
        console.log(params);
        this.state = {
            form: [],
            datePicker: false,
            timePicker: false,
            formDataObj: params,
            signatureDialogVisible: false,
            formInputValues: {
                profilepic: [],
                signature: params.client_signature
            },
            form_status: params.form_status,
            form_id: params.id,
            checkedItems: [],
            lastLocation: {
                latitude: '',
                longitude: '',
                odometer: 0.0
            },
            startButtonText: 'Start',
            startedDisable: true,
            startLocation: 'startLocation',
            loading: false,
            checkInDisable: true,
            checkOutDisable: true,
            isDialogVisible: false,
            isLocationVisible: false,
            reason: '',
            locationReason: '',
            cameraImages: params.camera_photos && params.camera_photos !== 'undefined' ? JSON.parse(params.camera_photos) : [],

            currentOrder: params,
            forms: [],
            dynamicForms: {},
            selectedInputs: params.form_values ? JSON.parse(params.form_values).maindata.lable : {},
            productVisible: false,
            AddproductVisible: false,
            serviceVisible: false,
            AddserviceVisible: false,
            product: [],
            service: [],
            formProduct: params.form_status === 'Completed' && params.product ? JSON.parse(params.product) : [],
            formService: params.form_status === 'Completed' && params.services ? JSON.parse(params.services) : [],
            dynamicForm: params.form_data ? JSON.parse(params.form_data) : {},
            position: [],
            CameraCaptiom: '',
            isCameraCaptiomVisible: false,
            tempCamera: []
        };
        console.log(this.state);
    }

    componentDidMount() {
        this.getForms();
        this.getProductAndService();
        retrieveItem('ATTENDANCE_CHECK_IN_DISABLE')
            .then((result) => {
                let val = result.checkinDisable;
                if (val) {
                    this.setState({
                        startedDisable: this.state.formDataObj.form_status === 'Started' ? true : false,
                        startButtonText: this.state.formDataObj.form_status !== 'Started' ? 'Start' : 'Started'
                    });
                }
            }).catch((error) => {
                //console.log(`Promise is rejected with error: ${error}`);
            });
    }

    getProductAndService() {
        getData(`product`)
            .then((result) => {
                if (result.length > 0) {
                    let obj = [];
                    for (let i = 0; i < result.length; i++) {
                        obj.push(result.item(i));
                    }
                    this.setState({ product: obj });
                }
            })
            .catch((error) => {
                //console.log(error);
            });

        getData(`service`)
            .then((result) => {
                if (result.length > 0) {
                    let obj = [];
                    for (let i = 0; i < result.length; i++) {
                        obj.push(result.item(i));
                    }
                    this.setState({ service: obj });
                }
            })
            .catch((error) => {
                //console.log(error);
            })
    }
    getForms() {
        getData(`dynamic_forms WHERE form_id=${this.state.currentOrder.form_id}`)
            .then((result1) => {
                let dynamicForms = [];
                if (result1.length > 0) {
                    dynamicForms = result1.item(0);
                    this.setState({ dynamicForms: dynamicForms });
                }
            })
            .catch((error) => {
                //console.log(error);
            })
    }

    checkStartedButtonStateEnabled() {
        this.setState({
            startedDisable: formDataObj.form_status === 'Started' ? true : false,
            startButtonText: formDataObj.form_status !== 'Started' ? 'Start' : 'Started'
        });
    }

    checkStartToggleFromLocal(val) {
        let formButtonId = this.state.form_id + 'DISABLE';
        storeItem(formButtonId, JSON.stringify({ 'btnDisable': val }))
            .then((res) => {
                this.setState({
                    startedDisable: val,
                    startButtonText: !val ? 'Start' : 'Started'
                });
            }).catch((error) => {
                //console.log(`Promise is rejected with error: ${error}`);
            });
    }

    startLocation() {
        this.setState({ loading: true });
        BackgroundGeolocation.getCurrentPosition({ persist: false, samples: 1 },
            (position) => {
                const lat2 = position.coords.latitude;
                const lon2 = position.coords.longitude;
                const lat1 = this.state.currentOrder.work_order_lat;
                const lon1 = this.state.currentOrder.work_order_longi;

                const R = 6371e3; // earth radius in meters
                const φ1 = lat1 * (Math.PI / 180);
                const φ2 = lat2 * (Math.PI / 180);
                const Δφ = (lat2 - lat1) * (Math.PI / 180);
                const Δλ = (lon2 - lon1) * (Math.PI / 180);

                const a = (Math.sin(Δφ / 2) * Math.sin(Δφ / 2)) +
                    ((Math.cos(φ1) * Math.cos(φ2)) * (Math.sin(Δλ / 2) * Math.sin(Δλ / 2)));

                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                const distance = R * c;
                if (distance > 300) {
                    this.setState({ isLocationVisible: true, loading: false, position });
                } else {
                    this.setState({ position });
                    this.insertStartLocation(position);
                }

            },
            (error) => {
                console.log(error);
                this.setState({ loading: false });
            });
    }

    insertStartLocation() {
        const position = this.state.position;
        if (this.state.form_status !== 'Hold') {
            let query = `INSERT INTO forms_data (form_status, dynamic_form_id, work_order_id, location, repeat_work_order_id, utc_time, company_id, created_date, start_form_time, restart_form_time, end_form_time, restart_end_time, modify, push_flag, BatteryStatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
            // }
            let value = ['Started', this.state.formDataObj.form_id, this.state.formDataObj.work_order_id, '[{"start_lat":' + position.coords.latitude + ',"start_long":' + position.coords.longitude + '}]', this.state.formDataObj.work_order_repeat_id, '+05.30', this.state.formDataObj.company_id, this.state.formDataObj.created_date, moment().format('YYYY-MM-DD hh:mm:ss'), '', '', '', true, true, position.battery.level];
            insertData(query, value)
                .then((result) => {
                    updateData(`UPDATE work_order_repeat SET status='Started', modify='1', push_flag='1' WHERE work_order_repeat_id=${this.state.formDataObj.work_order_repeat_id}`)
                        .then((res2) => {
                            this.checkStartToggleFromLocal(true);
                            this.setState({ loading: false });
                            syncDataToServer();
                        })
                        .catch((error) => {
                            this.setState({ loading: false });
                        })
                })
                .catch((error) => {
                    this.setState({ loading: false });
                })
        } else {
            let query = `UPDATE forms_data SET form_status='Started', modify='1', push_flag='1' WHERE work_order_id=${this.state.formDataObj.work_order_id} AND dynamic_form_id=${this.state.formDataObj.form_id} AND repeat_work_order_id=${this.state.formDataObj.work_order_repeat_id}`;
            updateData(query)
                .then((result) => {
                    updateData(`UPDATE work_order_repeat SET status='Started', modify='1', push_flag='1' where work_order_repeat_id=${this.state.formDataObj.work_order_repeat_id}`)
                        .then((res5) => {
                            this.checkStartToggleFromLocal(true);
                            this.setState({ loading: false });
                            syncDataToServer();
                        })
                        .catch((error) => {
                            this.setState({ loading: false });
                        })
                })
                .catch((error) => {
                    this.setState({ loading: false });
                })
        }
    }

    openGallery() {
        // More info on all the options is below in the API Reference... just some common use cases shown here
        const options = {
            title: 'Capture Image',
            quality: 1,
            maxWidth: 250,
            maxHeight: 250,
            // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        // Open Image Library:
        ImagePicker.launchCamera(options, (response) => {
            if (response.didCancel) {
                //console.log('User cancelled image picker');
            } else if (response.error) {
                //console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                // console.log('User tapped custom button: ', response.customButton);
            } else {
                // const source = { uri: response.uri };
                // this.state.cameraImages.push(response.data);
                // this.forceUpdate();
                this.setState({ tempCamera: response.data, isCameraCaptiomVisible: true });
            }
        });
    }

    onBackPress() {
        this.props.navigation.goBack(null);
    }

    _resetSign() {
        this.refs['sign'].resetImage();
    }

    _saveSign() {
        this.refs['sign'].saveImage();
    }

    _onSaveEvent(result) {
        this.setState({ signatureDialogVisible: false, formInputValues: { signature: result.encoded } });
    }
    _onDragEvent() {
        // This callback will be called when the user enters signature
    }

    onChangeHandler = (data, input) => {
        let lab = input.label;
        let obj = this.state.selectedInputs;

        if (input.type === 'checkbox') {
            const oldValueMap = obj.hasOwnProperty(lab) ? obj[lab] : [];
            let index = oldValueMap.indexOf(data);
            if (index === -1) {
                oldValueMap.push(data);
                this.setState({ checkedItems: oldValueMap });
                obj[lab] = oldValueMap;
            } else {
                const filterObj = oldValueMap.filter((item) => { return item !== data });
                this.setState({ checkedItems: filterObj });
                obj[lab] = filterObj;
            }
        } else {
            obj[lab] = data;
        }
        this.setState({ selectedInputs: obj });
    };

    dateCallback = (data) => {
        this.selectedDateOrTimeObject = data;
        this.setState({ datePicker: true, timePicker: false });
    };

    timeCallback = (data) => {
        this.selectedDateOrTimeObject = data;
        this.setState({ timePicker: true, datePicker: false });
    };

    onCompleteClick(value) {
        if (value == 0) {
            this.setState({ isDialogVisible: true });
        } else {
            if (this.validation(this.state.selectedInputs)) {
                this.setState({ loading: true });
                BackgroundGeolocation.getCurrentPosition({ persist: false, samples: 1 },
                    (position) => {
                        let camera_photos = this.state.cameraImages;
                        let client_signature = this.state.formInputValues.signature;
                        let form_values = { 'maindata': { 'lable': this.state.selectedInputs } };

                        let formObject = this.state.formDataObj;
                        let locationObj = this.state.currentOrder.location ? JSON.parse(this.state.currentOrder.location) : [];
                        locationObj.push({
                            comp_lat: position.coords.latitude,
                            comp_long: position.coords.longitude
                        });
                        let query = `UPDATE forms_data SET form_status=${this.state.reason === '' ? "'Completed'" : "'Hold'"}, location='${JSON.stringify(locationObj)}', client_signature='${client_signature}', camera_photos='${JSON.stringify(camera_photos)}', from_data='${formObject.form_data}', form_values='${JSON.stringify(form_values)}', hold_reason='${this.state.reason}', product='${JSON.stringify(this.state.formProduct)}', services='${JSON.stringify(this.state.formService)}', modify='1', push_flag='1' WHERE work_order_id=${this.state.formDataObj.work_order_id} AND dynamic_form_id=${this.state.formDataObj.form_id} AND repeat_work_order_id=${this.state.formDataObj.work_order_repeat_id}`;

                        updateData(query)
                            .then((result) => {
                                if (this.state.reason !== '') {
                                    updateData(`UPDATE work_order_repeat SET status='Hold', modify='1', push_flag='1' where work_order_repeat_id=${this.state.formDataObj.work_order_repeat_id}`)
                                        .then((res5) => {
                                            this.setState({ loading: false });
                                            syncDataToServer();
                                            this.onBackPress();
                                        })
                                        .catch((error) => {
                                            this.setState({ loading: false });
                                        })
                                } else {
                                    getData(`work_order_repeat where work_order_repeat_id=${this.state.formDataObj.work_order_repeat_id}`)
                                        .then((res1) => {
                                            let fomsid = JSON.parse(res1.item(0).form_id);
                                            let a = 0;
                                            if (fomsid.length !== 0) {
                                                for (let i = 0; i < fomsid.length; i++) {
                                                    getData(`forms_data where dynamic_form_id=${fomsid[i]} and repeat_work_order_id=${this.state.formDataObj.work_order_repeat_id} and form_status='Completed'`)
                                                        .then((res3) => {
                                                            a += res3.length;
                                                            if (fomsid.length === a) {
                                                                updateData(`UPDATE work_order_repeat SET status='Finished', modify='1', push_flag='1' where work_order_repeat_id=${this.state.formDataObj.work_order_repeat_id}`)
                                                                    .then((res4) => {
                                                                        //console.log(res4);
                                                                        syncDataToServer();
                                                                    })
                                                                    .catch((error) => {
                                                                        this.setState({ loading: false });
                                                                    })
                                                            }
                                                            this.setState({ loading: false });
                                                            this.onBackPress();
                                                        })
                                                        .catch((error) => {
                                                            this.setState({ loading: false });
                                                        })
                                                }
                                            }
                                        })
                                        .catch((error) => {
                                            this.setState({ loading: false });
                                        })
                                }
                            })
                            .catch((error) => {
                                this.setState({ loading: false });
                            })
                    },
                    (error) => {
                        console.log(error);
                        this.setState({ loading: false });
                    });
            }
        }

    }

    validation(data) {
        let valid = true;
        if (Object.keys(this.state.dynamicForms).length) {
            let obj = JSON.parse(this.state.dynamicForms.form_data);
            for (let i = 0; i < obj.inputids.length; i++) {
                let reuqired = `reuqired${obj.inputids[i]}`;
                if (obj.hasOwnProperty(reuqired) && !data.hasOwnProperty(obj.lable[i]) && obj.inputtype[i] !== 'radio') {
                    valid = false;
                }
            }
        }
        return valid;
    }
    removeImage(index) {
        this.state.cameraImages.splice(index, 1);
        this.forceUpdate();
    }

    async sendEmail() {
        if (this.state.emailSend) {
            this.setState({ loading: true });
            await sendEmail(this.state.formDataObj.forms_id, this.state.emailSend)
                .then(res => {

                    Alert.alert(
                        'Alert !!!',
                        res.data.message,
                        [
                            { text: 'OK', onPress: () => {
                                this.setState({ loading: false });
                                this.props.navigation.goBack()
                            } 
                        },
                        ],
                        { cancelable: false }
                    )
                    console.log(res);
                })
                .catch(err => {
                    this.setState({ loading: false });
                    console.log(err);
                })
        }
    }

    renderDynamicForm() {
        let form1 = [];
        if (Object.keys(this.state.dynamicForms).length) {
            let obj = JSON.parse(this.state.dynamicForms.form_data);
            for (let i = 0; i < obj.inputids.length; i++) {
                let radiocheckboxDropdownItems = 'lable' + obj.inputids[i];
                form1[i] = {
                    inputid: obj.inputids[i],
                    label: obj.lable[i],
                    type: obj.inputtype[i],
                    mandatory: obj.hasOwnProperty(`reuqired${obj.inputids[i]}`),//0 means no : 1 means yes
                    items: !(obj.inputtype[i] === 'radio' || 'checkbox' || 'dropdown') ? null : obj[radiocheckboxDropdownItems],
                    errorText: '',
                    error: 0
                };
            }
        }
        if (this.state.checkInDisable) {
            return (
                <View>
                    {this.state.formDataObj.form_status === 'Completed' ?
                        <View style={{ alignSelf: 'center', backgroundColor: '#bbb', padding: 15, marginTop: 10, alignItems: 'center' }}>
                            <Icon name='check-circle' type='FontAwesome' />
                            <Text>Completed</Text>
                        </View>
                        :
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 10 }}>
                            <Button1
                                title={this.state.startButtonText}
                                disabled={this.state.startedDisable}
                                onPress={() => {
                                    this.startLocation();
                                }}
                            >
                                {this.state.startButtonText}
                            </Button1>
                            <CameraView
                                disabled={(this.state.startButtonText === 'Start' || this.state.dynamicForms.camera !== 'Y') ? true : false}
                                profilepic={this.state.formInputValues.profilepic}
                                openGallery={() => {
                                    this.openGallery();
                                }}
                            />
                            <Button1
                                title={'Product'}
                                disabled={(this.state.startButtonText === 'Start' || this.state.dynamicForm.product !== 'Y') ? true : false}
                                onPress={() => {
                                    this.setState({ productVisible: true });
                                }}
                            >
                                {'Product'}
                            </Button1>
                            <Button1
                                title={'service'}
                                disabled={(this.state.startButtonText === 'Start' || this.state.dynamicForm.service !== 'Y') ? true : false}
                                onPress={() => {
                                    this.setState({ serviceVisible: true });
                                }}
                            >
                                {'service'}
                            </Button1>
                        </View>
                    }
                    <View style={{ margin: 10 }}>
                        <Text style={{ textAlign: 'center', color: '#ff6600', fontSize: 18 }}>{this.state.dynamicForms.form_name}</Text>
                        <Text style={{ textAlign: 'center' }}>#{this.state.currentOrder.work_order_code}</Text>
                        {this.state.formDataObj.form_status === 'Completed' ?
                            <Text style={{ textAlign: 'center' }}>You Have Completed This Form</Text>
                            :
                            <View />
                        }
                    </View>
                    <View style={{ backgroundColor: '#eee', paddingBottom: 10 }}>
                        <FormBuilder
                            form={form1}
                            openDatePicker={this.dateCallback}
                            openTimePicker={this.timeCallback}
                            // checkedItems={this.state.checkedItems}
                            onChangeHandler={this.onChangeHandler.bind(this)}
                            inputValue={this.state.selectedInputs}
                            disabledVal={this.state.startButtonText === 'Start' ? true : false}
                        />
                    </View>
                    <View style={{ marginLeft: 10, marginRight: 10, paddingBottom: 15 }}>
                        <Text style={{ color: '#000', fontSize: 15, fontWeight: 'bold', marginBottom: 5, marginTop: 10 }}>Photo</Text>
                        <View style={styles.imageOuter}>
                            {this.state.cameraImages.map((item, index) => {
                                return (
                                    <View
                                        style={{ padding: 5, borderRadius: 8, borderColor: '#777', borderWidth: 1, margin: 2 }}
                                        key={index}
                                    >
                                        <Thumbnail square
                                            source={{ uri: `data:image/png;base64,${item.img}` }}
                                            style={styles.image}
                                        />
                                        <Text style={{ textAlign: 'center', fontSize: 12, color: '#888' }}>{item.Caption}</Text>
                                        <TouchableOpacity
                                            onPress={() => this.removeImage(index)}
                                            style={{ position: 'absolute', top: 0, right: 0 }}
                                        >
                                            {this.state.formDataObj.form_status === 'Completed' ?
                                                <View />
                                                :
                                                <Icon
                                                    name="times-circle"
                                                    type="FontAwesome"
                                                    style={{ color: 'red', fontSize: 18 }}
                                                />
                                            }
                                        </TouchableOpacity>
                                    </View>
                                )
                            })}
                        </View>
                        <Text style={{ color: '#000', fontSize: 15, fontWeight: 'bold', marginBottom: 10, marginTop: 10 }}>Signature</Text>
                        <Thumbnail square
                            source={{ uri: `data:image/png;base64,${this.state.formInputValues.signature}` }}
                            style={[styles.image, { marginLeft: 10 }]}
                        />
                        {this.state.formDataObj.form_status === 'Completed' ?
                            <View>
                                <Text style={{ color: '#000', fontSize: 15, fontWeight: 'bold', marginBottom: 10, marginTop: 10 }}>Product</Text>
                                <Grid>
                                    <Row style={{ backgroundColor: '#ddd', borderWidth: 1, borderColor: '#111' }}>
                                        <Col style={{ borderRightWidth: 1, borderColor: '#111', alignItems: 'center' }}>
                                            <Text>
                                                Name
                                            </Text>
                                        </Col>
                                        <Col style={{ borderRightWidth: 1, borderColor: '#111', alignItems: 'center' }}>
                                            <Text>
                                                Quantity
                                            </Text>
                                        </Col>
                                        <Col style={{ alignItems: 'center' }}>
                                            <Text>
                                                Price
                                            </Text>
                                        </Col>
                                    </Row>
                                    {this.state.formProduct.map((item, key) => {
                                        return (
                                            <Row key={key} style={{ borderWidth: 1, borderColor: '#111', borderTopWidth: 0 }}>
                                                <Col style={{ borderRightWidth: 1, borderColor: '#111', alignItems: 'center' }}>
                                                    <Text>
                                                        {item.product_name}
                                                    </Text>
                                                </Col>
                                                <Col style={{ borderRightWidth: 1, borderColor: '#111', alignItems: 'center' }}>
                                                    <Text>
                                                        {item.qty}
                                                    </Text>
                                                </Col>
                                                <Col style={{ alignItems: 'center' }}>
                                                    <Text>
                                                        {item.price}
                                                    </Text>
                                                </Col>
                                            </Row>
                                        )
                                    })}
                                </Grid>
                                <Text style={{ color: '#000', fontSize: 15, fontWeight: 'bold', marginBottom: 10, marginTop: 10 }}>Sevices</Text>
                                <Grid>
                                    <Row style={{ backgroundColor: '#ddd', borderWidth: 1, borderColor: '#111' }}>
                                        <Col style={{ borderRightWidth: 1, borderColor: '#111', alignItems: 'center' }}>
                                            <Text>
                                                Name
                                            </Text>
                                        </Col>
                                        <Col style={{ borderRightWidth: 1, borderColor: '#111', alignItems: 'center' }}>
                                            <Text>
                                                Quantity
                                            </Text>
                                        </Col>
                                        <Col style={{ alignItems: 'center' }}>
                                            <Text>
                                                Price
                                            </Text>
                                        </Col>
                                    </Row>
                                    {this.state.formService.map((item, key) => {
                                        return (
                                            <Row key={key} style={{ borderWidth: 1, borderColor: '#111', borderTopWidth: 0 }}>
                                                <Col style={{ borderRightWidth: 1, borderColor: '#111', alignItems: 'center' }}>
                                                    <Text>
                                                        {item.service_name}
                                                    </Text>
                                                </Col>
                                                <Col style={{ borderRightWidth: 1, borderColor: '#111', alignItems: 'center' }}>
                                                    <Text>
                                                        {item.qty}
                                                    </Text>
                                                </Col>
                                                <Col style={{ alignItems: 'center' }}>
                                                    <Text>
                                                        {item.price}
                                                    </Text>
                                                </Col>
                                            </Row>
                                        )
                                    })}
                                </Grid>
                            </View>
                            :
                            <View />
                        }
                    </View>

                    {(this.state.datePicker || this.state.timePicker) ?
                        <DateTimePicker
                            isVisible={true}
                            mode={this.state.datePicker ? 'date' : 'time'}
                            onConfirm={(date) => {
                                this.onChangeHandler(this.state.datePicker ? moment(date).format("YYYY-MM-DD") : moment(date).format("hh:mm"), this.selectedDateOrTimeObject);
                                this.setState({ datePicker: false, timePicker: false });
                            }}
                            onCancel={() => {
                                this.setState({ datePicker: false, timePicker: false });
                            }}
                        />
                        :
                        null
                    }

                    {this.state.formDataObj.form_status === 'Completed' ?
                        <View />
                        :
                        <View>
                            {this.state.dynamicForms.signature === 'Y' ?
                                <View style={{ margin: 10 }}>
                                    <Text style={styles.labelStyle}>
                                        Signature
                                    </Text>
                                    <Button1
                                        title={'Enter Signature'}
                                        disabled={this.state.startButtonText === 'Start' ? true : false}
                                        onPress={() => this.setState({ signatureDialogVisible: true })}
                                    >
                                        Enter Signature
                                    </Button1>
                                </View>
                                :
                                null
                            }

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
                                <Button1
                                    title={'Complete'}
                                    disabled={this.state.startButtonText === 'Start' ? true : false}
                                    onPress={() => this.onCompleteClick('1')}
                                >
                                    Complete
                                </Button1>
                                <Button1
                                    title={'Hold'}
                                    disabled={this.state.startButtonText === 'Start' ? true : false}
                                    onPress={() => this.onCompleteClick('0')}
                                >
                                    Hold
                                </Button1>
                            </View>
                        </View>
                    }
                    {
                        this.state.formDataObj.form_status === 'Completed' ?
                            <View style={{ margin: 10 }}>
                                <View style={{ marginBottom: 10 }}>
                                    <Text style={{
                                        color: '#000',
                                        fontSize: 15,
                                        fontWeight: 'bold',
                                        marginBottom: 5,
                                        marginTop: 10
                                    }}>
                                        Email Id *
                                    </Text>
                                    <Textarea
                                        style={{
                                            textAlignVertical: 'top',  // hack android
                                            height: 55,
                                            fontSize: 14,
                                            color: '#333',
                                            borderWidth: 1,
                                            borderColor: '#bbb',
                                            borderRadius: 8,
                                            paddingLeft: 10,
                                            backgroundColor: '#fff'
                                        }}
                                        value={this.state.emailSend}
                                        onChangeText={(emailSend) => this.setState({ emailSend })}
                                    />
                                </View>
                                <Button1
                                    title={'Send Email'}
                                    onPress={() => this.sendEmail()}
                                >
                                    Send Email
                                </Button1>
                            </View>
                            :
                            <View />
                    }
                </View>
            )
        }
        return (
            <Card style={{ alignContent: 'center' }}>
                <CardItem>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                        First Check In
                    </Text>
                </CardItem>
            </Card>
        )
    }

    renderConfirmAlert() {
        if (this.state.isDialogVisible) {
            return (
                <InputAlertModal
                    children={'Enter Reason *'}
                    value={this.state.reason}
                    onChangeText={(reason) => this.setState({ reason })}
                    onAccept={() => {
                        if (this.state.reason !== '') {
                            this.setState({ isDialogVisible: false });
                            this.onCompleteClick('1');
                        }
                    }}
                    onDecline={() => {
                        this.setState({ isDialogVisible: false });
                    }}
                />
            )
        }
    }

    renderLocationAlert() {
        if (this.state.isLocationVisible) {
            return (
                <InputAlertModal
                    children={'Enter Reason out of work location'}
                    value={this.state.locationReason}
                    onChangeText={(locationReason) => this.setState({ locationReason })}
                    onAccept={() => {
                        if (this.state.locationReason !== '') {
                            this.setState({ isLocationVisible: false });
                            this.insertStartLocation();
                        }
                    }}
                    onDecline={() => {
                        this.setState({ isLocationVisible: false });
                    }}
                />
            )
        }
    }

    renderCameraCaptiomAlert() {
        if (this.state.isCameraCaptiomVisible) {
            return (
                <InputAlertModal
                    children={'Enter Caption'}
                    value={this.state.CameraCaptiom}
                    onChangeText={(CameraCaptiom) => this.setState({ CameraCaptiom })}
                    onAccept={() => {
                        if (this.state.CameraCaptiom !== '') {
                            this.state.cameraImages.push({ Caption: this.state.CameraCaptiom, img: this.state.tempCamera });
                            this.setState({ isCameraCaptiomVisible: false, CameraCaptiom: '', tempCamera: [] });
                        }
                    }}
                    onDecline={() => {
                        this.state.cameraImages.push({ Caption: this.state.CameraCaptiom, img: this.state.tempCamera });
                        this.setState({ isCameraCaptiomVisible: false, CameraCaptiom: '', tempCamera: [] });
                    }}
                />
            )
        }
    }

    closeProduct() {
        this.setState({ productVisible: false });
    }

    closeAddProduct() {
        this.setState({ AddproductVisible: false });
    }

    openAddProduct() {
        this.setState({ AddproductVisible: true });
    }

    closeService() {
        this.setState({ serviceVisible: false });
    }

    closeAddService() {
        this.setState({ AddserviceVisible: false });
    }

    openAddService() {
        this.setState({ AddserviceVisible: true });
    }

    addProduct(index) {
        if (this.state.product[index].qty) {
            this.state.product[index].qty += 1;
        } else {
            this.state.product[index].qty = 1
        }
        this.forceUpdate();
    }

    removeProduct(index) {
        if (this.state.product[index].qty) {
            this.state.product[index].qty -= 1;
        } else {
            this.state.product[index].qty = 0
        }
        this.forceUpdate();
    }

    addProductData() {
        let obj = this.state.formProduct;
        for (let i = 0; i < this.state.product.length; i++) {
            let found = obj.findIndex(item => item.product_id === this.state.product[i].product_id);
            if (found !== -1) {
                obj[found].qty = this.state.product[i].qty;
            } else if (this.state.product[i].qty) {
                obj.push(this.state.product[i]);
            }
        }
        this.setState({ formProduct: obj, AddproductVisible: false });
    }

    deleteFormProduct(index) {
        let obj = this.state.formProduct;
        obj.splice(index, 1);
        this.setState({ formProduct: obj });
    }

    addFormProduct(index) {
        let obj = this.state.formProduct;
        if (obj[index].qty) {
            obj[index].qty += 1;
        } else {
            obj[index].qty = 1
        }
        this.setState({ formProduct: obj });
    }

    removeFormProduct(index) {
        let obj = this.state.formProduct;
        if (obj[index].qty) {
            obj[index].qty -= 1;
        } else {
            obj[index].qty = 0
        }
        this.setState({ formProduct: obj });
    }

    // For Service
    deleteFormService(index) {
        let obj = this.state.formService;
        obj.splice(index, 1);
        this.setState({ formService: obj });
    }

    addFormService(index) {
        let obj = this.state.formService;
        if (obj[index].qty) {
            obj[index].qty += 1;
        } else {
            obj[index].qty = 1
        }
        this.setState({ formService: obj });
    }

    removeFormService(index) {
        let obj = this.state.formService;
        if (obj[index].qty) {
            obj[index].qty -= 1;
        } else {
            obj[index].qty = 0
        }
        this.setState({ formService: obj });
    }

    addSerice(index) {
        if (this.state.service[index].qty) {
            this.state.service[index].qty += 1;
        } else {
            this.state.service[index].qty = 1
        }
        this.forceUpdate();
    }

    removeSerice(index) {
        if (this.state.service[index].qty) {
            this.state.service[index].qty -= 1;
        } else {
            this.state.service[index].qty = 0
        }
        this.forceUpdate();
    }

    addSericeData() {
        let obj = this.state.formService;
        for (let i = 0; i < this.state.service.length; i++) {
            let found = obj.findIndex(item => item.service_id === this.state.service[i].service_id);
            if (found !== -1) {
                obj[found].qty = this.state.service[i].qty;
            } else if (this.state.service[i].qty) {
                obj.push(this.state.service[i]);
            }
        }
        this.setState({ formService: obj, AddserviceVisible: false });
    }

    render() {
        return (
            <View style={styles.container}>
                <Loader loading={this.state.loading} />
                <ToolbarHeaderBackMenu
                    headerText={this.state.dynamicForms.form_name}
                    call={this.onBackPress.bind(this)}
                    navigation={this.props}
                />
                <ScrollView>
                    {this.renderDynamicForm()}
                    {this.renderConfirmAlert()}
                    {this.renderLocationAlert()}
                    {this.renderCameraCaptiomAlert()}
                </ScrollView>
                <Dialog
                    visible={this.state.signatureDialogVisible}
                    title="Signature Dialog"
                    onTouchOutside={() => this.setState({ signatureDialogVisible: false })}>
                    <View style={styles.SignatureViewContainer}>
                        <View style={{ flex: 1 }}>
                            <SignatureCapture
                                style={[{ flex: 1 }, styles.signature]}
                                ref="sign"
                                onSaveEvent={(result) => {
                                    this.setState({ signatureDialogVisible: false, formInputValues: { signature: result.encoded } });
                                }}
                                onDragEvent={this._onDragEvent}
                                saveImageFileInExtStorage={false}
                                showNativeButtons={false}
                                showTitleLabel={false}
                                viewMode={"portrait"}
                                watermarkSize={20}
                                watermarkColor={'#888888'}
                                signatureColor={'#000000'}
                                watermarkLineSpacing={10}
                                watermarkWordSpacing={5}
                                watermarkAngle={45}
                            />

                            <View style={styles.buttonSignatureTab}>
                                <TouchableOpacity key={'reset'} style={styles.buttonSignature} onPress={this._resetSign.bind(this)}>
                                    <Text>Reset</Text>
                                </TouchableOpacity>
                                <TouchableOpacity key={'save'} style={styles.buttonSignature} onPress={this._saveSign.bind(this)}>
                                    <Text>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Dialog>
                <WorkOrderProduct
                    modalVisible={this.state.productVisible}
                    closeProduct={() => this.closeProduct()}
                    openAddProduct={() => this.openAddProduct()}
                    data={this.state.formProduct}
                    name={'Product'}
                    deleteFormProduct={(index) => this.deleteFormProduct(index)}
                    addFormProduct={(index) => this.addFormProduct(index)}
                    removeFormProduct={(index) => this.removeFormProduct(index)}
                />
                <AddWorkOrderProduct
                    modalVisible={this.state.AddproductVisible}
                    closeProduct={() => this.closeAddProduct()}
                    data={this.state.product}
                    name={'Select'}
                    addProduct={(index) => this.addProduct(index)}
                    removeProduct={(index) => this.removeProduct(index)}
                    addProductData={() => this.addProductData()}
                />
                <WorkOrderProduct
                    modalVisible={this.state.serviceVisible}
                    closeProduct={() => this.closeService()}
                    openAddProduct={() => this.openAddService()}
                    data={this.state.formService}
                    name={'Service'}
                    deleteFormProduct={(index) => this.deleteFormService(index)}
                    addFormProduct={(index) => this.addFormService(index)}
                    removeFormProduct={(index) => this.removeFormService(index)}
                />
                <AddWorkOrderProduct
                    modalVisible={this.state.AddserviceVisible}
                    closeProduct={() => this.closeAddService()}
                    data={this.state.service}
                    name={'Select'}
                    addProduct={(index) => this.addSerice(index)}
                    removeProduct={(index) => this.removeSerice(index)}
                    addProductData={() => this.addSericeData()}
                />
            </View>
        );
    }
}

DynamicFormScreen.navigationOptions = {
    header: null
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column'
    },
    signature: {
        flex: 1,
        borderColor: '#000033',
        borderWidth: 1,
    },
    SignatureViewContainer: {
        backgroundColor: '#F5FCFF',
        height: 250
    },
    signatureView: {
        flex: 1
    },
    buttonSignatureTab: {
        height: 48,
        flexDirection: 'row',
        backgroundColor: '#8080CC'
    },
    buttonSignature: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    labelStyle: {
        color: '#000',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 10
    },
    imageOuter: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 10
    },
    image: {
        alignItems: 'center',
        width: (window.width / 3) - 30,
        height: (window.width / 4) + 5,
        // margin: 5,
        borderRadius: 8,
        borderColor: '#000',
        borderWidth: 1
    }
});


export default DynamicFormScreen;
