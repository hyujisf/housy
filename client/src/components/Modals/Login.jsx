import React, { useContext, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { AppContext } from "context/AppContext";
import { useMutation } from "react-query";
import { API } from "lib/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// import { redirect } from "react-router-dom";
// import RegisterModal from "../Register";

export default function LoginModal(props) {
	let navigate = useNavigate();

	const [state, dispatch] = useContext(AppContext);

	const [form, setForm] = useState({
		username: "",
		password: "",
	});

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

	const { username, password } = form;

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
			const response = await API.post("/login", body, config);

			// Checking process
			if (response.data != null) {
				// Send data to useContext
				dispatch({
					type: "SIGNIN",
					payload: response.data.data,
				});
				navigate("/");
				props.onHide();
				Toast.fire({
					icon: "success",
					title: "Successfully Sign In",
				});
			}
		} catch (error) {
			console.log(error);

			Toast.fire({
				icon: "error",
				title: "Failed to Sign In",
			});
		}
	});

	const goRegister = () => {
		props.onHide();
		props.toRegister();
	};

	return (
		<Modal
			{...props}
			size='md'
			aria-labelledby='contained-modal-title-vcenter'
			centered
		>
			<Modal.Body className='m-3'>
				<h1 className='text-center mt-3 mb-5 fw-bold'>Sign in</h1>

				<Form onSubmit={(e) => handleSubmit.mutate(e)}>
					<Form.Group className='mb-3'>
						<Form.Label htmlFor='username' className='fw-bold fs-4'>
							Username
						</Form.Label>
						<Form.Control
							size='lg'
							type='text'
							id='username'
							placeholder='Username'
							className='bg-tertiary'
							value={username}
							name='username'
							onChange={handleChange}
						/>
					</Form.Group>

					<Form.Group className='mb-3'>
						<Form.Label htmlFor='Password' className='fw-bold fs-4'>
							Password
						</Form.Label>
						<Form.Control
							size='lg'
							type='password'
							id='Password'
							placeholder='Password'
							className='bg-tertiary'
							value={password}
							name='password'
							onChange={handleChange}
						/>
					</Form.Group>

					<Form.Group className='ms-auto mb-4'>
						<Button size='lg' type='submit' className='mt-4 py-3 px-4 w-100'>
							Sign in
						</Button>
					</Form.Group>

					<Form.Text muted>
						Don't have an acount? Click
						<span
							onClick={(e) => goRegister()}
							className={"btn btn-link pb-2 px-1"}
						>
							here
						</span>
					</Form.Text>
				</Form>
			</Modal.Body>
		</Modal>
	);
}
