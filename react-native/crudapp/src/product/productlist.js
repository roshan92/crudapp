import React, { Component } from 'react';
import { AsyncStorage, Text, Image, Dimensions, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Container, Content, Card, CardItem, Icon, Body } from 'native-base';
import { StackActions, NavigationActions } from 'react-navigation';

const width = Dimensions.get('window').width

export default class ProductList extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Hot Products',
            headerTitleStyle :{textAlign: 'center',alignSelf:'center'},
            headerRight: (
                <TouchableOpacity onPress={() => {
                    AsyncStorage.clear();
                    Alert.alert(
                        'Alert',
                        'Are you sure you want to log out?',
                        [
                          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                          {text: 'OK', onPress: () => {
                            navigation.getParam('handleUser')
                            const resetAction = StackActions.reset({
                                index: 0, // Reset nav stack
                                key: null,
                                actions: [
                                    NavigationActions.navigate({
                                        routeName: 'StackAuth', // Call home stack
                                        action: NavigationActions.navigate({
                                            routeName: 'Login',
                                        }),
                                    }),
                                ],
                            })
                            navigation.dispatch(resetAction)
                          }},
                        ],
                        { cancelable: false }
                    )
                }}>
                    <Icon active name='ios-log-out' style={{marginRight: 10}} />
                </TouchableOpacity>
            )
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            data: [],
        }
        this.getProductListApi()
    }

    getProductListApi() {
        fetch('http://10.111.240.96/simplecrudapp/api/product/list', {
            method : 'GET',
        })
        .then((response) => {
            response.json()
            .then((responseJson) => {
                if(response.status === 200) {
                    this.setState({
                        data: responseJson.value
                    })
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
                    <FlatList
                        contentContainerStyle={styles.list}
                        data={this.state.data}
                        renderItem={({ item }) => (
                            <Card style={styles.card}>
                                <CardItem cardBody style= {{alignSelf:'center'}} button onPress={() => this.props.navigation.navigate('ProductDetails',{productId: item.id})}>
                                    <Image source={{uri: `http://10.111.240.96/simplecrudapp/product/images/${item.image_filename}`}}
                                    style={{height: 150, width: 150, }}/>
                                </CardItem>
                                <CardItem>
                                <Body>
                                    <Text>{item.name}</Text>
                                    <Text>RM {item.price}</Text>
                                </Body>
                                </CardItem>
                            </Card>
                        )}
                    />
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        width: (width / 2) - 15,
        marginLeft: 10,
        marginTop: 10,
    },
    list: {
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
      }
})