import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { geoEqualEarth, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

import Svg, { Circle, Defs, G, Path, Pattern, Rect } from 'react-native-svg';

import countries from '../mock/countries50m.json';
import ResponsiveText from './layout/ResponsiveText';
const COUNTRIES = feature(countries, countries.objects.countries).features;

const genrateColor = (red, green, blue, opacity) => {
  return `rgba(${red}, ${green}, ${blue},${opacity} )`;
};

const countriesDynamic = [
  {
    name: 'USA',
    coordinates: [-74.0059, 40.7128],
    markerColor: {
      red: 25,
      green: 32,
      blue: 0,
      opacity: 1,
    },
    percentage: '15',
  },
  {
    name: 'Sweden',
    coordinates: [60.1282, 18.6435],
    markerColor: {
      red: 10,
      green: 112,
      blue: 252,
      opacity: 0.4,
    },
    percentage: '25',
  },
  {
    name: 'Canada',
    coordinates: [56.1304, 106.3468],
    markerColor: {
      red: 255,
      green: 52,
      blue: 199,
      opacity: 0.4,
    },

    percentage: '55',
  },
];

const projection = geoEqualEarth()
  .scale(160)
  .translate([800 / 2, 450 / 2]);

const WorldMap = (props) => {
  const [geographies, setGeographies] = useState(COUNTRIES);
  const [showData, setShowData] = useState(false);
  const [domData, setDomData] = useState([]);
  useEffect(() => {
    console.log('props??....................', props.domination)
    // console.log('props???', props?.domination[1]?.latLng[0]?.lat)
    setDomData(props?.domination)

    if (props?.domination.length) {
      setShowData(true)
    }
  }, [])

  const handleCountryClick = (countryIndex) => {
    //  console.log('Clicked on country: ', geographies[countryIndex]);
  };

  const handleMarkerClick = (i) => {
    // console.log('Marker: ', countriesDynamic[i]);
  };

  return (
    <View
      style={{
        flex: 1,
        // backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: wp(10),
        marginTop: wp(-5)
      }}>
      {showData ?
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {/* <Svg width={400} height={wp(75)} viewBox="0 0 800 450">
          <G>
            {geographies.map((d, i) => (
              <React.Fragment key={`gird-${i}`}>
                <Path
                  key={`path-${i}`}
                  d={geoPath().projection(projection)(d)}
                  // fill={`rgba(38,50,56,${(1 / geographies.length) * i})`}
                  fill="#e0dfe4"
                  strokeDasharray="1"
                  strokeWidth={2}
                  onPress={() => handleCountryClick(i)}
                />
                <Defs>
                  <Pattern
                    id="smallGrid"
                    width="8"
                    height="8"
                    patternUnits="userSpaceOnUse">
                    <Path
                      d="M 8 0 L 0 0 0 8"
                      fill="none"
                      stroke="white"
                      stroke-width="0.5"
                    />
                  </Pattern>
                  <Pattern
                    id="grid"
                    width="80"
                    height="80"
                    patternUnits="userSpaceOnUse">
                    <Rect width="80" height="80" fill="url(#smallGrid)" />
                  </Pattern>
                </Defs>

                <Rect width="100%" height="100%" fill="url(#grid)" />
                <Path
                  stroke-dasharray="5,5"
                  fill="transparent"
                  d={geoPath().projection(projection)(d)}
                />
              </React.Fragment>
            ))}
          </G>
          <G>
            {countriesDynamic.map((city, i) => (
              <React.Fragment key={`group-${i}`}>
                <Circle
                  key={`marker-${i}`}
                  cx={projection(city.coordinates)[0]}
                  cy={projection(city.coordinates)[1]}
                  r={city.percentage / 3}
                  fill={genrateColor(
                    city.markerColor.red,
                    city.markerColor.green,
                    city.markerColor.blue,
                    1,
                  )}
                  strokeWidth={city.percentage}
                />
                <Circle
                  key={`marker-Layer-${i}`}
                  cx={projection(city.coordinates)[0]}
                  cy={projection(city.coordinates)[1]}
                  r={city.percentage}
                  fill={genrateColor(
                    city.markerColor.red,
                    city.markerColor.green,
                    city.markerColor.blue,
                    0.5,
                  )}
                  stroke={genrateColor(
                    city.markerColor.red,
                    city.markerColor.green,
                    city.markerColor.blue,
                    0.2,
                  )}
                  strokeWidth={city.percentage * 1.2}
                />
              </React.Fragment>
            ))}
          </G>
        </Svg> */}
          {/* :TODO: */}
          {domData.length &&
            <Svg width={400} height={wp(75)} viewBox="0 0 800 450">
              <G>
                {geographies.map((d, i) => (
                  <React.Fragment key={`gird-${i}`}>
                    <Path
                      key={`path-${i}`}
                      d={geoPath().projection(projection)(d)}
                      // fill={`rgba(38,50,56,${(1 / geographies.length) * i})`}
                      fill="#e0dfe4"
                      strokeDasharray="1"
                      strokeWidth={2}
                      onPress={() => handleCountryClick(i)}
                    />
                    <Defs>
                      <Pattern
                        id="smallGrid"
                        width="8"
                        height="8"
                        patternUnits="userSpaceOnUse">
                        <Path
                          d="M 8 0 L 0 0 0 8"
                          fill="none"
                          stroke="white"
                          stroke-width="0.5"
                        />
                      </Pattern>
                      <Pattern
                        id="grid"
                        width="80"
                        height="80"
                        patternUnits="userSpaceOnUse">
                        <Rect width="80" height="80" fill="url(#smallGrid)" />
                      </Pattern>
                    </Defs>

                    <Rect width="100%" height="100%" fill="url(#grid)" />
                    <Path
                      stroke-dasharray="5,5"
                      fill="transparent"
                      d={geoPath().projection(projection)(d)}
                    />
                  </React.Fragment>
                ))}
              </G>
              <G>
                {domData.map((city, i) => {
                  console.log('city....', projection([city?.latLng[0]?.lng, city?.latLng[0]?.lat])[0], projection([city?.latLng[0]?.lat, city?.latLng[0]?.lng])[0])
                  // console.log('city....', projection([city?.latLng[0]?.lat, city?.latLng[0]?.lng])[0])
                  // console.log('count....', city.count)
                  // console.log('count....1:::',(city.coordinates))
                  // console.log('count....2::', projection(city.coordinates)[1])
                  return (
                    <React.Fragment key={`group-${i}`}>
                      <Circle
                        key={`marker-${i}`}
                        cx={projection([city?.latLng[0]?.lat, city?.latLng[0]?.lng])[0]}
                        cy={projection([city?.latLng[0]?.lat, city?.latLng[0]?.lng])[1]}
                        // cx={projection(city.coordinates)[0]}
                        // cy={projection(city.coordinates)[1]}
                        r={city.count}
                        fill={genrateColor(
                          25,
                          32,
                          0,
                          1,
                        )}
                        strokeWidth={city.count}
                      />
                      {/* <Circle
                    key={`marker-Layer-${i}`}
                    cx={projection(city.coordinates)[0]}
                    cy={projection(city.coordinates)[1]}
                    r={city.percentage}
                    fill={genrateColor(
                      city.markerColor.red,
                      city.markerColor.green,
                      city.markerColor.blue,
                      0.5,
                    )}
                    stroke={genrateColor(
                      city.markerColor.red,
                      city.markerColor.green,
                      city.markerColor.blue,
                      0.2,
                    )}
                    strokeWidth={city.percentage * 1.2}
                  /> */}
                    </React.Fragment>
                  )
                })}
              </G>
            </Svg>}



          <View style={{ flexDirection: 'row' }}>
            {/* {countriesDynamic.map((city, i) => (
            <View
              key={`countriesDynamic-${i}`}
              style={{ marginHorizontal: 10, width: 90 }}>
              <View
                key={`countriesDynamic-${i}`}
                style={{
                  height: 5,
                  width: '20%',
                  backgroundColor: genrateColor(
                    city.markerColor.red,
                    city.markerColor.green,
                    city.markerColor.blue,
                    1,
                  ),
                }}></View>
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text>{city.name}</Text>
                <Text>{city.percentage}%</Text>
              </View>
            </View>
          ))} */}

            {domData.length &&
              <>
                {domData.map((item) => (
                  <View
                    // key={`countriesDynamic-${item._id}`}
                    style={{ marginHorizontal: 10, width: 90 }}>
                    <View
                      key={`countriesDynamic-${item._id}`}
                      style={{
                        height: 5,
                        width: '20%',
                        backgroundColor: "#" + Math.floor(Math.random() * 16777215).toString(16),



                      }}></View>
                    <View
                      style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text>{item._id}</Text>
                      <Text>{item.count / props.totalDomination * 100}%</Text>
                    </View>
                  </View>
                ))}
              </>
            }
          </View>
        </View>
        :
        <ResponsiveText>Loading</ResponsiveText>}</View >
  );
};

export default WorldMap;
