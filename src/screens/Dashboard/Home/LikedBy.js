import React, { useRef, useState, useEffect } from 'react';
import { View, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import Container from '../../../components/layout/Container';
import AppHeader from '../../../components/layout/AppHeader';
import Like from '../../../components/Like';
import { connect } from 'react-redux';
import axios from "axios"
import ResponsiveText from '../../../components/layout/ResponsiveText';



function LikedBy(props) {

  const [noDataFound, setNoDataFound] = useState(false)
  const [loader, setLoader] = useState(true)
  const [myLikes, setMyLikes] = useState([]);



  useEffect(() => {
    getMyLikes(props?.route?.params)
  }, []);


  const getMyLikes = (_props) => {
    axios.post(`${API_URL}/post/get-likes`,
      {
        post: (props?.route?.params?.post_id),
      },
      {
        headers: { 'x-auth-token': props.token }
      })
      .then(res => res.data.data)
      .then(res => {


        if (!res.likes.length) {
          setNoDataFound(true)
          setLoader(false)
        } else {
          setMyLikes(res.likes)
          setLoader(false)

          setNoDataFound(false)
        }

      })
      .catch((err) => {
        console.log('ERROR=======', err)
      });
  }


  return (
    <Container>
      <AppHeader
        title={'People who liked'}
        onLeftPress={() => props.navigation.goBack()}
      />



      {loader ? <ActivityIndicator size="small" color="#0299A1" /> : null}

      {noDataFound ?
        <View style={{ alignItems: 'center' }}>
          <ResponsiveText>No Likes</ResponsiveText>
        </View> :

        <FlatList
          data={myLikes}
          keyExtractor={item => item._id}
          renderItem={({ item }) => {
            return (
              <View >
                <Like key={item._id} item={item} />

              </View>
            )
          }} />

      }



    </Container>
  );
}




function mapStateToProps(state) {
  return {

    token: state.auth.token,

  }
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LikedBy);
