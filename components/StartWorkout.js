import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { useRoute } from "@react-navigation/native";
import StopwatchContainer from "./stopwatch.container";
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import BleManager from 'react-native-ble-manager';
import React, {useRef,useState, useEffect} from 'react';
import { Buffer } from 'buffer';




const TIME_SERVICE_UUID               = '00001805-0000-1000-8000-00805F9B34FB';
const TIME_SERVICE_CHARATERISTIC_UUID = '00002A2B-0000-1000-8000-00805F9B34FB';


function StartWorkout(props){

  const route = useRoute();
  const connectedDevices = route.params.connectedDevices;
  console.log("Device ID" , route.params.connectedDevices[0][0].id)
  

  const disconect = (id) => {
    BleManager.disconnect(id);
  };


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

  const promisses = connectedDevices.map( device => BleManager.write(device[0].id,TIME_SERVICE_UUID,TIME_SERVICE_CHARATERISTIC_UUID, buffer.toJSON().data)) ;

  await Promise.all(promisses);
  
  
  console.log("Data Written");
}


  console.log(connectedDevices[0][0].id);
    return(
      <LinearGradient colors={['#8130F2', '#B114AB']} style={styles.container}>

        <View style={styles.logo}>
          <Image source={require("../assets/images/sweat_logo.png")} />
        </View>
        <View style={styles.image}>
          <Image
            style={styles.workout_image}
            source={require("../assets/images/startWorkout.png")}
          />
        </View>

      <View style={styles.stopwatch}>
            <StopwatchContainer writeTime = {writeTime}/>
      </View>
      <View style={styles.button}>
        <Pressable onPress={() => {props.navigator.navigate("Home")}}>
          <View style={styles.button_style_leave}>
            <Text style={{color: 'white', fontFamily: 'Akira'}}>
            LEAVE  <Icon name="sign-out-alt" size={20} color="white" />   
            </Text>
          </View>
        </Pressable>
      </View>
      </LinearGradient>
    );
}

export default StartWorkout;

const styles = StyleSheet.create({
    container: {
      flex: 1,

      alignItems: "center",
      justifyContent: "center",
    },
    logo: {
      flex: 1,
      marginTop: 50,
    },
    image: {
      flex: 3,
      alignItems:'center',
      justifyContent: 'center'
    },
    stopwatch: {
      flex: 1.5,
      alignItems:'center',
      justifyContent: 'center'
    },
    button: {
      flex: 1,
    },
    workout_image: {
  resizeMode:'cover'
    }
    ,
    button_style: {
      padding: 15,
      borderRadius: 25,
      backgroundColor: '#ffffff',
      color: 'black',
      width: 300,
      alignItems: 'center',
    },
    button_style_leave: {
      padding: 15,
      borderRadius: 25,
      backgroundColor: 'black',
      color: 'black',
      width: 300,
      alignItems: 'center',
    },
  });