import React, { Component } from 'react';
import { AsyncStorage, Text, Dimensions, StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { Container, Header, Content, List, ListItem, Thumbnail, Left, Body, Right, Button, Icon } from 'native-base'

const width = Dimensions.get('window').width

export default class CartList extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Shopping Cart',
            headerTitleStyle :{textAlign: 'center',alignSelf:'center'},
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            cartLength: 0,
        }
        this.getCartApi()
    }

    getCartApi() {
        AsyncStorage.getItem("@userid").then((value) => {
            fetch(`http://10.111.240.96/simplecrudapp/api/cart/show?user_id=${value}`, {
                method : 'GET',
            })
            .then((response) => {
                response.json()
                .then((responseJson) => {
                    if(response.status === 200) {
                        this.setState({
                            data: responseJson.value,
                            cartLength: responseJson.value.length
                        })
                    }
                    else {
                        this.setState({
                            data: [],
                            cartLength: 0
                        })
                        // alert(responseJson.message)
                    }
                })
            })
            .done();
        })
    }

    deleteCartApi(cartId) {
        fetch('http://10.111.240.96/simplecrudapp/api/cart/delete', {
            method : 'DELETE',
            headers: {
                'Content-type' : 'application/json',
            },
            body: JSON.stringify({
                'id': cartId
            })
        })
        .then((response) => {
            response.json()
            .then((responseJson) => {
                if(response.status === 202) {
                    this.getCartApi()
                }
                else {
                    alert(responseJson.message)
                }
            })
        })
        .done();
    }

    addQuantity(cartId, itemQuantity) {
        let qty = parseInt(itemQuantity)+1
        this.updateCartApi(cartId, qty)
    }

    removeQuantity(cartId, itemQuantity) {
        let qty = parseInt(itemQuantity)-1
        if(qty < 1) {
            alert("Invalid quantity.")
        }
        else {
            this.updateCartApi(cartId, qty)
        }
    }

    updateCartApi(cartId, itemQuantity) {
        fetch('http://10.111.240.96/simplecrudapp/api/cart/update', {
            method : 'POST',
            headers: {
                'Content-type' : 'application/json',
            },
            body: JSON.stringify({
                'id': cartId,
                'quantity': itemQuantity
            })
        })
        .then((response) => {
            response.json()
            .then((responseJson) => {
                if(response.status === 202) {
                    this.getCartApi()
                }
                else {
                    alert(responseJson.message)
                }
            })
        })
        .done();
    }

    render() {
        return (
            <Container>
                <Content>
                    {
                        this.state.cartLength == 0 ?
                        (
                            <View/>
                        )
                        :
                        (
                            <FlatList
                                data={this.state.data}
                                renderItem={({ item }) => (
                                <List>
                                    <ListItem thumbnail>
                                    <Left>
                                        <Thumbnail square source={{ uri:`http://10.111.240.96/simplecrudapp/product/images/${item.image_filename}`}} />
                                    </Left>
                                    <Body>
                                        <Text style={{fontSize: 15}}>{item.name}</Text>
                                        <Text style={{fontSize: 15}}>RM{item.price}</Text>
                                        <View style={{flex: 1, flexDirection: 'row', marginTop: 5}}>
                                            <View style={{width: 25, height: 25, backgroundColor: 'lightgrey', justifyContent: 'center', alignItems: 'center'}}>
                                                <TouchableOpacity onPress={() => {
                                                    this.removeQuantity(item.id, item.quantity)
                                                }}>
                                                    <Icon active name='ios-remove' style={{color: 'black', fontSize: 25}}/>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{width: 50, height: 25, backgroundColor: '#f7f7f7', justifyContent: 'center', alignItems: 'center'}}>
                                            <Text style={{fontSize: 15}}>{item.quantity}</Text>
                                            </View>
                                            <View style={{width: 25, height: 25, backgroundColor: 'lightgrey', justifyContent: 'center', alignItems: 'center'}}>
                                                <TouchableOpacity onPress={() => {
                                                    this.addQuantity(item.id, item.quantity)
                                                }}>
                                                    <Icon active name='ios-add' style={{color: 'black', fontSize: 25}}/>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </Body>
                                    <Right>
                                        <Button transparent onPress={()=>this.deleteCartApi(item.id)}>
                                            <Icon active name='ios-trash' style={{color: 'red', fontSize: 30}}/>
                                        </Button>
                                    </Right>
                                    </ListItem>
                                </List>
                            )}
                            />
                        )
                    }
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
})