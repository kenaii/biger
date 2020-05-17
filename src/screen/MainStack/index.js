import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './HomePage/HomePage';
import OrderPage from './OrderPage/OrderPage';

const Stack = createStackNavigator();

function Main() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomePage} options={{ headerShown: false }} />
            <Stack.Screen name="Order" component={OrderPage} options={{title: 'Төлбөрийн мэдээлэл'}} /> 
        </Stack.Navigator>
    );
}

export default Main;