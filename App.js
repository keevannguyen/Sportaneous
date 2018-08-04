import React, { Component } from 'react';
import { StyleSheet, StatusBar, View, Text, TouchableOpacity, ListView, AsyncStorage, TextInput, Image } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Button from 'apsl-react-native-button';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Ionicons } from '@expo/vector-icons';
import MapScreen from './map.js';
import LottieView from 'lottie-react-native';

console.disableYellowBox = true;


//Where it shows the NAME and the ICON of our web app.
class WelcomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  welcomePress() {
    this.props.navigation.navigate("Home");
  }

  render() {
    return (
      <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.9} onPress={() => this.welcomePress()}>
        <View style={{flex: 1, alignItems: "center", backgroundColor: "black"}}>
          <StatusBar backgroundColor="blue" barStyle="light-content"/>
          <Image style={{width: 350, height: 350, marginTop: 80, marginBottom: -50}} source={require('./assets/logo.png')} />
          <Text style={{color: "white", fontSize: 18}}>Need to find people for a pickup game?</Text>
          <Text style={{color: "white", fontSize: 18, marginTop: 8}}>Start spontaneous sports.</Text>
          <Text style={{color: "white", fontSize: 18, marginTop: 8}}>Sportaneously.</Text>
          <Text style={{color: "white", fontSize: 14, marginTop: 70}}>Touch to begin.</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

//Where a user can choose create an event or view events
class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home'
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: "black"}}>
        <Button style={{flex: 1, backgroundColor: '#272727', marginBottom: 0, borderRadius: 0}} textStyle={{fontSize: 70, color: "white"}}
          onPress={() => this.props.navigation.navigate("Sport")} activeOpacity={0.7}>
              CREATE
              <Ionicons style={{fontSize: 50, color: "white", marginRight: 35, marginTop: 5}} name="ios-add-circle-outline"></Ionicons>
        </Button>
        <View style={styles.separator2} />
        <Button style={{flex: 1, backgroundColor: '#272727', marginBottom: 0, borderRadius: 0}} textStyle={{fontSize: 70, color: "white"}}
          onPress={() => this.props.navigation.navigate("Map")} activeOpacity={0.7}>
              VIEW
              <Ionicons style={{fontSize: 60, color: "white", marginRight: 60, marginLeft: -60, marginTop: 5}} name="ios-eye"></Ionicons>
        </Button>
      </View>
    );
  }
}

//Where user can create event
//choose sports type, location, start time, when it will expire
//also, user can go back HomeScreen, cancel, and submit an event
class ChooseSportScreen extends React.Component {
  static navigationOptions = {
    title: ""
  };

  handleSport(sport) {
    AsyncStorage.setItem('event', JSON.stringify({
      sport: sport.toLowerCase()
    })).then( () => this.props.navigation.navigate("Location"));
  }

  render() {
    var dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => (r1 !== r2)
    });

    return (
      <View style={{flex: 1}}>
        <StatusBar barStyle="light-content" />
        <ListView
          style={{flex: 1}}
          renderRow={(rowData)=>(
            <TouchableOpacity onPress={() => this.handleSport(rowData.sport)} activeOpacity={0.7}>
              <View style={{padding: 15, flex: 1, alignItems: "center", backgroundColor: "#272727"}}>
                  <Text style={{fontSize: 20, color: "white"}}>{rowData.sport}</Text>
                  <Ionicons style={{fontSize: 60, color: "white"}} name={rowData.name}></Ionicons>
              </View>
            </TouchableOpacity>
          )}
          dataSource={dataSource.cloneWithRows([{ sport: "Soccer", name: "ios-football"},{ sport: "Basketball", name: "ios-basketball"},
        { sport: "Baseball", name: "ios-baseball"},{sport: "Tennis", name: "ios-tennisball"},{ sport: "Frisbee", name: "ios-disc"},
          { sport: "Football", name: "ios-american-football"},{ sport: "Bicycling", name: "ios-bicycle"}])}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
        />
      </View>
    );
  }
}

class ChooseLocationScreen extends React.Component {
  static navigationOptions = {
    title: "Where to Play"
  };

  handleCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      (success) => {
        AsyncStorage.mergeItem('event', JSON.stringify({
          longitude: success.coords.longitude,
          latitude: success.coords.latitude
        })).then( () => this.props.navigation.navigate("Time"));
      });
  }

  render() {
    return (
      <View style={{flex: 1,backgroundColor: "black"}}>
        <Button style={{flex: 1, backgroundColor: '#272727', marginBottom: 0, borderRadius: 0}} textStyle={{fontSize: 60, color: "white"}}
          onPress={()=> this.handleCurrentLocation()} activeOpacity={0.7}>
          Current Location
        </Button>
        <View style={styles.separator2} />
        <Button style={{flex: 1, backgroundColor: '#272727', marginBottom: 0, borderRadius: 0}} textStyle={{fontSize: 60, color: "white"}}
          onPress={() => this.props.navigation.navigate("EnterLocation")} activeOpacity={0.7}>
          Other Location
        </Button>
      </View>
    );
  }
}

class EnterLocationScreen extends React.Component {
  static navigationOptions = {
    title: "Choose a Location"
  };

  constructor(props) {
    super(props);
    this.state = {
      street: "",
      city: "",
      state: ""
    }
  }

  handleLocation() {
    AsyncStorage.mergeItem('event', JSON.stringify({
      address: {
        street: this.state.street,
        city: this.state.city,
        state: this.state.state
      }
    })).then( () => this.props.navigation.navigate("Time"));
  }

  render() {
    return (
      <View style={{flex: 1, padding: 20, backgroundColor: "#272727"}}>
        <Text style={{color: "white", marginTop: 20, marginLeft: 10, fontSize: 20, borderBottomColor: "white", borderBottomWidth: 5}}>Street Address</Text>
        <TextInput
          placeholder="Street Address"
          style={{height: 50, padding: 10, backgroundColor: "white", borderColor: 'gray', borderWidth: 1, borderRadius: 20, fontSize: 18}}
          onChangeText={(street) => this.setState({street})}
          value={this.state.street}
        />
        <Text style={{color: "white", marginTop: 20, marginLeft: 10, fontSize: 20, borderBottomColor: "white", borderBottomWidth: 5}}>City</Text>
        <TextInput
          placeholder="City"
          style={{height: 50, padding: 10, backgroundColor: "white", borderColor: 'gray', borderWidth: 1, borderRadius: 20, fontSize: 18}}
          onChangeText={(city) => this.setState({city})}
          value={this.state.city}
        />
        <Text style={{color: "white", marginTop: 20, marginLeft: 10, fontSize: 20, borderBottomColor: "white", borderBottomWidth: 5}}>State</Text>
        <TextInput
          placeholder="State"
          style={{height: 50, padding: 10, backgroundColor: "white", borderColor: 'gray', borderWidth: 1, borderRadius: 20, fontSize: 18}}
          onChangeText={(state) => this.setState({state})}
          value={this.state.state}
        />
        <Button style={{ marginTop: 30, padding: 10, backgroundColor: '#14A76C'}} textStyle={{fontSize: 20, color: "white"}} onPress={() => this.handleLocation()}>
          Next →
        </Button>
      </View>
    );
  }
}

class ChooseTimeScreen extends React.Component {
  static navigationOptions = {
    title: "Time"
  };

  constructor(props) {
    super(props);
    this.state = {
      isStartTimeVisible: false,
      isEndTimeVisible: false,
      startTime: null,
      endTime: null,
    }
  }

  _showStartTimePicker = () => this.setState({ isStartTimeVisible: true });

  _hideStartTimePicker = () => this.setState({ isStartTimeVisible: false });

  _handleStartTimePicked = (date) => {
    this.setState( {startTime: new Date(date)} );
    console.log('A start date has been picked: ', date.toLocaleString());
    this._hideStartTimePicker();
  };

  _showEndTimePicker = () => this.setState({ isEndTimeVisible: true });

  _hideEndTimePicker = () => this.setState({ isEndTimeVisible: false });

  _handleEndTimePicked = (date) => {
    this.setState( {endTime: new Date(date)} );
    console.log('An end date has been picked: ', date.toLocaleString());
    this._hideEndTimePicker();
  };

