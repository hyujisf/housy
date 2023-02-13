import React, { useState } from "react";
import LayoutStore from "layouts/withSearchbar";
import Card from "components/CardProperties";
import { API } from "lib/api";
import { useQuery } from "react-query";
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
								<Card
									Rooms={properties}
									className={css.RoomLink}
									searchCity={true}
								/>
							</div>
						</div>
					</section>
				</div>
			</div>
			{/* </Container> */}
		</LayoutStore>
	);
}
