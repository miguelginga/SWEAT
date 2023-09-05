
import { useRoute } from "@react-navigation/native";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import BleManager from 'react-native-ble-manager';

function WorkoutFinished(props){
    const route = useRoute();
    return(
        <View style={styles.container}>
        <View style={styles.logo}>
          <Text style={styles.headerText}>Workout Finished!</Text>
        </View>
        <View style={styles.image}>
          <Image
            style={styles.workout_image}
            source={require("../assets/images/workoutEnd.png")}
          />
        </View>
        <View style={styles.parent}>
            <Text style={styles.child}>{route.params.mins}:</Text>
            <Text style={styles.child}>{route.params.sec}:</Text>
            <Text style={styles.child}>{route.params.msec}</Text>
        </View>
        <View style={styles.button}>
        <Pressable  onPress={() => props.navigator.navigate("StartWorkout")}>
            <View style={styles.button_style}>
              <Text>New Workout</Text>
            </View>
          </Pressable>
        </View>
      </View>
    );
}

export default WorkoutFinished;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#DC5B67",
      alignItems: "center",
      justifyContent: "center",
    },
    logo: {
      flex: 3,
      borderColor:'white',
      border:2,
      alignItems: "center",
      justifyContent: "center",
    },
    image: {
      flex: 3,
      alignItems:'center',
      justifyContent: 'center'
    },
    button: {
      flex: 2,
    },
    workout_image: {
  resizeMode:'cover'
    }
    ,
    button_style: {
      padding: 15,
      borderRadius: 25,
      backgroundColor: "#ffffff",
      color: "black",
      width: 200,
      alignItems: "center",
    },
    headerText:{
        color: "#ffffff",
        fontSize: 30,
        alignSelf: "center",
        margin:25,
        fontWeight:'bold'
    },
    parent: {
        flex:2,
        flexDirection: "row",
        justifyContent: 'center',
        alignItems:'center',
        margin:20,
        marginRight:35
    },

    child: {
      fontSize: 36,
      color: "#ffffff",
    }
  });