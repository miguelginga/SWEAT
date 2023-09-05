import {
    StyleSheet,
    Text,
    View,
    Pressable,
    Modal,
    NativeEventEmitter, NativeModules,Platform,PermissionsAndroid
  } from 'react-native';
  import React, {useRef,useState, useEffect} from 'react';
  import BleManager from 'react-native-ble-manager';
  import Toast from 'react-native-toast-message';

  //iniciar o BLE manager
  const BleManagerModule = NativeModules.BleManager;
  const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
  let isDiscoverPeripheralListenerActive = false;
  

function BLEconnection(props){

    //variável para controlar a visibilidade deste ecrã
    const [isVisibleBLE, setVisibleBLE] = useState(props.visible);
    useEffect(() => {
        setVisibleBLE(props.visible);
    });
    
    //lista de dispositivos
    const [devices, setDevices] = useState([]);
    //variável para controlar se está a realizar scan ou não
    const [scanning, setScanning] = useState(false);
    //variável para guardar o dispositivo conectado
    const [connectedDevice, setConnectedDevice] = useState([]);
    //variável para controlar o nome do dispositivo a que se pretende ligar
    const [deviceName, setDeviceName] = useState({name:''})

    

    //inicar o BLE manager a cada refresh
    useEffect(() => {
      BleManager.start({ showAlert: false });
  
      const subscription = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
  
      return () => {
        subscription.remove();
        if (isDiscoverPeripheralListenerActive) {
          isDiscoverPeripheralListenerActive = false;
          bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
        }
      };
    }, []);


    //ligar o bluetooth e verificar as permissões
    useEffect(() => {
        BleManager.enableBluetooth().then(() => {
          console.log('Bluetooth is turned on!');
        });
    
        if (Platform.OS === 'android' && Platform.Version >= 31) {
          PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          ]).then(result => {
            if (result) {
              console.debug(
                '[handleAndroidPermissions] User accepts runtime permissions android 12+',
              );
            } else {
              console.error(
                '[handleAndroidPermissions] User refuses runtime permissions android 12+',
              );
            }
          });
        } else if (Platform.OS === 'android' && Platform.Version >= 23) {
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(checkResult => {
            if (checkResult) {
              console.debug(
                '[handleAndroidPermissions] runtime permission Android <12 already OK',
              );
            } else {
              PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              ).then(requestResult => {
                if (requestResult) {
                  console.debug(
                    '[handleAndroidPermissions] User accepts runtime permission android <12',
                  );
                } else {
                  console.error(
                    '[handleAndroidPermissions] User refuses runtime permission android <12',
                  );
                }
              });
            }
          });
        }
      }, []);
  
      //verificar se existe um dispositivo com o nome que é pretendido e conectar


  
    //fazer scan BLE por dispositivos  
    function scanDevices  (devName) {
      console.log("Connected Devices " , connectedDevice)

      setScanning(true);
  
      BleManager.scan([], 5, true)
        .then(() => {
          console.log('Scanning...');
          isDiscoverPeripheralListenerActive = true;
          setTimeout(() => {
            setScanning(false);
            if (isDiscoverPeripheralListenerActive) {
              isDiscoverPeripheralListenerActive = false;
              bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
            }
          }, 5000); // Set the timeout to match the scan duration (in milliseconds)
        })
        .catch((error) => {
          console.log('Error scanning devices:', error);
          setScanning(false);
        });

        console.log("Scanned Device list " , devices);
        const showToastScan = setTimeout(() => {
          Toast.show({
            type: 'success',
            text1: 'Scan Finished',
            text2: 'You can now connect your devices.'
          });
        }, 5000)


      };
  

    //filtrar dispositivos encontrados e verificar se têm algum dos nomes chaves pretendidos
    const handleDiscoverPeripheral = (data) => {
      const { id, name } = data;
      const device = { id, name, connected: false };
      console.log('Discovered device:', device);
      if (name === 'XIAO SWEAT LEFT WRIST'||name === 'XIAO SWEAT RIGHT WRIST' 
      || name === 'XIAO SWEAT LEFT ELBOW'||name === 'XIAO SWEAT RIGHT ELBOW'
      || name === 'XIAO SWEAT LEFT SHOULDER'||name === 'XIAO SWEAT RIGHT SHOULDER'
      || name === 'XIAO SWEAT LEFT ANKLE'||name === 'XIAO SWEAT RIGHT ANKLE'
      || name === 'XIAO SWEAT LEFT THIGH'||name === 'XIAO SWEAT RIGHT THIGH'
      || name === 'XIAO SWEAT LEFT WAIST' ) { 
        setDevices((prevDevices) => {
          if (prevDevices.some((prevDevice) => prevDevice.id === device.id)) {
            return prevDevices.map((prevDevice) =>
              prevDevice.id === device.id ? device : prevDevice
            );
          } else {
            return [...prevDevices, device];
          }
        });
      }
    };
  
    //conectar ao dispositivo
    function connectToDevice (devName)  {
      const deviceNameObj = {name: devName};
      setDeviceName(deviceNameObj);
      console.log("Device Name ", deviceName.name)
      if (devices.length > 0 ) {
        const deviceToConnect = devices.find((device) => device.name === deviceName.name);
        console.log("Device to Connect" , deviceName.name)
        if (deviceToConnect && !connectedDevice.flat(1).some(device => deviceToConnect.name === device.name)) {
          BleManager.connect(deviceToConnect.id)
        .then(() => {
          console.log('Connected to device:', deviceToConnect.name);
          setConnectedDevice(prevDevices => [...prevDevices,[deviceToConnect]]);

          setDevices((prevDevices) =>
            prevDevices.map((prevDevice) =>
              prevDevice.id === deviceToConnect.id ? { ...prevDevice, connected: true } : prevDevice
            )
          );
        })
        .catch((error) => {
          console.log('Error connecting to device:', error);
        });

        showToast(deviceToConnect.name);
        }
      }
      
    };

    const showToast = (devicName) => {
      Toast.show({
        type: 'success',
        text1: 'Connected',
        text2: 'Device ' + devicName + ' Successfully Connected.'
      });
    }


  
    return(
<Modal animationType={'slide'} transparent={false} visible={isVisibleBLE}>
            <View style={{height:'100%', width:'100%', backgroundColor:'black', display:'flex', justifyContent:'space-between',}}>
              <View style={styles.bleFlex}>
                <View><Text style={{color: 'white', fontFamily: 'Akira'}} >Wrist</Text></View>
                <View style={{display:'flex', flexDirection:'row'}}>
                    <Pressable onPress={() =>connectToDevice("XIAO SWEAT LEFT WRIST")}  disabled={scanning}>
                      <View style={styles.buttonBLE_style}  >
                        <Text style={{color: 'white', fontFamily: 'Akira'}} >
                          LEFT 
                       </Text>
                      </View>
                    </Pressable>
                    <Pressable onPress={() => connectToDevice("XIAO SWEAT RIGHT WRIST")}>
                      <View style={styles.buttonBLE_style}>
                        <Text style={{color: 'white', fontFamily: 'Akira'}} >
                          RIGHT 
                       </Text>
                      </View>
                    </Pressable>
                </View>
              </View>
              <View style={styles.bleFlex}>
                <View><Text style={{color: 'white', fontFamily: 'Akira'}} >Elbow</Text></View>
                <View style={{display:'flex', flexDirection:'row'}}>
                    <Pressable onPress={() => connectToDevice("XIAO SWEAT LEFT ELBOW")}>
                      <View style={styles.buttonBLE_style}>
                        <Text style={{color: 'white', fontFamily: 'Akira'}}>
                          LEFT 
                       </Text>
                      </View>
                    </Pressable>
                    <Pressable onPress={() => connectToDevice("XIAO SWEAT RIGHT ELBOW")}>
                      <View style={styles.buttonBLE_style}>
                        <Text style={{color: 'white', fontFamily: 'Akira'}}>
                          RIGHT 
                       </Text>
                      </View>
                    </Pressable>
                </View>
              </View>
              <View style={styles.bleFlex}>
                <View><Text style={{color: 'white', fontFamily: 'Akira'}} >Shoulder</Text></View>
                <View style={{display:'flex', flexDirection:'row'}}>
                    <Pressable onPress={() => connectToDevice("XIAO SWEAT LEFT SHOULDER")}>
                      <View style={styles.buttonBLE_style}>
                        <Text style={{color: 'white', fontFamily: 'Akira'}}>
                          LEFT 
                       </Text>
                      </View>
                    </Pressable>
                    <Pressable onPress={() => connectToDevice("XIAO SWEAT RIGHT SHOULDER")}>
                      <View style={styles.buttonBLE_style}>
                        <Text style={{color: 'white', fontFamily: 'Akira'}}>
                          RIGHT 
                       </Text>
                      </View>
                    </Pressable>
                </View>
              </View>
              
              <View style={styles.bleFlex}>
                <View><Text style={{color: 'white', fontFamily: 'Akira'}} >thigh</Text></View>
                <View style={{display:'flex', flexDirection:'row'}}>
                    <Pressable onPress={() => connectToDevice("XIAO SWEAT LEFT THIGH")}>
                      <View style={styles.buttonBLE_style}>
                        <Text style={{color: 'white', fontFamily: 'Akira'}}>
                          LEFT 
                       </Text>
                      </View>
                    </Pressable>
                    <Pressable onPress={() => connectToDevice("XIAO SWEAT RIGHT THIGH")}>
                      <View style={styles.buttonBLE_style}>
                        <Text style={{color: 'white', fontFamily: 'Akira'}}>
                          RIGHT 
                       </Text>
                      </View>
                    </Pressable>
                </View>
              </View>
              <View style={styles.bleFlex}>
                <View><Text style={{color: 'white', fontFamily: 'Akira'}} >Ankle</Text></View>
                <View style={{display:'flex', flexDirection:'row'}}>
                    <Pressable onPress={() => connectToDevice("XIAO SWEAT LEFT ANKLE")}>
                      <View style={styles.buttonBLE_style}>
                        <Text style={{color: 'white', fontFamily: 'Akira'}}>
                          LEFT 
                       </Text>
                      </View>
                    </Pressable>
                    <Pressable onPress={() => connectToDevice("XIAO SWEAT RIGHT ANKLE")}>
                      <View style={styles.buttonBLE_style}>
                        <Text style={{color: 'white', fontFamily: 'Akira'}}>
                          RIGHT 
                       </Text>
                      </View>
                    </Pressable>
                </View>
              </View>
              <View style={styles.bleFlex}>
                <View><Text style={{color: 'white', fontFamily: 'Akira'}} >Waist</Text></View>
                <View style={{display:'flex', flexDirection:'row'}}>
                    <Pressable onPress={() => connectToDevice("XIAO SWEAT LEFT WAIST")}>
                      <View style={styles.buttonBLEWaist_style}>
                        <Text style={{color: 'white', fontFamily: 'Akira'}}>
                          CONNECT
                       </Text>
                      </View>
                    </Pressable>
                </View>
              </View>


          <View style={styles.connect_button}>
            <Pressable onPress={() => {scanDevices("")}}>
              <View style={styles.button_style}>
                <Text style={{color: '#8130F2', fontFamily: 'Akira'}}>
                  SCAN FOR DEVICES
                </Text>
              </View>
            </Pressable>
          </View>
          <View style={styles.connect_button}>
            <Pressable onPress={() => {setVisibleBLE(false); props.hide(); props.getDeviceList(connectedDevice)}}>
              <View style={styles.button_style}>
                <Text style={{color: '#8130F2', fontFamily: 'Akira'}}>
                  RETURN
                </Text>
              </View>
            </Pressable>
          </View>
          </View>


            <Toast position='bottom'/>
      </Modal>
    );
}

export default BLEconnection;


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
      alignItems:'center',
      flex: 0.2,
    },
    connection_image: {
      width: 300,
      height: 300,
    },
    button_style: {
      padding: 15,
      borderRadius: 25,
      backgroundColor: '#ffffff',
      color: 'black',
      width: 300,
      alignItems: 'center',
    },
    buttonBLE_style: {
      padding: 15,
      borderRadius: 25,
      backgroundColor: '#8130F2',
      color: 'white',
      width: 100,
      alignItems: 'center',
      margin:5
    },
    buttonBLEWaist_style: {
      padding: 15,
      borderRadius: 25,
      backgroundColor: '#8130F2',
      color: 'white',
      width: 210,
      alignItems: 'center',
      margin:5
    },
    bleFlex:{
      display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center', margin:10, marginHorizontal:20
    }
  });
  