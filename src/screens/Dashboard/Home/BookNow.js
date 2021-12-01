
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import Input from '../../../components/layout/Input';
import Colors from '../../../theme/colors';
import AppHeader from '../../../components/layout/AppHeader';
import Content from '../../../components/layout/Content';
import ResponsiveText from '../../../components/layout/ResponsiveText';
import Button from '../../../components/layout/Button';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import axios from 'axios';
import API_URL from '../../../config/constants';
import { connect } from 'react-redux';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import Icons from '../../../theme/icons'

class BookNow extends Component {

    constructor(props) {
        super(props);
        console.log('this.props..', props.route.params.studioRate)

        let startDate = moment(); // today
        let datesBlacklist = [moment().subtract(1, 'days'), moment().subtract(2, 'days')];

        // Create a week's worth of custom date styles and marked dates.
        let customDatesStyles = [];
        let markedDates = [];


        this.state = {
            selectedDate: '',
            startDate,
            datesBlacklist,
            formattedDate: '',
            formattedEndDate: '',
            title: '',
            userdate: '',
            showCalandar: true,
            showEndCalendar: true,
            tim: false,
            error: '',
            duration: '',
            budget: '',
            filterTypes: ['10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00',
                '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'],
            locationFilterTypeIdx: 0,
            locationEndFilterTypeIdx: 0,
            dateSelected: ({ [moment(new Date()).format('YYYY-MM-DD')]: { selected: true, selectedColor: '#0D8991' } }),
            dateEndSelected: ({ [moment(new Date()).format('YYYY-MM-DD')]: { selected: true, selectedColor: '#0D8991' } })

        };
    }


    onDateSelected = selectedDate => {

        console.log('selectedDate::', selectedDate, 'type:::', typeof (selectedDate))


        // this.setState({ selectedDate });
        this.setState({ formattedDate: selectedDate.toISOString() });
        // console.log('formattedDate', this.state.formattedDate, 'type', typeof (this.state.formattedDate))

    }
    onTimeSelected = (value) => {
        // console.log('value', value)
        // console.log('formattedDate.....', (this.state.formattedDate.slice(0, 5)))
    }


    onEndDateSelected = selectedDate => {

        console.log('selectedDate::', selectedDate, 'type:::', typeof (selectedDate))


        // this.setState({ selectedDate });
        this.setState({ formattedEndDate: selectedDate.toISOString() });
        // console.log('formattedDate', this.state.formattedDate, 'type', typeof (this.state.formattedDate))

    }
    onEndTimeSelected = (value) => {
        // console.log('value', value)
        // console.log('formattedDate.....', (this.state.formattedDate.slice(0, 5)))
    }


    submit = () => {
        if (!this.state.title) {
            this.setState({ error: 'Plese enter booking title.' });
        }
        else if (!this.state.formattedDate) {
            this.setState({ error: 'Please select your start date.' });
        }

        else if (!this.state.formattedEndDate) {
            this.setState({ error: 'Please select your end date.' });
        }
        else if (!this.state.duration) {
            this.setState({ error: 'Please enter duration.' });
        } else if (!this.state.budget) {
            this.setState({ error: 'Please enter budget.' });

        }
        // else if (!this.state.tim) {
        //     this.setState({ error: 'Please select your time.' });
        // }
        else {
            console.log("date:;;", this.state.formattedDate)
            this.setState({ error: '' });
            axios.post(`${API_URL}/studio/booking/sent-booking-request`, {
                "studio": this.props.route.params.studioId,
                "time": this.state.formattedDate,
                "starts_at": this.state.formattedDate,
                "ends_at": this.state.formattedEndDate,
                "text": this.state.title,
                "price": this.props.route.params.studioRate,
                // "price": this.state.budget,
                "duration": this.state.duration
            }, {
                headers: { 'x-auth-token': this.props.token }
            }).then(res => {

                this.props.navigation.navigate('Checkout')
                // Alert.alert(
                //     "Booking!",
                //     res.data.message,
                //     [
                //         { text: "OK", onPress: () => this.props.navigation.goBack() },
                //         { text: "To my bookings", onPress: () => this.props.navigation.navigate('ChatStack', { screen: 'MyBookings' }) }
                //     ]
                // );
            }).catch((err) => {
                console.log('ERROR__::', err)
            });
        }
    }


    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fdfdfd' }}>
                <AppHeader onLeftPress={() => this.props.navigation.goBack()} />
                <Content style={styles.content}>
                    <ResponsiveText style={{ color: 'grey', marginVertical: 10, fontSize: 3.5 }}>Description</ResponsiveText>

