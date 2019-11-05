import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    AsyncStorage,
    Image,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard
} from 'react-native';

import {
    TextInput, Snackbar, ActivityIndicator, TouchableRipple
} from 'react-native-paper';

import { Header } from 'react-navigation-stack';

import colors from '../constants/colors';

//importing request
import * as request from '../constants/requests';
import { ScrollView } from 'react-native-gesture-handler';


export default class SignUp extends Component {

    //pageHeader
    static navigationOptions = (props) => ({
        // header: null
        headerStyle: {
            elevation: 0
        }
    });


    constructor() {
        super();
        this.state = {
            email: null,
            password: null,
            cpassword: null,
            loginPError: false,
            loginError: false,
            message: null,
            visible: false,
            signingUp: false
        }
    }

    _signup = async () => {
        Keyboard.dismiss();
        if (this.state.email == null || this.state.password == null || this.state.cpassword == null) {
            this.setState({ loginError: true, loginPError: true });
        } else if(this.state.password.length <= 5 || this.state.cpassword.length <= 5){
            this.setState({ signingUp: false, loginPError: true, visible: true, message: 'Password must be more than 5 characters' });
        } else if (this.state.password != this.state.cpassword) {
            this.setState({ message: "Passwords Doesnt match", visible: true, loginPError: true });
        } else {
            this.setState({ signingUp: true });
            const loginResp = await request._signup(this.state.email, this.state.password, this.state.cpassword);
            if (loginResp.response.error == 0) {
                this.setState({ signingUp: false });
                // saving info offline
                AsyncStorage.setItem('userInfo', JSON.stringify(loginResp.response.data[0]));
                AsyncStorage.setItem('logginKey', 'loggedIn');
                this.props.navigation.navigate('General');
            } else if (loginResp.response.error == 1 && loginResp.response.message == 'Username already in use') {
                this.setState({ signingUp: false, loginError: true, visible: true, message: loginResp.response.message });
            } else {
                this.setState({ signingUp: false, loginError: true, visible: true, message: 'Password must be more than 5 characters' });
            }
        }
    }

    render() {
        return (
            <KeyboardAvoidingView style={Styles.container} behavior='padding' keyboardVerticalOffset={Header.HEIGHT + 40}>
                <ScrollView>
                    <View style={{ flexDirection: 'row', marginHorizontal: 20 }}>
                        <Text style={{ color: 'black', fontSize: 50, fontWeight: 'bold' }}>
                            Spend
                            </Text>
                        <Text style={{ color: colors.accent, fontSize: 30, fontWeight: 'bold' }}>.me</Text>
                    </View>
                    <View style={{ margin: 20 }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                style={{ width: 80, height: 80 }}
                                source={{ uri: 'https://img.icons8.com/doodle/96/000000/user.png' }} />
                        </View>
                        <TextInput
                            style={Styles.textInput}
                            type='contained'
                            label='Username'
                            value={this.state.email}
                            onChangeText={email => this.setState({ email })}
                            selectionColor='white'
                            underlineColor={colors.primary}
                            onSubmitEditing={() => this.passwordInput.focus()}
                            returnKeyType='next'
                            error={this.state.loginError}
                        />
                        <TextInput
                            style={Styles.textInput}
                            type='contained'
                            label='Password'
                            value={this.state.password}
                            onChangeText={password => this.setState({ password })}
                            selectionColor='white'
                            underlineColor={colors.primary}
                            secureTextEntry={true}
                            returnKeyType='next'
                            ref={(input) => this.passwordInput = input}
                            onSubmitEditing={() => this.cpasswordInput.focus()}
                            autoCapitalize='none'
                            error={this.state.loginPError}
                        />
                        <TextInput
                            style={Styles.textInput}
                            type='contained'
                            label='Confirm Password'
                            value={this.state.cpassword}
                            onChangeText={cpassword => this.setState({ cpassword })}
                            selectionColor='white'
                            underlineColor={colors.primary}
                            secureTextEntry={true}
                            returnKeyType='go'
                            ref={(input) => this.cpasswordInput = input}
                            onSubmitEditing={() => this._signup()}
                            autoCapitalize='none'
                            error={this.state.loginPError}
                        />
                        <TouchableOpacity onPress={() => {
                            this._signup();
                        }}>
                            <View style={Styles.button}>
                                <ActivityIndicator animating={true} color={colors.text} size='small'
                                    style={{
                                        width: this.state.signingUp == false ? 0 : 'auto',
                                        height: this.state.signingUp == false ? 0 : 'auto',
                                        opacity: this.state.signingUp == false ? 0 : 1,
                                        marginRight: 5
                                    }} />
                                <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold' }}>SIGN Up</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <Snackbar
                    visible={this.state.visible}
                    onDismiss={() => this.setState({ visible: false })}
                    duration={4000}
                >
                    {this.state.message}
                </Snackbar>
            </KeyboardAvoidingView>
        )
    }
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    textInput: {
        backgroundColor: 'transparent',
        marginTop: 10
    },
    button: {
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        height: 70,
        marginTop: 50,
        flexDirection: 'row',
        backgroundColor: colors.primary
    },
});