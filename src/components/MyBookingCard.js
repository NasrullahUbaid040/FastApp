import React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ResponsiveText from './layout/ResponsiveText';

const dummyArray = [
  {
    date: 18,
    day: 'Today',
    titleText: 'Dream Land Studio',
    subTitleText: '2406 E 8th St,Los Angeles'
  },
  {
    date: 20,
    day: 'Sun',
    titleText: 'Next Gen Studio',
    subTitleText: '1200 N Alvarado St,New York'
  },
  {
    date: 28,
    day: 'Sat',
    titleText: 'Rex Studio',
    subTitleText: 'Los Angeles,CA 90021'
  },
  {
    date: 28,
    day: 'Sat',
    titleText: 'Rex Studio',
    subTitleText: 'Los Angeles,CA 90021'
  },
  {
    date: 28,
    day: 'Sat',
    titleText: 'Rex Studio',
    subTitleText: 'Los Angeles,CA 90021'
  },
  {
    date: 28,
    day: 'Sat',
    titleText: 'Rex Studio',
    subTitleText: 'Los Angeles,CA 90021'
  },
  {
    date: 28,
    day: 'Sat',
    titleText: 'Rex Studio',
    subTitleText: 'Los Angeles,CA 90021'
  }
]

function MyBookingCard(props) {
  return (
    <View>
      <FlatList
        keyExtractor={(item, index) => `${index}`}
        data={dummyArray}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={props.onPress}
              style={styles.container}>
              <View style={styles.left}>
                <ResponsiveText style={{ ...styles.dateText }}>{item.date}</ResponsiveText>
                <ResponsiveText style={{ ...styles.dateText }}>{item.day}</ResponsiveText>
              </View>
              <View style={{ paddingVertical: 20, paddingHorizontal: 15 }}>
                <ResponsiveText style={{ fontWeight: 'bold' }} >{item.titleText}</ResponsiveText>
                <ResponsiveText style={{ color: 'grey', fontSize: 3.5 }}>{item.subTitleText}</ResponsiveText>
              </View>
            </TouchableOpacity>
          )
        }}
      />


    </View>
  );
}


const styles = {
  container: {
    flex: 1,
    borderRadius: 5,
    flexDirection: 'row',
    marginBottom: 10,
    borderWidth: .5,
    borderColor: 'lightgrey'

  },
  left: {
    width: wp(20),
    backgroundColor: '#F3FBFA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  right: {
    padding: 8,
  },
  dateText: {
    fontWeight: 'bold',
    fontSize: 4,
    color: '#0099A2',
  },
  detailsText: {
    color: '#3C5063', fontWeight: 'bold',

  },
};
export default MyBookingCard;
