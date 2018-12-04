import React, { Component } from 'react';
import { AsyncStorage, Dimensions, StyleSheet, Text, View, Image, TouchableHighlight, TouchableOpacity, Alert } from 'react-native';
import { Container, Content, Footer, Button, Icon } from 'native-base';

import ImageSlider from 'react-native-image-slider';
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
export default class ProductDetails extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerRight: (
                <TouchableOpacity onPress={() => {
                    navigation.navigate('CartList')
                }}>
                    <Icon active name='ios-cart' style={{marginRight: 10}} />
                </TouchableOpacity>
            )
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            name: '',
            description: '',
            price: '',
            imagesArr: [],
        }
        this.getProductShowApi()
    }

    getProductShowApi() {
        var productId = this.props.navigation.getParam('productId')
        // alert(productId)
        fetch(`http://10.111.240.96/simplecrudapp/api/product/show?id=${productId}`, {
            method : 'GET',
        })
        .then((response) => {
            response.json()
            .then((responseJson) => {
                if(response.status === 200) {
                    var images = []
                    for(let image of responseJson.value.images) {
                        let imgFilename = `http://10.111.240.96/simplecrudapp/product/images/${image.filename}`
                        images.push(imgFilename)
                    }
                    this.setState({
                        name: responseJson.value.name,
                        description: responseJson.value.description,
                        price: responseJson.value.price,
                        imagesArr: images
                    })
                }
                else {
                    alert(responseJson.message)
                }
            })
        })
        .done();
    }

    addCartApi() {
        var productId = this.props.navigation.getParam('productId')
        AsyncStorage.getItem("@userid").then((value) => {
            // alert(productId + ', ' + value)
            fetch('http://10.111.240.96/simplecrudapp/api/cart/create', {
                method : 'POST',
                headers: {
                    'Content-type' : 'application/json',
                },
                body: JSON.stringify({
                    'user_id': value,
                    'product_id': productId,
                    'quantity': 1
                })
            })
            .then((response) => {
                response.json()
                .then((responseJson) => {
                    alert(responseJson.message)
                })
            })
            .done();
        });
    }

    render() {

        return (
            <Container>
                <Content>
                    <View style={styles.content1}>
                        <ImageSlider
                        loop
                        autoPlayWithInterval={3000}
                        images={this.state.imagesArr}
                        onPress={({ index }) => alert(index)}
                        customSlide={({ index, item, style, width }) => (
                            // It's important to put style here because it's got offset inside
                            <View
                                key={index}
                                style={[ style, styles.customSlide ]}
                            >
                                <Image source={{ uri: item }} style={styles.customImage} />
                            </View>
                        )}
                        customButtons={(position, move) => (
                            <View style={styles.buttons}>
                                {this.state.imagesArr.map((image, index) => {
                                    return (
                                    <TouchableHighlight
                                        key={index}
                                        underlayColor="#ccc"
                                        onPress={() => move(index)}
                                        style={styles.button}
                                    >
                                        <Text style={position === index && styles.buttonSelected}>
                                        {index + 1}
                                        </Text>
                                    </TouchableHighlight>
                                    );
                                })}
                            </View>
                        )}
                        />
                    </View>
                    <View style={styles.content2}>
                        <Text style={styles.nameText}>{this.state.name}</Text>
                        <Text style={styles.priceText}>RM {this.state.price}</Text>
                        <Text style={styles.descriptionText}>{this.state.description}</Text>
                    </View>
                </Content>
                <Footer style={{borderTopWidth: 0, backgroundColor: '#fff'}}>
                    <Button block info style={{width: width-20}} onPress={()=> this.addCartApi()}>
                        <Text style={{fontSize: 17}}>Buy Now</Text>
                    </Button>
                </Footer>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    slider: { backgroundColor: '#000', height: 300 },
    content1: {
        width: '100%',
        height: 300,
    },
    content2: {
        width: '100%',
        height: height-350,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    buttons: {
        zIndex: 1,
        height: 15,
        marginTop: -25,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    button: {
        margin: 3,
        width: 15,
        height: 15,
        opacity: 0.9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonSelected: {
        opacity: 1,
        color: 'red',
    },
    customSlide: {
        backgroundColor: '#d7d7d7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    customImage: {
        width: width,
        height: 300,
    },
    nameText: {
        fontSize: 17,
        fontWeight: 'bold'
    },
    priceText: {
        fontSize: 15,
    },
    descriptionText: {
        fontSize: 15,
        marginTop: 15     
    }
});