import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import SlidingUpPanel from 'rn-sliding-up-panel';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {getAddressAsync} from '../../../service/address.service';
import {getDistance} from 'geolib';
import * as yup from 'yup';
import {Formik} from 'formik';

const origin = {latitude: 47.9141627, longitude: 106.9228042};
const destination = {latitude: 47.9068943, longitude: 106.9320664};
const GOOGLE_MAPS_APIKEY = 'AIzaSyAoFbqPyuDuhNLKJJLRT-RPJ8q52mCc4Vc';

const {height} = Dimensions.get('window');

class HomePage extends Component {
  validationScheme = yup.object().shape({
    recievePhoneNumber: yup
      .string()
      .trim()
      .required('boglono vv')
      .matches(/^\d{8}$/g, 'is not phonenumber'),
    deliveryPhoneNumber: yup
      .string()
      .trim()
      .required('boglono vv')
      .matches(/^\d{8}$/g, 'is not phonenumber'),
  });

  constructor(props) {
    super(props);

    this.state = {
      address1: {},
      address2: {},
      centerCoordinate: {
        latitude: 47.9169351,
        longitude: 106.921919,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
      loading: false,
      customMarkerVisible: true,
      imageVisible: true,
    };
    this.onChangeRegionComplete = this.onChangeRegionComplete.bind(this);
  }

  deliveryAddress = () => {
    const {address1 = {}, address2 = {}, centerCoordinate} = this.state;
    this.setState({loading: true}, () => {
      if (!address1.latitude) {
        getAddressAsync(centerCoordinate)
          .then(result => {
            if (
              result &&
              result.status === 'OK' &&
              result.results &&
              result.results.length > 0
            ) {
              const {results} = result;
              const title = results[0].formatted_address;
              this.setState({
                address1: {...address1, ...centerCoordinate, title},
                address2: {...address1, title},
                loading: false,
              });
            }
          })
          .catch(e => {
            console.log('error', e);
            this.setState({loading: false});
          });
      } else if (!address2.latitude) {
        getAddressAsync(centerCoordinate)
          .then(result => {
            if (
              result &&
              result.status === 'OK' &&
              result.results &&
              result.results.length > 0
            ) {
              const {results} = result;
              const title = results[0].formatted_address;
              this.setState(
                {
                  address2: {...address2, ...centerCoordinate, title},
                  customMarkerVisible: false,
                  imageVisible: false,
                  loading: false,
                },
                () => {
                  this._panel.show();
                },
              );
            }
          })
          .catch(e => {
            console.log('error', e);
            this.setState({loading: false});
          });
      } else {
        this.setState({loading: false});
        this._panel.show();
      }
    });
  };

  getDistanceCalculate = () => {
    const {address1, address2} = this.state;
    var dis = getDistance(address1, address2);
    Alert.alert(`Distance\n${dis} Meter\nor\n${dis / 1000} KM`);
  };

  onChangeRegionComplete = e => {
    this.setState({centerCoordinate: e, loading: true}, () => {
      getAddressAsync(e)
        .then(result => {
          if (
            result &&
            result.status === 'OK' &&
            result.results &&
            result.results.length > 0
          ) {
            const {results} = result;
            const title = results[0].formatted_address;
            const {address1, address2} = this.state;
            if (!address1 || !address1.latitude) {
              this.setState({address1: {title, key: 'add1'}, loading: false});
            } else if (!address2 || !address2.latitude) {
              this.setState({address2: {title, key: 'add2'}, loading: false});
            }
          }
        })
        .catch(err => {
          this.setState({loading: false});
          console.warn('err', err);
        });
    });
  };

  renderCustomMarker = () => {
    const {imageVisible, address1 = {}} = this.state;
    const imgSource = !address1.latitude
      ? require('../../../../assets/logo_red.jpg')
      : require('../../../../assets/logo_green.jpg');
    if (imageVisible) {
      return (
        <View style={styles.customMarker}>
          <View>
            <Image
              pointerEvents="none"
              source={imgSource}
              style={styles.markerImage}
            />
            <View style={styles.rectangle} />
          </View>
        </View>
      );
    }
    return null;
  };

  onCheckClick = (values, action) => {
    const {navigation} = this.props;
    action.isSubmitting = false;
    navigation.navigate('Order');
  };

  render() {
    const {address1 = {}, address2 = {}} = this.state;
    return (
      <View style={styles.container}>
        {address1 && address1.title && (
          <View style={styles.inputLocation}>
            <Image
              style={styles.pickLogo}
              source={require('../../../../assets/logo_red.jpg')}
            />
            <View style={styles.addressInfo} />
            <View style={styles.marginLeft8}>
              <Text style={styles.addressTitle1}>Барааг очиж авах хаяг</Text>
              <Text numberOfLines={1} style={styles.txtLoc}>
                {address1.title || ''}
              </Text>
            </View>
          </View>
        )}
        {address2 && address2.title && (
          <View style={styles.inputLocation}>
            <Image
              style={styles.pickLogo}
              source={require('../../../../assets/logo_green.jpg')}
            />
            <View style={styles.addressInfo} />
            <View style={styles.marginLeft8}>
              <Text style={styles.addressTitle2}>Барааг хүргэж өгөх хаяг</Text>
              <Text numberOfLines={1} style={styles.txtLoc}>
                {address2.title || ''}
              </Text>
            </View>
          </View>
        )}

        {this.renderCustomMarker()}

        <MapView
          style={styles.mapStyle}
          initialRegion={{
            latitude: 47.9169351,
            longitude: 106.921919,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          onRegionChangeComplete={this.onChangeRegionComplete}>
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY}
          />
          {address1 && address1.latitude && (
            <Marker coordinate={address1} title={'a1'} description={'b1'}>
              <View>
                <Image
                  pointerEvents="none"
                  source={require('../../../../assets/logo_red.jpg')}
                  style={styles.markerImage}
                />
                <View style={styles.rectangle} />
              </View>
            </Marker>
          )}
          {address2 && address2.latitude && (
            <Marker coordinate={address2} title={'a2'} description={'b2'}>
              <View>
                <Image
                  pointerEvents="none"
                  source={require('../../../../assets/logo_green.jpg')}
                  style={styles.markerImage}
                />
                <View style={styles.rectangle} />
              </View>
            </Marker>
          )}
        </MapView>

        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={this.deliveryAddress}>
            <Text style={styles.btnSongoh}>Хаягийг сонгох</Text>
          </TouchableOpacity>
        </View>

        <SlidingUpPanel
          ref={c => (this._panel = c)}
          height={height * 0.8}
          draggableRange={{top: height * 0.8, bottom: 0}}
          animatedValue={this._draggedValue}
          showBackdrop={true}
          backdropOpacity={0.5}
          allowMomentum={false}
          allowDragging={false}>
          <View style={styles.panel}>
            <KeyboardAwareScrollView enableOnAndroid={true}>
              <View style={styles.panelHeader}>
                <Text style={styles.sliderTitle}>ХҮРГЭЛТИЙН МЭДЭЭЛЭЛ</Text>
              </View>
              <Formik
                enableReinitialize
                initialValues={{
                  recievePhoneNumber: '',
                  deliveryPhoneNumber: '',
                }}
                validationSchema={this.validationScheme}
                onSubmit={(values, action) =>
                  this.onCheckClick(values, action)
                }>
                {formikProps => {
                  const {
                    values,
                    touched,
                    errors,
                    handleChange = () => {},
                    handleBlur = () => {},
                  } = formikProps;
                  return (
                    <View style={styles.panelContainer}>
                      <View style={styles.margin10}>
                        <View style={styles.inputLocationDetails}>
                          <Image
                            style={styles.pickLogo}
                            source={require('../../../../assets/logo_red.jpg')}
                          />
                          <View style={styles.addressInfo} />
                          <View style={styles.marginLeft8}>
                            <Text style={styles.addressTitle1}>
                              Барааг очиж авах хаяг
                            </Text>
                            <TextInput style={styles.titleFontSize16}>
                              {address1.title || ''}
                            </TextInput>
                          </View>
                        </View>
                      </View>
                      <View style={styles.space}>
                        <View style={styles.inputLocationDetails}>
                          <Image
                            style={styles.pickLogo}
                            source={require('../../../../assets/logo_green.jpg')}
                          />
                          <View style={styles.addressInfo} />
                          <View style={styles.marginLeft8}>
                            <Text style={styles.addressTitle2}>
                              Барааг хүргэж өгөх хаяг
                            </Text>
                            <TextInput style={styles.titleFontSize16}>
                              {address2.title || ''}
                            </TextInput>
                          </View>
                        </View>
                      </View>
                      <View style={styles.space}>
                        <View>
                          <Text style={styles.txtDesc}>
                            Барааг өгөх хүний утасны дугаар
                          </Text>
                          <TextInput
                            style={styles.phoneText}
                            onChangeText={handleChange('deliveryPhoneNumber')}
                            onBlur={handleBlur('deliveryPhoneNumber')}
                            defaultValue={values.deliveryPhoneNumber}
                          />
                          {touched.deliveryPhoneNumber &&
                            errors.deliveryPhoneNumber && (
                              <View style={styles.marginTop8RowContainerStyle}>
                                <Text style={styles.errorText}>
                                  {errors.deliveryPhoneNumber}
                                </Text>
                              </View>
                            )}
                        </View>
                      </View>
                      <View style={styles.space}>
                        <Text style={styles.txtDesc}>
                          Барааг хүлээн авах хүний утасны дугаар
                        </Text>
                        <TextInput
                          style={styles.phoneText}
                          onChangeText={handleChange('recievePhoneNumber')}
                          onBlur={handleBlur('recievePhoneNumber')}
                          defaultValue={values.recievePhoneNumber}
                        />
                        {touched.recievePhoneNumber &&
                          errors.recievePhoneNumber && (
                            <View style={styles.marginTop8RowContainerStyle}>
                              <Text style={styles.errorText}>
                                {errors.recievePhoneNumber}
                              </Text>
                            </View>
                          )}
                      </View>
                      <View style={styles.btnContainer}>
                        <TouchableOpacity
                          style={styles.btn}
                          onPress={formikProps.handleSubmit}>
                          <Text style={styles.btnSongoh}>Баталгаажуулах</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                }}
              </Formik>
            </KeyboardAwareScrollView>
          </View>
        </SlidingUpPanel>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
  },
  mapStyle: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  panel: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  panelHeader: {
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
    zIndex: 1,
  },
  panelContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: 10,
  },
  btn: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    height: 50,
    backgroundColor: '#162a69',
    borderRadius: 15,
  },
  btnContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  nextBtn: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    height: 50,
    backgroundColor: '#162a69',
    borderRadius: 15,
    margin: 10,
  },
  space: {
    margin: 10,
  },
  phone: {
    flex: 1,
    flexDirection: 'row',
  },
  txtDesc: {
    color: '#b3b3b3',
    fontSize: 14,
    alignSelf: 'stretch',
  },
  txtLocDesc: {
    color: '#000',
    fontSize: 12,
    alignSelf: 'stretch',
  },
  txtLoc: {
    color: '#000',
    fontSize: 16,
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
    padding: 2,
  },
  pickLogo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 8,
    marginRight: 8,
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
    padding: 2,
  },
  rectangle: {
    height: 20,
    width: 2,
    backgroundColor: 'black',
    alignSelf: 'center',
  },
  customMarker: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerImage: {width: 30, height: 30, borderRadius: 15},
  addressInfo: {
    height: 30,
    width: 1,
    marginTop: 3,
    marginBottom: 3,
    backgroundColor: '#e3e3e3',
  },
  addressTitle1: {color: '#eb4034', fontSize: 12, alignSelf: 'stretch'},
  addressTitle2: {color: '#3fc450', fontSize: 12, alignSelf: 'stretch'},
  marginLeft8: {flex: 1, marginLeft: 8},
  btnSongoh: {color: '#fff', fontSize: 20},
  margin10: {marginLeft: 10, marginRight: 10, marginBottom: 10},
  titleFontSize16: {fontSize: 16, padding: 0},
  phoneText: {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e3e3e3',
  },
  sliderTitle: {alignSelf: 'center', fontSize: 16},
  marginTop8RowContainerStyle: {
    flexDirection: 'row',
    marginTop: 8,
    // flex: 1
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 13,
    marginTop: 3,
    marginLeft: 7,
    flex: 1,
  },
});

export default HomePage;
