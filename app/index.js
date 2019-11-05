import React, { Component } from 'react';
import {
    View,
    AsyncStorage,
    StyleSheet,
    Text
} from 'react-native';



export default class Index extends Component {

    constructor(props) {
        super(props);
        this.state = {
          data:this.props.navigation.state.params
        }
        this._loadApp()
      }

      //pageHeader
    static navigationOptions = (props) => ({
        // header: null
        headerStyle: {
            elevation: 0
        }
    });
    

    _loadApp = async () => {
        const value = await AsyncStorage.getItem('logginKey');
        if (value == null) {
            await AsyncStorage.setItem('logginKey', 'loggedOut');
            this.props.navigation.navigate('LoginPage');
        }
        else if (value == 'loggedOut') {
            this.props.navigation.navigate('LoginPage');
        }
        else if (value != 'loggedOut' && value != null) {
            this.props.navigation.navigate('General');
        }
        else {
            this.props.navigation.navigate('LoginPage');
        }
    }

    render() {
        return (
            <View style={Styles.container}>
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
    }
});