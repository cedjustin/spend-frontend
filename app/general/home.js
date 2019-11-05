import React, { Component } from 'react'
import { Text, View, AsyncStorage, Dimensions, StyleSheet, ScrollView, Image } from 'react-native'
import {
    ActivityIndicator,
    Title,
    IconButton,
    FAB,
    Dialog,
    Portal,
    TouchableRipple,
    Provider
} from 'react-native-paper';
import UserAvatar from 'react-native-user-avatar';
import colors from '../constants/colors';

// time dependencies
import moment from 'moment';

//animation dependencies
import Animated from 'react-native-reanimated';
const { event, Value, Extrapolate, interpolate } = Animated;
import * as Animatable from 'react-native-animatable';

export default class Home extends Component {

    //pageHeader
    static navigationOptions = (props) => ({
        header: null
    });

    constructor() {
        super();
        this.state = {
            userInfo: null,
            loaded: false,
            activities: [
                {
                    time: 'Today 12:30',
                    amount: '10,000 RWF',
                    description: 'Move Ride',
                    type: 'down'
                },
                {
                    time: '12 May 2019',
                    amount: '250,000 RWF',
                    description: 'Transfer',
                    type: 'up'
                },
                {
                    time: '10 May 2019',
                    amount: '2,000 RWF',
                    description: 'Drinking',
                    type: 'down'
                },
                {
                    time: '5 May 2019',
                    amount: '15,000 RWF',
                    description: 'MOMO',
                    type: 'up'
                },
            ],
            currentMonth: null,
            showDialog: false
        }
    }

    _getUserInfo = async () => {
        const user = await AsyncStorage.getItem('userInfo');
        const userObject = JSON.parse(user);
        this.setState({
            userInfo: userObject
        })
    }

    _getMonth() {
        const currentMonth = 'October';
        this.setState({
            currentMonth: currentMonth
        })
    }

    _loadData = async () => {
        await this._getUserInfo();
        this.setState({
            loaded: true
        })
    }

    _showDialog = () => this.setState({ showDialog: true });

    _hideDialog = () => this.setState({ showDialog: false });

    componentDidMount() {
        this._getMonth();
        this._loadData();
        // animation
        this.scrollY = new Value(0);

        this.collapsableHeaderY = interpolate(this.scrollY, {
            inputRange: [0, 30],
            outputRange: [-100, 0],
            extrapolate: Extrapolate.CLAMP
        })

        this.collapsableHeaderOpacity = interpolate(this.scrollY, {
            inputRange: [0, 30],
            outputRange: [0, 1],
            extrapolate: Extrapolate.CLAMP
        })

        this.collapsibleHeaderViewOpacity = interpolate(this.scrollY, {
            inputRange: [0, 30],
            outputRange: [-20, 1],
            extrapolate: Extrapolate.CLAMP
        })

        this.collapsibleHeaderViewY = interpolate(this.scrollY, {
            inputRange: [0, 50],
            outputRange: [20, 0],
            extrapolate: Extrapolate.CLAMP
        })
    }

    _logout(){
        AsyncStorage.removeItem('userInfo');
        AsyncStorage.removeItem('logginKey');
        this.props.navigation.navigate('LoginPage');
    }

