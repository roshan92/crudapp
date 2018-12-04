import React, {Component} from 'react'
import { View, StyleSheet, Text, Dimensions, AsyncStorage } from 'react-native'
import { Container, Content, Item, Input, Button, Icon} from 'native-base'

const {width: WIDTH } = Dimensions.get('window')
export default class SignUp extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            confirmpassword: ''
        }
    }

    async saveUser(key, value) {
        try {
          await AsyncStorage.setItem(key, value);
        } catch (error) {
            alert(error)
          console.log('AsyncStorage Error: ' + error.message);
        }
    }

    postSignupApi() {
        const { username, password, confirmpassword } = this.state
        if(password == confirmpassword) {
            fetch('http://10.111.240.96/simplecrudapp/api/user/signup', {
                method : 'POST',
                headers: {
                    'Content-type' : 'application/json',
                },
                body: JSON.stringify({
                    'username': username,
                    'password': password
                })
            })
            .then((response) => {
                response.json()
                .then((responseJson) => {
                    if(response.status === 201) {
                        alert("Successfully registered. Please log in to continue.")
                        this.props.navigation.goBack()
                    }
                    else {
                        alert(responseJson.message)
                    }
                })
            })
            .done();
        }
        else {
            alert("Password does not match.")
        }
    }
    
    render() {
        return(
            <Container>
                <Content contentContainerStyle={{ justifyContent: 'center', flex: 1, alignItems: 'center'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 25, marginBottom: 20}}>Product App</Text>
                    <Item rounded style={styles.inputcontainer} >
                        <Icon active name='ios-mail-outline' style={{color:"white"}} />
                        <Input
                            style={styles.input}
                            placeholder="Username"
                            placeholderTextColor="white"
                            value={this.state.username} 
                            onChangeText={ (username) => this.setState({username})}
                        />
                    </Item>
                    <Item rounded style={styles.inputcontainer} >
                        <Icon active name='ios-lock-outline' style={{color:"white"}} />
                        <Input
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="white"
                            secureTextEntry={true}
                            value={this.state.password} 
                            onChangeText={ (password) => this.setState({password})}
                        />
                    </Item>
                    <Item rounded style={styles.inputcontainer} >
                        <Icon active name='ios-lock-outline' style={{color:"white"}} />
                        <Input
                            style={styles.input}
                            placeholder="Confirm Password"
                            placeholderTextColor="white"
                            secureTextEntry={true}
                            value={this.state.confirmpassword} 
                            onChangeText={ (confirmpassword) => this.setState({confirmpassword})}
                        />
                    </Item>
                    <Button style={styles.button} onPress={() => this.postSignupApi()} >
                        <Text style={{color:'white'}}>SIGN UP</Text>
                    </Button>
                    <View style={{flexDirection: 'row', marginVertical:5, marginHorizontal: 35}}>
                        <View style={{backgroundColor: 'grey', height: 1, flex: 1, alignSelf: 'center'}} />
                        <Text style={{ alignSelf:'center', paddingHorizontal:5, fontSize:14, fontFamily:'Cochin' }}> OR </Text>
                        <View style={{backgroundColor: 'grey', height: 1, flex: 1, alignSelf: 'center'}} />
                    </View>
                    <Button style={styles.button} onPress={() => this.props.navigation.navigate('Login')}>
                        <Text style={{color:'white'}}>LOGIN</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'center',
        alignItems:'center',
        height:null,
        width:null
    },
    input:{
        color:"white"
    },
    inputcontainer: {
        width: WIDTH - 55,
        height: 45,
        backgroundColor: '#1769aa',
        color: 'white',
        alignSelf: 'center',
        marginVertical: 5
    },
    button: {
        width: WIDTH - 55,
        height: 45,
        borderRadius:45,
        backgroundColor: '#3498DB',
        marginVertical: 10,
        justifyContent:'center',
        alignItems:'center',
        alignSelf: 'center',
    }

})

