import React from 'react';
import { StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icons from '../theme/icons';

function StoryItem({ border, borderPurple, uri, containerSize, onPress }) {
  let borderColors = border
    ? ['#00FFFF', '#17C8FF', '#329BFF', '#4C64FF', '#6536FF', '#8000FF']
    : ['#fff', '#fff'];

  borderColors = borderPurple
    ? ['#0099A2', '#0099A2']
    : borderColors;
  const size = containerSize ? containerSize : 68;

  return (
    <View>
      <LinearGradient
        colors={borderColors}
        start={{ x: 0.0, y: 1.0 }}
        end={{ x: 1.0, y: 1.0 }}
        style={[styles.gradient, { height: size, width: size }]}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.buttonContainer, { height: size - 2, width: size - 2 }]}
          // style={styles.buttonContainer}
          onPress={onPress}>
          <Image
            source={{ uri: uri }}
            style={[styles.avatar, { height: size - 10, width: size - 10 }]}
          />
        </TouchableOpacity>
      </LinearGradient>
      {!border && (
        <View style={styles.addBtn}>
          {Icons.AddStory({ height: 22, width: 22 })}
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    position: 'relative',
    marginRight: 8,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderRadius: 40,
  },
  avatar: {
    resizeMode: 'cover',
    overflow: 'hidden',
    borderRadius: 40,
  },
  addBtn: {
    position: 'absolute',
    bottom: 5,
    right: 7,
  },
});
export default StoryItem;
