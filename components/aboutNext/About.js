import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Image, ActivityIndicator, ScrollView, } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appbar } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';

import RenderHtml from 'react-native-render-html';

const source = {
    html: `
  <p style='text-align:center;color:red'>
    Hello World!
  </p>`
};

export default class About extends Component {
    constructor(props) {
        super(props)

        this.state = {
            header: '',
            image: "",
            bodyText: "",
            loader: true
        }
    }

    async componentDidMount() {
        try {
            const headingAbout = JSON.parse(await AsyncStorage.getItem("headingAbout"))
            const imageUrlAbout = JSON.parse(await AsyncStorage.getItem("imageUrlAbout"))
            const bodyText = JSON.parse(await AsyncStorage.getItem("bodyText"))

            console.log("imageUrlAbout :- ",imageUrlAbout)


            const body = bodyText.replace(/<(.|\n)*?>/g, '');

            console.log(body)

            this.setState({
                header: headingAbout,
                image: imageUrlAbout,
                // bodyText: body,
                bodyText: bodyText,

            })

            if (this.state.image !== "") {
                this.setState({
                    loader: false
                })
            }else{
                this.setState({
                    loader: false,
                    ShowImage:true
                })
            }

            console.log(this.state.image)

        } catch (error) {
            console.log(error.message)
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
                    <Appbar.Content title={this.state.header} />
                </Appbar.Header>

                {this.state.loader && (
                    <View style={styles.activityIndicatorStyle}>
                        <ActivityIndicator color="#57A3FF" size="large" />
                    </View>
                )}

                <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                    <View style={styles.body}>
                        {/* <Text style={{ fontSize: 25, fontWeight: "600", marginBottom: "6%", }}>Heading</Text> */}

                        <Image source={{ uri: this.state.image } }  resizeMode="contain" style={{ height: 250, width: 320, marginBottom: "5%",display:this.state.ShowImage ? "none": "flex" }} />
                        {/* <Text style={{}}>{this.state.bodyText}</Text> */}
                        {/* <WebView style={{  width: 800, height: "100%" }}
                            source= {{html: `${this.state.bodyText}`}} /> */}

                        <RenderHtml
                            contentWidth={{width:100}}
                            source= {{html: `${this.state.bodyText}`}}
                        />
                    </View>




                </ScrollView>



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
                  source={{html: '<p>Here I am</p>'}}
                  automaticallyAdjustContentInsets={false}
                />
              </View> */}

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    ttl: {
        backgroundColor: '#fff',
    },
    body: {
        marginLeft: "5%",
        marginRight: "5%",
        marginTop: "5%",
        marginBottom: "10%"
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
})
