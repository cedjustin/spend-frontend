import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    ImageBackground,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard,
    AsyncStorage,
} from 'react-native';

import {
    TextInput, Snackbar, ActivityIndicator, TouchableRipple
} from 'react-native-paper';

import colors from '../constants/colors';

// animation dependencies
import Animated, { Easing } from 'react-native-reanimated';
import { TapGestureHandler, State } from 'react-native-gesture-handler';

//importing request
import * as request from '../constants/requests';


const {
    Value,
    event,
    block,
    cond,
    eq,
    set,
    Clock,
    startClock,
    clockRunning,
    stopClock,
    debug,
    timing,
    interpolate,
    Extrapolate,
    concat
} = Animated;

function runTiming(clock, value, dest) {
    const state = {
        finished: new Value(0),
        position: new Value(0),
        time: new Value(0),
        frameTime: new Value(0)
    };

    const config = {
        duration: 500,
        toValue: new Value(0),
        easing: Easing.inOut(Easing.ease)
    };

    return block([
        cond(clockRunning(clock), 0, [
            set(state.finished, 0),
            set(state.time, 0),
            set(state.position, value),
            set(state.frameTime, 0),
            set(config.toValue, dest),
            startClock(clock)
        ]),
        timing(clock, state, config),
        cond(state.finished, debug('stop clock', stopClock(clock))),
        state.position
    ]);
}


export default class signin extends Component {

    //pageHeader
    static navigationOptions = (props) => ({
        header: null
    });


