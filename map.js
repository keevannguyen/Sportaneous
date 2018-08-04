import React from 'react';
import {
  AsyncStorage,
  TouchableOpacity,
  StyleSheet,
  Text,
  ListView,
  Animated,
  View,
  Image,
  Dimensions,
  ScrollView,
 } from 'react-native';

import {
  MapView
} from 'expo';

import { Ionicons } from '@expo/vector-icons';

const icons = {
  basketball: require('./assets/basketball.png'),
  baseball: require('./assets/baseball.png'),
  cycling: require('./assets/cycling.png'),
  football: require('./assets/football.png'),
  frisbee: require('./assets/frisbee.png'),
  soccer: require('./assets/soccer.png'),
  tennis: require('./assets/tennis.png')
}



const {width, height } = Dimensions.get("window");
const CARD_HEIGHT = height/7;
const CARD_WIDTH = CARD_HEIGHT;


class MapScreen extends React.Component {
  static navigationOptions = {
    title: "Sportaneous Events Nearby"
  };

  constructor(props){
    super(props);
    //const ds = new ListView.DataSource({rowHasChanged: (r1,r2)=> (r1!==r2)})
    this.state = {
      lat: 0,
      long: 0,
      latDelta: 0.1,
      longDelta: 0.1,
      events: [],
      filteredEvents: null,
      sports: [{ sport: "Soccer", name: "ios-football"}, { sport: "Basketball", name: "ios-basketball"},
      { sport: "Baseball", name: "ios-baseball"}, {sport: "Tennis", name: "ios-tennisball"}, { sport: "Frisbee", name: "ios-disc"},
      { sport: "Football", name: "ios-american-football"}, { sport: "Bicycling", name: "ios-bicycle"}],
      //
      //ds.cloneWithRows([])
    }
    //this.changeSport = this.changeSport.bind(this);
  }

  componentWillMount(){
      this.index = 0;
      this.animation = new Animated.Value(0);
  }
  componentDidMount(){
    navigator.geolocation.getCurrentPosition(
        (success) => {
          //let newObj = {latitude:this.state.lat}
          //console.log(success);
          this.setState({
              lat:success.coords.latitude ,
              long: success.coords.longitude,
          })
        }
      )

      fetch("http://10.2.103.54:3000/events",{
        method: 'GET',
        credentials: 'same-origin',
      })
      .then( (response) => response.json() )
      .then((responseJson)=> {
          if(responseJson.success){
              //console.log("lat",responseJson.events[1].location.coordinates[0]);
             // console.log("long",responseJson.events[1]);
              this.setState({
                  events: responseJson.events
                  //ds.cloneWithRows(response.events);
              })
          }
      } )
      .catch((err) => console.log(err))

  }

  changeSport(sportType){
    if (sportType !== "All") {
      sportType = sportType.toLowerCase();
      let newEvents = this.state.events.filter((event)=> event.sport===sportType)
      this.setState({
          filteredEvents: newEvents
      });
    }
    else {
      this.setState({
          filteredEvents: null
      })
    }
  }

  render() {
    let markers = this.state.filteredEvents? this.state.filteredEvents: this.state.events;
    return (
      <View style={{flex: 1 }}>
        <MapView style={{flex: 7}}
         region={{
           latitude: this.state.lat,
           longitude: this.state.long,
           latitudeDelta: this.state.latDelta,
           longitudeDelta: this.state.longDelta}}
        >
         {[markers.map( (marker, index) => {
          return (
             <MapView.Marker key={index}
             coordinate={{ latitude: marker.location.coordinates[0],
                  longitude: marker.location.coordinates[1] }}
             title={marker.sport[0].toUpperCase() + marker.sport.slice(1)}
             description={new Date(marker.startTime).toLocaleString()}
             children={<Image style={{height: 30, width: 30}} source={icons[marker.sport]}></Image>}
             />
           );
        })].concat([<MapView.Marker key="user" coordinate={{latitude: this.state.lat, longitude: this.state.long}}
          children={
                  <Image style={{height: 50, width: 50}} source={require("./assets/pulsing.gif")}></Image>
                    } />])
         }
         </MapView>

         <Animated.ScrollView
            horizontal
            scrollEventThrottle={1}
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      x: this.animation,
                    },
                  },
                },
              ],
              { useNativeDriver: true }
            )}
            style={styles.scrollView}
            contentContainerStyle={styles.endPadding}
        >

        {[{sport: "All", name: "ios-aperture"}].concat(this.state.sports).map( (sport, index) => (
            <TouchableOpacity
                key={index}
                onPress={() => {this.changeSport(sport.sport) }}
            >
            <View style={styles.card} >
                <View style={styles.textContent}>
                  <Text numberOfLines={1} style={[styles.cardtitle, {textShadowColor: 'rgba(0, 0, 0, 0.75)',
                    textShadowOffset: {width: -1, height: 1},
                    textShadowRadius: 10}]}
                  >{sport.sport}</Text>
                  <Ionicons style={{fontSize: 50, marginLeft: 12}} name={sport.name}> </Ionicons>
                </View>
             </View>
          </TouchableOpacity>

        ))}

        </Animated.ScrollView>
        <Text style={{position: "absolute", marginLeft: 130, marginTop: 490, fontWeight: "bold", backgroundColor: "rgb(0,0,0,0)",
            textShadowColor: 'rgba(0, 0, 0, 0.75)',
            textShadowOffset: {width: -1, height: 1},
            textShadowRadius: 10}}>Sort By Sport</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      paddingVertical: 10,
    },
    endPadding: {
      paddingRight: 0,
    },
    card: {
      padding: 10,
      elevation: 2,
      marginHorizontal: 10,
      shadowColor: "#000",
      shadowRadius: 5,
      shadowOpacity: 0.3,
      shadowOffset: { x: 2, y: -2 },
      height: CARD_HEIGHT,
      width: CARD_WIDTH,
      overflow: "hidden",
    },
    cardImage: {
      flex: 3,
      width: "100%",
      height: "100%",
      alignSelf: "center",
    },
    textContent: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    cardtitle: {
      fontSize: 12,
      marginTop: 5,
      fontWeight: "bold",
    },
    cardDescription: {
      fontSize: 12,
      color: "#444",
    },
    markerWrap: {
      alignItems: "center",
      justifyContent: "center",
    },
    marker: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "rgba(130,4,150, 0.9)",
    },
    ring: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: "rgba(130,4,150, 0.3)",
      position: "absolute",
      borderWidth: 1,
      borderColor: "rgba(130,4,150, 0.5)",
    },
  });

export default MapScreen;
