import {
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	Alert,
	Pressable,
	Image,
	TextInput,
	ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import Carousel from "../components/Carousel";
import Services from "../components/Services";
import DressItem from "../components/DressItem";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../ProductReducer";
import { useNavigation } from "@react-navigation/native";
import { collection, getDoc, getDocs, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const HomeScreen = () => {
	const cart = useSelector((state) => state.cart.cart);
	// const [items, setItems] = useState([]);
	const userUid = auth.currentUser.uid;
	const product = useSelector((state) => state.product.product);
	const dispatch = useDispatch();
	const [searchItem, setSearchItem] = useState("");
	const total = cart
		.map((item) => item.quantity * item.price)
		.reduce((curr, prev) => curr + prev, 0);
	const navigation = useNavigation();
	console.log(cart);
	const [displayCurrentAddress, setdisplayCurrentAddress] = useState(
		"we are loading your location"
	);
	const [locationServicesEnabled, setlocationServicesEnabled] = useState(false);
	useEffect(() => {
		checkIfLocationEnabled();
		getCurrentLocation();
	}, []);
	const checkIfLocationEnabled = async () => {
		let enabled = await Location.hasServicesEnabledAsync();
		if (!enabled) {
			Alert.alert(
				"Location services not enabled",
				"Please enable the location services",
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
		} else {
			setlocationServicesEnabled(enabled);
		}
	};
	const getCurrentLocation = async () => {
		let { status } = await Location.requestForegroundPermissionsAsync();

		if (status !== "granted") {
			Alert.alert(
				"Permission denied",
				"allow the app to use the location services",
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

		const { coords } = await Location.getCurrentPositionAsync();
		// console.log(coords)
		if (coords) {
			const { latitude, longitude } = coords;

			let response = await Location.reverseGeocodeAsync({
				latitude,
				longitude,
			});

			// console.log(response)

			for (let item of response) {
				let address = `${item.name} ${item.city} ${item.postalCode}`;
				setdisplayCurrentAddress(address);
			}
			// const docRef = doc(db, "users", `${userUid}`);
			// const docSnap = await getDoc(docRef);
			const currentUser = await getDoc(doc(db, "users", `${userUid}`));
			if (!currentUser.address) {
				await setDoc(
					doc(db, "users", `${userUid}`),
					{
						address: displayCurrentAddress,
					},
					{
						merge: true,
					}
				);
			}
		}
	};
	useEffect(() => {
		if (product.length > 0) return;

		const fetchProducts = async () => {
			let items = [];
			const colRef = collection(db, "services");
			const docsSnap = await getDocs(colRef);
			docsSnap.forEach((doc) => {
				items.push(doc.data());
			});
			items?.map((service) => dispatch(getProducts(service)));
		};
		fetchProducts();
	}, []);
	console.log(product);

	const filteredProducts = product.filter((products) => {
		return products.name.toLowerCase().includes(searchItem.toLowerCase());
	});

	const renderProducts = searchItem ? filteredProducts : product;

	return (
		<>
			<ScrollView
				style={{ backgroundColor: "#F0F0F0", flex: 1, marginTop: 50 }}
			>
				{/* Location and Profile */}
				<View
					style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
				>
					<MaterialIcons name="location-on" size={30} color="#fd5c63" />
					<View>
						<Text style={{ fontSize: 18, fontWeight: "600" }}>Home</Text>
						<Text>{displayCurrentAddress}</Text>
					</View>

					<Pressable
						onPress={() => navigation.navigate("Profile")}
						style={{ marginLeft: "auto", marginRight: 7 }}
					>
						<Image
							style={{ width: 40, height: 40, borderRadius: 20 }}
							source={{
								uri: "https://res.cloudinary.com/teaspoonapp/image/upload/v1681971402/adaptive-icon_mm1y1m.png",
							}}
						/>
					</Pressable>
				</View>

				{/* Search Bar */}
				<View
					style={{
						padding: 10,
						margin: 10,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						borderWidth: 0.8,
						borderColor: "#C0C0C0",
						borderRadius: 7,
					}}
				>
					<TextInput
						placeholder="Search for items or More"
						onChangeText={(text) => setSearchItem(text)}
					/>
					<Feather name="search" size={24} color="#fd5c63" />
				</View>

				{/* Image Carousel */}
				<Carousel />

				{/* Services Component */}
				<Services />

				{/* Render all the Products */}

				{renderProducts.map((item, index) => (
					<DressItem item={item} key={index} />
				))}
			</ScrollView>

			{total === 0 ? null : (
				<Pressable
					style={{
						backgroundColor: "#088F8F",
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

					<Pressable onPress={() => navigation.navigate("PickUp")}>
						<Text style={{ fontSize: 14, fontWeight: "600", color: "white" }}>
							Schedule Pickup/Delivery
						</Text>
					</Pressable>
				</Pressable>
			)}
		</>
	);
};

export default HomeScreen;

const styles = StyleSheet.create({});
