import React, { useContext, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";

// Mutual Pages
import Home from "pages";
import Profile from "pages/Profile";
import Detail from "pages/Detail";

// Tenant Pages
import MyBooking from "pages/Tenant/Booking";
import History from "pages/Tenant/History";

// Owner Pages
import OwnerHome from "pages/Owner";
import AddProperty from "pages/Owner/PropertyAdd";
import OwnerHistory from "pages/Owner/History";

// Login Checking
import IsLogin from "lib/PrivateRoute/IsLogin"
import { API, setAuthToken } from "lib/api";
import { AppContext } from "context/AppContext";
import { useNavigate } from 'react-router-dom';


// Err
import ErrNoMatch from "pages/error"

// Data
// import DataRooms from "./data/rooms";


// init token on axios every time the app is refreshed
if (localStorage.token) {
	setAuthToken(localStorage.token);
}

export default function App() {

	const [state, dispatch] = useContext(AppContext);

	useEffect(() => {
		if (localStorage.token) {
			setAuthToken(localStorage.token);
		}
	}, [state]);
	// let navigate = useNavigate();
	// console.clear();
	console.log(state);

	const checkUser = async () => {
		try {
			const response = await API.get('/check-auth');

			// If the token incorrect
			if (response.data.code === 404) {
				return dispatch({
					type: 'AUTH_ERROR',
				});
			}

			// Get user data
			let payload = response.data.data;
			// Get token from local storage
			payload.token = localStorage.token;

			// Send data to useContext
			dispatch({
				type: 'SIGNIN',
				payload,
			});
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (localStorage.token) {
			checkUser();
		}
	}, []);
	return (
		<Routes>
			{state.isLogin === true && state.user.list_as_id === 1 ? (

				<>
					<Route path="/" element={<OwnerHome />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/addproperty" element={<AddProperty />} />
					<Route path="/history" element={<OwnerHistory />} />
				</>
			) : (
				<>
					<Route path="/" element={<Home />} />
					<Route path="/detail/:id" element={<Detail />} />
					{/* <Route path="/detail/:id" element={<Detail room={DataRooms} />} /> */}
					<Route path="/" element={<IsLogin />} >
						<Route path="/profile" element={<Profile />} />
						<Route path="/mybooking" element={<MyBooking />} />
						<Route path="/history" element={<History />} />
					</Route>
				</>
			)}

			<Route path="*" element={<ErrNoMatch />} />
		</Routes>
	);
}

