import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Alert, View } from 'react-native';
// import RNFetchBlob from 'rn-fetch-blob';

import Posts from "../pagination/Post";
import Pagination from "../pagination/Pagination";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PublicerDetails({navigation}) {
  const [posts, setPosts] = useState([]);
  const [getDetails, setgetDetails] = useState([]);
  const [loader, setLoading] = useState(false);
  const [showData, setshowData] = useState(true);
  const [showText, setshowText] = useState(true);
  const [showpage, setshowpage] = useState(false);
  const [showPagiantion, setshowPagiantion] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage,setPostsPerPage] = useState(20);

  useEffect(() => {

    const fetchPosts = async () => {
      setLoading(true);
      const searchqueryLocal = JSON.parse(await AsyncStorage.getItem('searchquery'));
      const email = JSON.parse(await AsyncStorage.getItem('email'));
      const labelLocal = JSON.parse(await AsyncStorage.getItem('labelLocal'));
      const documentList = JSON.parse(await AsyncStorage.getItem('documentList'));
     
       let path = documentList;

        fetch(path, {
            method: "POST",
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({
                searchQuery: searchqueryLocal,
                searchField: labelLocal,
                startPage: 0,
                userEmail: email,
              }),
          }).then((result) => {
            result.json().then((resp) => {
                const detail = resp;
                const prs = (detail);
      
                setPosts(prs.refreadDocumentList);
                setLoading(false);
      
                if (!prs.refreadDocumentList.length > 0) {
                  console.log("helo")
                  setshowText(false)
                }else{
                  setshowpage(true)
                }
                
                if(prs.refreadDocumentList.length <= 20 || prs.refreadDocumentList.length ===0){
                  setshowPagiantion(false)
                  console.log("check :- ", prs.refreadDocumentList);
                }
            });
          })
        //   .then(resp => {
        //   const detail = resp;
        //   const prs = (detail);

        //   setPosts(prs.refreadDocumentList);
        //   setLoading(false);

        //   if (!prs.refreadDocumentList.length > 0) {
        //     console.log("helo")
        //     setshowText(false)
        //   }else{
        //     setshowpage(true)
        //   }
          
        //   if(prs.refreadDocumentList.length <= 20 || prs.refreadDocumentList.length ===0){
        //     setshowPagiantion(false)
        //     console.log("check :- ", prs.refreadDocumentList);
        //   }

        // })
        .catch((error, statusCode) => {
          // console.log('statusCode :', statusCode);
          Alert.alert('Error', "There has been a problem with your fetch operation. Please try again.", [{ text: 'Okay' }], { cancelable: true });
          navigation.goBack()
          setLoading(false)

          console.log(
            'There has been a problem with your fetch operation: ' + error.message);
        });
    };

    fetchPosts();
  }, []);

  // GET CURRENT POSTS

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);


  //CHANGE PAGE

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const postsPerPages = (pageSize) => setPostsPerPage(pageSize)

  console.log("currentPage :- ",postsPerPage)


  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Posts posts={currentPosts} loading={loader} eText={showText} navigation={navigation} />
        {showpage && (
          <Pagination postsPerPage={postsPerPage} totalPosts={posts.length} showPages={showPagiantion} paginate={paginate} postsPerPages={postsPerPages} />
        )}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
