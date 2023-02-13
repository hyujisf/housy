import React from "react";
import { Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

const PayBookingModal = (props) => {
	// const redirect = useNavigate();
	return (
		<Modal
			{...props}
			size='lg'
			aria-labelledby='contained-modal-title-vcenter'
			centered
		>
			<Modal.Body className='m-3 text-center'>
				<Form.Text className='fs-3 text-black'>
					Pembayaran Anda akan dikonfirmasi dalam 1 x 24 Jam untuk melihat
					pesanan Klik{" "}
					<Link to='/history' className='text-black fw-bold'>
						Disini
					</Link>{" "}
					Terima kasih
				</Form.Text>
			</Modal.Body>
		</Modal>
	);
};

export default PayBookingModal;
