import React from 'react';
import {
    StyleSheet,
    View,
    Modal,
    ActivityIndicator
} from 'react-native';
import { Container, Content, Card, CardItem, Text, Header, Title, Left, Body, Right, Icon, Button, Footer, FooterTab } from 'native-base';

export const WorkOrderProduct = props => {
    const { card, boldText, text, plusButton, minusButton, buttonIcon } = styles;
    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={props.modalVisible}
            onRequestClose={props.closeProduct} 
        >
            <Container>
                <Header info>
                    <Left />
                    <Body>
                        <Title>
                            {props.name}
                        </Title>
                    </Body>
                    <Right>
                        <Icon name='plus-circle' type='FontAwesome' onPress={props.openAddProduct} style={{ color: '#fff' }} />
                    </Right>
                </Header>
                <Content>
                    {props.data.map((item, index) => {
                        return (
                            <Card style={card} key={index}>
                                <Text style={boldText}>
                                    {item.product_name ? item.product_name: item.service_name}
                                </Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={text}>
                                        Price :
                                    </Text>
                                    <Text style={boldText}>
                                        {item.price}
                                    </Text>
                                    <Text style={text}>
                                        ({item.unit})
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={text}>
                                        Total Price :
                                    </Text>
                                    <Text style={boldText}>
                                        {item.price * item.qty}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={text}>
                                        Quantity
                                    </Text>
                                    <Button small danger style={minusButton} onPress={() => props.removeFormProduct(index)}>
                                        <Icon name="minus" type="FontAwesome" style={buttonIcon} />
                                    </Button>
                                    <Text style={boldText}>
                                        {item.qty}
                                    </Text>
                                    <Button success small style={plusButton} onPress={() => props.addFormProduct(index)}>
                                        <Icon name="plus" type="FontAwesome" style={buttonIcon} />
                                    </Button>
                                </View>
                                <View style={{ position: 'absolute', right: 0, top: 0 }}>
                                    <Icon 
                                        name='times-circle' 
                                        type='FontAwesome'
                                        style={{ color: 'red'}}
                                        onPress={() => props.deleteFormProduct(index)} 
                                    />
                                </View>
                            </Card>
                        )
                    })}
                </Content>
                <Footer transparent>
                    <FooterTab style={{ backgroundColor:"#FFF" }}>
                        <Button 
                            small light 
                            style={{ marginLeft: 10, marginRight: 10, backgroundColor: '#ddd' }}
                            onPress={props.closeProduct}
                        >
                            <Text>
                                Cancel
                            </Text>
                        </Button>
                        <Button 
                            small info 
                            style={{ marginLeft: 10, marginRight: 10, backgroundColor: '#0b9bcf' }}
                            onPress={props.openAddProduct}
                        >
                            <Text>
                                Add
                            </Text>
                        </Button>
                        <Button 
                            small warning 
                            style={{ marginLeft: 10, marginRight: 10, backgroundColor: '#ff8901' }}
                            onPress={props.closeProduct}
                        >
                            <Text>
                                Save
                            </Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        </Modal>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        padding: 10,
        marginLeft: 10,
        marginRight: 10
    },
    text: {
        fontWeight: 'normal',
        fontSize: 14,
        color: '#777',
        margin: 1,
        marginLeft: 5
    },
    boldText: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#000',
        margin: 1,
        marginLeft: 5
    },
    minusButton: {
        marginLeft: 10,
        borderRadius: 5,
        marginRight: 20
    },
    plusButton: {
        marginLeft: 10,
        borderRadius: 5,
        marginLeft: 20
    },
    buttonIcon: {
        fontSize: 15,
        marginLeft: 10,
        marginRight: 10
    }
});
