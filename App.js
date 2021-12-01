import React, { useEffect } from 'react';
import Navigation from './src/navigation'
import JobCard from './src/screens/Dashboard/Profile/NewScreens/JobCard'
import Feed from './src/components/Feed'
import MySongwriter from './src/screens/Dashboard/Profile/NewScreens/MySongwriter'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './src/redux/Store';
import OneSignal from 'react-native-onesignal'
import Peer from './src/screens/Dashboard/Post/Peer';
import SplashScreen from 'react-native-splash-screen';


console.disableYellowBox = true
const App = () => {

  // const [publishableKey, setPublishableKey] = useState('');


  useEffect(() => {
    //my account fde33dd4-519e-4351-b30e-ac19fdfc3266\
    SplashScreen.hide();

    OneSignal.setAppId('0c1bf4e2-fdea-487c-bd50-dd161a4d4382');


  }, [])


  // const fetchPublishableKey = async () => {
  //   // const key = await fetchKey(); // fetch key from your server here
  //   const key = 'pk_test_51JuBMYSHtcm2usARh36XYwC0XDJr1KAbXYBEdAexkYjInrN7QuyCPVVDbEmNTJixmCMiy2Rc85o2oOwfbJwfK56C00dPEHuHCG'
  //   setPublishableKey(key);
  // };


  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <Navigation />
      </PersistGate>
    </Provider>
  )
}
export default App
