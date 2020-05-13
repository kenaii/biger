import React from 'react';
import { View, Image, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
// import Modal from 'react-native-modalbox';
// import NoInternetComp from '../../components/NoInternetComp';
import NetInfo from '@react-native-community/netinfo';
import { store } from '../../store/store';

const { width } = Dimensions.get('window')

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
            <View style={styles.container}>
                <Image
                    style={styles.logoImgStyle}
                    source={require('../../../assets/logo.jpg')
                    }
                />
                <ActivityIndicator color="#fff" style={styles.marginTop25} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    logoImgStyle: {
        width: width * 0.4,
        resizeMode: "contain"
    },
    marginTop25: {
        marginTop: 25,
    }
});

SplashPage.contextType = store;
export default SplashPage;
