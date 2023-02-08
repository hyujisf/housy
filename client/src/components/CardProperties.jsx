import { Card, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { API } from "lib/api";
// import axios from "axios";
import { useQuery } from "react-query";

import { toCurrency } from "lib/Currency";
import css from "./CardProperties.module.css";

export default function CardProperties(props) {
	let { data: properties } = useQuery("propertiesCache", async () => {
		const response = await API.get("/properties");
		return response.data.data;
	});

	console.log("data showed", properties);
	return (
		<>
			{properties?.map((room, k) => {
				return (
					<Link
						to={"/detail/" + room.id}
						key={k}
						className='w-100'
						style={{ textDecoration: "none" }}
					>
						<Card className={props.className}>
							<div className='position-absolute mt-3 ms-3 d-flex gap-2'>
								{room.amenities.map((amenity, k) => (
									<span key={k} className={css.Tag}>
										{amenity}
									</span>
								))}
							</div>
							<div className={css.WrapperPrimaryImage}>
								<Image
									variant='top'
									className={css.PrimaryImage}
									src={
										// "https://3408-2404-8000-1004-b94f-71a6-be6-bec4-1ca1.ap.ngrok.io/uploads/"
										"http://localhost:5000/uploads/" + room.image
									}
								/>
							</div>
							<Card.Body>
								<Card.Title>
									<strong>
										{toCurrency(room.price)} / {room.type_rent}
									</strong>
								</Card.Title>
								<Card.Subtitle className='mb-2'>
									{room.bedroom} Beds, {room.bathroom} Bath, {room.size} Sqft
								</Card.Subtitle>
								<Card.Text>
									{room.district}, {room.city.name}
								</Card.Text>
								{/* <Button variant="primary">Go somewhere</Button> */}
							</Card.Body>
						</Card>
					</Link>
				);
			})}
		</>
	);
}
