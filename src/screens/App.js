import React from 'react';
import Navigation from '../navigation';
import SplashScreen from 'react-native-splash-screen';
import { NativeBaseProvider } from 'native-base';

function App() {
  React.useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <NativeBaseProvider>
      <Navigation />
    </NativeBaseProvider>
  );
}

export default App;
