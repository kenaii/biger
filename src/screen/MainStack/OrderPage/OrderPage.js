import React, {Component} from 'react';
import {Text, View} from 'react-native';

export default class OrderPage extends Component {
  render() {
    return (
      <View style={{flex: 1, alignSelf: 'stretch', flexDirection: 'column'}}>
        <View
          style={{
            borderWidth: 1,
            borderRadius: 10,
            borderColor: '#e3e3e3',
            margin: 30,
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              marginLeft: 20,
              marginRight: 20,
              marginBottom: 10,
            }}>
            <View style={{margin: 10}}>
              <Text>Хүргэлтийн үнэ</Text>
            </View>
            <View style={{flex: 1, margin: 10}}>
              <Text style={{textAlign: 'right'}}>3000₮</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginLeft: 20,
              marginRight: 20,
              marginBottom: 10,
            }}>
            <View style={{margin: 10}}>
              <Text>Төлбөр хүлээн авах банк</Text>
            </View>
            <View style={{flex: 1, margin: 10}}>
              <Text style={{textAlign: 'right'}}>Хаан банк</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginLeft: 20,
              marginRight: 20,
              marginBottom: 10,
            }}>
            <View style={{margin: 10}}>
              <Text>Дансны дугаар</Text>
            </View>
            <View style={{flex: 1, margin: 10}}>
              <Text style={{textAlign: 'right'}}>5007934573</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginLeft: 20,
              marginRight: 20,
              marginBottom: 10,
            }}>
            <View style={{margin: 10}}>
              <Text>Данс эзэмшигчийн нэр</Text>
            </View>
            <View style={{flex: 1, margin: 10}}>
              <Text style={{textAlign: 'right'}}>Баасанбат</Text>
            </View>
          </View>
        </View>
        <Text style={{marginLeft: 30}}>
          Санамж: Та гүйлгээний утга дээр өөрийн утасны дугаарыг заавал бичэх
          ёстой гэдгийг анхаарна уу!
        </Text>
      </View>
    );
  }
}
