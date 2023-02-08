import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import Layout from "layouts/withSearchbar";
import Modal from "components/Modals/Booking";

import { Button, Image, Table } from "react-bootstrap";
import logo from "assets/icons/Logo.svg";
import Stepper from "assets/icons/Stepper.svg";

import css from "./Booking.module.css";
import { toCurrency } from "lib/Currency";
import { API } from "lib/api";

import { useQuery } from "react-query";
import { AppContext } from "context/AppContext";

import moment from "moment/moment";
import { MillisToDate } from "lib/dateConvertion";
export default function MyBooking() {
	const [state, dispatch] = useContext(AppContext);
	const [showModal, setShowModal] = useState();

	const data = JSON.parse(localStorage.getItem("Booking"));

	let { data: user } = useQuery("userBookCache", async () => {
		const response = await API.get("/user/" + state.user.id);
		return response.data.data;
	});
	console.log("data user", user);
	let { data: property } = useQuery("propertyBookCache", async () => {
		const response = await API.get("/property/" + data.property);
		return response.data.data;
	});
	console.log("data property", property);

	const title = "My Booking";
	document.title = "Housy | " + title;

	return (
		<Layout className='bg-tertiary'>
			<div className=''>
				<div className={css.MaxWidth}>
					{data?.checkin ? (
						<div className={css.Card}>
							<div className='d-flex justify-content-between'>
								<div className={css.CardLeft}>
									<Image src={logo} alt='Logo' className={css.ImgLogo} />
									<div className='d-flex gap-3 align-items-center'>
										<div className='pe-4'>
											<h2>{property?.name}</h2>
											<p style={{ width: "19.5rem" }}>
												{property?.address}, {property?.district},{" "}
												{property?.city.name}
											</p>
											<span className={css.Badge}>{data.status}</span>
										</div>
										<div
											style={{ width: "14rem" }}
											className='d-flex align-items-center gap-4'
										>
											<div className=''>
												<Image src={Stepper} width={16} />
											</div>
											<div className='d-flex flex-column gap-4'>
												<div>
													<strong className='d-block'>Checkin</strong>
													<span className='text-secondary'>
														{MillisToDate(data?.checkin)}
													</span>
												</div>
												<div>
													<strong className='d-block'>Checkout</strong>
													<span className='text-secondary'>
														{MillisToDate(data?.checkout)}
													</span>
												</div>
											</div>
										</div>
										<div className=''>
											<div>
												<strong className='d-block'>Amenities</strong>
												<ul>
													{property?.amenities.map((x, k) => {
														return (
															<li key={k} className='text-secondary'>
																{x}
															</li>
														);
													})}
												</ul>
											</div>
											<div>
												<strong className='d-block'>Type of rent</strong>
												<span className='text-secondary ps-4'>
													{property?.type_rent}
												</span>
											</div>
										</div>
									</div>
								</div>
								<div className={css.CardRight}>
									<div>
										<h1 className='fw-bold'>Booking</h1>

										<p>
											<strong>{moment(data?.checkin).format("dddd")}</strong>,{" "}
											{MillisToDate(data?.checkin)}
										</p>
									</div>
									<div className={css.WrapperCardImage}>
										<Image
											className={css.CardImage}
											src={process.env.PUBLIC_URL + "/img/Uploads/receipt.png"}
										/>
									</div>
									<small className='text-secondary'>Upload payment proof</small>
								</div>
							</div>
							<div className=''>
								<Table className='mt-4 mb-5'>
									<thead>
										<tr>
											<th>No</th>
											<th>Full Name</th>
											<th>Gender</th>
											<th>Phone</th>
											<th></th>
										</tr>
									</thead>
									<tbody>
										<tr className='text-secondary'>
											<td>1</td>
											<td>{user?.fullname}</td>
											<td>{user?.gender}</td>
											<td>{user?.phone}</td>
											<td className='fw-semibold text-black'>
												Long Time Rent : 1 Year
											</td>
										</tr>
										<tr>
											<td colSpan='4'></td>
											<td className='fw-semibold' style={{ width: "18rem" }}>
												total <span style={{ padding: "0 2.45rem" }}></span> :{" "}
												<span className='text-danger'>
													{toCurrency(data?.total)}
												</span>
											</td>
										</tr>
									</tbody>
								</Table>
							</div>
							<div className=''>
								<div className='d-flex justify-content-end'>
									<Button
										type='button'
										// onClick={RegistingHistory}
										className={"btn btn-primary fw-bold fs-5 ms-auto"}
										style={{ padding: "1rem 6rem" }}
									>
										PAY
									</Button>
								</div>
							</div>
						</div>
					) : (
						<div
							className='d-flex align-items-center justify-content-center'
							style={{ minHeight: "90vh" }}
						>
							<div className='text-center bg-white rounded-4 p-5 shadow'>
								<h2>Booking Kosong</h2>
								<p>Silahkan lakukan checkin terlebih dahulu</p>
								<Link to='/' className='btn btn-primary px-4 py-2 mt-2'>
									Kembali
								</Link>
							</div>
						</div>
					)}
				</div>
			</div>

			<Modal
				show={showModal}
				// gotoregister={gotoRegistration}
				onHide={() => setShowModal(false)}
			/>
		</Layout>
	);
}
