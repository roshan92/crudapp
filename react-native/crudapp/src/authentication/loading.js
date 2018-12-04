import React, { Component } from 'react'
import { AsyncStorage, ActivityIndicator, StyleSheet, View } from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation'

export default class Loading extends Component {

    constructor(props) {
        super(props)
        this.getUser()
    }

    async getUser() {
        try {
            const userid = await AsyncStorage.getItem('@userid')
            // alert(userid)
            if(userid == null) {
                this.resetNavigation('StackAuth', 'Login')
            }
            else {
                this.resetNavigation('StackProduct', 'ProductList')
            }
        } catch (error) {
            console.log("Error retrieving data" + error)
        }
    }

    resetNavigation(route1, route2) {
        const resetAction = StackActions.reset({
            index: 0, // Reset nav stack
            key: null,
            actions: [
                NavigationActions.navigate({
                    routeName: route1, // Call home stack
                    action: NavigationActions.navigate({
                        routeName: route2,
                    }),
                }),
            ],
        })
        this.props.navigation.dispatch(resetAction);
    }

    render() {
        return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    }
})