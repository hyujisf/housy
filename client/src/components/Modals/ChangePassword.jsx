import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
// import RegisterModal from "../Register";

import css from "./ChangePassword.module.css";

const ChangePasswordModal = (props) => {
	const [message, setMessage] = useState(null);
	const [type, setType] = useState("password");
	const [form, setForm] = useState({
		oldpassword: "",
		username: "",
		email: "",
		password: "",
		list_as_id: "",
		gender: "",
		phone: "",
		address: "",
	});

	const showHide = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setType(type === "input" ? "password" : "input");
	};

	// const [isLogin, setIsLogin] = useState({});

	// const isLogin = JSON.parse(localStorage.getItem("isLogin"));
	// // get index data
	// const userIndex = JSON.parse(localStorage.getItem("userData")).findIndex(
	// 	(obj) => obj.username === isLogin.username
	// );
	// // get whole data on userData
	// const user = JSON.parse(localStorage.getItem("userData")).find(
	// 	(obj) => obj.username === isLogin.username
	// );
	// const userData = JSON.parse(localStorage.getItem("userData"));

	// const changePassword = (e) => {
	// 	e.preventDefault();

	// 	const checkPass = {
	// 		old: e.target.oldpassword.value,
	// 		new: e.target.password1.value,
	// 		confirm: e.target.password2.value,
	// 	};
	// 	if (!checkPass.new) {
	// 		alert("Form New Password is required!");
	// 	}
	// 	if (!checkPass.confirm) {
	// 		alert("Form Confirm Password is required!");
	// 	}
	// 	if (checkPass.new !== checkPass.confirm) {
	// 		alert("Password tidak sama");
	// 	}
	// 	if (checkPass.new === checkPass.confirm) {
	// 		const updatedUser = { ...userData[userIndex], password: checkPass.new };
	// 		userData.splice(userIndex, 1, updatedUser);
	// 		localStorage.setItem("userData", JSON.stringify(userData));
	// 		alert("password telah diubah");
	// 		props.onHide();
	// 	}
	// };

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
							value={passwordOld}
							name='passwordOld'
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
							value={passwordConfirm}
							name='passwordConfirm'
							onChange={handleChange}
						/>
					</Form.Group>
					<div className='w-100'>
						<span
							className={type === "input" ? css.HidePassword : css.PeekPassword}
							onClick={showHide}
						>
							{type === "input" ? "Hide Password" : "Show Password"}
						</span>
					</div>
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
