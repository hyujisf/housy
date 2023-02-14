import React, { useState, useContext } from "react";
import { HiCalendar } from "react-icons/hi2";
import { duration, bed, bath, amenities } from "data/Filter";
import { useMutation } from "react-query";
import { API } from "lib/api";
import Toast from "lib/sweetAlerts";
import { AppContext } from "context/AppContext";
import {
	ToggleButton,
	Button,
	// ButtonGroup,
	InputGroup,
	Form,
	Stack,
	Row,
	Col,
} from "react-bootstrap";

export default function Sidebar(props) {
	// const [checked, setChecked] = useState(false);
	const [durationVal, setDuration] = useState("");
	const [dateVal, setDate] = useState("");
	const [bedVal, setBed] = useState("");
	const [bathVal, setBath] = useState("");
	const [amenitiesVal, setAmenities] = useState([]);
	const [budgetVal, setBudget] = useState(9000000);

	const [state, dispatch] = useContext(AppContext);

	console.log(durationVal, dateVal, bedVal, bathVal, amenitiesVal, budgetVal);

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
			// const body = JSON.stringify(form);

			// Insert data for login process
			const response = await API.get(
				"/multiFilter?typeRent=" +
					durationVal +
					"&price=" +
					budgetVal +
					"&bedroom=" +
					bedVal +
					"&bathroom=" +
					bathVal +
					'&amenities=["' +
					amenitiesVal.join('","') +
					'"]' +
					"&date=" +
					dateVal,
				config
			);

			// Checking process
			if (response.data.data != null) {
				// Send data to useContext
				dispatch({
					type: "FILTER",
					status: state.isLogin,
					isUser: state.user,
					payload: response.data.data,
				});
				console.log("filter", response.data.data);
			}
		} catch (error) {
			Toast.fire({
				icon: "error",
				title: "Property not found",
			});
			console.log(error);
		}
	});

	return (
		<>
			<aside className={props.className}>
				<Form>
					<Stack gap={4}>
						<div className=''>
							<h4 className='mb-3'>
								<strong>Type of Rent</strong>
							</h4>

							<div className='d-flex gap-4'>
								{duration.map((durData, idk) => (
									<ToggleButton
										key={idk}
										size='lg'
										name='duration'
										type='radio'
										id={`dur-${idk}`}
										variant={
											durationVal === durData.value ? "primary" : "tertiary"
										}
										value={durData.value}
										checked={durationVal === durData.value}
										onChange={(e) => setDuration(e.target.value)}
										className={"w-100"}
									>
										{durData.name}
									</ToggleButton>
								))}
							</div>
						</div>

						<div className=''>
							<h4 className=''>
								<strong>Date</strong>
							</h4>

							<div className='d-flex gap-5'>
								<InputGroup size='lg' className='mb-3'>
									<InputGroup.Text id='inputGroup-sizing-sm'>
										<HiCalendar />
									</InputGroup.Text>
									<Form.Control
										type='date'
										aria-label='Small'
										value={dateVal}
										aria-describedby='inputGroup-sizing-sm'
										onChange={(e) => setDate(e.target.value)}
									/>
								</InputGroup>
							</div>
						</div>

						<Stack>
							<h4 className=''>
								<strong>Property Room</strong>
							</h4>
							<div className=''>
								<span>Bedroom</span>
								<div className='d-flex gap-3 mb-3'>
									{bed.map((bedData, idk) => (
										<ToggleButton
											key={idk}
											name='bedroom'
											type='radio'
											id={`bed-${idk}`}
											variant={
												bedVal === bedData.value ? "primary" : "tertiary"
											}
											value={bedData.value}
											checked={bedVal === bedData.value}
											onChange={(e) => setBed(e.target.value)}
											className={"w-100"}
										>
											{bedData.name}
										</ToggleButton>
									))}
								</div>
							</div>
							<div className=''>
								<span>Bathroom</span>
								<div className='d-flex gap-3'>
									{bath.map((bathData, idk) => (
										<ToggleButton
											key={idk}
											name='bathroom'
											type='radio'
											id={`bath-${idk}`}
											variant={
												bathVal === bathData.value ? "primary" : "tertiary"
											}
											value={bathData.value}
											checked={bathVal === bathData.value}
											onChange={(e) => setBath(e.target.value)}
											className={"w-100"}
										>
											{bathData.name}
										</ToggleButton>
									))}
								</div>
							</div>
						</Stack>

						<div className=''>
							<h4 className=''>
								<strong>Amenities</strong>
							</h4>

							<div className='d-flex flex-column'>
								{amenities.map((amenities, idk) => (
									<div key={idk} className='d-flex justify-content-between'>
										<Form.Label
											htmlFor={`amenities-${idk}`}
											className='text-secondary'
										>
											{amenities.value}
										</Form.Label>

										<Form.Check
											reverse
											name='amenities'
											type='checkbox'
											value={amenities.value}
											id={`amenities-${idk}`}
											checked={amenitiesVal.includes(amenities.value)}
											onChange={(e) => {
												if (e.target.checked) {
													setAmenities((prevState) => [
														...prevState,
														e.target.value,
													]);
												} else {
													setAmenities((prevState) =>
														prevState.filter((a) => a !== e.target.value)
													);
												}
											}}
										/>
									</div>
								))}
							</div>
						</div>

						<div className=''>
							<h4 className=''>
								<strong>Budget</strong>
							</h4>

							<Form.Group
								as={Row}
								className='d-flex align-items-center'
								controlId='formHorizontalEmail'
							>
								<Form.Label column sm={5}>
									Less than IDR.
								</Form.Label>
								<Col sm={7}>
									<Form.Control
										size='lg'
										name='price'
										type='number'
										placeholder='Price Range'
										value={budgetVal}
										onChange={(e) => setBudget(e.target.value)}
									/>
								</Col>
							</Form.Group>
						</div>
						<Form.Group className='ms-auto'>
							<Button
								size='lg'
								type='button'
								className='px-4'
								onClick={(e) => handleSubmit.mutate(e)}
							>
								Apply
							</Button>
						</Form.Group>
					</Stack>
				</Form>
			</aside>
		</>
	);
}
