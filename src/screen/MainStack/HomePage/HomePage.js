import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Image,
  PermissionsAndroid,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import SlidingUpPanel from 'rn-sliding-up-panel';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {getAddressAsync} from '../../../service/address.service';
import {sendMailAsync} from '../../../service/mail.service';
import {getDistance} from 'geolib';
import * as yup from 'yup';
import {Formik} from 'formik';
import Geolocation from 'react-native-geolocation-service';
import ActivityIndicatorComp from '../../../components/ActivityIndicatorComp';

const {height} = Dimensions.get('window');
class HomePage extends Component {
  validationScheme = yup.object().shape({
    recievePhoneNumber: yup
      .string()
      .trim()
      .required('Та утасны дугаарыг заавал оруулна уу!')
      .matches(/^\d{8}$/g, 'Утасны дугаарыг зөв оруулна уу!'),
    deliveryPhoneNumber: yup
      .string()
      .trim()
      .required('Та утасны дугаарыг заавал оруулна уу!')
      .matches(/^\d{8}$/g, 'Утасны дугаарыг зөв оруулна уу!'),
    recieveAddress: yup
      .string()
      .trim()
      .required('Та хаягаа заавал оруулна уу!'),
    deliveryAddress: yup
      .string()
      .trim()
      .required('Та хаягаа заавал оруулна уу!'),
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
      currentCoordinate: {
        latitude: 47.9169351,
        longitude: 106.921919,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
      loading: false,
      distance: {},
      imageVisible: true,
      sendLoading: false,
    };
    this.onChangeRegionComplete = this.onChangeRegionComplete.bind(this);
    this.selectAddressClick = this.selectAddressClick.bind(this);
    this.onCheckClick = this.onCheckClick.bind(this);
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      this.permissatioAndroid();
    }
    this._map.setMapBoundaries(
      {latitude: 48.225648, longitude: 105.987859},
      {latitude: 47.565081, longitude: 107.724928},
    );
  }

