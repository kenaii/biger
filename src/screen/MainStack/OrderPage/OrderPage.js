import React, { Component } from 'react';
import {
    Text, View
} from 'react-native';

export default class OrderPage extends Component {

    render() {
        return (
            <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'column' }}>

                 <View style={{ borderWidth: 1, borderRadius: 10, borderColor: '#e3e3e3', margin: 30 }}>
                    <View style={{ flexDirection: 'row', margin: 20 }}>
                        <View style={{ position: 'absolute', left: 0, margin: 10 }}><Text>Хүргэлтийн үнэ</Text></View>
                        <View style={{ position: 'absolute', right: 0, margin: 10 }}><Text>3000₮</Text></View>
                    </View>
                    <View style={{ flexDirection: 'row', margin: 20 }}>
                        <View style={{ position: 'absolute', left: 0, margin: 10 }}><Text>Төлбөр хүлээн авах банк</Text></View>
                        <View style={{ position: 'absolute', right: 0, margin: 10 }}><Text>Хаан банк</Text></View>
                    </View>
                    <View style={{ flexDirection: 'row', margin: 20 }}>
                        <View style={{ position: 'absolute', left: 0, margin: 10 }}><Text>Дансны дугаар</Text></View>
                        <View style={{ position: 'absolute', right: 0, margin: 10 }}><Text>5007934573</Text></View>
                    </View>
                    <View style={{ flexDirection: 'row', margin: 20 }}>
                        <View style={{ position: 'absolute', left: 0, margin: 10 }}><Text>Данс эзэмшигчийн нэр</Text></View>
                        <View style={{ position: 'absolute', right: 0, margin: 10 }}><Text>Баасанбат</Text></View>
                    </View>

                </View>

                <Text>Санамж: Та гүйлгээний утга дээр өөрийн утасны дугаарыг заавал бичэх ёстой!</Text>
                
            </View>
        );
    }
}