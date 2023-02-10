import React, { useState, useContext } from "react";
import { AppContext } from "context/AppContext";
import { useQuery } from "react-query";
import { useMutation } from "react-query";
import { Image, Button, Modal, Form } from "react-bootstrap";
import { TbGenderBigender } from "react-icons/tb";
import { HiUserCircle, HiMail } from "react-icons/hi";
import {
	MdLocationPin,
	MdLock,
	MdLocalPhone,
	MdPersonPinCircle,
} from "react-icons/md";
// import PassModal from "components/Modals/ChangePassword";
import { API } from "lib/api";
import Toast from "lib/sweetAlerts";
import Layout from "layouts/withSearchbar";
import css from "./Profile.module.css";

export default function Profile() {
	const [state, dispatch] = useContext(AppContext);
	const [preview, setPreview] = useState(null);
	const [PasswordModal, setPasswordModal] = useState(false);
	const [form, setForm] = useState({
		image: "",
		name: "",
		desc: "",
		price: "",
		qty: "",
	});

	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	// Handle change data on form
	const handleChange = (e) => {
		setForm({
			...form,
			[e.target.name]:
				e.target.type === "file" ? e.target.files : e.target.value,
		});

		// Create image url for preview
		if (e.target.type === "file") {
			let url = URL.createObjectURL(e.target.files[0]);
			setPreview(url);
		}
	};

	const handleSubmit = useMutation(async (e) => {
		try {
			e.preventDefault();

			// Configuration
			const config = {
				headers: {
					"Content-type": "multipart/form-data",
				},
			};

			// Store data with FormData as object
			const formData = new FormData();
			formData.set("image", form.image[0], form.image[0].name);

			console.log(form);

			// Insert product data
			const response = await API.patch(
				"/user/" + state.user.id + "/changePhotoProfile",
				formData,
				config
			);
			console.log(response);
			Toast.fire({
				icon: "success",
				title: "Berhasil mengubah Gambar Profil",
			});
		} catch (error) {
			console.log(error);
			Toast.fire({
				icon: "error",
				title: "Gagal mengubah Gambar Profil",
			});
		}
	});
	let { data: user } = useQuery("ProfileCache", async () => {
		const response = await API.get("/user/" + state.user.id);
		return response.data.data;
	});

	console.log("data Profile", user);

	const title = "Profile";
	document.title = "Housy | " + title;

	return (
		<Layout className='bg-tertiary'>
			<div className=''>
				<div className={css.MaxWidth}>
					<div className={css.Card}>
						<div className='d-flex'>
							<div className={css.CardLeft}>
								<h1 className='mb-4 text-black'>
									<strong>Personal Info</strong>
								</h1>
								<div className='d-flex gap-3 align-items-center'>
									<HiUserCircle fontSize={36} />
									<div className=''>
										<strong className={css.ListTitle}>{user?.fullname}</strong>
										<small>Full name</small>
									</div>
								</div>
								<div className='d-flex gap-3 align-items-center'>
									<HiMail fontSize={36} />
									<div className=''>
										<strong className={css.ListTitle}>{user?.email}</strong>
										<small>Email</small>
									</div>
								</div>
								<div className='d-flex gap-3 align-items-center'>
									<MdLock fontSize={36} />
									<div className=''>
										<strong
											className={css.ListTitleTrigger}
											onClick={() => setPasswordModal(true)}
										>
											Change Password
										</strong>
										<small>Password</small>
									</div>
								</div>
								<div className='d-flex gap-3 align-items-center'>
									<MdPersonPinCircle fontSize={36} />
									<div className=''>
										<strong className={css.ListTitle}>
											{user?.list_as.name}
										</strong>
										<small>Status</small>
									</div>
								</div>
								<div className='d-flex gap-3 align-items-center'>
									<TbGenderBigender fontSize={36} />
									<div className=''>
										<strong className={css.ListTitle}>{user?.gender}</strong>
										<small>Gender</small>
									</div>
								</div>
								<div className='d-flex gap-3 align-items-center'>
									<MdLocalPhone fontSize={36} />
									<div className=''>
										<strong className={css.ListTitle}>{user?.phone}</strong>
										<small>Mobile Phone</small>
									</div>
								</div>
								<div className='d-flex gap-3 align-items-center'>
									<MdLocationPin fontSize={36} />
									<div className=''>
										<strong className={css.ListTitle}>{user?.address}</strong>
										<small>Address</small>
									</div>
								</div>
							</div>
							<div className={css.CardRight}>
								<div className={css.WrapperCardImage}>
									<Image
										className={css.ToggleImage}
										src={state.user.image}
										alt={state.user.username + " Housy Profile Image"}
									/>
									<Image className={css.CardImage} src={+user?.image} />
									{/* <Link to='/'>back to home</Link> */}
								</div>
								<Button
									onClick={handleShow}
									className={"btn btn-primary w-100 py-3 fw-bold fs-5"}
								>
									Change Photo Profil
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<Modal centered show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Modal heading</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={(e) => handleSubmit.mutate(e)}>
						<Form.Group className='mb-3'>
							<Form.Label>Image Property</Form.Label>

							{preview && (
								<div>
									<img
										src={preview}
										className={css.PreviewImage}
										alt={preview}
									/>
								</div>
							)}
							<Form.Control
								size='lg'
								id='image'
								name='image'
								onChange={handleChange}
								className='bg-tertiary'
								type='file'
							/>
						</Form.Group>
						<Button variant='primary' type='submit' onClick={handleClose}>
							Save Changes
						</Button>
					</Form>
				</Modal.Body>
			</Modal>
			{/* <PassModal
				show={PasswordModal}
				// gotoregister={gotoRegistration}
				// onHide={() => setPasswordModal(false)}
			/> */}
		</Layout>
	);
}