  selectAddressClick = () => {
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
              if (address2 && address2.latitude) {
                if (this.getDistanceCalculate(centerCoordinate, address2)) {
                  this.setState(
                    {
                      address1: {...address1, ...centerCoordinate, title},
                      loading: false,
                      imageVisible: false,
                    },
                    () => {
                      this._panel.show();
                    },
                  );
                }
              } else {
                this.setState({
                  address1: {...address1, ...centerCoordinate, title},
                  address2: {...address1, title},
                  loading: false,
                });
              }
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
              if (this.getDistanceCalculate(centerCoordinate, address1)) {
                this.setState(
                  {
                    address2: {...address2, ...centerCoordinate, title},
                    imageVisible: false,
                    loading: false,
                  },
                  () => {
                    this._panel.show();
                  },
                );
              }
            }
          })
          .catch(e => {
            console.log('error', e);
            this.setState({loading: false});
          });
      } else {
        this.setState({loading: false});
        if (this.getDistanceCalculate(address1, address2)) {
          this._panel.show();
        }
      }
    });
  };

  getDistanceCalculate = (location1, location2) => {
    // const {address1, address2} = this.state;
    let dis = getDistance(location1, location2);
    let price = 5000;
    const distance_meter = dis / 1000;
    if (distance_meter < 0.2) {
      Alert.alert(
        'Уучлаарай',
        '200м дотор хүргэлт хийх боломжгүй',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: true},
      );
      return false;
    }
    const distance_km = Math.ceil(dis / 1000);
    if (distance_km > 5 && distance_km <= 40) {
      price += (distance_km - 5) * 500;
    } else if (distance_km > 40) {
      Alert.alert(
        'Уучлаарай',
        '40км ээс дээш зайд хүргэлт хийх боломжгүй',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: true},
      );
      return false;
    }

    this.setState({distance: {distance: dis, distance_km, price}});
    return true;
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
            const {address1 = {}, address2 = {}} = this.state;
            if (!address1.latitude) {
              this.setState({address1: {...address1, title}, loading: false});
            } else if (!address2.latitude) {
              this.setState({address2: {...address2, title}, loading: false});
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
      ? require('../../../../assets/logo_red.png')
      : require('../../../../assets/logo_green.png');
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
    const {distance} = this.state;
    action.isSubmitting = false;
    this.setState({sendLoading: true}, async () => {
      try {
        await sendMailAsync({...values, distance});
        this.setState({sendLoading: false}, () => {
          navigation.navigate('Order', distance);
        });
      } catch (error) {
        const {response: {data: {message} = {}} = {}} = error;
        console.warn('onCheckClick', message, error);
        this.setState({sendLoading: false});
      }
    });
  };

  permissatioAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission approved');
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  currentLocationClicked = () => {
    Geolocation.getCurrentPosition(
      data => {
        console.log('done', data);
        const {
          coords: {latitude, longitude},
        } = data;
        this._map.animateToCoordinate({latitude, longitude}, 1);
      },
      error => {
        console.warn('currentLocationClicked', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  phoneClicked = () => {
    Linking.openURL('tel:77898877');
  };

  address1Clicked = () => {
    const {address1 = {}, address2 = {}} = this.state;
    if (address1.latitude) {
      if (
        !address2.latitude &&
        address2.onChange &&
        address2.onChange.latitude
      ) {
        this.setState({
          address2: {
            title: address2.title,
            key: 'add2',
            latitude: address2.onChange.latitude,
            longitude: address2.onChange.longitude,
            onChange: null,
          },
        });
      } else if (!address2.latitude && !address2.onChange && address2.title) {
        this.setState({address2: {}});
      }
      this.setState(
        {
          imageVisible: true,
          address1: {
            title: address1.title,
            key: 'add1',
            onChange: {
              latitude: address1.latitude,
              longitude: address1.longitude,
            },
          },
        },
        () => {
          this._map.animateToRegion(
            {
              latitude: address1.latitude,
              longitude: address1.longitude,
              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
            },
            350,
          );
        },
      );
    }
  };

  address2Clicked = () => {
    const {address2 = {}, address1 = {}} = this.state;
    if (address2.latitude) {
      if (
        !address1.latitude &&
        address1.onChange &&
        address1.onChange.latitude
      ) {
        this.setState({
          address1: {
            title: address1.title,
            key: 'add2',
            latitude: address1.onChange.latitude,
            longitude: address1.onChange.longitude,
            onChange: null,
          },
        });
      } else if (!address1.latitude && !address1.onChange && address1.title) {
        this.setState({address1: {}});
      }
      this.setState(
        {
          imageVisible: true,
          address2: {
            title: address2.title,
            key: 'add2',
            onChange: {
              latitude: address2.latitude,
              longitude: address2.longitude,
            },
          },
        },
        () => {
          this._map.animateToRegion(
            {
              latitude: address2.latitude,
              longitude: address2.longitude,
              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
            },
            350,
          );
        },
      );
    }
  };

  render() {
    const {
      address1 = {},
      address2 = {},
      distance = {},
      centerCoordinate,
      sendLoading,
    } = this.state;
    return (
      <View style={styles.container}>
        <ActivityIndicatorComp loading={sendLoading} />
        {address1 && address1.title && (
          <TouchableOpacity
            style={styles.inputLocation}
            onPress={() => this.address1Clicked()}>
            <Image
              style={styles.pickLogo}
              source={require('../../../../assets/logo_red.png')}
            />
            <View style={styles.addressInfo} />
            <View style={styles.marginLeft8}>
              <Text
                style={[
                  styles.addressTitle1,
                  address2.latitude && address1.latitude
                    ? null
                    : !address2.latitude && address1.latitude
                    ? {color: '#e3e3e3'}
                    : null,
                ]}>
                Барааг очиж авах хаяг
              </Text>
              <Text
                numberOfLines={1}
                style={[
                  styles.txtLoc,
                  address2.latitude && address1.latitude
                    ? null
                    : !address2.latitude && address1.latitude
                    ? {color: '#e3e3e3'}
                    : null,
                ]}>
                {address1.title || ''}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        {address2 && address2.title && (
          <TouchableOpacity
            style={styles.inputLocation}
            onPress={() => this.address2Clicked()}>
            <Image
              style={styles.pickLogo}
              source={require('../../../../assets/logo_green.png')}
            />
            <View style={styles.addressInfo} />
            <View style={styles.marginLeft8}>
              <Text
                style={[
                  styles.addressTitle2,
                  address2.latitude && address1.latitude
                    ? null
                    : address2.latitude && !address1.latitude
                    ? {color: '#e3e3e3'}
                    : null,
                ]}>
                Барааг хүргэж өгөх хаяг
              </Text>
              <Text
                numberOfLines={1}
                style={[
                  styles.txtLoc,
                  address2.latitude && address1.latitude
                    ? null
                    : address2.latitude && !address1.latitude
                    ? {color: '#e3e3e3'}
                    : null,
                ]}>
                {address2.title || ''}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {this.renderCustomMarker()}

        <MapView
          ref={ref => (this._map = ref)}
          style={styles.mapStyle}
          initialRegion={centerCoordinate}
          showsMyLocationButton={true}
          showsUserLocation={true}
          zoomControlEnabled={true}
          zoomTapEnabled={true}
          zoomEnabled={true}
          onRegionChangeComplete={this.onChangeRegionComplete}>
          {address1 && address1.latitude && (
            <Marker coordinate={address1} title={address1.title || ''}>
              <View>
                <Image
                  pointerEvents="none"
                  source={require('../../../../assets/logo_red.png')}
                  style={styles.markerImage}
                />
                <View style={styles.rectangle} />
              </View>
            </Marker>
          )}
          {address2 && address2.latitude && (
            <Marker coordinate={address2} title={address2.title || ''}>
              <View>
                <Image
                  pointerEvents="none"
                  source={require('../../../../assets/logo_green.png')}
                  style={styles.markerImage}
                />
                <View style={styles.rectangle} />
              </View>
            </Marker>
          )}
        </MapView>

        <View style={styles.btnContainer}>
          <TouchableOpacity style={styles.callBtn} onPress={this.phoneClicked}>
            <Image
              style={{
                width: 20,
                height: 20,
              }}
              source={require('../../../../assets/celular.png')}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.callBtn}
            onPress={this.currentLocationClicked}>
            <Image
              style={{
                width: 20,
                height: 20,
              }}
              source={require('../../../../assets/current_location.png')}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nextBtn}
            onPress={this.selectAddressClick}>
            <Text style={styles.btnSongoh}>Хаяг сонгох</Text>
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
          <Formik
            enableReinitialize
            initialValues={{
              recievePhoneNumber: '',
              deliveryPhoneNumber: '',
              recieveAddress: address2.title,
              deliveryAddress: address1.title,
            }}
            validationSchema={this.validationScheme}
            onSubmit={(values, action) => this.onCheckClick(values, action)}
            style={styles.felx1}>
            {formikProps => {
              const {
                values,
                touched,
                errors,
                handleChange = () => {},
                handleBlur = () => {},
              } = formikProps;
              return (
                <View style={styles.panel}>
                  <KeyboardAwareScrollView enableOnAndroid={true}>
                    <View style={styles.panelHeader}>
                      <Text style={styles.sliderTitle}>
                        ХҮРГЭЛТИЙН МЭДЭЭЛЭЛ
                      </Text>
                    </View>
                    <View style={styles.panelContainer}>
                      <View style={styles.margin10}>
                        <View style={styles.inputLocationDetails}>
                          <Image
                            style={styles.pickLogo}
                            source={require('../../../../assets/logo_red.png')}
                          />
                          <View style={styles.addressInfo} />
                          <View style={styles.marginLeft8}>
                            <Text style={styles.addressTitle1}>
                              Барааг очиж авах хаяг
                            </Text>
                            <TextInput
                              style={styles.titleFontSize16}
                              onChangeText={handleChange('deliveryAddress')}
                              onBlur={handleBlur('deliveryAddress')}
                              defaultValue={values.deliveryAddress}
                              // textAlignVertical="auto"
                              // textAlign="left"
                            />
                          </View>
                        </View>
                        {touched.deliveryAddress && errors.deliveryAddress && (
                          <View style={styles.marginTop8RowContainerStyle}>
                            <Text style={styles.errorText}>
                              {errors.deliveryAddress}
                            </Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.space}>
                        <View style={styles.inputLocationDetails}>
                          <Image
                            style={styles.pickLogo}
                            source={require('../../../../assets/logo_green.png')}
                          />
                          <View style={styles.addressInfo} />
                          <View style={styles.marginLeft8}>
                            <Text style={styles.addressTitle2}>
                              Барааг хүргэж өгөх хаяг
                            </Text>
                            <TextInput
                              style={styles.titleFontSize16}
                              onChangeText={handleChange('recieveAddress')}
                              onBlur={handleBlur('recieveAddress')}
                              defaultValue={values.recieveAddress}
                            />
                          </View>
                        </View>
                        {touched.recieveAddress && errors.recieveAddress && (
                          <View style={styles.marginTop8RowContainerStyle}>
                            <Text style={styles.errorText}>
                              {errors.recieveAddress}
                            </Text>
                          </View>
                        )}
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
                            placeholder={'88001122'}
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
                          placeholder={'99001122'}
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
                      <View style={styles.space}>
                        <Text style={styles.txtDesc}>
                          Хүргэлтийн зай {distance.distance_km} км
                        </Text>
                      </View>
                      <View style={styles.space}>
                        <Text style={styles.txtDesc}>
                          Хүргэлтийн төлбөр {distance.price} төгрөг
                        </Text>
                      </View>
                    </View>
                  </KeyboardAwareScrollView>

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
        </SlidingUpPanel>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  felx1: {
    flex: 1,
  },
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
  panelContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: 10,
  },
  btnContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    height: 50,
    backgroundColor: '#162a69',
    borderRadius: 15,
    margin: 10,
  },
  nextBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    height: 50,
    backgroundColor: '#162a69',
    borderRadius: 15,
    margin: 10,
  },
  callBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 50,
    margin: 10,
  },
  space: {
    margin: 10,
  },
  txtDesc: {
    color: '#000',
    fontSize: 14,
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
    marginTop: -50,
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
  btnSongoh: {color: '#fff', fontSize: 20, fontWeight: 'bold'},
  margin10: {marginLeft: 10, marginRight: 10, marginBottom: 10},
  titleFontSize16: {fontSize: 16, padding: 0},
  phoneText: {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e3e3e3',
  },
  sliderTitle: {
    alignSelf: 'center',
    fontSize: 16,
  },
  marginTop8RowContainerStyle: {
    flexDirection: 'row',
    marginTop: 8,
    // flex: 1
  },
  errorText: {
    color: 'orange',
    fontSize: 13,
    marginTop: 3,
    marginLeft: 7,
    flex: 1,
  },
});

export default HomePage;
