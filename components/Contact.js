import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  ScrollView,Image
} from 'react-native';

import { Appbar } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { SafeAreaView } from 'react-native-safe-area-context';


import AsyncStorage from '@react-native-async-storage/async-storage';

import { WebView } from 'react-native-webview';

export default class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: true,
      name: 'NaN',
    };
  }

  async componentDidMount() {
    try {
      const sName = JSON.parse(await AsyncStorage.getItem('sName'));
      const sNameLast = JSON.parse(await AsyncStorage.getItem('sNameLast'));

      this.setState({
        name: sName + ' ' + sNameLast,
      });
      console.log('name : ', this.state.name);
    } catch (error) {
      console.log('There has problem in AsyncStorage : ' + error.message);
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Appbar.Header style={styles.ttl}>
          <TouchableOpacity
            style={{ paddingLeft: '2%' }}
            onPress={() => this.props.navigation.goBack()}>
            <AntDesign name="arrowleft" color="#05375a" size={25} />
          </TouchableOpacity>
          <Appbar.Content title="Contact The Library" />
        </Appbar.Header>

        <View style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}>
            {/* {this.state.loader && (
              <View style={styles.activityIndicatorStyle}>
                <ActivityIndicator color="#57A3FF" size="large" />
              </View>
            )} */}




            <View style={styles.mainContainer}>

              {/* ===============INFO======================= */}
              <View style={styles.uDetail}>
                <Text style={styles.uNme}>Hello</Text>
                <Text style={styles.uNme}>{this.state.name}</Text>
                <Text style={{ marginTop: 10, color: '#8A8A8A' }}>
                  Welcome to Learning Resource Center, BITSoM, Mumbai{' '}
                </Text>




                <Text style={{ marginTop: 10, color: '#8A8A8A' }}>Given below is the contact information for your library.</Text>
              </View>



              <View style={styles.info}>
                <Text style={styles.fontInfo}>Dr. Sanjay Kataria</Text>
                <Text style={styles.fontInfo}>Librarian,</Text>
                <Text style={styles.fontInfo}>BITS- School of Management,</Text>
                <Text style={styles.fontInfo}>
                  E-mail: sanjay.kataria@bitsom.edu.in
                </Text>
              </View>

              <View style={styles.addInfo}>
                <Text
                  style={{ fontSize: 17, color: '#242960', fontWeight: '700' }}>
                  ADDRESS
                </Text>

                <View>
                  <Text style={{ color: '#8A8A8A' }}>
                    8th Floor, Hiranandani Knowledge Park, Powai, Mumbai -
                    400076
                  </Text>
                </View>
              </View>

              {/* <View style={{ margin: 0 }}>
                <WebView
                  scalesPageToFit={true}
                  bounces={false}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  frameBorder="0"
                  style={{ border: 0, width: 800, height: 300 }}
                  allowFullScreen=""
                  aria-hidden="false"
                  zoomEnabled={true}
                  zoomControlEnabled={true}
                  onLoadStart={() =>
                    this.setState({
                      loader: true,
                    })
                  }
                  onLoadEnd={() =>
                    this.setState({
                      loader: false,
                    })
                  }
                  source={{
                    html: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.7161772565955!2d72.91372611421342!3d19.120103255554838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c7b4bf193655%3A0xbed2ed46d787f335!2sBITSoM%2C%20BITS%20School%20of%20Management!5e0!3m2!1sen!2sin!4v1640751914394!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>',
                  }}
                  automaticallyAdjustContentInsets={false}
                />
              </View> */}

              {/* <View style={styles.buttonMap}>
                <TouchableOpacity
                  style={styles.buttonStyle}
                  onPress={() =>
                    Linking.openURL('https://goo.gl/maps/C9wFHaEwwDAMGCaq8')
                  }>
                  <Text style={{ fontSize: 16, color: '#252a60' }}>Open Map</Text>
                </TouchableOpacity>
              </View> */}
            </View>

            
          </ScrollView>
        </View>

        <View
              style={{
                paddingHorizontal: 5,
                paddingVertical: 8,
                // marginTop: '37%',
                // position: "absolute",
                // left: "30%",
                // bottom: 0
              }}>
              <TouchableOpacity
                onPress={() => Linking.openURL('https://libcon.in/')}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>Powered by</Text>
                <Text style={{ color: '#f68823' }}> LIBCON</Text>
              </TouchableOpacity>
            </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  ttl: {
    backgroundColor: '#ffffff',
  },
  mainContainer: {
    marginTop: '5%',
    marginLeft: '5%',
    marginRight: '5%',
  },
  fontInfo: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: '1%',
  },
  activityIndicatorStyle: {
    flex: 1,
    position: 'absolute',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 'auto',
    left: 0,
    right: 0,
    top: '-10%',
    bottom: 0,
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    zIndex: 3,
  },
  addInfo: {
    marginTop: '5%',
    marginBottom: '2%',
  },
  buttonMap: {
    marginTop: 10,
    padding: 5,
    paddingHorizontal: 0,
    marginLeft: '70%',
    marginBottom: '10%',
  },
  buttonStyle: {
    padding: 5,
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 50,
    borderColor: '#f68d2c',
  },

  uDetail: {
    // marginTop: 10,
    marginBottom: 20,
  },
  uNme: {
    fontSize: 25,
  },
});
