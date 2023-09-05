
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import StopwatchContainer from "./stopwatch.container";

function Workout(props){
    return(
        <View style={styles.container}>
        <View style={styles.logo}>
          <Text style={styles.headerText}>Workout in Progress!</Text>
        </View>
        <View style={styles.image}>
          <Image
            style={styles.workout_image}
            source={require("../assets/images/workout.png")}
          />
        </View>

      </View>
    );
}

export default Workout;

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
    }
  });