import React, { Component } from 'react';
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
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getAddressAsync } from '../../../service/address.service';
import { getDistance } from 'geolib';
import * as yup from 'yup';
import { Formik } from 'formik';

const { height } = Dimensions.get('window');

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
      loading: false,
      customMarkerVisible: true,
      distance: {},
      imageVisible: true,
    };
    this.onChangeRegionComplete = this.onChangeRegionComplete.bind(this);
    this.selectAddressClick = this.selectAddressClick.bind(this);   
    this.onCheckClick = this.onCheckClick.bind(this);
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      this.permissatioAndroid();
      this._map.setMapBoundaries({ latitude: 48.225648, longitude: 105.987859 }, { latitude: 47.565081, longitude: 107.724928 })
    }
  }

  selectAddressClick = () => {
    const { address1 = {}, address2 = {}, centerCoordinate } = this.state;
    this.setState({ loading: true }, () => {
      if (!address1.latitude) {
        getAddressAsync(centerCoordinate)
          .then(result => {
            if (
              result &&
              result.status === 'OK' &&
              result.results &&
              result.results.length > 0
            ) {
              const { results } = result;
              const title = results[0].formatted_address;
              this.setState({
                address1: { ...address1, ...centerCoordinate, title },
                address2: { ...address1, title },
                loading: false,
              });
            }
          })
          .catch(e => {
            console.log('error', e);
            this.setState({ loading: false });
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
              const { results } = result;
              const title = results[0].formatted_address;
              this.setState(
                {
                  address2: { ...address2, ...centerCoordinate, title },
                  customMarkerVisible: false,
                  imageVisible: false,
                  loading: false,
                },
                () => {
                  if (this.getDistanceCalculate()) {
                    this._panel.show();
                  }
                },
              );
            }
          })
          .catch(e => {
            console.log('error', e);
            this.setState({ loading: false });
          });
      } else {
        this.setState({ loading: false });
        this._panel.show();
      }
    });
  };

  getDistanceCalculate = () => {
    const { address1, address2 } = this.state;
    var dis = getDistance(address1, address2);
    let price = 5000;
    const distance_km = Math.ceil(dis / 1000);
    if (distance_km > 5) { 
      price += (distance_km - 5) * 500;
    } else if (distance_km > 40) {
      Alert.alert(
        "Уучлаарай",
        "40км ээс дээш зайд хүргэлт хийх боломжгүй",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ],
        { cancelable: true }
      );
      return false;
    }

    this.setState({ distance: { distance: dis, distance_km, price } });
    return true;
  };

  onChangeRegionComplete = e => {
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
            const title = results[0].formatted_address;
            const { address1, address2 } = this.state;
            if (!address1 || !address1.latitude) {
              this.setState({ address1: { title, key: 'add1' }, loading: false });
            } else if (!address2 || !address2.latitude) {
              this.setState({ address2: { title, key: 'add2' }, loading: false });
            }
          }
        })
        .catch(err => {
          this.setState({ loading: false });
          console.warn('err', err);
        });
    });
  };

  renderCustomMarker = () => {
    const { imageVisible, address1 = {} } = this.state;
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
    const { navigation } = this.props;
    const { distance } = this.state;
    action.isSubmitting = false;
    navigation.navigate('Order', distance);
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

  render() {
    const { address1 = {}, address2 = {}, distance = {} } = this.state;
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
          ref={(ref) => this._map = ref}
          style={styles.mapStyle}
          initialRegion={{
            latitude: 47.9169351,
            longitude: 106.921919,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
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
                  source={require('../../../../assets/logo_red.jpg')}
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
            onPress={this.selectAddressClick}>
            <Text style={styles.btnSongoh}>Хаяг сонгох</Text>
          </TouchableOpacity>
        </View>

        <SlidingUpPanel
          ref={c => (this._panel = c)}
          height={height * 0.8}
          draggableRange={{ top: height * 0.8, bottom: 0 }}
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
            style={{ flex: 1 }}>
            {formikProps => {
              const {
                values,
                touched,
                errors,
                handleChange = () => { },
                handleBlur = () => { },
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
                            source={require('../../../../assets/logo_red.jpg')}
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
                            source={require('../../../../assets/logo_green.jpg')}
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
  },
  markerImage: { width: 30, height: 30, borderRadius: 15 },
  addressInfo: {
    height: 30,
    width: 1,
    marginTop: 3,
    marginBottom: 3,
    backgroundColor: '#e3e3e3',
  },
  addressTitle1: { color: '#eb4034', fontSize: 12, alignSelf: 'stretch' },
  addressTitle2: { color: '#3fc450', fontSize: 12, alignSelf: 'stretch' },
  marginLeft8: { flex: 1, marginLeft: 8 },
  btnSongoh: { color: '#fff', fontSize: 20 },
  margin10: { marginLeft: 10, marginRight: 10, marginBottom: 10 },
  titleFontSize16: { fontSize: 16, padding: 0 },
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