                    <Input
                        placeholder={'Write here...'}
                        inputStyle={styles.input}
                        value={this.state.title}
                        onChangeText={(e) => this.setState({ title: e })}
                    />
                    <ResponsiveText style={{ color: 'grey', marginVertical: 10, fontSize: 3.5 }}>start date & time</ResponsiveText>
                    {!this.state.showCalandar ?

                        <View style={[styles.input, { height: hp(60) }]} >
                            <TouchableOpacity style={{ alignSelf: 'flex-end', right: 10, top: hp(2), height: hp(5) }} onPress={() => {
                                this.setState({ tim: false })
                                this.setState({ showCalandar: !this.state.showCalandar })
                            }}
                            >
                                {Icons.UpArrow()}
                            </TouchableOpacity>

                            {/* monthly calandar */}
                            <Calendar
                                markingType={'period'}
                                markedDates={this.state.dateSelected}
                                onDayPress={(day) => {
                                    this.setState({ dateSelected: { [day.dateString]: { selected: true, selectedColor: '#0D8991' } } })
                                    // console.log('dateSelected========>', this.state.dateSelected, "..")
                                    let a = Object.keys(this.state.dateSelected)
                                    let b = JSON.stringify(a[0])
                                    let time = 'T00:00:00.000Z'
                                    let newVal = a + time


                                    let val = moment(newVal).format()
                                    console.log("date n time:::: ", a + time.toString())
                                    this.setState({ formattedDate: a + time.toString() })

                                }}
                                // minDate={"2021/08/26"}
                                minDate={moment().add(1, 'd').format('L')}
                                enableSwipeMonths={true}
                                theme={{
                                    backgroundColor: 'red',
                                    // calendarBackground: '#ffffff',
                                    selectedDayTextColor: '#0D8991',
                                    selectedColor: '#0D8991',
                                    todayTextColor: 'black',
                                    dayTextColor: 'black',
                                }}
                            />

                        </View>

                        :

                        <View style={[styles.input, { height: hp(20), }]} >
                            <TouchableOpacity style={{ alignSelf: 'flex-end', right: 10, top: hp(2), height: hp(5) }} onPress={() => this.setState({ showCalandar: !this.state.showCalandar })}>
                                {Icons.DropArrow()}
                            </TouchableOpacity>

                            <CalendarStrip
                                calendarAnimation={{ type: 'sequence', duration: 10 }}
                                daySelectionAnimation={{ type: 'border', duration: 200, borderWidth: 1, borderHighlightColor: '#0099A2', backgroundColor: '#0099A2' }}
                                style={{ height: hp(15), marginTop: 10 }}
                                calendarHeaderStyle={{ color: 'black' }}
                                minDate={moment().add(3, 'days')}
                                // maxDate={moment().add(15, 'days')}
                                scrollable={true}
                                datesBlacklist={this.state.datesBlacklist}
                                onDateSelected={this.onDateSelected}
                                dateNumberStyle={{ color: 'black', backgroundColor: '#F6F8F9', borderRadius: 100, height: 25, width: 25, textAlignVertical: 'center' }}
                                dateNameStyle={{ color: 'grey' }}
                                highlightDateNumberStyle={{ color: 'white' }}
                                highlightDateNameStyle={{ color: 'white' }}
                                highlightDateContainerStyle={{ backgroundColor: '#0D8991' }}
                                disabledDateNameStyle={{ color: 'grey' }}
                                disabledDateNumberStyle={{ color: 'grey' }}
                                iconContainer={{ flex: 0.1 }}
                            />
                        </View>}



                    <View style={[styles.input, { marginTop: 10 }]}>
                        <ScrollView contentContainerStyle={styles.filterContainer} horizontal showsHorizontalScrollIndicator={false}>

