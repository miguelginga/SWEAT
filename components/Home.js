import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Modal,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ActionSheet from 'react-native-actionsheet';
import React, {useRef, useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {LogBox} from 'react-native';
import {ImageSlider} from 'react-native-image-slider-banner';
import BLEconnection from './BLEconnection';
import Toast from 'react-native-toast-message';
import BleManager from 'react-native-ble-manager';
import { Buffer } from 'buffer';

const TIME_SERVICE_UUID               = '00001805-0000-1000-8000-00805F9B34FB';
const TIME_SERVICE_CHARATERISTIC_UUID = '00002A2B-0000-1000-8000-00805F9B34FB';



function Home(props) {


  const writeTime = async () => {

    const curr = new Date();
    const timeOffset = curr.getTimezoneOffset() / -60;
    const timeBufferContent  = new Uint8Array(7);
  
    timeBufferContent[0] = curr.getUTCFullYear();
    timeBufferContent[1] = (curr.getUTCFullYear() >> 8);
    timeBufferContent[2] = curr.getUTCMonth() + 1;
    timeBufferContent[3] = curr.getUTCDate();
    timeBufferContent[4] = curr.getUTCHours() + timeOffset;
    timeBufferContent[5] = curr.getUTCMinutes();
    timeBufferContent[6] = curr.getUTCSeconds();
  
    const buffer = Buffer.from(timeBufferContent);
    console.log(buffer.toJSON().data)
    const promisses = deviceList.map( device => BleManager.write(device[0].id,TIME_SERVICE_UUID,TIME_SERVICE_CHARATERISTIC_UUID, buffer.toJSON().data)) ;

    await Promise.all(promisses);
    
    console.log("Data Written");
  }


  LogBox.ignoreAllLogs();
  let actionSheet = useRef();

  this.state = {
    images: [
      require('../assets/images/UpperBodyPanel.png'),
      require('../assets/images/LowerBodyPanel.png'),
    ],
  };

  useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
  }, []);

  var optionArray = [
    <Text style={{color: '#8130F2', fontFamily: 'Akira'}}>
      BEGIN WORKOUT <Icon name="running" size={30} color="black" />
    </Text>,
    <Text style={{color: '#8130F2', fontFamily: 'Akira'}}>
      DEVICE PLACEMENT TUTORIAL <Icon name="info" size={30} color="black" />
    </Text>,
    <Text style={{color: '#8130F2', fontFamily: 'Akira'}}>GO BACK</Text>,
  ];

  const showActionSheet = () => {
    actionSheet.current.show();
  };



  const [isVisible, setVisible] = useState(false);
  const [isVisibleBLE, setVisibleBLE] = useState(false);

  //get from child
  const [deviceList, setDeviceList] = useState([]);

  const getDeviceList = (devices) =>{
    setDeviceList(devices);
  }


  const hideBLEScreen = () =>{
    setVisibleBLE(false);
  }

  const showToast = () => {
    Toast.show({
      type: 'error',
      text1: 'Unable to Start Workout',
      text2: 'There are no motion capturing devices connected.'
    });
  }

  return (
    <LinearGradient colors={['#8130F2', '#B114AB']} style={styles.container}>
      <Modal animationType={'slide'} transparent={false} visible={isVisible}>
        <View style={styles.container}>
          <View style={{flex: 5, marginTop: 25}}>
            <ImageSlider
              data={[
                {img: require('../assets/images/UpperBodyPanel.png')},
                {img: require('../assets/images/LowerBodyPanel.png')},
              ]}
              localImg
              autoPlay={false}
              preview={false}
              onItemChanged={item => console.log('item', item)}
              closeIconColor="#fff"
              caroselImageStyle={{height: 500}}
            />
          </View>

          <View style={styles.connect_button}>
            <Pressable onPress={() => setVisible(false)}>
              <View style={styles.button_style}>
                <Text style={{color: '#8130F2', fontFamily: 'Akira'}}>
                  RETURN
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </Modal>
      
      
      <BLEconnection visible={isVisibleBLE} hide={hideBLEScreen} getDeviceList = {getDeviceList}></BLEconnection>
      
      
      <View style={styles.logo}>
        <Image source={require('../assets/images/sweat_logo.png')} />
      </View>
      <View style={styles.connection}>
        <Image
          style={styles.connection_image}
          source={require('../assets/images/connection_high.png')}
        />
      </View>
      <View style={styles.connect_button}>
        <Pressable onPress={() => setVisibleBLE(true)}>
          <View style={styles.button_style}>
            <Text style={{color: '#8130F2', fontFamily: 'Akira'}}>
              Connect Devices
            </Text>
          </View>
        </Pressable>
      </View>
      <View style={styles.connect_button}>
        <Pressable onPress={showActionSheet}>
          <View style={styles.button_style}>
            <Text style={{color: '#8130F2', fontFamily: 'Akira'}}>WORKOUT</Text>
          </View>
        </Pressable>
      </View>
      <ActionSheet
        ref={actionSheet}
        options={optionArray}
        cancelButtonIndex={2}
        onPress={index => {
          if (index == 1) setVisible(true);
          if (index == 0 && deviceList.length > 0) {props.navigator.navigate('StartWorkout', {connectedDevices: deviceList}); writeTime()};
          if(index == 0 && deviceList.length <= 0) showToast();
        }}
      />
      <Toast/>
    </LinearGradient>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    flex: 1,
    marginTop: 50,
  },
  connection: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connect_button: {
    flex: 0.8,
  },
  connection_image: {
    width: 300,
    height: 300,
  },
  button_style: {
    padding: 15,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    width: 300,
    alignItems: 'center',
  },
  buttonBLE_style: {
    padding: 15,
    borderRadius: 25,
    backgroundColor: 'red',
    color: 'white',
    width: 100,
    alignItems: 'center',
    margin:5
  },
  buttonBLEWaist_style: {
    padding: 15,
    borderRadius: 25,
    backgroundColor: 'red',
    color: 'white',
    width: 210,
    alignItems: 'center',
    margin:5
  },
  bleFlex:{
    display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center', margin:10, marginHorizontal:20
  }
});
