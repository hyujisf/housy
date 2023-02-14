import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { API } from "lib/api";
import Toast from "lib/sweetAlerts";
// import RegisterModal from "../Register";

import css from "./ChangePassword.module.css";

const ChangePasswordModal = (props) => {
	let navigate = useNavigate();
	const [message, setMessage] = useState(null);
	const [type, setType] = useState("password");
	const [form, setForm] = useState({
		old_password: "",
		confirm_new_password: "",
	});

	const { old_password, confirm_new_password } = form;

	const handleChange = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = useMutation(async (e) => {
		try {
			e.preventDefault();

			// Configuration
			const config = {
				headers: {
					"Content-type": "application/json",
				},
			};

			// Data body
			const body = JSON.stringify(form);

			// Insert data for login process
			const response = await API.patch("/user/changePassword", body, config);

			// Checking process
			if (response.data != null) {
				// Send data to useContext
				setForm(null);
				navigate("/");
				props.onHide();
				Toast.fire({
					icon: "success",
					title: response.data.data.message,
				});
			}
		} catch (error) {
			// console.log(error);

			Toast.fire({
				icon: "error",
				title: "Failed to Change Password",
			});
		}
	});

	return (
		<Modal
			{...props}
			size='md'
			aria-labelledby='contained-modal-title-vcenter'
			centered
		>
			<Modal.Body className='m-3'>
				<h1 className='text-center mt-3 mb-5 fw-bold'>Change Password</h1>
				<Form onSubmit={(e) => handleSubmit.mutate(e)}>
					{/* <Form onSubmit={changePassword}> */}
					<Form.Group className='mb-3'>
						<Form.Label htmlFor='oldpassword' className='fw-bold fs-4'>
							Old Password
						</Form.Label>
						<Form.Control
							size='lg'
							type={type}
							id='passwordOld'
							placeholder='Type your Old Password'
							// value={user.password}
							className='bg-tertiary'
							value={old_password}
							name='old_password'
							onChange={handleChange}
						/>
					</Form.Group>

					<Form.Group className='mb-3'>
						<Form.Label htmlFor='Password1' className='fw-bold fs-4'>
							New Password
						</Form.Label>
						<Form.Control
							size='lg'
							type={type}
							id='Password1'
							placeholder='Type your New Password'
							className='bg-tertiary'
							name='password1'
						/>
					</Form.Group>

					<Form.Group className='mb-3'>
						<Form.Label htmlFor='Password2' className='fw-bold fs-4'>
							Confirm Password
						</Form.Label>
						<Form.Control
							size='lg'
							type={type}
							id='Password2'
							placeholder='Confirm Your New Password'
							className='bg-tertiary'
							value={confirm_new_password}
							name='confirm_new_password'
							onChange={handleChange}
						/>
					</Form.Group>
					{/* <div className='w-100'>
						<span
							className={type === "input" ? css.HidePassword : css.PeekPassword}
							onClick={showHide}
						>
							{type === "input" ? "Hide Password" : "Show Password"}
						</span>
					</div> */}
					<Form.Group className='ms-auto mb-4'>
						<Button
							size='lg'
							type='submit'
							className='mt-4 py-3 px-4 w-100 fw-bold'
						>
							Confirm
						</Button>
					</Form.Group>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default ChangePasswordModal;
