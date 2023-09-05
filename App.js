import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./components/Home";
import StartWorkout from "./components/StartWorkout";
import Workout from "./components/Workout";
import WorkoutFinished from "./components/WorkoutFinished";


const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <Home navigator={navigation}/>
  );
}

function SWorkout({ navigation }) {
  return (
   <StartWorkout navigator={navigation}/>
  );
}

function WorkoutProgress({ navigation }) {
  return (
   <Workout navigator={navigation}/>
  );
}

function WorkoutEnd({ navigation }) {
  return (
   <WorkoutFinished navigator={navigation}/>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Home"
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="StartWorkout" component={SWorkout} />
        <Stack.Screen name="WorkoutProgress" component={WorkoutProgress} />
        <Stack.Screen name="WorkoutEnd" component={WorkoutEnd} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