    constructor() {
        super();
        this.state = {
            email: null,
            password: null,
            loginError: false,
            message: null,
            visible: false,
            loggingIn: false
        }
        this.buttonOpacity = new Value(1);
        this.onLocalButtonClicked = event([
            {
                nativeEvent: ({ state }) => block([
                    cond(eq(state, State.END), set(this.buttonOpacity,
                        runTiming(new Clock, 1, 0)))
                ])
            }
        ])

        this.onCloseState = event([
            {
                nativeEvent: ({ state }) => block([
                    cond(eq(state, State.END), set(this.buttonOpacity,
                        runTiming(new Clock, 0, 1)))
                ])
            }
        ])

        this.buttonY = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [100, 0],
            extrapolate: Extrapolate.CLAMP
        })
        this.buttonContainerHeight = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [Dimensions.get('window').height / 2 + 200, Dimensions.get('window').height / 3 + 10],
            extrapolate: Extrapolate.CLAMP
        })

        this.textInputZindex = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [1, -1],
            extrapolate: Extrapolate.CLAMP
        })

        this.textInputOpacity = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [1, 0],
            extrapolate: Extrapolate.CLAMP
        })

        this.textInputY = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [0, 100],
            extrapolate: Extrapolate.CLAMP
        })

        this.rotateCross = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [180, 360],
            extrapolate: Extrapolate.CLAMP
        })

        this.wordsPartHeight = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [Dimensions.get('window').height / 3 - 40, Dimensions.get('window').height / 2],
            extrapolate: Extrapolate.CLAMP
        })

        this.hideOnAnimated = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: Extrapolate.CLAMP
        })
    }

    _logIn = async () => {
        Keyboard.dismiss();
        if (this.state.email == null || this.state.password == null) {
            this.setState({ loginError: true })
        } else {
            this.setState({ loggingIn: true });
            const loginResp = await request._login(this.state.email, this.state.password);
            if (loginResp.error != 0) {
                this.setState({ loginError: true, message: loginResp.message, visible: true, loggingIn: false })
            } else if (loginResp.error == 0) {
                this.setState({ loggingIn: false });
                // saving info offline
                AsyncStorage.setItem('userInfo', JSON.stringify(loginResp.data[0]));
                AsyncStorage.setItem('logginKey', 'loggedIn');
                this.props.navigation.navigate('General');
            } else {
                this.setState({ loggingIn: false ,loginError: true, message: 'Email or Password is incorrect', visible: true, loggingIn: false })
            }
        }
    }

    render() {
        return (
            <View style={Styles.container}>
                <Animated.View style={{
                    ...StyleSheet.absoluteFill
                }}>
                    <ImageBackground
                        source={require('../../assets/mainbg.jpg')}
                        style={{ flex: 1, height: null, width: null }}
                        imageStyle={{ width: this.mainBgWSize, height: '100%' }}
                    >
                        <View style={{ backgroundColor: colors.primary, flex: 1, opacity: 0.9 }}></View>
                    </ImageBackground>
                </Animated.View>
                <Animated.View style={{ height: this.wordsPartHeight }}>
                    <Animated.View style={{ margin: 20 }}>
                        <Animated.Text style={{ color: '#fafafb', fontSize: 30, fontWeight: 'bold', opacity: this.hideOnAnimated }}>
                            HELLO
                        </Animated.Text>
                        <Animated.View style={{ flexDirection: 'row' }}>
                            <Animated.Text style={{ color: colors.text, fontSize: 50, fontWeight: 'bold' }}>
                                Spend
                            </Animated.Text>
                            <Animated.Text style={{ color: colors.accent, fontSize: 30, fontWeight: 'bold' }}>.me</Animated.Text>
                        </Animated.View>
                    </Animated.View>
                </Animated.View>
                <Animated.View style={{ ...Styles.buttonContainer, height: this.buttonContainerHeight }}>
                    <View style={{ marginHorizontal: 20 }}>
                        <TapGestureHandler onHandlerStateChange={this.onLocalButtonClicked}>
                            <Animated.View style={{
                                ...Styles.button,
                                backgroundColor: 'white',
                                shadowColor: colors.primary,
                                opacity: this.buttonOpacity,
                                transform: [{
                                    translateY: this.buttonY
                                }]
                            }}>
                                <Text style={{ color: colors.accent, fontSize: 20, fontWeight: 'bold' }}>SIGN IN</Text>
                            </Animated.View>
                        </TapGestureHandler>
                        <Animated.View style={{
                            ...Styles.button,
                            transform: [{
                                translateY: this.buttonY
                            }],
                            opacity: this.buttonOpacity
                        }}>
                            <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold' }}>SIGN IN WITH GOOGLE</Text>
                        </Animated.View>
                    </View>
                    <Animated.View style={
                        {
                            height: Dimensions.get('window').height / 2,
                            ...StyleSheet.absoluteFill,
                            top: 0,
                            justifyContent: 'center',
                            zIndex: this.textInputZindex,
                            opacity: this.textInputOpacity,
                            transform: [{
                                translateY: this.textInputY
                            }]
                        }
                    }>
                        <TapGestureHandler onHandlerStateChange={this.onCloseState}>
                            <Animated.View style={Styles.closeButton}>
                                <Animated.Text style={{
                                    fontSize: 20, transform: [{
                                        rotate: concat(this.rotateCross, 'deg')
                                    }]
                                }}>
                                    x
                                </Animated.Text>
                            </Animated.View>
                        </TapGestureHandler>
                        <KeyboardAvoidingView style={{ margin: 20 }} behavior='padding' >
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
                                returnKeyType='go'
                                ref={(input) => this.passwordInput = input}
                                onSubmitEditing={() => this._logIn()}
                                autoCapitalize='none'
                                error={this.state.loginError}
                            />
                            <TouchableOpacity onPress={() => {
                                this._logIn();
                            }}>
                                <View style={{
                                    ...Styles.button,
                                    marginTop: 50,
                                    backgroundColor: 'white',
                                    shadowColor: colors.primary,
                                    opacity: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <ActivityIndicator animating={true} color={colors.accent} size='small'
                                        style={{
                                            width: this.state.loggingIn == false ? 0 : 'auto',
                                            height: this.state.loggingIn == false ? 0 : 'auto',
                                            opacity: this.state.loggingIn == false ? 0 : 1,
                                            marginRight: 5
                                        }} />
                                    <Text style={{ color: colors.accent, fontSize: 20, fontWeight: 'bold' }}>SIGN IN</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 50 }}>
                                <TouchableOpacity>
                                    <Text style={{ fontSize: 15, color: 'black' }}>Forgot Your Password??</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('SignupPage')}>
                                    <Text style={{ fontSize: 20, color: colors.accent, fontWeight: 'bold' }}>SIGN Up</Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    </Animated.View>
                </Animated.View>
                <Snackbar
                    visible={this.state.visible}
                    onDismiss={() => this.setState({ visible: false })}
                    duration={4000}
                >
                    {this.state.message}
                </Snackbar>
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: colors.primary
    },
    SignInCard: {
        backgroundColor: 'white',
        height: Dimensions.get('window').height / 2 + 100,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25
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
        backgroundColor: colors.primary,
        marginTop: 15
    },
    buttonContainer: {
        height: Dimensions.get('window').height / 3 + 50,
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25
    },
    closeButton: {
        height: 40,
        width: 40,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: -20,
        left: Dimensions.get('window').width / 2 - 20
    },
});