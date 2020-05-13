import React from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
// import Modal from 'react-native-modalbox';
// import NoInternetComp from '../../components/NoInternetComp';
import NetInfo from '@react-native-community/netinfo';
import { store } from '../../store/store';

class SplashPage extends React.Component {

    constructor(props) {
        super(props);

        this.modalInterRef = React.createRef();
    }

    componentDidMount() {
        const [state, dispatch] = this.context;
        NetInfo.fetch().then((netState) => {
            if (netState.isConnected) {
                setTimeout(() => {
                    dispatch({ type: 'SET_LOADING', payload: false });
                }, 1000);
            } else {
                this.createTwoButtonAlert()
            }
        });
    }

    createTwoButtonAlert = () => {
        Alert.alert(
            "Connection",
            "no internet connection",
            [
                {
                    text: "cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Check", onPress: () => this.checkInternetClick() }
            ],
            { cancelable: false }
        );
    }

    checkInternetClick = () => {
        NetInfo.fetch().then((netState) => {
            const [state, dispatch] = this.context;
            if (netState.isConnected) {
                this.modalInterRef.current.close();
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        });
    };

    render() {
        return (
            <View style={styles.primaryFlexContainerStyle}>
                <View style={styles.flex1CenterContainerStyle}>
                    <Image
                        style={styles.logoImgStyle}
                        source={require('../../../assets/logo.jpg')}
                    />

                    <ActivityIndicator color="#fff" style={styles.marginTop25} />
                </View>

                {/* <Modal
          style={styles.modal220Style}
          ref={this.modalInterRef}
          position="center"
          swipeToClose={false}
          backdropPressToClose={false}
          coverScreen>
          <NoInternetComp
            isWarning
            titleText="No internet sda min"
            buttonText="daxin oroldox sda gej"
            donePress={this.checkInternetClick}
          />
        </Modal> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    primaryFlexContainerStyle: {
        flex: 1,
        backgroundColor: '#fff',
    },
    flex1CenterContainerStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoImgStyle: {
        height: 175,
        width: 225,
    },
    marginTop25: {
        marginTop: 25,
    },
    modal220Style: {
        height: 220,
        backgroundColor: 'transparent',
    },
});

SplashPage.contextType = store;
export default SplashPage;
