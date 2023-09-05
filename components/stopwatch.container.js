import  React, {Component, useId} from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';


let padToTwo = (number) => (number <= 9 ? `0${number}`: number);

class StopwatchContainer extends Component {

    constructor(props){
        super(props);

        this.state = {
            min: 0,
            sec: 0,
            msec: 0,
            start:  false
        }

        this.lapArr = [];

        this.interval = null;

    }

    componentDidMount(){
        this.setState(
            {
                start: false
            },
            () => this.handleStart()
        );
    };



    handleStart = () => {
        if (this.state.start) {
            this.interval = setInterval(() => {
                if (this.state.msec !== 99) {
                    this.setState({
                        msec: this.state.msec + 1
                    });
                } else if (this.state.sec !== 59) {
                    this.setState({
                        msec: 0,
                        sec: ++this.state.sec
                    });
                } else {
                    this.setState({
                        msec: 0,
                        sec: 0,
                        min: ++this.state.min
                    });
                }
            }, 1);

        } else {
            clearInterval(this.interval);
        }
    };

    render(){
        return(
            <View style={styles.container} >
                <View style={styles.parent}>
                    <Text  style={styles.child}>{'  '+ padToTwo(this.state.min) + ' : '}</Text>
                    <Text  style={styles.child}>{padToTwo(this.state.sec) + ' : '}</Text>
                    <Text  style={styles.child}>{padToTwo(this.state.msec)}</Text>
                </View>
                <View style={styles.button}>
        <Pressable onPress={() => {this.state.start = !this.state.start;
this.handleStart();this.props.writeTime()}} >
            <View style={styles.button_style}>
              <Text style={{color: '#8130F2', fontFamily: 'Akira'}}>{this.state.start ? "End Workout" : "Start Workout"}</Text>
            </View>
          </Pressable>
        </View>
            </View>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        alignItems: "center",
        justifyContent: "center",
      },
    parent: {
        display: "flex",
        flexDirection: "row",
        justifyContent: 'center',
        alignItems:'center',
        margin:20,
        marginRight:35
    },

    child: {
      fontSize: 36,
      color: "#ffffff",
    },

    buttonParent: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: "12%",
        marginBottom: "16%"
    },

    button: {
        flex: 2,
      }
      ,
      button_style: {
        padding: 15,
        borderRadius: 25,
        backgroundColor: "#ffffff",
        color: "black",
        width: 300,
        alignItems: "center",
      },
});

export default StopwatchContainer;