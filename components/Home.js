import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  BackHandler,
  Alert,
  Linking,
  Image,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
  TextInput,
} from 'react-native';

import {Appbar} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient'
import * as Animatable from 'react-native-animatable';

import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {API_SLIDER} from '@env';
import config from '../config';

import Carousel from 'react-native-snap-carousel';
const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

import RadioGroup from 'react-native-radio-buttons-group';
import StarRating from 'react-native-star-rating';
// import RNExitApp from 'react-native-exit-app';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userGoogleInfo: {},
      name: '',
      email: '',
      id: '',
      loader: false,
      sliderData: [],
      showSlider: false,

      eventData: [],
      showEvents: false,
      showFeedBack: true,
      checked: false,
      showFeedData: false,
      feedData: [],
      newFeedData: [],
      showRate: false,
      starCount: 3,
      selectingData: [],

      radioButtons: [],
      data: [],
      description: '',
      showResponse: true,
      hideFeedBack: true,
    };
  }
  async componentDidMount() {
    try {
      const email = JSON.parse(await AsyncStorage.getItem('email'));
      const userId = JSON.parse(await AsyncStorage.getItem('userId'));
      const sName = JSON.parse(await AsyncStorage.getItem('sName'));
      const sNameLast = JSON.parse(await AsyncStorage.getItem('sNameLast'));

      this.setState({
        name: sName + ' ' + sNameLast,
        id: userId,
        email: email,
      });

      console.log('email : ', this.state.email);
    } catch (error) {
      console.log('There has problem in AsyncStorage : ' + errro.message);
    }

    this.getSliderData();
    this.getQuote();
    this.getEventDetails();
    this.getFeedQnA();
  }

  getEventDetails() {
    // console.log('hello');
    fetch(`https://bitsomapi.libcon.in/api/getEvent`, {
      method: 'GET',
      headers: {
        Accepts: 'application/json',
        'content-type': 'application/json',
      },
    })
      .then(result => {
        result.json().then(resp => {
          // console.log('resp event details :- ', resp);
          if (resp.status === 'success') {
            this.setState({
              eventData: resp.data,
              showEvents: true,
            });
          } else {
            this.setState({
              showEvents: false,
            });
          }
        });
      })
      .catch(error => {
        console.log(error.message);
        this.setState({
          showEvents: false,
        });
      });
  }

  getEvent(item) {
    this.props.navigation.navigate('EventDetails', {eventDetails: item});
  }

  showFeed() {
    this.setState({showFeedBack: true});
    console.log('show feed');
  }

  HideFeed() {
    this.setState({showFeedBack: false});
    console.log('hide feed');
  }

  getFeedQnA() {
    fetch(`https://bitsomapi.libcon.in/api/getQuestions`, {
      method: 'GET',
      headers: {
        Accepts: 'application/json',
        'content-type': 'application/json',
      },
    })
      .then(result => {
        result.json().then(resp => {
          // console.log('resp FeedBack details :- ', resp.data[0].heading);
          if (resp.status === 'success') {
            let FormatData = [];
            // const nwdatamcq = resp.data.map((item, i) => {
            //   if (item.mcq != null) {
            //     this.state.crmcq = item.mcq

            //     let Temp = item.mcq

            //     for (let i = 0; i < Temp.length; i++) {
            //       FormatData.push({
            //         id: Temp[i].id,
            //         questionId: Temp[i].questionId,
            //         answer: Temp[i].answer,
            //         active: Temp[i].active,
            //         checked: false
            //       })
            //     }
            //   }
            // })

            this.setState({
              fdtitle:resp.data[0].heading,
              // data: FormatData,
              feedData: resp.data,
              // mcqData: nwdatamcq,
              showFeedData: true,
            });

            var keys = this.state.feedData.map(t => t.type);

            var id = this.state.feedData.map(t => t.id);
            var type = this.state.feedData.map(t => t.type);
            var heading = this.state.feedData.map(t => t.heading);
            var question = this.state.feedData.map(t => t.question);
            var validFrom = this.state.feedData.map(t => t.validFrom);
            var validUpto = this.state.feedData.map(t => t.validUpto);
            var active = this.state.feedData.map(t => t.active);
            var mcq = this.state.feedData.map(t => t.mcq);

            let Selected = [];

            for (let i = 0; i < keys.length; i++) {
              Selected.push({
                id: id[i],
                type: type[i],
                heading: heading[i],
                question: question[i],
                validFrom: validFrom[i],
                validUpto: validUpto[i],
                active: active[i],
                mcq: mcq[i],
                star: 0,
              });
            }

            // alert(Selected);
            // console.log('total rate :- ', Selected);

            this.setState({
              startData: Selected,
              newFeedData: Selected,
            });

            // console.log('star :- ', this.state.startData);

            // console.log('nwdatamcq :- ', this.state.data);
          } else {
            this.setState({
              showFeedData: false,
            });
          }
        });
      })
      .catch(error => {
        console.log(error.message);
        this.setState({
          showFeedData: false,
        });
      });
  }

  onPressRadioButton(item, i) {
    // console.log(item[0].questionId, i)

    let postFeed = this.state.radioButtons;

    item.map((item, i) => {
      if (item.selected === true) {
        let strng = {
          questionId: item.questionId,
          user: this.state.email,
          answer: item.answer,
          show: item.active,
        };

        postFeed.push(strng);
      }
    });

    let newData = [
      ...new Map(postFeed.map(item => [item.questionId, item])).values(),
    ];
    console.log(newData);
    this.setState({
      radioButtons: newData,
    });
  }

  onStarRatingPress(rating, item, i) {
    console.log(rating, item, i);

    let postFeed = this.state.radioButtons;

    let strng = {
      questionId: item.questionId,
      user: this.state.email,
      answer: rating,
      show: item.active,
    };

    postFeed.push(strng);

    let newData = [
      ...new Map(postFeed.map(item => [item.questionId, item])).values(),
    ];
    console.log('new Data array :- ', newData);
    this.setState({
      radioButtons: newData,
    });

    const {newFeedData} = this.state;

    const newCompanies = [...newFeedData];
    newCompanies[item.starLenght].star = rating;
    this.setState({newFeedData: newCompanies});
    console.log('input :- ', newCompanies);
  }

  descrip(des, item) {
    console.log(des, item);

    let postFeed = this.state.radioButtons;

    let strng = {
      questionId: item.questionId,
      user: this.state.email,
      answer: des,
      show: item.active,
    };

    postFeed.push(strng);

    let newData = [
      ...new Map(postFeed.map(item => [item.questionId, item])).values(),
    ];
    console.log(newData);
    this.setState({
      radioButtons: newData,
      description: des,
    });
  }

  postFeedBack() {
    const {radioButtons} = this.state;

    console.log(radioButtons.length);

    if (radioButtons.length != 0) {
      fetch(`https://bitsomapi.libcon.in/api/feedback`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(radioButtons),
      })
        .then(result => {
          result.json().then(resp => {
            console.log('Feedback Response resp  :- ', resp);

            if (resp.status === 'success') {
              // this.setState({
              //   eventData: resp.data,
              //   showEvents: true,
              // })

              this.setState({
                showFeedBack: false,
                showResponse: false,
              });

              setTimeout(() => {
                this.setState({
                  hideFeedBack: false,
                });
              }, 3000);
            } else {
              // this.setState({
              //   showEvents: false,
              // })
            }
          });
        })
        .catch(error => {
          alert(error.message);
          Alert.alert(
            'Error!',
            'Something went wrong. Please try again.',
            [{text: 'Okay'}],
            {cancelable: true},
          );
          // this.setState({
          //   showEvents: false,
          // })
        });
    } else {
      Alert.alert(
        '',
        'Please select the atlest one option...',
        [{text: 'Okay'}],
        {cancelable: true},
      );
    }
  }

  getQuote() {
    fetch(`https://zenquotes.io/api/random`, {
      method: 'GET',
      headers: {
        Accepts: 'application/json',
        'content-type': 'application/json',
      },
    })
      .then(result => {
        result.json().then(resp => {
          console.log('Quote of the day :- ', resp[0].q);

          if (resp.length > 0) {
            this.setState({
              Quote: resp[0].q,
              showQuote: true,
            });
          } else {
            this.setState({
              showQuote: false,
            });
          }
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({
          showSlider: false,
        });
      });
  }

  getSliderData() {
    fetch(`${config.API_SLIDER}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(result => {
        result.json().then(resp => {
          if (resp.status === 'success') {
            this.setState({
              sliderData: resp.data,
              showSlider: true,
            });
            // console.log('data :- ', this.state.sliderData);
          } else {
            this.setState({
              showSlider: false,
            });
          }
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({
          showSlider: false,
        });
      });
  }

  _renderItem = ({item, index}) => {
    {
      if (item.photo === 'https://bitsomapi.libcon.in/Images/NoPhoto.png') {
        this.state.showImage = false;
      } else {
        this.state.showImage = true;
      }
    }

    return (
      <React.Fragment key={index}>
        <TouchableOpacity
          style={{borderRadius: 8, marginBottom: '10%'}}
          onPress={() => this.getBiblionumber(item)}>
          <View
            style={[
              {
                marginTop: '5%',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottomRightRadius: 8,
                borderBottomLeftRadius: 8,
              },
            ]}>
            <View
              style={{
                borderRadius: 8,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 5,
              }}>
              <Image
                style={{
                  display: this.state.showImage ? 'flex' : 'none',
                  width: 150,
                  height: 200,
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
                source={{uri: item.photo}}
              />

              {!this.state.showImage ? (
                <View
                  style={{
                    height: 200,
                    backgroundColor: '#fff',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 5,
                  }}>
                  <Text style={{padding: 5}}>{item.item.title}</Text>
                  <Text
                    style={{paddingTop: 2, paddingLeft: 5, paddingBottom: 5}}>
                    {item.item.author}
                  </Text>
                </View>
              ) : null}

              <View
                style={{
                  backgroundColor: '#fff',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 2,
                  textAlign: 'center',
                }}>
                <Text style={{padding: 5}}>{item.title}</Text>
                <Text style={{paddingTop: 2, paddingLeft: 5, paddingBottom: 5}}>
                  {item.author}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </React.Fragment>
    );
  };

  async getBiblionumber(item) {
    console.log(item.biblionumber);

    if (item.biblionumber.length !== 0) {
      await AsyncStorage.setItem('opacNext', JSON.stringify(item.biblionumber));
      await AsyncStorage.setItem('opacNextAuthor', JSON.stringify(item.title));
      const da = JSON.parse(await AsyncStorage.getItem('opacNext'));
      const opacNextAutho = JSON.parse(
        await AsyncStorage.getItem('opacNextAuthor'),
      );
      console.log('data : ', da, opacNextAutho);
      // console.log('mail', this.props.route.params.da);
      this.props.navigation.push('OpacNext');
    } else {
      console.log('no data');
    }
  }

  backButton() {
    BackHandler.addEventListener(
      'hardwareBackPress',

      this.disableBackButton(),
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      // RNExitApp.exitApp()
      this.disableBackButton(),
    );
  }

  disableBackButton() {
    BackHandler.exitApp();
    // Alert.alert('Exit From App', 'Do you want to exit from app ?', [
    //   {text: 'Yes', onPress: () =>  BackHandler.exitApp()},
    //   {text: 'No', onPress: () => console.warn('No Pressed')},
    // ]);
    return true;
  }

  logOut() {
    BackHandler.removeEventListener('hardwareBackPress', this.disableBack());
  }

  disableBack() {
    Alert.alert(
      'Log out from App',
      'Do you want to log out from app ?',
      [
        {text: 'Yes', onPress: () => this.clearToken()},
        {text: 'No', onPress: () => console.warn('No Pressed')},
      ],
      {cancelable: true},
    );
    return true;
  }

  async clearToken() {
    await AsyncStorage.clear();
    BackHandler.exitApp();
    // RNExitApp.exitApp();
  }

  render() {
    return (
      <SafeAreaView style={{backgroundColor: '#ffffff', flex: 1}}>
        <StatusBar backgroundColor="#FF5733" barStyle="dark-content" />
        <ImageBackground
          source={require('./image/template_1.png')}
          resizeMode="cover"
          style={{
            flex: 1,
            justifyContent: 'center',
          }}>
          <View style={styles.container}>
            <>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{marginBottom: '10%'}}>
                  <View style={styles.uDetail}>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={[styles.uNme, {width: '70%', color: '#fff'}]}>
                        Hello
                      </Text>

                      <TouchableOpacity
                        onPress={() => this.logOut()}
                        style={{
                          justifyContent: 'center',
                          flex: 1,
                          alignItems: 'center',
                          borderRadius: 5,
                        }}>
                        <View style={{flexDirection: 'row', marginLeft: 10}}>
                          <Text
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                              color: '#fff',
                            }}>
                            Logout
                          </Text>
                          <MaterialIcons
                            name="logout"
                            color="red"
                            size={15}
                            style={{marginLeft: 5, marginTop: 3}}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.uNme}>{this.state.name}</Text>
                    <Text style={{marginTop: 10, color: '#FAFAFA'}}>
                      Welcome to Learning Resource Center, BITSoM, Mumbai{' '}
                    </Text>
                  </View>

                  {/* ---------PROFILE */}
                  <View style={{flexDirection: 'row'}}>
                    <View
                      style={ {width: '31%', marginTop: 10}}>
                      <TouchableOpacity
                      style={styles.bxShoadow}
                        onPress={() => this.props.navigation.push('Profile')}>
                        <LinearGradient
                          colors={['#F3F3F3', '#F3F3F3']}
                          style={styles.commonGradient}>
                          <View style={{padding: 10}}>
                            <View
                              style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 10,
                              }}>
                              <Feather name="user" color="#fe8c00" size={28} />
                            </View>

                            <View
                              style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 18,
                                marginBottom: 20,
                              }}>
                              <Text style={{color: '#717171'}}>
                                Your Profile
                              </Text>
                            </View>
                          </View>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>

                    {/*  ---------------------------ACCOUNT------------------------------ */}
                    <View style={{width: '31%', marginLeft: 10, marginTop: 10}}>
                      <TouchableOpacity
                        style={styles.bxShoadow}
                        onPress={() =>
                          this.props.navigation.navigate('Accountss')
                        }>
                        <LinearGradient
                          colors={['#F3F3F3', '#F3F3F3']}
                          style={styles.commonGradient}>
                          <View style={{padding: 10}}>
                            <View
                              style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 10,
                              }}>
                              <Feather name="lock" color="#fe8c00" size={28} />
                            </View>

                            <View
                              style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingTop: 10,
                                paddingBottom: 8,
                              }}>
                              <Text style={{color: '#717171'}}>Your </Text>
                              <Text style={{color: '#717171'}}> Account</Text>
                            </View>
                          </View>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>

                    {/* -----------------ABOUT--------------------------- */}
                    <View
                      style={{width: '31%', marginLeft: 10, marginTop: 10}}>
                      <TouchableOpacity
                      style={styles.bxShoadow}
                        onPress={() => this.props.navigation.push('About')}>
                        <LinearGradient
                          colors={['#F3F3F3', '#F3F3F3']}
                          style={styles.commonGradient}>
                          <View style={{padding: 10}}>
                            <View
                              style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 10,
                              }}>
                              <AntDesign
                                name="infocirlceo"
                                color="#fe8c00"
                                size={28}
                              />
                            </View>

                            <View
                              style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingTop: 10,
                                paddingBottom: 10,
                              }}>
                              <Text style={{color: '#717171'}}>
                                {' '}
                                More About{' '}
                              </Text>
                              <Text style={{color: '#717171'}}>
                                {' '}
                                The Library
                              </Text>
                            </View>
                          </View>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* -----------------CHECKOUT------------------------------ */}

                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <View
                      style={ {width: '31%', marginTop: 10}}>
                      <TouchableOpacity
                      style={styles.bxShoadow}
                        onPress={() => this.props.navigation.push('Opac')}>
                        <LinearGradient
                          colors={['#F3F3F3', '#F3F3F3']}
                          style={styles.commonGradient}>
                          <View style={{padding: 10}}>
                            <View
                              style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 10,
                              }}>
                              <AntDesign
                                name="search1"
                                color="#fe8c00"
                                size={28}
                              />
                            </View>

                            <View
                              style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 15,
                                marginBottom: 10,
                              }}>
                              <Text style={{color: '#717171'}}>
                                Search Book
                              </Text>

                              <Text style={{color: '#717171'}}>(OPAC)</Text>
                            </View>
                          </View>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>

                    {/*  ---------------------------ACCOUNT------------------------------ */}
                    <View style={{width: '31%', marginLeft: 10, marginTop: 10}}>
                      <TouchableOpacity
                        style={styles.bxShoadow}
                        onPress={() => this.props.navigation.push('Eresource')}>
                        <LinearGradient
                          colors={['#F3F3F3', '#F3F3F3']}
                          style={styles.commonGradient}>
                          <View style={{padding: 10}}>
                            <View
                              style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 10,
                              }}>
                              <AntDesign
                                name="book"
                                color="#fe8c00"
                                size={28}
                              />
                            </View>

                            <View
                              style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingTop: 20,
                                paddingBottom: 22,
                              }}>
                              <Text style={{color: '#717171'}}>
                                E-Resources{' '}
                              </Text>
                            </View>
                          </View>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>

                    {/* -----------------Search Book (OPAC)--------------------------- */}
                    <View
                      style={{width: '31%', marginLeft: 10, marginTop: 10}}>
                      <TouchableOpacity
                      style={styles.bxShoadow}
                        onPress={() => this.props.navigation.push('Contact')}>
                        <LinearGradient
                          colors={['#F3F3F3', '#F3F3F3']}
                          style={styles.commonGradient}>
                          <View style={{padding: 10}}>
                            <View
                              style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 10,
                              }}>
                              <AntDesign
                                name="contacts"
                                color="#fe8c00"
                                size={28}
                              />
                            </View>

                            <View
                              style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingTop: 14,
                                paddingBottom: 10,
                              }}>
                              <Text style={{color: '#717171'}}>Contact </Text>
                              <Text style={{color: '#717171'}}>
                                The Library
                              </Text>
                            </View>
                          </View>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* ------------------------------SLIDER----------------------------------------------------- */}

                  <View style={{marginBottom: '5%', marginTop: '8%'}}>
                    {this.state.showSlider ? (
                      <>
                        <View
                          style={{
                            borderBottomWidth: 1,
                            borderBottomColor: '#fff',
                            marginBottom: '6%',
                          }}></View>

                        <View>
                          <Text>Latest books in your library.</Text>
                        </View>

                        <View style={{marginTop: '8%', marginBottom: '3%'}}>
                          <Carousel
                            layout={'default'}
                            layoutCardOffset={18}
                            ref={c => {
                              this._carousel = c;
                            }}
                            data={this.state.sliderData}
                            renderItem={this._renderItem}
                            sliderWidth={viewportWidth}
                            itemWidth={150}
                          />
                        </View>
                      </>
                    ) : (
                      <View style={styles.activityIndicatorStyle}>
                        <ActivityIndicator color="#57A3FF" size="large" />
                      </View>
                    )}

                    {/* --------------------ALL-EVENTS------------------------------- */}
                    {this.state.showEvents && (
                      <View style={{marginBottom: '10%'}}>
                        <View
                          style={{
                            borderBottomWidth: 1,
                            borderBottomColor: '#fff',
                          }}></View>

                        <View style={{marginBottom: '5%', marginTop: '10%'}}>
                          <Text>Latest Events.</Text>
                        </View>

                        <View style={styles.secondContainer}>
                          {this.state.eventData.map((item, i) => {
                            // console.log('item image :- ', item.image);
                            return (
                              <React.Fragment key={i}>
                                <TouchableOpacity
                                  onPress={() => this.getEvent(item)}>
                                  <LinearGradient
                                    colors={['#fce5e5', '#f5ddde']}
                                    style={[
                                      {
                                        marginTop: '3%',
                                        marginBottom: '3%',
                                        borderRadius: 8,
                                        padding: 8,
                                      },
                                    ]}>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                      }}>
                                      <View
                                        style={{
                                          width: '70%',
                                          justifyContent: 'center',
                                        }}>
                                        <Text
                                          style={[
                                            {
                                              color: '#3860cc',
                                              marginLeft: 20,
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                            },
                                          ]}>
                                          {item.eventName}
                                        </Text>
                                      </View>

                                      <View style={{marginRight: 20}}>
                                        <Image
                                          style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: 50,
                                          }}
                                          source={{
                                            uri:
                                              item.image !== ''
                                                ? item.image
                                                : undefined,
                                          }}
                                          // source={{uri: item.image}}
                                        />
                                      </View>
                                    </View>
                                  </LinearGradient>
                                </TouchableOpacity>
                              </React.Fragment>
                            );
                          })}
                        </View>
                      </View>
                    )}

                    {/* --------------------FeedBack------------------------------- */}
                    {/* {this.state.showEvents && ( */}

                    {this.state.showFeedData ? (
                      <>
                        {this.state.hideFeedBack ? (
                          <View style={{marginBottom: '10%'}}>
                            <View
                              style={{
                                borderBottomWidth: 1,
                                borderBottomColor: '#fff',
                                marginBottom: '10%',
                              }}></View>

                            {/* <View
                              style={{marginBottom: '5%', marginTop: '10%'}}>
                              <Text>Feedback.</Text>
                            </View> */}

                            <View style={[styles.secondContainer,{alignItems:"flex-start"}]}>
                              <>
                                {this.state.showResponse ? (
                                  <View
                                    style={{
                                      width:"100%"
                                      // flexDirection: 'row',
                                      // justifyContent: 'space-between',
                                    }}>
                                    {/* <View style={{justifyContent: 'center'}}>
                                      <Text
                                        style={[
                                          {
                                            marginLeft: 10,
                                            alignItems: 'center',
                                            fontSize: 18,
                                          },
                                        ]}>
                                        Feedback
                                      </Text>
                                    </View> */}

                                    <View style={styles.fdTitle}>
                                      <Text style={styles.txtfd}>
                                        {this.state.fdtitle}
                                      </Text>
                                    </View>

                                    {/* {this.state.showFeedBack ? (
                                      <TouchableOpacity
                                        style={styles.rightIcon}
                                        onPress={() => this.HideFeed()}>
                                        <Feather
                                          name="chevron-up"
                                          color="#5ec6e9"
                                          size={25}
                                          style={[styles.rightM]}
                                        />
                                      </TouchableOpacity>
                                    ) : (
                                      <TouchableOpacity
                                        style={styles.rightIcon}
                                        onPress={() => this.showFeed()}>
                                        <Feather
                                          name="chevron-down"
                                          color="#3860cc"
                                          size={25}
                                          style={[styles.rightM]}
                                        />
                                      </TouchableOpacity>
                                    )} */}
                                  </View>
                                ) : (
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      padding: '5%',
                                    }}>
                                    <Animatable.Text
                                      animation={'rubberBand'}
                                      style={{
                                        fontWeight: 'bold',
                                        marginRight: '4%',
                                        justifyContent: 'center',
                                        alignContent: 'center',
                                        alignItems: 'center',
                                        marginTop: '1%',
                                        fontSize: 16,
                                      }}>
                                      Thank Your For Your Feedbak.
                                    </Animatable.Text>
                                    <Animatable.View
                                      style={styles.successIcon}
                                      animation={'bounceIn'}>
                                      <Feather
                                        name="check-circle"
                                        color="green"
                                        size={28}
                                      />
                                    </Animatable.View>
                                  </View>
                                )}
                              </>

                              {this.state.showFeedBack ? (
                                <View
                                  style={{
                                    width:"100%",
                                    marginTop: '5%',
                                    marginBottom: '5%',
                                    padding: 5,
                                  }}>
                                  {this.state.newFeedData.map((item, i) => {
                                    // { console.log("item.mcq 1 :- ", item.type) }
                                    this.state.typ = item.type;
                                    this.state.showRate = true;

                                    if (item.type === 'RATE') {
                                      this.state.showRate = true;
                                      this.state.showGEN = false;
                                      this.state.showMcq = false;

                                      // console.log("Rate :- ", item.type,this.state.showRate)
                                    } else if (item.type === 'GEN') {
                                      this.state.showGEN = true;
                                      this.state.showRate = false;
                                      this.state.showMcq = false;
                                      // console.log("General ", item.type)
                                    } else {
                                      this.state.showGEN = false;
                                      this.state.showRate = false;
                                      this.state.showOption = true;
                                      this.state.showMcq = true;
                                      // console.log("this.state.showGEN :- ", this.state.showGEN, this.state.showRate)
                                    }

                                    if (item.mcq != null) {
                                      if (item.mcq.length > 0) {
                                        this.state.newMcqData = item.mcq;

                                        this.state.showMcqAnswer = true;

                                        this.state.showOption = true;
                                      }
                                    } else {
                                      this.state.showMcqAnswer = true;
                                      this.state.newMcqData = [
                                        {
                                          answer: 'item.mcq',
                                          questionId: item.id,
                                          active: item.active,
                                          star: item.star,
                                          starLenght: i,
                                          heading: item.heading,
                                        },
                                      ];
                                    }
                                    return (
                                      <React.Fragment key={i}>
                                        <View style={{flexDirection: 'row'}}>
                                          {/* <Text style={{paddingLeft: '2%'}}>
                                            {i + 1}.
                                          </Text> */}
                                          <Text
                                            style={{
                                              paddingRight: '5%',
                                              textAlign: 'left',
                                              marginTop:"5%"
                                            }}>
                                    
                                            {item.question}
                                          </Text>
                                        </View>

                                        <View style={{flexDirection: 'row',borderBottomWidth:1,paddingBottom:"5%",borderBottomColor:"#E2E2E2"}}>
                                          {this.state.showMcq ? (
                                            <View
                                              style={{
                                                // width: '10%',
                                                marginTop: '5%',
                                                // marginLeft: '1%',
                                              }}>
                                              <RadioGroup
                                                radioButtons={
                                                  this.state.newMcqData
                                                }
                                                onPress={(
                                                  radioButtonsArray,
                                                  i,
                                                ) =>
                                                  this.onPressRadioButton(
                                                    radioButtonsArray,
                                                    i,
                                                  )
                                                }
                                              />
                                            </View>
                                          ) : null}

                                          {this.state.showMcqAnswer && (
                                            <View style={{marginTop: '7%'}}>
                                              {this.state.newMcqData.map(
                                                (item, i) => {
                                                  // { console.log("item.answer 3 :- ", item) }
                                                  // this.state.showOption = true
                                                  {
                                                    if (
                                                      item.answer === 'item.mcq'
                                                    ) {
                                                      // if (this.state.typ === "Rate") {
                                                      //   this.state.showRate = true;
                                                      //   this.state.showGEN = false;
                                                      //   console.log("Rate :- ", this.state.typ)
                                                      // } else if (this.state.typ === "GEN") {
                                                      //   this.state.showGEN = true;
                                                      //   this.state.showRate = false;
                                                      //   console.log("General ", this.state.typ)
                                                      // }  else if (this.state.typ === "Rate") {
                                                      //   this.state.showRate = true;
                                                      //   this.state.showGEN = false;
                                                      //   console.log("Rate :- ", this.state.typ)
                                                      // }else {
                                                      //   this.state.showGEN = false;
                                                      //   this.state.showRate = false;
                                                      //   this.state.showOption = true
                                                      //   // console.log("this.state.showGEN :- ", this.state.showGEN, this.state.showRate)
                                                      // }
                                                      this.state.showOption = true;
                                                    } else {
                                                      // console.log(this.state.typ)
                                                      this.state.showOption = false;
                                                    }
                                                  }
                                                  return (
                                                    <React.Fragment key={i}>
                                                      <View style={{flexDirection: 'row',}}>
                                                        {!this.state
                                                          .showOption ? (
                                                          <>
                                                            <View  style={{ marginRight:'2%',marginLeft:'2%',marginBottom:
                                                                  18,width:"90%"}}>
                                                              <Text
                                                                style={[styles.title]}>
                                                                {item.answer}
                                                              </Text>
                                                            </View>
                                                          </>
                                                        ) : (
                                                          <>
                                                            <>
                                                              {this.state
                                                                .showGEN && (
                                                                <View
                                                                  style={[
                                                                    styles.textAreaContainer,
                                                                    {
                                                                      height: 150,
                                                                    },
                                                                  ]}>
                                                                  <TextInput
                                                                    style={
                                                                      styles.textArea
                                                                    }
                                                                    underlineColorAndroid="transparent"
                                                                    placeholder="Description..."
                                                                    placeholderTextColor="grey"
                                                                    // numberOfLines={10}
                                                                    multiline={
                                                                      true
                                                                    }
                                                                    value={
                                                                      this.state
                                                                        .description
                                                                    }
                                                                    onChangeText={des =>
                                                                      this.descrip(
                                                                        des,
                                                                        item,
                                                                      )
                                                                    }
                                                                  />
                                                                </View>
                                                              )}
                                                            </>

                                                            <>
                                                              {this.state
                                                                .showRate ? (
                                                                <View
                                                                  style={[
                                                                    styles.textAreaContainer,
                                                                    {
                                                                      borderWidth: 0,
                                                                    },
                                                                  ]}>
                                                                  <StarRating
                                                                    disabled={
                                                                      false
                                                                    }
                                                                    maxStars={5}
                                                                    rating={
                                                                      item.star
                                                                    }
                                                                    selectedStar={rating =>
                                                                      this.onStarRatingPress(
                                                                        rating,
                                                                        item,
                                                                        i,
                                                                      )
                                                                    }
                                                                    fullStarColor={
                                                                      '#FFC300'
                                                                    }
                                                                  />
                                                                </View>
                                                              ) : null}
                                                            </>
                                                          </>
                                                        )}
                                                      </View>
                                                    </React.Fragment>
                                                  );
                                                },
                                              )}
                                            </View>
                                          )}
                                        </View>
                                      </React.Fragment>
                                    );
                                  })}

                                  <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => this.postFeedBack()}>
                                    <LinearGradient
                                      colors={['#f68823', '#b03024']}
                                      style={styles.signIn}>
                                      <Text
                                        style={[
                                          styles.textSign,
                                          {
                                            color: '#fff',
                                          },
                                        ]}>
                                        Submit
                                      </Text>
                                    </LinearGradient>
                                  </TouchableOpacity>
                                </View>
                              ) : null}
                            </View>
                          </View>
                        ) : null}
                      </>
                    ) : null}

                    {/* )} */}

                    {/* ------------------Quote----------------------------- */}

                    {this.state.showQuote ? (
                      <View style={{marginBottom: '20%'}}>
                        <View
                          style={{
                            borderBottomWidth: 1,
                            borderBottomColor: '#fff',
                          }}></View>

                        <View style={{marginBottom: '5%', marginTop: '10%'}}>
                          <Text>Quote of the Day.</Text>
                        </View>

                        <View style={styles.secondContainer}>
                          <Text style={{fontSize: 20}}>{this.state.Quote}</Text>
                        </View>
                      </View>
                    ) : null}
                  </View>
                </View>

                <View
                  style={{
                    paddingTop: 2,
                    paddingBottom: 5,
                    // marginTop:"20%",
                    // position: "absolute",
                    // top:"99%",
                    // backgroundColor: "#fff",
                    width: '100%',
                  }}>
                  <TouchableOpacity
                    onPress={() => Linking.openURL('https://libcon.in/')}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{color: '#fff'}}>Powered by</Text>
                    <Text style={{color: 'red'}}> LIBCON</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  ttl: {
    backgroundColor: '#fff',
  },
  container: {
    marginLeft: '5%',
    marginRight: '5%',
  },
  uDetail: {
    marginTop: 10,
    marginBottom: 10,
  },
  bxShoadow: {
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  uNme: {
    fontSize: 30,
    color: '#fff',
  },
  button: {
    alignItems: 'center',
    marginTop: 13,
  },
  commonGradient: {
    width: '100%',
    justifyContent: 'center',
    borderRadius: 10,
  },
  textCommon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconC: {
    marginTop: 4,
    marginRight: 10,
    marginLeft: 20,
  },
  rightIcon: {
    justifyContent: 'center',
    marginTop: 4,
    flex: 1,
  },
  rightM: {
    textAlign: 'right',
    marginRight: 20,
  },
  scrollView: {
    flexGrow: 1,
    flex: 1,
  },
  activityIndicatorStyle: {
    flex: 1,
    // position: 'absolute',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '20%',
    marginTop: '20%',
    // left: 0,
    // right: 0,
    // top: 0,
    // bottom: 0,
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },

  secondContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    // borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },

  textAreaContainer: {
    marginLeft: '5%',
    paddingRight: '2%',
    borderColor: '#D8D8D8',
    borderWidth: 1,
    padding: 5,
    width: '90%',
    borderRadius: 5,
    marginBottom: '5%',
  },
  textArea: {
    // height: 150,
    paddingBottom: '10%',
    justifyContent: 'flex-start',
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

  fdTitle: {
    // justifyContent: 'center',
    width:"100%",
    marginTop: '5%',
    borderBottomWidth: 1,
    paddingBottom: '3%',
    borderColor: '#E2E2E2',
  },
  txtfd: {textTransform: 'capitalize', fontSize: 18,width:"100%"},
  title:{
    // width:"90%"
  }
});
