import React from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Platform,
  Image,
  ImageBackground,
} from 'react-native';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';
const {width: screenWidth} = Dimensions.get('window');
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import ResponsiveText from './layout/ResponsiveText';

const cardsData = [
  {
    type: 'MastersCard',
    icon: require('../assets/icons/masterIcon.png'),
    cardBG: require('../assets/images/MasterCardBG.png'),
    expDate: '12/20',
  },
  {
    type: 'Visa Card',
    icon: require('../assets/icons/visaIcon.png'),
    cardBG: require('../assets/images/MasterCardBG.png'),
    expDate: '12/20',
  },
];

function MyCarousel(props) {
  const _renderItem = ({item, index}, parallaxProps) => {
    return (
      <View style={styles.item}>
        <ImageBackground
          resizeMode="cover"
          source={item.cardBG}
          style={styles.imageBG}>
          <ParallaxImage
            source={{
              uri: 'https://thumbs.gfycat.com/DishonestNastyIbex-poster.jpg',
            }}
            containerStyle={styles.imageContainer}
            style={styles.image}
            parallaxFactor={0.4}
            {...parallaxProps}
          />
          <View style={styles.cardContainer}>
            <Image source={item.icon} style={{resizeMode: 'cover'}} />
            <ResponsiveText style={styles.typeText}>{item.type}</ResponsiveText>
            <View style={{height: 80}} />
            <ResponsiveText style={styles.expDateHeading}>
              Exp Date
            </ResponsiveText>
            <ResponsiveText style={styles.expDate}>
              {item.expDate}
            </ResponsiveText>
          </View>
        </ImageBackground>
      </View>
    );
  };

  return (
    <Carousel
      sliderWidth={screenWidth}
      sliderHeight={screenWidth}
      itemWidth={screenWidth - 60}
      data={cardsData}
      renderItem={_renderItem}
      hasParallaxImages={true}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    width: screenWidth - 60,
    height: screenWidth - 60,
    marginVertical: 10,
    marginBottom: 20,
  },
  imageBG: {
    width: screenWidth - 60,
    height: screenWidth - 50,
    padding: 15,
    overflow: 'hidden',
    elevation: 1,
  },
  cardContainer: {
    flex: 1,
    paddingTop: 20,
    borderRadius: 50,
  },
  typeText: {
    fontSize: 7,
    color: '#615F6C',
  },
  expDateHeading: {
    fontSize: 5,
    color: '#615F6C',
    opacity: 0.5,
  },
  expDate: {
    fontSize: 5,
    color: '#000',
    opacity: 0.5,
    fontWeight: 'bold',
  },
});

export default MyCarousel;
