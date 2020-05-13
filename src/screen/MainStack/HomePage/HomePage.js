import React, { Component } from 'react';
import {
    StyleSheet, Text, View, Dimensions, TouchableOpacity, TextInput, Image, Button
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import SlidingUpPanel from 'rn-sliding-up-panel'
import axios from 'axios'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { getAddressAsync } from '../../../service/address.service'

const { height } = Dimensions.get('window')

class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            address1: null,
            address2: null,
            centerCoordinate: {
                latitude: 47.9169351,
                longitude: 106.921919,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            },
            loading: false,
            customMarkerVisible: true
        }
        this.onChangeRegionComplete = this.onChangeRegionComplete.bind(this)
    }

    deliveryAddress2 = () => {
        const { address1, address2, centerCoordinate } = this.state
        if (address1 && !address1.latitude) {
            getAddressAsync(centerCoordinate).then(result => {
                if (
                    result &&
                    result.status === 'OK' &&
                    result.results &&
                    result.results.length > 0
                ) {
                    const { results } = result;
                    const title = results[0].formatted_address
                    this.setState({ address1: { ...address1, ...centerCoordinate, title }, address2: address1 })
                }
            }).catch(e => {
                console.log('error', e)
                this.setState({ loading: false })
            })
        } else if (address2 && !address2.latitude) {
            getAddressAsync(centerCoordinate).then(result => {
                if (
                    result &&
                    result.status === 'OK' &&
                    result.results &&
                    result.results.length > 0
                ) {
                    const { results } = result;
                    const title = results[0].formatted_address
                    this.setState({ address2: { ...address2, ...centerCoordinate, title }, customMarkerVisible: false }, () => {
                        this._panel.show()
                    })
                }
            }).catch(e => {
                console.log('error', e)
                this.setState({ loading: false })
            })
        } else {
            this._panel.show()
        }
    };

    deliveryAddress = () => {
        const { address1, address2, centerCoordinate } = this.state
        if (address1 && !address1.latitude) {
            this.setState({ address1: { ...address1, ...centerCoordinate }, address2: address1 })
        } else if (address2 && !address2.latitude) {
            this.setState({ address2: { ...address2, ...centerCoordinate }, customMarkerVisible: false }, () => {
                this._panel.show()
            })
        } else {
            this._panel.show()
        }
    };

    onChangeRegionComplete = (e) => {
        this.setState({ centerCoordinate: e, loading: true }, () => {
            getAddressAsync(e)
                .then(result => {
                    if (
                        result &&
                        result.status === 'OK' &&
                        result.results &&
                        result.results.length > 0
                    ) {
                        const { results } = result;
                        const title = results[0].formatted_address
                        const { address1, address2 } = this.state
                        if (!address1 || !address1.latitude) {
                            this.setState({ address1: { title, key: 'add1' }, loading: false })
                        } else if (!address2 || !address2.latitude) {
                            this.setState({ address2: { title, key: 'add2' }, loading: false })
                        }
                    }
                }).catch(err => {
                    this.setState({ loading: false })
                    console.warn('err', err)
                })
        })
    }

    renderCustomMarker = () => {
        const imgSource = !this.state.address2 ? require('../../../../assets/logo_red.jpg') : require('../../../../assets/logo_green.jpg');
        return (
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                <View>
                    <Image pointerEvents="none" source={imgSource} style={{ width: 30, height: 30, borderRadius: 15 }} />
                    <View style={styles.rectangle}></View>
                </View>
            </View>
        );
        // if (customMarkerVisible) {
        // }
        // return null
    }

    render() {
        const { address1, address2, centerCoordinate } = this.state
        return (
            <View style={styles.container}>
                {address1 &&
                    <View style={styles.inputLocation}>
                        <Image
                            style={styles.pickLogo}
                            source={
                                require('../../../../assets/logo_red.jpg')
                            }
                        />
                        <View style={{ height: 30, width: 1, marginTop: 3, marginBottom: 3, backgroundColor: '#e3e3e3' }}></View>
                        <View style={{ flex: 1, marginLeft: 8 }}>
                            <Text style={{ color: '#eb4034', fontSize: 12, alignSelf: 'stretch' }}>Барааг очиж авах хаяг</Text>
                            <Text numberOfLines={1} style={styles.txtLoc}>{address1.title || ''}</Text>
                        </View>
                    </View>}
                {address2 &&
                    <View style={styles.inputLocation}>
                        <Image
                            style={styles.pickLogo}
                            source={
                                require('../../../../assets/logo_green.jpg')
                            }
                        />
                        <View style={{ height: 30, width: 1, marginTop: 3, marginBottom: 3, backgroundColor: '#e3e3e3' }}></View>
                        <View style={{ flex: 1, marginLeft: 8 }}>
                            <Text style={{ color: '#3fc450', fontSize: 12, alignSelf: 'stretch' }}>Барааг хүргэж өгөх хаяг</Text>
                            <Text numberOfLines={1} style={styles.txtLoc}>{address2.title || ''}</Text>
                        </View>
                    </View>}

                {this.renderCustomMarker()}

                <MapView
                    style={styles.mapStyle}
                    initialRegion={{
                        latitude: 47.9169351,
                        longitude: 106.921919,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                    }}
                    // showsMyLocationButton={true}
                    // accessibilityLiveRegion="polite"
                    // onRegionChange={e => console.log('e', e)}
                    onRegionChangeComplete={this.onChangeRegionComplete}
                >
                    {address1 && address1.latitude &&
                        <Marker
                            coordinate={address1}
                            title={'a1'}
                            description={'b1'}
                        >
                            <View>
                                <Image pointerEvents="none" source={require('../../../../assets/logo_red.jpg')} style={{ width: 30, height: 30, borderRadius: 15 }} />
                                <View style={styles.rectangle}></View>
                            </View>
                        </Marker>}
                    {address2 && address2.latitude &&
                        <Marker
                            coordinate={address2}
                            title={'a2'}
                            description={'b2'}
                        >
                            <View>
                                <Image pointerEvents="none" source={require('../../../../assets/logo_green.jpg')} style={{ width: 30, height: 30, borderRadius: 15 }} />
                                <View style={styles.rectangle}></View>
                            </View>
                        </Marker>}
                </MapView>


                <View style={styles.btnContainer}>
                    <TouchableOpacity style={styles.nextBtn} onPress={this.deliveryAddress}>
                        <Text style={{ color: '#fff', fontSize: 20 }}>Хаягийг сонгох</Text>
                    </TouchableOpacity>
                </View>

                {address1 && address2 &&
                    <SlidingUpPanel
                        ref={c => (this._panel = c)}
                        height={height * 0.8}
                        draggableRange={{ top: height * 0.8, bottom: 0 }}
                        animatedValue={this._draggedValue}
                        showBackdrop={true}
                        backdropOpacity={0.5}
                        allowMomentum={false}
                        allowDragging={false}>
                        <View style={styles.panel}>
                            <KeyboardAwareScrollView style={{ flex: 1 }} enableOnAndroid={true}>
                                <View style={styles.panelHeader}>
                                    <Text style={{ alignSelf: "center", fontSize: 16 }}>ХҮРГЭЛТИЙН МЭДЭЭЛЭЛ</Text>
                                </View>

                                <View style={styles.panelContainer}>
                                    <View style={{ marginLeft: 10, marginRight: 10, marginBottom: 10 }}>
                                        <View style={styles.inputLocationDetails}>
                                            <Image
                                                style={styles.pickLogo}
                                                source={
                                                    require('../../../../assets/logo_red.jpg')
                                                }
                                            />
                                            <View style={{ height: 30, width: 1, marginTop: 3, marginBottom: 3, backgroundColor: '#e3e3e3' }}></View>
                                            <View style={{ flex: 1, marginLeft: 8 }}>
                                                <Text style={{ color: '#eb4034', fontSize: 12, alignSelf: 'stretch' }}>Барааг очиж авах хаяг</Text>
                                                <TextInput style={{ fontSize: 16, padding: 0 }}>{address1.title || ''}</TextInput>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.space}>
                                        <View style={styles.inputLocationDetails}>
                                            <Image
                                                style={styles.pickLogo}
                                                source={
                                                    require('../../../../assets/logo_green.jpg')
                                                }
                                            />
                                            <View style={{ height: 30, width: 1, marginTop: 3, marginBottom: 3, backgroundColor: '#e3e3e3' }}></View>
                                            <View style={{ flex: 1, marginLeft: 8 }}>
                                                <Text style={{ color: '#3fc450', fontSize: 12, alignSelf: 'stretch' }}>Барааг хүргэж өгөх хаяг</Text>
                                                <TextInput style={{ fontSize: 16, padding: 0 }}>{address2.title || ''}</TextInput>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.space}>
                                        <View>
                                            <Text style={styles.txtDesc}>Барааг өгөх хүний утасны дугаар</Text>
                                            <TextInput style={{ height: 40, borderRadius: 10, borderWidth: 1, borderColor: '#e3e3e3' }} />
                                        </View>
                                    </View>
                                    <View style={styles.space}>
                                        <Text style={styles.txtDesc}>Барааг хүлээн авах хүний утасны дугаар</Text>
                                        <TextInput style={{ height: 40, borderRadius: 10, borderWidth: 1, borderColor: '#e3e3e3' }} />
                                    </View>
                                    <View style={styles.btnContainer}>
                                        <TouchableOpacity style={styles.btn} onPress={() => this.props.navigation.navigate('Order')} >
                                            <Text style={{ color: '#fff', fontSize: 20 }}>Баталгаажуулах</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </KeyboardAwareScrollView>
                        </View>
                    </SlidingUpPanel>
                }
            </View >
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch'
    },
    mapStyle: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -1
    },
    panel: {
        flex: 1,
        backgroundColor: 'white',
        position: 'relative',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20
    },
    panelHeader: {
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    favoriteIcon: {
        position: 'absolute',
        top: -24,
        right: 24,
        backgroundColor: '#2b8a3e',
        width: 48,
        height: 48,
        padding: 8,
        borderRadius: 24,
        zIndex: 1
    },
    panelContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        padding: 10
    },
    btn: {
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        height: 50,
        backgroundColor: '#162a69',
        borderRadius: 15
    },
    btnContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 10
    },
    nextBtn: {
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        height: 50,
        backgroundColor: '#162a69',
        borderRadius: 15,
        margin: 10
    },
    space: {
        margin: 10
    },
    phone: {
        flex: 1,
        flexDirection: 'row'
    },
    txtDesc: {
        color: '#b3b3b3',
        fontSize: 14,
        alignSelf: 'stretch'
    },
    txtLocDesc: {
        color: '#000',
        fontSize: 12,
        alignSelf: 'stretch'
    },
    txtLoc: {
        color: '#000',
        fontSize: 16
    },
    inputLocation: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        zIndex: 0,
        borderRadius: 10,
        padding: 2
    },
    pickLogo: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginLeft: 8,
        marginRight: 8
    },
    inputLocationDetails: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center',
        backgroundColor: '#fff',
        zIndex: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e3e3e3',
        padding: 2
    },
    rectangle: {
        height: 20,
        width: 2,
        backgroundColor: 'black',
        alignSelf: 'center'
    }
})


export default HomePage
