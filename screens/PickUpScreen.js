import {
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	TextInput,
	Pressable,
	ScrollView,
	Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import HorizontalDatepicker from "@awrminkhodaei/react-native-horizontal-datepicker";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { auth } from "../firebase";

const PickUpScreen = () => {
	const [selectedDate, setSelectedDate] = useState("");
	const cart = useSelector((state) => state.cart.cart);
	const [deliveryAddress, setDeliveryAddress] = useState("");
	const [user, setUser] = useState(null);
	const total = cart
		.map((item) => item.quantity * item.price)
		.reduce((curr, prev) => curr + prev, 0);
	const [selectedTime, setSelectedTime] = useState([]);
	const [delivery, setDelivery] = useState("");

	const deliveryTime = [
		{
			id: "0",
			name: "Tomorrow",
		},
		{
			id: "4",
			name: "2-3 Days",
		},

		{
			id: "1",
			name: "3-4 Days",
		},
		{
			id: "2",
			name: "4-5 Days",
		},
		{
			id: "3",
			name: "5-6 Days",
		},
	];

	const times = [
		{
			id: "0",
			time: "10:00 AM",
		},
		{
			id: "1",
			time: "11:00 AM",
		},
		{
			id: "2",
			time: "12:00 Noon",
		},
		{
			id: "3",
			time: "1:00 PM",
		},
		{
			id: "4",
			time: "2:00 PM",
		},
		{
			id: "5",
			time: "3:00 PM",
		},
		{
			id: "6",
			time: "4:00 PM",
		},
		{
			id: "7",
			time: "5:00 PM",
		},
		{
			id: "8",
			time: "6:00 PM",
		},
	];
	const navigation = useNavigation();
	useEffect(() => {
		const customer = auth.currentUser;
		setUser(customer);
	}, []);
	const proceedToCart = () => {
		if (!selectedDate || !selectedTime || !delivery) {
			Alert.alert(
				"Empty or invalid",
				"Please select all the fields",
				[
					{
						text: "Cancel",
						onPress: () => console.log("Cancel Pressed"),
						style: "cancel",
					},
					{ text: "OK", onPress: () => console.log("OK Pressed") },
				],
				{ cancelable: false }
			);
		}
		if (selectedDate && selectedTime && delivery) {
			navigation.replace("Cart", {
				pickUpDate: selectedDate,
				selectedTime: selectedTime,
				no_Of_days: delivery,
				delivery_Address: deliveryAddress,
				email: user.email,
			});
		}
	};

	return (
		<>
			<SafeAreaView style={{ marginTop: 50 }}>
				<Text style={{ fontSize: 16, fontWeight: "500", marginHorizontal: 10 }}>
					enter Address
				</Text>
				<TextInput
					style={{
						padding: 40,
						borderColor: "gray",
						borderWidth: 0.7,
						paddingVertical: 80,
						borderRadius: 9,
						margin: 10,
					}}
					placeholder="Enter Address"
					onChangeText={(text) => setDeliveryAddress(text)}
				/>

				<Text style={{ fontSize: 16, fontWeight: "500", marginHorizontal: 10 }}>
					Pick Up Date
				</Text>
				<HorizontalDatepicker
					mode="gregorian"
					startDate={moment(new Date()).format("YYYY-MM-DD")}
					endDate={moment().add(7, "days").calendar()}
					initialSelectedDate={moment(new Date()).format("YYYY-MM-DD")}
					onSelectedDateChange={(date) => setSelectedDate(date)}
					selectedItemWidth={170}
					unselectedItemWidth={38}
					itemHeight={38}
					itemRadius={10}
					selectedItemTextStyle={styles.selectedItemTextStyle}
					unselectedItemTextStyle={styles.selectedItemTextStyle}
					selectedItemBackgroundColor="#222831"
					unselectedItemBackgroundColor="#ececec"
					flatListContainerStyle={styles.flatListContainerStyle}
				/>

				<Text style={{ fontSize: 16, fontWeight: "500", marginHorizontal: 10 }}>
					Select Time
				</Text>

				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					{times.map((item, index) => (
						<Pressable
							key={index}
							onPress={() => setSelectedTime(item.time)}
							style={
								selectedTime.includes(item.time)
									? {
											margin: 10,
											borderRadius: 7,
											padding: 15,
											backgroundColor: "#00ff33",
											color: "white",
									  }
									: {
											margin: 10,
											borderRadius: 7,
											padding: 15,
											borderColor: "gray",
											borderWidth: 0.9,
									  }
							}
						>
							<Text>{item.time}</Text>
						</Pressable>
					))}
				</ScrollView>

				<Text style={{ fontSize: 16, fontWeight: "500", marginHorizontal: 10 }}>
					Delivery Date
				</Text>

				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					{deliveryTime.map((item, i) => (
						<Pressable
							style={
								delivery.includes(item.name)
									? {
											margin: 10,
											borderRadius: 7,
											padding: 15,
											backgroundColor: "#00ee99",
									  }
									: {
											margin: 10,
											borderRadius: 7,
											padding: 15,
											borderColor: "gray",
											borderWidth: 0.7,
									  }
							}
							onPress={() => setDelivery(item.name)}
							key={i}
						>
							<Text>{item.name}</Text>
						</Pressable>
					))}
				</ScrollView>
			</SafeAreaView>

			{total === 0 ? null : (
				<Pressable
					style={{
						backgroundColor: "#088F8F",
						marginTop: "auto",
						padding: 10,
						marginBottom: 40,
						margin: 15,
						borderRadius: 7,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<View>
						<Text style={{ fontSize: 17, fontWeight: "600", color: "white" }}>
							{cart.length} items | ₦ {total}
						</Text>
						<Text
							style={{
								fontSize: 15,
								fontWeight: "400",
								color: "white",
								marginVertical: 6,
							}}
						>
							extra charges might apply
						</Text>
					</View>

					<Pressable onPress={proceedToCart}>
						<Text style={{ fontSize: 17, fontWeight: "600", color: "white" }}>
							Proceed to Cart
						</Text>
					</Pressable>
				</Pressable>
			)}
		</>
	);
};

export default PickUpScreen;

const styles = StyleSheet.create({});
