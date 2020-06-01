import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {store} from '../../store/store';
import {getVersionAsync} from '../../service/auth.service';
import {checkUpdate} from '../../utils/filter';

const {width} = Dimensions.get('window');

class SplashPage extends React.Component {
  constructor(props) {
    super(props);

    // this.modalInterRef = React.createRef();
  }

  componentDidMount() {
    NetInfo.fetch().then(netState => {
      if (netState.isConnected) {
        this.onInitAsync();
      } else {
        this.createTwoButtonAlert();
      }
    });
  }

  createTwoButtonAlert = () => {
    Alert.alert(
      'Интернет',
      'Интернет холболтоо шалгана уу!',
      [{text: 'Шалгах', onPress: () => this.checkInternetClick()}],
      {cancelable: false},
    );
  };

  createUpdateAlert = () => {
    Alert.alert(
      'Шинэчлэлт',
      'Шинэ хувилбар гарсан байна аппликейшнээ шинэчилнэ үү!',
      [{text: 'Шинэчлэх', onPress: () => this.onUpdateClick()}],
      {cancelable: false},
    );
  };

  checkInternetClick = () => {
    NetInfo.fetch().then(netState => {
      const [state, dispatch] = this.context;
      if (netState.isConnected) {
        this.onInitAsync();
        // this.modalInterRef.current.close();
        dispatch({type: 'SET_LOADING', payload: false});
      } else {
        this.createTwoButtonAlert();
      }
    });
  };

  onInitAsync = async () => {
    try {
      const [state, dispatch] = this.context;
      const _version = await getVersionAsync();
      const isUpdate = checkUpdate(_version);
      if (isUpdate) {
        this.createUpdateAlert();
      } else {
        setTimeout(() => {
          dispatch({type: 'SET_LOADING', payload: false});
        }, 1000);
      }
    } catch (error) {}
  };

  onUpdateClick = () => {
    if (Platform.OS === 'ios') {
      console.log('ios clicked');
      // Linking.openURL(
      //   `https://itunes.apple.com/jp/app/apple-store/id${APPLE_STORE}?l=en&mt=8`,
      // );
    } else {
      Linking.openURL('market://details?id=com.biger');
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.logoImgStyle}
          source={require('../../../assets/logo.jpg')}
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
    backgroundColor: '#fff',
  },
  logoImgStyle: {
    width: width * 0.4,
    resizeMode: 'contain',
  },
  marginTop25: {
    marginTop: 25,
  },
});

SplashPage.contextType = store;
export default SplashPage;