  handleEvent(){
    AsyncStorage.getItem('event')
      .then( result => {
        var parsedJson = JSON.parse(result);
        Object.assign(parsedJson, { startTime: this.state.startTime, endTime: this.state.endTime });
        console.log('parsed', parsedJson);
        fetch('http://10.2.103.54:3000/createEvent', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(parsedJson)
        })
        .then( res => {
          if(res.status === 200) {
            console.log("Successfully added event!");
            this.props.navigation.navigate("Success");
          } else {
            console.log("Failed to add event!");
            alert("ERROR");
          }
        })
      })
      .catch( err => {
        alert("ERROR");
        console.log(err);
      });
  }

  render() {
    return (
      <View style={{flex: 1, padding: 20, backgroundColor: "#272727"}}>
        <Text style={{color: "white", marginTop: 20, marginLeft: 10, fontSize: 20, borderBottomColor: "white", borderBottomWidth: 5}}>Start Time <Text>{" "}</Text><Ionicons style={{fontSize: 26, color: "white"}} name="ios-calendar"></Ionicons></Text>

        <TouchableOpacity activeOpacity={0.7} onPress={this._showStartTimePicker}>
          <TextInput
            placeholder="Start Time"
            style={{height: 50, padding: 10, backgroundColor: "white", borderColor: 'gray', borderWidth: 1, borderRadius: 20, fontSize: 18}}
            value={this.state.startTime ? this.state.startTime.toLocaleDateString("en-us", {weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "numeric"}) : null}
            pointerEvents="none"
          />
        </TouchableOpacity>

        <Text style={{color: "white", marginTop: 20, marginLeft: 10, fontSize: 20, borderBottomColor: "white", borderBottomWidth: 5}}>End Time <Text>{" "}</Text><Ionicons style={{fontSize: 26, color: "white"}} name="ios-calendar"></Ionicons></Text>
        <TouchableOpacity activeOpacity={0.7} onPress={this._showEndTimePicker}>
           <TextInput
            placeholder="End Time"
            style={{height: 50, padding: 10, backgroundColor: "white", borderColor: 'gray', borderWidth: 1, borderRadius: 20, fontSize: 18}}
            value={this.state.endTime ? this.state.endTime.toLocaleDateString("en-us", {weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "numeric"}) : null}
            pointerEvents="none"
          />
        </TouchableOpacity>

        <DateTimePicker
          mode="datetime"
          isVisible={this.state.isStartTimeVisible}
          onConfirm={this._handleStartTimePicked}
          onCancel={this._hideStartTimePicker}
          minimumDate={new Date()}
          titleIOS="Select Start Time"
          minuteInterval={15}
        />

        <DateTimePicker
          mode="datetime"
          isVisible={this.state.isEndTimeVisible}
          onConfirm={this._handleEndTimePicked}
          onCancel={this._hideEndTimePicker}
          minimumDate={new Date(this.state.startTime)}
          titleIOS="Select End Time"
          minuteInterval={15}
        />

        <Button style={{ marginTop: 30, padding: 10, backgroundColor: '#14A76C'}} textStyle={{fontSize: 20, color: "white"}}
          onPress={() => this.handleEvent()} isDisabled={this.state.startTime && this.state.endTime ? false : true}>
          Finish
        </Button>

      </View>
    );
  }
}

//where it just shows success message
class SuccessScreen extends React.Component {
  static navigationOptions = {
    title: 'Success'
  };

  componentDidMount() {
    this.animation.play(0, 120);
    setTimeout(()=>this.props.navigation.navigate("Home"), 2200);
  }

 render() {
   return (
     <View style={{flex: 1, alignItems: "center", position:'absolute', height: '100%', width: '100%'}}>

      <Text style={{marginTop: 40, fontSize: 70, color: "#14A76C", fontWeight: "bold"}}>Success!</Text>
      <LottieView
        source={require('./assets/success.json')}
        ref={animation => {
          this.animation = animation;
        }}
      />
    </View>
   );
 }
}


export default createStackNavigator(
  {
    Welcome: {
      screen: WelcomeScreen,
    },
    Home: {
      screen: HomeScreen,
    },
    Sport: {
      screen: ChooseSportScreen,
    },
    Location: {
      screen: ChooseLocationScreen,
    },
    EnterLocation: {
      screen: EnterLocationScreen,
    },
    Time: {
      screen: ChooseTimeScreen,
    },
    Success: {
      screen: SuccessScreen,
    },
    Map: {
      screen: MapScreen,
    },
  },
  {
    initialRouteName: 'Welcome',
    navigationOptions: {
      headerStyle: {
        backgroundColor: 'black',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  });



const styles = StyleSheet.create({
  createContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    flex: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  separator2: {
    flex: 0,
    height: 1.5,
    backgroundColor: '#8E8E8E',
  }
});