    render() {
        const ActivityCard = this.state.activities.map((activity) => {
            return (
                <Animatable.View style={{ ...styles.bCardRow, marginVertical: 2.5 }} animation="fadeInUp">
                    <View style={styles.bCardRow}>
                        <IconButton style={
                            { width: 50, height: 50, borderRadius: 10, backgroundColor: activity.type == 'down' ? colors.redButtonBg : colors.greenButtonBg }}
                            icon={activity.type == 'down' ? 'arrow-down' : 'arrow-up'}
                            color={activity.type == 'down' ? colors.danger : colors.accent}
                        />
                        <View style={{ marginHorizontal: 5 }}>
                            <Text style={{ color: 'gray' }}>{activity.time}</Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{activity.description}</Text>
                        </View>
                    </View>
                    <View style={styles.bCardRow}>
                        <Text style={{ color: activity.type == 'down' ? colors.danger : colors.accent }}>
                            {activity.type == 'down' ? '-' : '+'}{activity.amount}
                        </Text>
                    </View>
                </Animatable.View>
            )
        });

        if (this.state.loaded == false) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator animated={true} size='small' color={colors.accent} />
                </View>
            )
        } else {
            return (
                <View style={styles.container}>
                    <Provider>
                        <Portal>
                            <Dialog
                                visible={this.state.showDialog}
                                onDismiss={this._hideDialog}>
                                <Dialog.Content>
                                    <Animatable.View style={{ ...styles.pill, flexDirection: 'row', alignItems: 'center' }} animation="bounceIn">
                                        <UserAvatar size="50" name={this.state.userInfo.username} color={colors.dark} />
                                        <Text style={{ color: colors.dark, marginHorizontal: 35 }}>Go to account</Text>
                                    </Animatable.View>
                                    <TouchableRipple onPress={()=>this._logout()}>
                                        <Animatable.View style={{ ...styles.pill, backgroundColor: colors.primary, marginTop: 10 }} animation="bounceIn">
                                            <View style={{ fledDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 15 }}>
                                                <Text style={{ color: colors.text }}>Logout</Text>
                                            </View>
                                        </Animatable.View>
                                    </TouchableRipple>
                                </Dialog.Content>
                            </Dialog>
                        </Portal>
                        <Animated.View style={{
                            ...styles.collapsableHeader, height: 100, transform: [{
                                translateY: this.collapsableHeaderY
                            }],
                            opacity: this.collapsableHeaderOpacity
                        }}>
                            <Animated.View style={
                                {
                                    flexDirection: 'row',
                                    margin: 20,
                                    opacity: this.collapsibleHeaderViewOpacity,
                                    transform: [{
                                        translateY: this.collapsibleHeaderViewY
                                    }]
                                }
                            }>
                                <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>
                                    Spend
                            </Text>
                                <Text style={{ color: colors.accent, fontSize: 10, fontWeight: 'bold' }}>.me</Text>
                            </Animated.View>
                        </Animated.View>
                        <Animated.ScrollView
                            onScroll={event([{ nativeEvent: { contentOffset: { y: this.scrollY } } },])} scrollEventThrottle={16}
                            style={
                                {
                                    zIndex: -1,
                                    position: 'relative',
                                    top: -70,
                                    minHeight: Dimensions.get('window').height + 100
                                }
                            }
                        >
                            <Animated.View style={{
                                ...styles.header
                            }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 20, fontWeight: 'bold' }}>
                                        Spend
                            </Text>
                                    <Text style={{ color: colors.accent, fontSize: 10, fontWeight: 'bold' }}>.me</Text>
                                </View>
                                <View>
                                    <Title style={{ color: colors.text, fontSize: 30 }}>{this.state.currentMonth}</Title>
                                </View>
                                <TouchableRipple onPress={this._showDialog}>
                                    <UserAvatar size="50" name={this.state.userInfo.username} color={colors.dark} />
                                </TouchableRipple>
                            </Animated.View>
                            <View style={styles.fPart}>
                                <Animated.View style={{ ...styles.fPartContainer, borderBottomLeftRadius: this.sPartBorderRadius }}>
                                    <View style={styles.bCardRow}>
                                        <Text style={{ color: '#f9f9f9' }}>Balance</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: colors.text, fontSize: 20 }}> 35,000</Text>
                                            <Text style={{ color: colors.text, fontSize: 10 }}>RWF</Text>
                                        </View>
                                    </View>
                                    <View style={styles.bCard}>
                                        <View style={{ marginHorizontal: 15, marginTop: 10 }}>
                                            <Image
                                                style={{ width: 50, height: 50 }}
                                                source={{ uri: 'https://img.icons8.com/color/480/000000/mastercard-logo.png' }} />
                                        </View>
                                        <View style={styles.bCardRow}>
                                            <Text style={{ ...styles.cardDigits, color: 'gray' }}>****</Text>
                                            <Text style={{ ...styles.cardDigits, color: 'gray' }}>****</Text>
                                            <Text style={{ ...styles.cardDigits, color: 'gray' }}>****</Text>
                                            <Text style={styles.cardDigits}>1234</Text>
                                        </View>
                                        <View style={{ ...styles.bCardRow, justifyContent: 'space-between' }}>
                                            <Text style={{ marginHorizontal: 15 }}>Cedrick Justin</Text>
                                            <Text style={{ marginHorizontal: 15, color: 'gray' }}>8/20</Text>
                                        </View>
                                    </View>
                                </Animated.View>
                            </View>
                            <View style={styles.sPart}>
                                <View style={{ margin: 20 }}>
                                    {ActivityCard}
                                </View>
                            </View>
                        </Animated.ScrollView>
                        <FAB
                            style={styles.fab}
                            small
                            icon="plus"
                            label="Activity"
                            color="white"
                            onPress={() => console.log('Pressed')}
                        />
                    </Provider>
                </View >
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary
    },
    header: {
        flexDirection: 'row',
        height: 100,
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 0
    },
    fPart: {
        height: Dimensions.get('window').height / 2,
        backgroundColor: 'white'
    },
    fPartContainer: {
        height: '100%',
        backgroundColor: colors.primary,
        justifyContent: 'center'
    },
    bCard: {
        margin: 20,
        borderRadius: 15,
        backgroundColor: 'white'
    },
    bCardRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 15
    },
    cardDigits: {
        fontSize: 30
    },
    sPart: {
        minHeight: Dimensions.get('window').height / 2 - 20,
        backgroundColor: 'white',
        marginBottom: 20
    },
    collapsableHeader: {
        backgroundColor: 'rgb(255,255,255)',
        zIndex: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        justifyContent: 'flex-end'
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: colors.primary
    },
    pill: {
        width: '100%',
        backgroundColor: colors.disabled,
        borderRadius: 25,
        marginTop: 5
    }
})