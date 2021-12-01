import React, { useState } from 'react'
import { View, TouchableOpacity, Dimensions } from 'react-native'

import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import {
  LineChart,
} from 'react-native-chart-kit'
import ResponsiveText from './layout/ResponsiveText'
import Colors from '../theme/colors'
import { data } from "./DummyData/dummyData";


const chartConfig = {
  backgroundColor: 'white',
  backgroundGradientFrom: '#FAFAFA',
  backgroundGradientTo: '#FAFAFA',
  decimalPlaces: 1, // optional, defaults to 2dp
  color: (opacity = 1) => 'rgba(0, 153, 162, 5)',
  labelColor: (opacity = 1) => 'rgba(0, 0, 0, 1)',
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: 'white',
  },
}

const Graph = (props) => {
  const [graphData, setGraphData] = useState(data[3].data)
  const [indexValue, setIndexValue] = useState(0)

  console.log('GraphData', graphData)

  const DotContent = ({ x, y, index }) => {
    const max = Math.max(...data[indexValue].data)

    console.log('>>>', data[indexValue].data[index] === max)

    console.log()
    return (
      <View
        style={{
          borderRadius: 8,
          height: 16,
          width: 16,
          backgroundColor: 'white',
          position: 'absolute',
          top: y - 8, // <--- relevant to height / width (
          left: x - 8, // <--- width / 2
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={{
          height: 10, width: 10, borderRadius: 5, borderColor: '#14C764', borderWidth: 2, backgroundColor: data[indexValue].data[index] === max ? '#14C764' : 'white',
        }}
        />
      </View>
    )
  }

  const FilterFunc = (i, ind) => {
    const temp = data.findIndex((item) => {
      return item.name === i.name
    })
    setIndexValue(ind)
    setGraphData(data[temp].data)
  }

  return (
    <View style={styles.mainView}>
      <View style={styles.dayz}>
        {data.map((item, index) => {
          return (
            <TouchableOpacity onPress={() => FilterFunc(item, index)}>
              <ResponsiveText style={{ color: Colors.Primary, fontWeight: 'bold' }}>{item.name}</ResponsiveText>
            </TouchableOpacity>
          )
        })}
      </View>
      <LineChart
        data={{
          labels: ['January', 'February', 'March', 'April', 'May', 'June'],
          datasets: [
            {
              data: graphData,
            },
          ],
        }}
        width={Dimensions.get('window').width} // from react-native
        height={220}
        // yLabelsOffset={wp(-80)}
        withInnerLines={false}
        withOuterLines={false}
        yAxisLabel="$"
        yAxisSuffix="k"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={chartConfig}
        style={{
          marginVertical: 5,
          borderRadius: 16,
          marginLeft: -40,
        }}

        renderDotContent={DotContent}
        yLabelsOffset={wp(-83)}
      />
    </View>
  )
}

const styles = {
  mainView: {
    marginVertical: wp(5),
  },
  dayz: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: wp(17),
    marginBottom: wp(2),
    paddingLeft: wp(10),
  },
}

export default Graph
