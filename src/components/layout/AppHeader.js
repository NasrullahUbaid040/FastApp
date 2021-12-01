import React from 'react'
import {
  StatusBar,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import Icons from '../../theme/icons'
import { navigationRef } from '../../navigation/navigate'
import ResponsiveText from './ResponsiveText'
import analytics from '../../assets/icons/analytics.png'
import { connect } from 'react-redux'

const AppHeader = (props) => {
  const {
    rightIcon, onRightPress, onLeftPress, title, stat, onStatClick, decisionScreenType,
  } = props
  // console.log('props.userData>>>>>>>>>>>>>>', props?.userData?._type)
  return (
    <LinearGradient
      colors={props?.userData?._type === "Artist" || props?.userData?._type === "Singer" ? ['#5DA7FE', '#3B74AD', '#18425D'] : ['#009C9F', '#008BA9', '#0075B6']}
      // colors={['#009C9F', '#008BA9', '#0075B6']}
      start={{ x: 0, y: 0 }
      }
      end={{ x: 0.8, y: 0.0 }}
      style={{ minHeight: wp('28'), width: wp('100%') }} >

      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <View
        style={[
          styles.content,
          Platform.OS === '767'
            ? { marginTop: 0 }
            : { marginTop: getStatusBarHeight() },
        ]}
      >
        {onLeftPress ? (
          <TouchableOpacity
            style={styles.sideContainer}
            activeOpacity={0.9}
            onPress={onLeftPress}
          >
            {Icons.HeaderBackArrow({ tintColor: '#FFF' })}
          </TouchableOpacity>
        ) : (
          <View style={styles.sideContainer} />
        )}
        <View style={{
          minWidth: wp('40'),
          alignItems: 'center',
        }}
        >
          {!title ? (
            <Image
              source={require('../../assets/images/header_fast.png')}
              style={{ width: wp('40'), resizeMode: 'contain' }}
            />
          ) : (<ResponsiveText style={{ color: '#fff', fontSize: 5 }}>{title}</ResponsiveText>)}
        </View>

        {stat && (
          <TouchableOpacity style={{ position: 'absolute', right: wp(8) }} onPress={onStatClick}>
            <Image source={analytics} style={{ height: wp(6), width: wp(7), tintColor: 'white' }} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.sideContainer}
          activeOpacity={0.9}
          onPress={onRightPress}
        >
          {rightIcon && rightIcon()}
        </TouchableOpacity>
      </View>
    </LinearGradient >
  )
}
const styles = StyleSheet.create({
  container: {},
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  logo: {
    height: 60,
  },
  sideContainer: {
    width: wp('10%'),
  },
})
// export default AppHeader
function mapStateToProps(state) {
  return {

    token: state.auth.token,
    userData: state.auth.user

  }
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppHeader);