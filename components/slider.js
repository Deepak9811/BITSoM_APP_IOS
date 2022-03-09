// import React, { Component } from 'react'
// import { ActivityIndicator, StyleSheet, View, Dimensions, ScrollView, Image, FlatList, Text,ImageBackground } from 'react-native'

// import { API_SLIDER } from "@env"

// import Carousel from 'react-native-snap-carousel';
// const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

// const image = { uri: "https://reactjs.org/logo-og.png" };

// const colors = ['tomato', 'thistle', 'skyblue', 'teal'];

// export default class slider extends Component {
//     constructor(props) {
//         super(props)

//         this.state = {
//             showSlider: false,
//             sliderData: [],
//             images: [
//                 { url: "https://images.pexels.com/photos/1382734/pexels-photo-1382734.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500", name: "shakira" },
//                 { url: 'https://images.pexels.com/photos/9413/animal-cute-kitten-cat.jpg?cs=srgb&dl=adorable-animal-cat-9413.jpg&fm=jpg', name: "cat" },
//                 { url: 'https://i.pinimg.com/236x/c6/6b/11/c66b111bf4df809e87a1208f75d2788b.jpg', name: "baby" }
//             ]
//         }
//     }

//     // componentDidMount() {
//     //     this.getSliderData()
//     // }

//     // getSliderData() {
//     //     fetch(`${API_SLIDER}`, {
//     //         method: 'GET',
//     //         headers: {
//     //             Accept: 'application/json',
//     //             'Content-Type': 'application/json',
//     //         },
//     //     }).then(result => {
//     //         result.json().then(resp => {

//     //             if (resp.status === "success") {
//     //                 this.setState({
//     //                     sliderData: resp.data,
//     //                     showSlider: true
//     //                 })
//     //                 console.log("data :- ", this.state.sliderData)
//     //             } else {

//     //             }
//     //         })
//     //     }).catch(error => {
//     //         console.log(error)
//     //     })
//     // }


//     // _renderItem = ({ item, index }) => {
//     //     return (
//     //         <React.Fragment key={index}>

//     //             <View style={{ borderRadius: 8, }}>
//     //                 <View style={[{ marginTop: "5%", alignItems: "center", justifyContent: "center", backgroundColor: "#fff", borderBottomRightRadius: 8, borderBottomLeftRadius: 8 }]}>
//     //                     <View style={{
//     //                         borderRadius: 8, shadowColor: '#000',
//     //                         shadowOffset: { width: 0, height: 1 },
//     //                         shadowOpacity: 0.2,
//     //                         shadowRadius: 2,
//     //                         elevation: 5
//     //                     }}>
//     //                         <Image style={{ width: 150, height: 200, borderTopLeftRadius: 8, borderTopRightRadius: 8 }} source={{ uri: item.photo }} />
//     //                         <Text style={{ backgroundColor: "#fff", padding: 5 }}>{item.title}</Text>
//     //                         <Text style={{ backgroundColor: "#fff", paddingTop: 2, paddingLeft: 5, paddingBottom: 5 }}>{item.author}</Text>
//     //                     </View>
//     //                 </View>
//     //             </View>
//     //         </React.Fragment>
//     //     );
//     // }


//     render() {
//         return (



//             <View style={styles.container}>

//                 {/* <Carousel
//                     layout={'default'} layoutCardOffset={`18`}
//                     ref={(c) => { this._carousel = c; }}
//                     data={this.state.sliderData}
//                     renderItem={this._renderItem}
//                     sliderWidth={viewportWidth}
//                     itemWidth={155}
//                 /> */}


//                 <ImageBackground source={image} resizeMode="cover" style={styles.image}><Text style={styles.text}>Inside</Text>
//                 </ImageBackground>




//             </View>
//         )
//     }
// }

// const { width } = Dimensions.get('window');
// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: 'white', },
//     child: { justifyContent: 'center', alignItems: "center" },
//     text: { fontSize: width * 0.5, textAlign: 'center' },
// });


// import React, { useState, useEffect } from "react";
// import { ScrollView, StyleSheet, Text, View } from 'react-native';
// // import axios from "axios";
// import RNFetchBlob from 'rn-fetch-blob';

// import Posts from "./pagination/Post";
// import Pagination from "./pagination/Pagination";
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function slider() {
//     const [posts, setPosts] = useState([]);
//     const [loader, setLoading] = useState(false);
//     const [showData, setshowData] = useState(true);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [postsPerPage] = useState(5);

//     useEffect(() => {

//         const fetchPosts = async () => {
//             // setLoading(true);
//             // const res = await axios.get("https://jsonplaceholder.typicode.com/posts");
//             // console.log(res.data)
//             // setPosts(res.data);
//             // setLoading(false);

//             setLoading(true);
//             const searchqueryLocal = JSON.parse(await AsyncStorage.getItem('searchquery'));
//             const email = JSON.parse(await AsyncStorage.getItem('email'));
//             const userId = JSON.parse(await AsyncStorage.getItem('userId'));
//             const sName = JSON.parse(await AsyncStorage.getItem('sName'));
//             const sNameLast = JSON.parse(await AsyncStorage.getItem('sNameLast'));
//             const labelLocal = JSON.parse(await AsyncStorage.getItem('labelLocal'));

//             const headers = {
//                 Accept: 'application/json',
//                 'Content-Type': 'application/json',
//             };
//             const body = JSON.stringify({
//                 searchQuery: searchqueryLocal,
//                 searchField: labelLocal,
//                 startPage: 0,
//                 userEmail: email,
//             }),
//                 path = 'https://bitsomt.refread.com/webservice/pub/documents';


//             RNFetchBlob.config({
//                 trusty: true,
//             })
//                 .fetch('POST', path, headers, body)
//                 .then(resp => {
//                     // console.log(resp.data)
//                     const detail = resp.data;
//                     const prs = JSON.parse(detail);
//                     console.log("data :- ",prs.refreadDocumentList)
//                     setPosts(prs.refreadDocumentList);
//                     setLoading(false);

//                     // this.setState({
//                     //     showData: true,
//                     //     booksDetails: prs.refreadDocumentList,
//                     //     loader: false,
//                     // });

//                     if (prs.refreadDocumentList.length != 0) {
//                         console.log("helo")
//                     }
//                     console.log("check :- ", prs.refreadDocumentList.length);

//                 })
//                 .catch((error, statusCode) => {
//                     // console.log('statusCode :', statusCode);
//                     console.log(
//                         'There has been a problem with your fetch operation: ' +
//                         error.message,
//                     );
//                 });
//         };

//         fetchPosts();
//     }, []);

//     // GET CURRENT POSTS

//     const indexOfLastPost = currentPage * postsPerPage;
//     const indexOfFirstPost = indexOfLastPost - postsPerPage;
//     const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);


//     //CHANGE PAGE

//     const paginate = (pageNumber) => setCurrentPage(pageNumber)


//     return (
//         <View style={styles.container}>
//             <ScrollView>
//                 <Posts posts={currentPosts} loading={loader} />
//                 <Pagination postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate} />
//             </ScrollView>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         marginTop: "5%",
//         flex: 1
//     }
// });

