import React from 'react';
import {
  View,
  Image,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

class DeliveryComp extends React.Component {
  render() {
    return (
      <View style={styles.panel}>
        <KeyboardAwareScrollView style={{flex: 1}} enableOnAndroid={true}>
          <View style={styles.panelHeader}>
            <Text style={{alignSelf: 'center', fontSize: 16}}>
              ХҮРГЭЛТИЙН МЭДЭЭЛЭЛ
            </Text>
          </View>

          <View style={styles.panelContainer}>
            <View style={{marginLeft: 10, marginRight: 10, marginBottom: 10}}>
              <View style={styles.inputLocationDetails}>
                <Image
                  style={styles.pickLogo}
                  source={require('../../../../assets/logo_red.jpg')}
                />
                <View
                  style={{
                    height: 30,
                    width: 1,
                    marginTop: 3,
                    marginBottom: 3,
                    backgroundColor: '#e3e3e3',
                  }}
                />
                <View style={{flex: 1, marginLeft: 8}}>
                  <Text
                    style={{
                      color: '#eb4034',
                      fontSize: 12,
                      alignSelf: 'stretch',
                    }}>
                    Барааг очиж авах хаяг
                  </Text>
                  <TextInput style={{fontSize: 16, padding: 0}}>
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
                <View
                  style={{
                    height: 30,
                    width: 1,
                    marginTop: 3,
                    marginBottom: 3,
                    backgroundColor: '#e3e3e3',
                  }}
                />
                <View style={{flex: 1, marginLeft: 8}}>
                  <Text
                    style={{
                      color: '#3fc450',
                      fontSize: 12,
                      alignSelf: 'stretch',
                    }}>
                    Барааг хүргэж өгөх хаяг
                  </Text>
                  <TextInput style={{fontSize: 16, padding: 0}}>
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
                  style={{
                    height: 40,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#e3e3e3',
                  }}
                />
              </View>
            </View>
            <View style={styles.space}>
              <Text style={styles.txtDesc}>
                Барааг хүлээн авах хүний утасны дугаар
              </Text>
              <TextInput
                style={{
                  height: 40,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#e3e3e3',
                }}
              />
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.props.navigation.navigate('Order')}>
                <Text style={{color: '#fff', fontSize: 20}}>
                  Баталгаажуулах
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
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
});

export default DeliveryComp;
