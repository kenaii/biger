import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainStack from './MainStack';
import SplashPage from './SplashPage/SplashPage';
import { store } from '../store/store';

const Stack = createStackNavigator();

export default function App() {
  const [state] = useContext(store);

  return (
    <NavigationContainer>
      {state.isLoading ? (
        <Stack.Navigator headerMode="none">
          <Stack.Screen name="Splash" component={SplashPage} />
        </Stack.Navigator>
      ) : (
          <MainStack />
        )}
    </NavigationContainer>
  );
}
