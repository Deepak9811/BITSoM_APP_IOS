import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Platform,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  ToastAndroid,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient'
import * as Animatable from 'react-native-animatable';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Picker as SelectPicker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';


import BcryptReactNative from 'react-native-bcrypt';
// import {API_URL} from "@env"
import config from '../config';

export default class LogInNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      pass: '',
      purposeValue: '',
      purposeIndexValue: '',
      terminalData: [],
      check_textInputChange: false,
      secureTextEntry: true,
      loader: false,
      showPage: false,
      userData: '',
    };
  }

  textInputchange(val) {
    if (val.length !== 0) {
      this.setState({
        email: val,
        check_textInputChange: true,
      });
    } else {
      this.setState({
        email: val,
        check_textInputChange: false,
      });
    }
  }

  handlePasswordChange(val) {
    this.setState({
      password: val,
    });
  }

  updateSecureTextEntry() {
    this.setState({
      secureTextEntry: false,
    });
  }

  async componentDidMount() {

    const email = JSON.parse(await AsyncStorage.getItem('email'));
    console.log("email : ", email)
    if (email !== null) {
      this.props.navigation.navigate('Home');
    } else {
      this.setState({
        showPage: true,
      });
    }


  }

  onPickerValueChange = (value, index, label) => {
    this.setState(
      {
        purposeValue: value,
        // purposeName: this.state.terminalData[index].p_name,
      },

    );
  };

  check() {
    if (
      this.state.email === '' ||
      this.state.pass === ''
    ) {
      console.log(this.state.pass);
      Alert.alert('', 'Please enter your account details to login.');
    } else if (
      this.state.email !== '' &&
      this.state.pass !== ''
    ) {
      console.log(this.state.pass);
      this.signIn();
    } else {
      Alert.alert('', 'Please enter your correct account details to login.');
    }
  }

  signIn() {
    this.setState({ loader: true });
    // console.log(this.state.email, this.state.pass, this.state.purposeValue);

    fetch(
      `${config.API_URL}LIBCON-PATINFO&parameter=${this.state.email}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
        },
      },
    )
      .then(result => {
        result.json().then(async resp => {
          console.log("resp : ", resp.data.response[0]);
          if(resp.status === "success"){
            if (resp.length !== 0) {
              try {
                await AsyncStorage.setItem('userId', JSON.stringify(resp.data.response[0][0]));
                await AsyncStorage.setItem('sName', JSON.stringify(resp.data.response[0][2]));
                await AsyncStorage.setItem('sNameLast', JSON.stringify(resp.data.response[0][3]));
  
              } catch (error) {
                console.log("try : ", error)
              }
  
              const sname = resp.data.response[0][4];
              // console.log('resp : ', sname);
  
              if (this.state.email === sname) {
  
                try {
                  const salt = await BcryptReactNative.genSaltSync(10);
                  console.log(salt)
                  const hash = (salt, resp.data.response[0][5]);
                  console.log(hash)
                  const isSame = await BcryptReactNative.compareSync(
                    this.state.pass,
                    hash,
                  );
  
                  if (isSame === true) {
  
                    await AsyncStorage.setItem('email', JSON.stringify(resp.data.response[0][4]));
  
                    this.setState({
                      userData: resp.data.response[0],
                    });
  
                    this.props.navigation.push('Home');
  
                  } else {
                    Alert.alert("", "Please enter your correct account details to login.", [
                      { text: 'Okay' }
                    ], { cancelable: true })
                    this.setState({
                      loader: false,
                    });
                  }
  
                  this.setState({
                    loader: false,
                  });
                } catch (e) {
                  console.log({ e });
                }
              } else {
                Alert.alert('', 'Please enter your correct account details to login.');
                this.setState({
                  loader: false,
                });
              }
            } 
          }else {
            this.setState({
              loader: false,
            });
            ToastAndroid.show(
              'Please enter your correct account details to login.',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
            );
          }
          
        });
      })
      .catch(error => {
        ToastAndroid.show(
          resp.message,
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
        this.setState({
          loader: false,
        });
        console.log(
          'There has been a problem with your fetch operation: ' +
          error.message,
        );
      });

    // setTimeout(() => {
    //   console.log(this.state.userData.length);
    //   if (this.state.userData.length > 0) {
    //     console.log('null');
    //   } else {
    //     ToastAndroid.showWithGravity(
    //       'ERROR: API Not Reachable. There seemed to be an error while reaching the server, please try again some time later.',
    //       ToastAndroid.LONG,
    //       ToastAndroid.CENTER,
    //     );
    //     this.setState({
    //       loader: false,
    //     });
    //   }
    // }, 9000);
  }

  render() {
    return (
      <>
        {this.state.showPage ? (
          <View
            
            style={styles.container}>
            <StatusBar backgroundColor="#fff9" barStyle="dark-content" />

            <View
              style={{
                justifyContent: 'center',
                flex: 1,
                alignItems: 'center',
                marginTop: '10%',
              }}>
              <Image source={require('./image/bitsom.png')} />
            </View>


            {this.state.loader ? (
              <>
                <View
                  style={{
                    height: '100%',
                    width: '100%',
                    position: 'absolute',
                    elevation: 3,
                    backgroundColor: 'rgba(0,0,0,0.2)',
                  }}></View>
                <View
                  style={{
                    flex: 1,
                    width: '100%',
                    position: 'absolute',
                    elevation: 3,
                    top: '50%',
                    justifyContent: 'center',
                  }}>
                  <ActivityIndicator size="large" color="#0d6efd" />
                </View>
              </>
            ) : null}

            <Animatable.View style={[styles.footer]} animation="fadeInUpBig" duration={1000} >
              <ScrollView showsVerticalScrollIndicator={false}>

                <View>
                  {/* --------Email-------------------- */}

                  <View>
                    <Text style={[styles.text_footer, { marginTop: 20 }]}>
                      {' '}
                      Email{' '}
                    </Text>
                    <View style={styles.action}>
                      <FontAwesome name="user-o" color="#05375a" size={20} />

                      <TextInput
                        returnKeyType="next"
                        placeholder="Your Email"
                        style={styles.textInput}
                        value={this.state.email}
                        onChangeText={val => {
                          this.textInputchange(val);
                          this.setState({
                            email: val,
                          });
                        }}
                      />
                      {this.state.check_textInputChange ? (
                        <Animatable.View animation="bounceIn">
                          <Feather
                            name="check-circle"
                            color="green"
                            size={20}
                          />
                        </Animatable.View>
                      ) : null}
                    </View>
                  </View>

                  {/* ------------Password------------- */}
                  <Text style={[styles.text_footer, { marginTop: 20 }]}>
                    {' '}
                    Password{' '}
                  </Text>
                  <View style={styles.action}>
                    <Feather name="lock" color="#05375a" size={20} />

                    <TextInput
                      secureTextEntry={
                        this.state.secureTextEntry ? true : false
                      }
                      returnKeyType="next"
                      placeholder="Your Password"
                      style={styles.textInput}
                      value={this.state.pass}
                      onChangeText={val => {
                        this.handlePasswordChange(val);
                        this.setState({
                          pass: val,
                        });
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => this.updateSecureTextEntry()}>
                      {this.state.secureTextEntry ? (
                        <Feather name="eye-off" color="grey" size={20} />
                      ) : (
                        <TouchableOpacity
                          onPress={() =>
                            this.setState({
                              secureTextEntry: true,
                            })
                          }>
                          <Feather name="eye" color="green" size={20} />
                        </TouchableOpacity>
                      )}
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.check()}>
                    <LinearGradient
                    // colors={['rgba(0,0,0,0.8)', 'transparent']}
                    colors={['#f68823', '#b03024']}
                      // colors={['#f68823', '#b03024']}
                      style={styles.signIn}>
                      <Text
                        style={[
                          styles.textSign,
                          {
                            color: '#fff',
                          },
                        ]}>
                        Sign In
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <View
                    style={{
                      paddingHorizontal: 5,
                      paddingVertical: 15,
                      marginTop: '25%',
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
                </View>
              </ScrollView>
            </Animatable.View>
          </View>
        ) : null}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomColor: '#f68823',
    paddingBottom: 5,
    borderBottomWidth: 1,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  button: {
    alignItems: 'center',
    marginTop: 30,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
