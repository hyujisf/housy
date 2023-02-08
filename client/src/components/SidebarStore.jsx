import React, { useState } from "react";
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
import { HiCalendar } from "react-icons/hi2";

export default function Sidebar(props) {
	// const [checked, setChecked] = useState(false);
	const [durationVal, setDuration] = useState("");
	const [dateVal, setDate] = useState("");
	const [bedVal, setBed] = useState("");
	const [bathVal, setBath] = useState("");
	const [amenitiesVal, setAmenities] = useState("");
	const [budgetVal, setBudget] = useState(9000000);

	const startFind = () => {
		props.SearchRoom({
			duration: durationVal,
			date: dateVal,
			bedroom: bedVal,
			bathroom: bathVal,
			amenities: amenitiesVal,
			budget: budgetVal,
		});
	};
	console.log(durationVal, bedVal, bathVal, amenitiesVal, budgetVal);

	const duration = [
		{ name: "Day", value: "Day" },
		{ name: "Month", value: "Donth" },
		{ name: "Year", value: "Year" },
	];
	const bed = [
		{ name: "1", value: "1" },
		{ name: "2", value: "2" },
		{ name: "3", value: "3" },
		{ name: "4", value: "4" },
		{ name: "5+", value: "5" },
	];

	const bath = [
		{ name: "1", value: "1" },
		{ name: "2", value: "2" },
		{ name: "3", value: "3" },
		{ name: "4", value: "4" },
		{ name: "5+", value: "5" },
	];

	const amenities = [
		{ value: "Furnished" },
		{ value: "Pet Allowed" },
		{ value: "Shared Accomodation" },
	];

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
											// checked={amenitiesVal === amenities.name}
											onChange={(e) => setAmenities(e.target.value)}
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
								onClick={startFind}
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
