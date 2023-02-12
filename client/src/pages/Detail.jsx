import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { Image, Button } from "react-bootstrap";
import { IoBed } from "react-icons/io5";
import { GiBathtub } from "react-icons/gi";
import { AppContext } from "context/AppContext";
import { API } from "lib/api";

import Toast from "lib/sweetAlerts";
import css from "./Detail.module.css";

import Layout from "layouts/withoutSearchbar";
import OrderModal from "components/Modals/Detail";

// import { DateToMillis } from "lib/dateConvertion";

export default function Detail(props) {
	const [state, dispatch] = useContext(AppContext);
	const [showModal, setShowModal] = useState(false);
	const navigate = useNavigate();
	const { id } = useParams();

	let { data: property } = useQuery("detailPropertyCache", async () => {
		const response = await API.get("/property/" + id);
		return response.data.data;
	});

	let { data: myBooking } = useQuery("getBookingCache", async () => {
		const response = await API.get("/myBooking");
		return response.data.data;
	});

	const handleBooking = () => {
		if (!myBooking) {
			setShowModal(true);
		} else {
			Toast.fire({
				icon: "error",
				title:
					"You have an unpaid order, please pay in advance before placing another order!",
			});
			navigate("/mybooking");
		}
	};

	const title = "Detail Property";
	document.title = "Housy | " + title;

	return (
		<Layout className={"bg-white"}>
			<div className={css.MaxWidth} style={{ marginTop: "4rem" }}>
				<div className='d-flex flex-column gap-3 w-100'>
					<div className={css.WrapperPrimaryImage}>
						<Image src={property?.image} className={css.PrimaryImage} />
					</div>
					<div className='d-flex gap-3'>
						<div className={css.WrapperSubImage}>
							<Image
								src={process.env.PUBLIC_URL + "/img/rooms/image3.png"}
								className={css.PrimaryImage}
							/>
						</div>
						<div className={css.WrapperSubImage}>
							<Image
								src={process.env.PUBLIC_URL + "/img/rooms/image7.png"}
								className={css.PrimaryImage}
							/>
						</div>
						<div className={css.WrapperSubImage}>
							<span className={css.ImageMore}>+5</span>
							<Image
								src={process.env.PUBLIC_URL + "/img/rooms/image6.png"}
								className={css.PrimaryImage}
							/>
						</div>
					</div>
				</div>
				<div className={css.WrappingBookingDesc}>
					<h1 className={css.BookingTitle}>{property?.name}</h1>
					<div className={css.BookingDesc}>
						<div>
							<h3 className='fw-bold'>
								{property?.price} / {property?.type_rent}
							</h3>
							<p className='text-secondary' style={{ width: "360px" }}>
								{property?.address}, <br /> {property?.district},{" "}
								{property?.city.name}
							</p>
						</div>
						<div className=' d-flex gap-3'>
							<div className='fw-semibold'>
								<small className='text-secondary'>Bedrooms</small>
								<span className='d-flex align-items-center gap-2 fs-4'>
									{property?.bedroom} <IoBed />
								</span>
							</div>
							<div className='fw-semibold'>
								<small className='text-secondary'>Bathrooms</small>{" "}
								<span className='d-flex align-items-center gap-2 fs-4'>
									{property?.bathroom} <GiBathtub />
								</span>
							</div>
							<div className='fw-semibold'>
								<small className='text-secondary'>Area</small>{" "}
								<span className='d-flex align-items-center gap-2 fs-4'>
									{property?.size} sqft
								</span>
							</div>
						</div>
					</div>
					<div className=''>
						<h3 className='fw-bold'>Description</h3>
						<p className='text-secondary'>{property?.description}</p>
					</div>
					<div className='d-flex w-100 justify-content-end'>
						<Button
							size='lg'
							variant='primary'
							className='px-5 py-2'
							onClick={handleBooking}
							// onClick={() => setRegisterModal(true)}
						>
							BOOK NOW
						</Button>
					</div>
					{/* <Link to='/'>back to home</Link> */}
				</div>
				<OrderModal
					show={showModal}
					// property={dataProperty}
					// gotoregister={gotoRegistration}
					onHide={() => setShowModal(false)}
				/>
			</div>
		</Layout>
	);
}
