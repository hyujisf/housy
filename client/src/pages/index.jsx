import React, { useState } from "react";
import LayoutStore from "layouts/withSearchbar";
// import DataRooms from "data/rooms";
import Card from "components/CardProperties";
import { API } from "lib/api";
import { useQuery } from "react-query";
// import css from "home.module.css";
import Sidebar from "components/SidebarStore";

import css from "./index.module.css";

export default function Home() {
	const [filters, setFilters] = useState({});

	let { data: properties } = useQuery("propertiesCache", async () => {
		const response = await API.get("/properties");
		return response.data.data;
	});

	console.log("data showed", properties);
	const updateFilters = (searchProperty) => {
		setFilters(searchProperty);
		console.log("test", searchProperty);
	};

	const filterData = (properties) => {
		// console.log("filtered", filterData);
		const filteredData = properties.filter((data) => {
			// if (filters.dration === "year") {
			// 	return false;
			// }
			if (filters.bed && data.bedroom !== filters.bed) {
				return false;
			}
			if (filters.bath && data.bathroom !== filters.bath) {
				return false;
			}
			if (filters.budget && data.price > filters.budget) {
				return false;
			}
			// if (filters.amenities && room.amenities !== filters.amenities) {
			// 	return false;
			// }
			return true;
		});
		console.log("filtered", filteredData);
		return filteredData;
	};

	document.title = "Housy";

	return (
		<LayoutStore className={"bg-tertiary"}>
			{/* <Container> */}
			<div className={css.MaxWidth}>
				<div>
					<Sidebar SearchProperty={updateFilters} className={css.SideItem} />
				</div>
				<div>
					<section className={css.MainWithSidebar}>
						<div className='p-lg-4'>
							<div className={css.RoomsDisplay}>
								{/* <Card Rooms={filterData(properties)} className={"RoomLink"} /> */}
								<Card Rooms={properties} className={css.RoomLink} />
							</div>
						</div>
					</section>
				</div>
			</div>
			{/* </Container> */}
		</LayoutStore>
	);
}
