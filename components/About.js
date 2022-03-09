import React, { Component } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ActivityIndicator, ToastAndroid, Text, ScrollView
} from 'react-native';

import { WebView } from 'react-native-webview';

import { Appbar } from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient'
// import * as Animatable from 'react-native-animatable';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: true,
      dataAbout: []
    };
  }


  async componentDidMount() {
    try {
      const libraryID = JSON.parse(await AsyncStorage.getItem('libraryID'));
      const token = JSON.parse(await AsyncStorage.getItem('libraryToken'));

      this.setState({
        libraryCode: libraryID,
        token: token,
      })

      this.getContent()

    } catch (error) {
      console.log(error.message)
    }
  }

  getContent() {

    console.log(this.state.libraryCode, " :- ", this.state.token)

    fetch(`https://bitsomapi.libcon.in/api/getContent`, {
      method: "GET",
      headers: {
        Accepts: "application/json",
        "content-type": "application/json",
      }
    }).then((result) => {
      result.json().then((resp) => {
        console.log("response :- ", resp)

        if (resp.status === 'success') {
          this.setState({
            dataAbout: resp.data,
            loader: false
          })
        } else {
          this.setState({
            loader: false
          })
          ToastAndroid.show(
            resp.message,
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
          );
        }
      })
    }).catch(error => {
      console.log('There has been a problem with your fetch operation: ' + error.message)
      this.setState({
        loader: false
      })
    })
  }

  async getDetailsAbout(item) {
    console.log(item.id, item.heading, item.imageUrl)
    try {
      await AsyncStorage.setItem("headingAbout", JSON.stringify(item.heading))
      await AsyncStorage.setItem("imageUrlAbout", JSON.stringify(item.imageUrl))
      await AsyncStorage.setItem("bodyText", JSON.stringify(item.bodyText))
      const headingAbout = JSON.parse(await AsyncStorage.getItem("headingAbout"))
      const imageUrlAbout = JSON.parse(await AsyncStorage.getItem("imageUrlAbout"))
      const bodyText = JSON.parse(await AsyncStorage.getItem("bodyText"))
      if (headingAbout != null && imageUrlAbout != null && bodyText != null) {
        console.log(imageUrlAbout)
        this.props.navigation.navigate("AboutNext")
      } else {
        console.log("Something wents wrong.")
      }
    } catch (error) {
      console.log(error)

    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Appbar.Header style={styles.ttl}>
          <TouchableOpacity
            style={{ paddingLeft: '2%' }}
            onPress={() => this.props.navigation.goBack()}>
            <AntDesign name="arrowleft" color="#05375a" size={25} />
          </TouchableOpacity>
          <Appbar.Content title="More About The Library" />
        </Appbar.Header>

        <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>

          <View style={{ justifyContent: "center", alignItems: "center", marginTop: "5%",marginBottom:"12%" }}>
            {this.state.dataAbout.map((item, i) => {
              return (
                <React.Fragment key={i}>
                  {/* <Text>{item.heading}</Text> */}


                  <TouchableOpacity style={styles.button} onPress={() => this.getDetailsAbout(item)}>
                    <LinearGradient
                      colors={['#fff', '#fff']}
                      style={styles.commonGradient}>
                      <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>

                        <View >
                          <Text style={[styles.textCommon, { color: '#e1495e' }]}>
                            {item.heading}
                          </Text>
                        </View>

                        <View style={styles.rightIcon}>
                          <Feather
                            name="chevron-right"
                            color="#e1495e"
                            size={20}
                            style={styles.rightM}
                          />
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>


                </React.Fragment>
              )
            })}
          </View>
        </ScrollView>


        {this.state.loader && (
          <View style={styles.activityIndicatorStyle}>
            <ActivityIndicator color="#57A3FF" size="large" />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor:"#fff"
  },
  activityIndicatorStyle: {
    flex: 1,
    position: 'absolute',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 'auto',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    // elevation: 3,
  },
  ttl: {
    backgroundColor: '#fff',
  },
  button: {
    alignItems: 'center',
    marginTop: "5%",
    width: "90%",
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1
  },
  commonGradient: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    borderRadius: 10,
  },
  textCommon: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: "15%"
  },
  rightIcon: {
    marginTop: 4,
    marginRight: "5%"
  },
});
