import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Image, Button, Form, Modal } from "react-bootstrap";
import { useMutation } from "react-query";

import { IoBed } from "react-icons/io5";
import { GiBathtub } from "react-icons/gi";

import { useQuery } from "react-query";
import { API } from "lib/api";
import css from "./Detail.module.css";

import Layout from "layouts/withoutSearchbar";
// import OrderModal from "components/Modals/Detail";
import { AppContext } from "context/AppContext";
import Toast from "lib/sweetAlerts";

import moment from "moment";
// import { DateToMillis } from "lib/dateConvertion";

export default function Detail(props) {
	const [state, dispatch] = useContext(AppContext);
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const { id } = useParams();

	const navigate = useNavigate();

	const [form, setForm] = useState({
		checkin: "",
		checkout: "",
	});

	const handleChange = (e) => {
		const value = moment(e.target.value).valueOf();
		setForm({
			...form,
			[e.target.name]: value,
		});
	};

	const handleSubmit = useMutation(async (e) => {
		try {
			e.preventDefault();
			Toast.fire({
				icon: "success",
				title: "Berhasil Checkout",
			});
			navigate("/mybooking");
			const newForm = {
				...form,
				property: id,
				total: property.price,
				status: "Waiting Approve",
			};
			localStorage.setItem("Booking", JSON.stringify(newForm));
		} catch (err) {
			console.log(err);

			Toast.fire({
				icon: "error",
				title: "Gagal Checkout",
			});
		}
	});

	let { data: property } = useQuery("getpropertyCache", async () => {
		const response = await API.get("/property/" + id);
		return response.data.data;
	});

	const title = "Detail Property";
	document.title = "Housy | " + title;

	return (
		<Layout className={"bg-white"}>
			<div className={css.MaxWidth} style={{ marginTop: "4rem" }}>
				<div className='d-flex flex-column gap-3 w-100'>
					<div className={css.WrapperPrimaryImage}>
						<Image
							src={"http://localhost:5000/uploads/" + property?.image}
							className={css.PrimaryImage}
						/>
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
							onClick={handleShow}
							// onClick={() => setRegisterModal(true)}
						>
							BOOK NOW
						</Button>
					</div>
					{/* <Link to='/'>back to home</Link> */}
				</div>

				<Modal size='md' centered show={show} onHide={handleClose}>
					<Modal.Body className={css.Modal}>
						<h2 className='text-center mt-3 mb-3 fw-bold'>
							How long you will stay
						</h2>
						{/* <Form className={css.Form} onSubmit={saveBookDate}> */}
						<Form onSubmit={(e) => handleSubmit.mutate(e)} className={css.Form}>
							<Form.Group className='mb-3'>
								<Form.Label htmlFor='checkin' className='fw-bold fs-4'>
									Check-in
								</Form.Label>
								<Form.Control
									autoFocus
									size='lg'
									type='date'
									className='bg-tertiary'
									id='checkin'
									name='checkin'
									placeholder='Checkin'
									onChange={handleChange}
								/>
							</Form.Group>
							<Form.Group className='mb-3'>
								<Form.Label htmlFor='checkout' className='fw-bold fs-4'>
									Check-out
								</Form.Label>
								<Form.Control
									size='lg'
									type='date'
									className='bg-tertiary'
									id='checkout'
									name='checkout'
									placeholder='Checkout'
									onChange={handleChange}
								/>
							</Form.Group>

							<Form.Group className='ms-auto mb-4'>
								<Button
									size='lg'
									type='submit'
									className='mt-4 py-3 px-4 w-100'
									// onClick={RegistSubmit}
								>
									Order
								</Button>
							</Form.Group>
						</Form>
					</Modal.Body>
				</Modal>
			</div>
		</Layout>
	);
}
