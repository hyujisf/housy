import React, { useState, useContext } from "react";
// import { Link } from "react-router-dom";
import { AppContext } from "context/AppContext";
import { useQuery, useQueryClient } from "react-query";
import { API } from "lib/api";
import css from "./Profile.module.css";
import { Image, Button } from "react-bootstrap";
import { useMutation } from "react-query";

import { HiUserCircle, HiMail } from "react-icons/hi";
import {
	MdLocationPin,
	MdLock,
	MdLocalPhone,
	MdPersonPinCircle,
} from "react-icons/md";
import { TbGenderBigender } from "react-icons/tb";
import PassModal from "components/Modals/ChangePassword";
import Layout from "layouts/withoutSearchbar";
import { Form } from "react-router-dom";
import Swal from "sweetalert2";
import ImageModal from "components/Modals/ChangeImage";

export default function Profile() {
	const [state, dispatch] = useContext(AppContext);
	const [PasswordModal, setPasswordModal] = useState(false);
	const [imageModal, setImageModal] = useState(false)
	const queryClient = useQueryClient();


	let { data: user } = useQuery("ProfileCache", async () => {
		const response = await API.get("/user/" + state.user.id);
		return response.data.data;
	});

	// const Toast = Swal.mixin({
	// 	toast: true,
	// 	position: "top-end",
	// 	showConfirmButton: false,
	// 	timer: 3000,
	// 	timerProgressBar: true,
	// 	didOpen: (toast) => {
	// 		toast.addEventListener("mouseenter", Swal.stopTimer);
	// 		toast.addEventListener("mouseleave", Swal.resumeTimer);
	// 	},
	// });

	// const handleSubmit = useMutation(async (e) => {
	// 	e.preventDefault();
	// 	const formData = new FormData();
	// 	formData.append("image", imageFile);
	// 	try {
	// 	  const response = await API.patch("/user/changeImage/" + state.user.id, formData);
	// 	  Toast.fire({
	// 		icon: "success",
	// 		title: "Profile picture updated successfully",
	// 	  });
	// 	  await queryClient.invalidateQueries("ProfileCache");
	// 	} catch (error) {
	// 	  console.error(error);
	// 	  Toast.fire({
	// 		icon: "error",
	// 		title: "Failed to update profile picture",
	// 	  });
	// 	}
	// });
	  



	// const handleChange = (e) => {
	// 	setImageFile(e.target.files[0]);
	// 	// Create image url for preview
	// 	// if (e.target.type === "file") {
	// 	// 	let url = URL.createObjectURL(e.target.files[0]);
			
	// 	// }
	// };
	  

	console.log("data showed", user);

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
										className={css.CardImage}
										src={"http://localhost:5000/uploads/" + user?.image}
									/>
									{/* <Link to='/'>back to home</Link> */}
								</div>
							
									<Button 
										className={"btn btn-primary w-100 py-3 fw-bold fs-5"} 
										
										onClick={() => setImageModal(true)}
									>
										Change Photo Profil
									</Button>
								
								
							</div>
						</div>
					</div>
				</div>
			</div>

			<PassModal
				show={PasswordModal}
				// gotoregister={gotoRegistration}
				onHide={() => setPasswordModal(false)}
			/>
			<ImageModal 
				show={imageModal} onHide={() => setImageModal(false)} 
			/>
		</Layout>
	);
}
