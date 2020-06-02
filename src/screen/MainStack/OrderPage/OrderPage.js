import React from 'react';
import {Text, View} from 'react-native';

const OrderPage = ({route: {params: distance = {}} = {}}) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        alignSelf: 'stretch',
        flexDirection: 'column',
      }}>
      <View
        style={{
          borderWidth: 1,
          borderRadius: 10,
          borderColor: '#e3e3e3',
          margin: 30,
          backgroundColor: '#f5f5f5',
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
            <Text style={{textAlign: 'right'}}>{distance.price}₮</Text>
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
            <Text style={{textAlign: 'right'}}>О.Баасанбат</Text>
          </View>
        </View>
      </View>
      <Text style={{marginLeft: 30}}>
        Санамж: Та гүйлгээний утга дээр өөрийн утасны дугаарыг заавал бичих
        ёстой гэдгийг анхаарна уу!
      </Text>
      <Text style={{marginLeft: 30, marginTop: 10}}>
        Захиалгатай холбоотой мэдээллийг 77898877, 99662969 дугаарт холбогдож авна уу.
      </Text>
    </View>
  );
};

export default OrderPage;
