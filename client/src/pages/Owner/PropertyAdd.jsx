import React, { useState } from "react";
import Layout from "layouts/withoutSearchbar";
import { Form, Col, Button } from "react-bootstrap";
import Toast from "lib/sweetAlerts";

import { useMutation } from "react-query";
import { API } from "lib/api";
import { period, amenities, nums } from "data/AddProperty";
import { useQuery } from "react-query";

import css from "./PropertyAdd.module.css";
import { useNavigate } from "react-router-dom";

export default function AddProperty() {
	const redirect = useNavigate();
	//Store all category data
	const [preview, setPreview] = useState(null);
	const [form, setForm] = useState({
		name: "",
		city_id: "",
		address: "",
		district: "",
		price: "",
		type_rent: "",
		amenities: [],
		bedroom: "",
		bathroom: "",
		description: "",
		size: "",
		image: "",
	});

	let { data: cities } = useQuery("getCitiesCache", async () => {
		const response = await API.get("/cities");
		return response.data.data;
	});

	// For handle if category selected
	const handleAmenities = (e) => {
		const value = e.target.value;
		const checked = e.target.checked;

		console.log(`${value} is ${checked}`);

		let setAmenities = [...form.amenities];
		// Case 1 : The user checks the box
		if (checked) {
			setAmenities.push(value);
		}
		setForm({ ...form, amenities: setAmenities });
	};
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
			console.log("property data", form);
			const formData = new FormData();
			formData.append("name", form.name);
			formData.append("image", form.image[0], form.image[0].name);
			formData.append("city_id", form.city_id);
			formData.append("address", form.address);
			formData.append("description", form.description);
			formData.append("district", form.district);
			formData.append("price", form.price);
			formData.append("amenities", JSON.stringify(form.amenities));
			formData.append("type_rent", form.type_rent);
			formData.append("bedroom", form.bedroom);
			formData.append("bathroom", form.bathroom);
			formData.append("description", form.description);
			formData.append("size", form.size);

			const response = await API.post("/property", formData, config);

			console.log("Property success to add", response);

			setForm({
				name: "",
				city_id: "",
				address: "",
				district: "",
				price: "",
				type_rent: "",
				amenities: [],
				bedroom: "",
				bathroom: "",
				description: "",
				size: "",
				image: "",
			});
			Toast.fire({
				icon: "success",
				title: "Property baru telah berhasil ditambahkan",
			});
			redirect("/");
		} catch (err) {
			console.log("Fail to add Property", err);
			// console.log(form.amenities);

			Toast.fire({
				icon: "error",
				title: "Property baru gagal ditambahkan",
			});
		}
	});

	const title = "Add Property";
	document.title = "Housy | " + title;

	return (
		<Layout className={"bg-tertiary"}>
			<div className={css.MaxWidth}>
				<div className={css.Card}>
					<h2 className='fw-bold fs-1 my-4'>Add Property</h2>
					<Form onSubmit={(e) => handleSubmit.mutate(e)} className='fw-bold'>
						<Form.Group className='mb-3'>
							<Form.Label>Name Property</Form.Label>
							<Form.Control
								className='bg-tertiary'
								size='lg'
								type='text'
								id='name'
								name='name'
								autoFocus
								onChange={handleChange}
							/>
						</Form.Group>

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
								id='upload'
								name='image'
								onChange={handleChange}
								className='bg-tertiary'
								type='file'
							/>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>City</Form.Label>
							<Form.Select
								className='bg-tertiary'
								size='lg'
								type='text'
								id='city_id'
								name='city_id'
								onChange={handleChange}
							>
								<option>-</option>
								{cities?.map((e, k) => {
									return (
										<option key={k} value={e.id}>
											{e.name}
										</option>
									);
								})}
							</Form.Select>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Address</Form.Label>
							<Form.Control
								className='bg-tertiary'
								size='lg'
								as='textarea'
								rows={3}
								type='text'
								id='address'
								name='address'
								onChange={handleChange}
							/>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Price</Form.Label>
							<Form.Control
								className='bg-tertiary'
								size='lg'
								id='price'
								name='price'
								type='text'
								onChange={handleChange}
							/>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Type of Rent</Form.Label>
							<Form.Select
								size='lg'
								id='type_rent'
								name='type_rent'
								type='text'
								className='bg-tertiary'
								onChange={handleChange}
							>
								<option>-</option>
								{period.map((e, k) => {
									return (
										<option key={k} value={e.value}>
											{e.value}
										</option>
									);
								})}
							</Form.Select>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Amenities</Form.Label>
							<div
								className='d-flex gap-5'
								style={{ fontWeight: "500", fontSize: "1.2rem" }}
							>
								{amenities.map((amenities, k) => (
									<Form.Check
										key={k}
										//   style={{ fontWeight: "500", fontSize: "1.2rem" }}
										type='checkbox'
										id={amenities.value}
										label={amenities.value}
										name={amenities.value}
										value={amenities.value}
										onChange={handleAmenities}
									/>
								))}
							</div>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Bed Room</Form.Label>
							<Form.Select
								size='lg'
								id='bedroom'
								name='bedroom'
								type='text'
								className='bg-tertiary'
								onChange={handleChange}
							>
								<option>-</option>
								{nums.map((e, k) => {
									return (
										<option key={k} value={e.value}>
											{e.value}
										</option>
									);
								})}
							</Form.Select>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Bath Room</Form.Label>
							<Form.Select
								size='lg'
								id='bathroom'
								name='bathroom'
								type='text'
								className='bg-tertiary'
								onChange={handleChange}
							>
								<option>-</option>
								{nums.map((e, k) => {
									return (
										<option key={k} value={e.value}>
											{e.value}
										</option>
									);
								})}
							</Form.Select>
						</Form.Group>

						<Form.Group className='mb-3'>
							<Form.Label>Size</Form.Label>
							<Form.Control
								className='bg-tertiary'
								size='lg'
								id='size'
								name='size'
								type='text'
								onChange={handleChange}
								placeholder='size in sqft'
							/>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>District</Form.Label>
							<Form.Control
								className='bg-tertiary'
								size='lg'
								id='district'
								name='district'
								type='text'
								onChange={handleChange}
							/>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Description</Form.Label>
							<Form.Control
								className='bg-tertiary'
								size='lg'
								as='textarea'
								rows={3}
								type='text'
								id='description'
								name='description'
								onChange={handleChange}
							/>
						</Form.Group>
						<Col className='d-flex mb-5 justify-content-end'>
							<Button size='lg' type='submit' className='click px-5 py-2'>
								Save
							</Button>
						</Col>
					</Form>
				</div>
			</div>
		</Layout>
	);
}
