import React from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";

import css from "./index.module.css";

const OrderModal = (props) => {
	// const { id } = useParams();

	const redirect = useNavigate();
	const data = JSON.parse(localStorage.getItem("isLogin"));
	const saveBookDate = (e) => {
		e.preventDefault();
		const d = {
			checkin: e.target.checkin.value,
			checkout: e.target.checkout.value,
			Rooms: props.roomID,
		};

		if (!d.checkin) {
			alert("Form checkin is required!");
		}
		if (!d.checkout) {
			alert("Form checkout is required!");
		}
		if (data !== null) {
			const checkinFormat = moment(d.checkin).format("YYYY-MM-DD");
			const checkoutFormat = moment(d.checkout).format("YYYY-MM-DD");

			data.checkin = checkinFormat;
			data.checkout = checkoutFormat;
			data.Rooms = d.Rooms;
			localStorage.setItem("isLogin", JSON.stringify(data));
			redirect("/mybooking");
		} else {
			alert("Kamu belum login!");
		}
	};

	return (
		<Modal {...props} size='md' centered>
			<Modal.Body className={css.Modal}>
				<h2 className='text-center mt-3 mb-3 fw-bold'>
					How long you will stay
				</h2>
				<Form className={css.Form} onSubmit={saveBookDate}>
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
						/>
					</Form.Group>
					<Form.Group className='mb-3'>
						<Form.Label htmlFor='checkout' className='fw-bold fs-4'>
							Check-out
						</Form.Label>
						<Form.Control
							autoFocus
							size='lg'
							type='date'
							id='checkout'
							placeholder='Checkout'
							className='bg-tertiary'
							name='checkout'
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
	);
};

export default OrderModal;
