import React from 'react';
import {
    StyleSheet,
    View,
    Modal
} from 'react-native';
import { Container, Content, Card, Text, Header, Title, Left, Body, Right, Icon, Button, Footer, FooterTab } from 'native-base';

export const AddWorkOrderProduct = props => {
    const { card, boldText, text, plusButton, minusButton, buttonIcon } = styles;
    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={props.modalVisible}
            onRequestClose={props.closeProduct} 
        >
            <Container>
                <Header>
                    <Left />
                    <Body>
                        <Title>
                            {props.name}
                        </Title>
                    </Body>
                    <Right />
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
                                        {item.price * (item.qty ? item.qty : 0)}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={text}>
                                        Quantity :
                                    </Text>
                                    <Button small danger style={minusButton} onPress={() => props.removeProduct(index)} >
                                        <Icon name="minus" type="FontAwesome" style={buttonIcon} />
                                    </Button>
                                    <Text style={boldText}>
                                        {item.qty ? item.qty : 0}
                                    </Text>
                                    <Button success small style={plusButton} onPress={() => props.addProduct(index)} >
                                        <Icon name="plus" type="FontAwesome" style={buttonIcon} />
                                    </Button>
                                </View>
                            </Card>
                        )
                    })}
                    
                </Content>
                <Footer transparent>
                    <FooterTab style={{ backgroundColor:"#FFF" }}>
                        <Button 
                            light small 
                            style={{ marginLeft: 10, marginRight: 10, backgroundColor: '#ddd' }}
                            onPress={props.closeProduct}
                        >
                            <Text>
                                Cancel
                            </Text>
                        </Button>
                        <Button 
                            info small 
                            style={{ marginLeft: 10, marginRight: 10, backgroundColor: '#0b9bcf' }}
                            onPress={props.addProductData}
                        >
                            <Text>
                                Add
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