                            {this.state.filterTypes.map((item, idx) => {
                                return (
                                    <TouchableOpacity
                                        key={idx}
                                        onPress={() => {
                                            this.setState({ tim: true })
                                            this.setState({ locationFilterTypeIdx: idx })
                                            console.log('time:', this.state.filterTypes[idx])
                                            this.setState({ userdate: this.state.filterTypes[idx] })






                                            let splitArray = this.state.formattedDate.split("T")
                                            let zone = this.state.formattedDate.split(".")
                                            console.log(`zone==>`, zone[1])
                                            console.log('value...>', splitArray[0] + "T" + this.state.filterTypes[idx] + "." + zone[1])
                                            this.setState({ formattedDate: splitArray[0] + "T" + this.state.filterTypes[idx] + "." + zone[1] })

                                        }}
                                        style={[
                                            styles.filterItem,
                                            idx === this.state.locationFilterTypeIdx
                                                ? styles.filterTypeActive
                                                : null,
                                        ]}
                                    >
                                        <ResponsiveText
                                            style={[
                                                styles.filterText,
                                                idx === this.state.locationFilterTypeIdx ? { color: '#FFF' } : null,
                                            ]}
                                        >
                                            {item}
                                        </ResponsiveText>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    </View>



                    {/* ............................................................ second calender ............................................................*/}
                    <>
                        <ResponsiveText style={{ color: 'grey', marginVertical: 10, fontSize: 3.5 }}>End date & time</ResponsiveText>
                        {!this.state.showEndCalendar ?

                            <View style={[styles.input, { height: hp(60) }]} >
                                <TouchableOpacity style={{ alignSelf: 'flex-end', right: 10, top: hp(2), height: hp(5) }} onPress={() => {
                                    this.setState({ tim: false })
                                    this.setState({ showEndCalendar: !this.state.showEndCalendar })
                                }}
                                >
                                    {Icons.UpArrow()}
                                </TouchableOpacity>

                                <Calendar
                                    markingType={'period'}
                                    markedDates={this.state.dateEndSelected}
                                    onDayPress={(day) => {
                                        this.setState({ dateEndSelected: { [day.dateString]: { selected: true, selectedColor: '#0D8991' } } })
                                        console.log('dateSelected========>', this.state.dateEndSelected)
                                        let a = Object.keys(this.state.dateEndSelected)
                                        let b = JSON.stringify(a[0])
                                        let time = 'T00:00:00.000Z'
                                        let newVal = a + time


                                        let val = moment(newVal).format()
                                        this.setState({ formattedEndDate: a + time.toString() });


                                    }}
                                    minDate={moment().add(1, 'd').format('L')}
                                    enableSwipeMonths={true}
                                    theme={{
                                        backgroundColor: 'red',
                                        selectedDayTextColor: '#0D8991',
                                        selectedColor: '#0D8991',
                                        todayTextColor: 'black',
                                        dayTextColor: 'black',
                                    }}
                                />

                            </View>



                            :


                            <View style={[styles.input, { height: hp(20), }]} >
                                <TouchableOpacity style={{ alignSelf: 'flex-end', right: 10, top: hp(2), height: hp(5) }} onPress={() => this.setState({ showEndCalendar: !this.state.showEndCalendar })}>
                                    {Icons.DropArrow()}
                                </TouchableOpacity>

                                <CalendarStrip
                                    calendarAnimation={{ type: 'sequence', duration: 10 }}
                                    daySelectionAnimation={{ type: 'border', duration: 200, borderWidth: 1, borderHighlightColor: '#0099A2', backgroundColor: '#0099A2' }}
                                    style={{ height: hp(15), marginTop: 10 }}
                                    calendarHeaderStyle={{ color: 'black' }}
                                    minDate={moment()}
                                    scrollable={true}
                                    datesBlacklist={this.state.datesBlacklist}
                                    onDateSelected={this.onEndDateSelected}
                                    dateNumberStyle={{ color: 'black', backgroundColor: '#F6F8F9', borderRadius: 100, height: 25, width: 25, textAlignVertical: 'center' }}
                                    dateNameStyle={{ color: 'grey' }}
                                    highlightDateNumberStyle={{ color: 'white' }}
                                    highlightDateNameStyle={{ color: 'white' }}
                                    highlightDateContainerStyle={{ backgroundColor: '#0D8991' }}
                                    disabledDateNameStyle={{ color: 'grey' }}
                                    disabledDateNumberStyle={{ color: 'grey' }}
                                    iconContainer={{ flex: 0.1 }}
                                />
                            </View>}



                        <View style={[styles.input, { marginTop: 10 }]}>
                            <ScrollView contentContainerStyle={styles.filterContainer} horizontal showsHorizontalScrollIndicator={false}>

                                {this.state.filterTypes.map((item, idx) => {
                                    return (
                                        <TouchableOpacity
                                            key={idx}
                                            onPress={() => {
                                                this.setState({ tim: true })
                                                this.setState({ locationEndFilterTypeIdx: idx })
                                                console.log('time:', this.state.filterTypes[idx])
                                                this.setState({ userdate: this.state.filterTypes[idx] })




                                                let splitArray = this.state.formattedEndDate.split("T")
                                                console.log('value...>', splitArray[0] + "T" + this.state.filterTypes[idx] + ":000Z")
                                                this.setState({ formattedEndDate: splitArray[0] + "T" + this.state.filterTypes[idx] + ":000Z" })

                                            }}
                                            style={[
                                                styles.filterItem,
                                                idx === this.state.locationEndFilterTypeIdx
                                                    ? styles.filterTypeActive
                                                    : null,
                                            ]}
                                        >
                                            <ResponsiveText
                                                style={[
                                                    styles.filterText,
                                                    idx === this.state.locationEndFilterTypeIdx ? { color: '#FFF' } : null,
                                                ]}
                                            >
                                                {item}
                                            </ResponsiveText>
                                        </TouchableOpacity>
                                    )
                                })}
                            </ScrollView>
                        </View>
                    </>

                    {this.state.error.length > 0 && <ResponsiveText style={styles.errorMessage}> {this.state.error}</ResponsiveText>}

                    <ResponsiveText style={{ color: 'grey', marginVertical: wp(5), fontSize: 3.5 }}>Duration(In Hours)</ResponsiveText>

                    <Input
                        placeholder={'0'}
                        inputStyle={styles.input}
                        value={this.state.duration}
                        onChangeText={(e) => this.setState({ duration: e })}
                    />


                    <ResponsiveText style={{ color: 'grey', marginVertical: wp(5), fontSize: 3.5 }}>Budget</ResponsiveText>

                    <Input
                        placeholder={'$'}
                        inputStyle={styles.input}
                        value={this.state.budget}
                        onChangeText={(e) => this.setState({ budget: e })}
                    />

                </Content>
                <Button
                    btnContainer={styles.proceedBtnContainer}
                    title={'Book Now'}
                    onPress={() => this.submit()}
                />


            </View >
        );
    }
}

function mapStateToProps(state) {
    return {

        token: state.auth.token,

    }
}

function mapDispatchToProps(dispatch) {
    return {
        // loginUser: (payload) => dispatch(loginUser(payload)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BookNow);
const styles = StyleSheet.create({
    content: {
        flex: 1,
        padding: 8,
        backgroundColor: '#fdfdfd',

    },
    errorMessage: {
        color: 'red',
        marginVertical: 15
    },
    input: {
        backgroundColor: '#fff',
        elevation: 2,
        height: wp('16'),
        // fontWeight: 'bold',
        marginVertical: 0,
        borderRadius: 5,
        zIndex: 0,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        color: '#000',
    },

    proceedBtnContainer: {
        marginTop: 10,
        height: wp('16'),
        width: wp('100') - 30,
        alignSelf: 'center',

    },

    filterItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: wp(30),
        // padding: 20,
        margin: 2
    },
    filterText: {
        color: Colors.Primary,
        fontSize: 3,
        width: wp(30),
        textAlign: 'center',

    },
    filterTypeActive: {
        backgroundColor: Colors.Primary,
        borderRadius: 10,
    },
})