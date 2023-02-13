import React, { useState, useContext } from "react";
// import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Alert, Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { useMutation } from "react-query";
import { API } from "lib/api";
import { AppContext } from "context/AppContext";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import css from "./index.module.css";
import moment from "moment";

const OrderModal = (props) => {
	const [state, dispatch] = useContext(AppContext);
	const { id } = useParams();

	let { data: property } = useQuery("getPropertyDataCache", async () => {
		const response = await API.get("/property/" + id);
		return response.data.data;
	});

	const redirect = useNavigate();
	const [message, setMessage] = useState(null);
	const [checkin, setCheckin] = useState(moment().format('YYYY-MM-DD'));
	const [checkout, setCheckout] = useState(moment().add(1, property?.type_rent).format('YYYY-MM-DD'));

	console.log("property",property)
	// const {
	// 	checkin,
	// 	checkout,
	// } = form;

	const Toast = Swal.mixin({
		toast: true,
		position: "top-end",
		showConfirmButton: false,
		timer: 2000,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener("mouseenter", Swal.stopTimer);
			toast.addEventListener("mouseleave", Swal.resumeTimer);
		},
	});

	const handleChange = (e) => {
		setCheckin(e.target.value);
		// let checkoutToMilis 
		if (property?.type_rent === "Year"){
			setCheckout(moment(e.target.value).add(1, 'year').format('YYYY-MM-DD'));
		} else if (property?.type_rent === "Month"){
			setCheckout(moment(e.target.value).add(1, 'month').format('YYYY-MM-DD'));
		} else if (property?.type_rent === "Day"){
			setCheckout(moment(e.target.value).add(1, 'day').format('YYYY-MM-DD'));
		} 
	};

	// const checkinFormat = moment(checkin).valueOf()
	// const checkoutFormat = moment(checkoutToMilis).format("YYYY-MM-DD")

	const dataTransaction = {
		property_id: property?.id,
		checkin: checkin,
		checkout: checkout,
		status: "waiting payment",
		total: property?.price,
	};

	const saveBookDate = useMutation(async (e) => {
		try {
			e.preventDefault();

			// Configuration Content-type
			const config = {
				headers: {
					"Content-type": "application/json",
				},
			};

			// Data body
			const body = JSON.stringify(dataTransaction);

			// Insert data user to database
			const response = await API.post("/transaction", body, config);

			// Notification
			if (response.data != null) {
				setCheckin("");
				setCheckout("");
				// setForm({
				// 	checkin: "",
				// 	checkout: "",
				// });
				props.onHide();
				redirect("/mybooking");

				Toast.fire({
					icon: "success",
					title: "Successfully Add Transaction",
				});
			} else {
				const alert = (
					<Alert variant='danger' className='py-1'>
						Transaction Failed!!!!
					</Alert>
				);
				setMessage(alert);
			}
		} catch (error) {
			Toast.fire({
				icon: "error",
				title: "Failed to Add Transaction",
			});
			const alert = (
				<Alert variant='danger' className='py-1'>
					Transaction Failed!!!
				</Alert>
			);
			setMessage(alert);
			console.log(error);
		}
	});

	return (
		<Modal {...props} size='md' centered>
			<Modal.Body className={css.Modal}>
				<h2 className='text-center mt-3 mb-3 fw-bold'>
					How long you will stay
				</h2>
				<Form className={css.Form} onSubmit={(e) => saveBookDate.mutate(e)}>
					<Form.Group className='mb-3'>
						<Form.Label htmlFor='checkin' className='fw-bold fs-4'>
							Check-in
						</Form.Label>
						<Form.Control
							autoFocus
							size='lg'
							type='date'
							id='checkin'
							placeholder='Checkin'
							className='bg-tertiary'
							name='checkin'
							value={checkin}
							onChange={handleChange}
							min={moment().format('YYYY-MM-DD')}
						/>
					</Form.Group>
					{/* <Form.Group className='mb-3'>
						<Form.Label htmlFor='checkout' className='fw-bold fs-4'>
							Check-out
						</Form.Label>
						<Form.Control
							disabled
							size='lg'
							type='date'
							id='checkout'
							placeholder='Checkout'
							className='bg-tertiary'
							name='checkout'
							value={checkout}
							// onChange={handleChange}
						/>
					</Form.Group> */}
					<h6 className="">Checkout Date : </h6>
					<span style={{fontSize:".7rem" }} className="py-2 px-3 rounded-pill bg-secondary text-white fw-bold">{moment(checkout).format("dddd, DD MMMM YYYY")}</span>

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
	);
};

export default OrderModal;
