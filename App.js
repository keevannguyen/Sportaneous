import React, { Component } from 'react';
import { StyleSheet, StatusBar, View, Text, TouchableOpacity, ListView, AsyncStorage, TextInput } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Button from 'apsl-react-native-button'

//Where it shows the NAME and the ICON of our web app.
class WelcomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {

    return (
      <View style={styles.container}>
        <Button light>
            <Text>Click Me!</Text>
        </Button>
        <Text>Sportaneous</Text>
        <Text>Spontaneous Sport Matches</Text>
      </View>
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
      <View style={styles.container}>
        <Text>Sportaneous</Text>
        <Text>Spontaneous Sport Matches</Text>
      </View>
    );
  }
}

//Where user can create event
//choose sports type, location, start time, when it will expire
//also, user can go back HomeScreen, cancel, and submit an event
class ChooseSportScreen extends React.Component {
  static navigationOptions = {
    title: "Choose a sport"
  };

  handleSport(sport) {
    AsyncStorage.setItem('event', JSON.stringify({
      sport: sport
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
          renderRow={(rowData)=>(
            <TouchableOpacity onPress={()=>{ this.handleSport(rowData); }}>
              <View style={{padding: 20, flex: 1, alignItems: "center"}}>
                  <Text style={{fontSize: 20}}>{rowData}</Text>
              </View>
            </TouchableOpacity>
          )}
          dataSource={dataSource.cloneWithRows(["Basketball", "Soccer", "Baseball", "Frisbee", "Rugby"])}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
        />
      </View>
    );
  }
}

class ChooseLocationScreen extends React.Component {
  static navigationOptions = {
    title: "Choose a Location"
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
      <View>
        <Button style={{backgroundColor: 'blue'}} textStyle={{fontSize: 18}} onPress={()=> this.handleCurrentLocation()}>
          Current location
        </Button>
        <Button style={{backgroundColor: 'red'}} textStyle={{fontSize: 18}} onPress={() => this.props.navigation.navigate("EnterLocation")}>
          Choose other location
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
      <View>
        <TextInput
          placeholder="Steet"
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(street) => this.setState({street})}
        value={this.state.street}
        />
        <TextInput
          placeholder="City"
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(city) => this.setState({city})}
        value={this.state.city}
        />
        <TextInput
          placeholder="State"
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(state) => this.setState({state})}
        value={this.state.state}
        />
        <Button style={{backgroundColor: 'red'}} textStyle={{fontSize: 18}} onPress={() => this.handleLocation()}>
          Next
        </Button>
      </View>
    );
  }
}

class ChooseTimeScreen extends React.Component {
  static navigationOptions = {
    title: "Time"
  };

  render() {
    return (
      <Text>Text1</Text>
    );
  }
}

//where it just shows success message
class SuccessScreen extends React.Component {
  static navigationOptions = {
    title: 'Su'
  };
 render() {
   return (
     <Container>
       <Button rounded dark>
            <Text>Back</Text>
       </Button>
     </Container>
   );
 }
}

//Where a user can view events on a map
class ViewScreen extends React.Component {
  static navigationOptions = {
    title: 'View Screen'
  };
 render() {
   return (
     <View style={styles.container}>
       <Text>Sportaneous</Text>
       <Text>Spontaneous Sport Matches</Text>
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
    View: {
      screen: ViewScreen,
    },
  },
  {
    initialRouteName: 'Sport',
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
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  }
});
