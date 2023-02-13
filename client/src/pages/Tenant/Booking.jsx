import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "layouts/withoutSearchbar";
// import Modal from "components/Modals/Booking";
import { useQuery } from "react-query";
import { API } from "lib/api";
import { useMutation } from "react-query";

import { Button, Image, Table } from "react-bootstrap";
import logo from "assets/icons/Logo.svg";
import Stepper from "assets/icons/Stepper.svg";

import css from "./Booking.module.css";
// import { toCurrency } from "lib/Currency";

import moment from "moment/moment";
export default function MyBooking() {
	// const [showModal, setShowModal] = useState();

	let { data: transaction } = useQuery("getBookingCache", async () => {
		const response = await API.get("/myBooking");
		return response.data.data;
	});

	console.log("booking", transaction);

	// // Fetching product data from database
	// let { data: midtrans} = useQuery("getMidtransCache", async () => {
	// 	const response = await API.get("/transaction/");
	// 	return response.data.data;
	// });

	
	// console.log("midtrans", midtrans)

	useEffect(() => {
		//change this to the script source you want to load, for example this is snap.js sandbox env
		const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
		//change this according to your client-key
		const myMidtransClientKey = "SB-Mid-client-MxZZnkEzX-K3qdGi";
	
		let scriptTag = document.createElement("script");
		scriptTag.src = midtransScriptUrl;
		// optional if you want to set script attribute
		// for example snap.js have data-client-key attribute
		scriptTag.setAttribute("data-client-key", myMidtransClientKey);
	
		document.body.appendChild(scriptTag);
		return () => {
		  document.body.removeChild(scriptTag);
		};
	  }, []);

	  const handlePay = useMutation(async () => {
		try {
		  // Get data from transaction
		//   const data = {
		// 	property_id: transaction?.property_id,
		// 	checkin: moment(transaction?.checkin).format('YYYY-MM-DD'),
		// 	checkout: moment(transaction?.checkout).format('YYYY-MM-DD'),
		// 	status: "pending",
		// 	total: transaction?.total,
		// };
	
		//   // Data body
		//   const body = JSON.stringify(data);
	
		  //Configuration
		  const config = {
			// method: "PATCH",
			headers: {
			  Authorization: "Basic " + localStorage.token,
			  "Content-type": "application/json",
			},
		  };
	
		  // Insert transaction data
		  const response = await API.get("/createMidtrans/" + transaction?.id, config);
		  console.log("midtrans response",response);
		  const token = response.data.data.token;
		  console.log("token", token)

		  window.snap.pay(token, {
			onSuccess: function (result) {
			  /* You may add your own implementation here */
			  console.log(result);
			  alert("Payment success");
			},
			onPending: function (result) {
			  /* You may add your own implementation here */
			  console.log(result);
			  alert("Payment pending");
			},
			onError: function (result) {
			  /* You may add your own implementation here */
			  console.log(result);
			  alert("Payment error");
			},
			onClose: function () {
			  /* You may add your own implementation here */
			  alert("you closed the popup without finishing the payment");
			},
		  });
		} catch (error) {
		  console.log(error);
		}
	  });


	return (
		<Layout className='bg-tertiary'>
			<div className=''>
				<div className={css.MaxWidth}>
					{ transaction === undefined ? (
						<div
							className='d-flex align-items-center justify-content-center'
							style={{ minHeight: "90vh" }}
						>
							<div className='text-center bg-white rounded-4 p-5 shadow'>
								<h2>Booking Kosong</h2>
								<p>Silahkan lakukan transaksi terlebih dahulu</p>
								<Link to='/' className='btn btn-primary px-4 py-2 mt-2'>
									Kembali
								</Link>
							</div>
						</div>  
					) : (
						<>
						<div className={css.Card}>
							<div className='d-flex justify-content-between'>
								<div className={css.CardLeft}>
									<Image src={logo} alt='Logo' className={css.ImgLogo} />
									<div className='d-flex gap-3 align-items-center'>
										<div className='pe-4'>
											<h2>{transaction?.property.name}</h2>
											<p style={{ width: "19.5rem" }}>
												{transaction?.property.address}, <br></br>{transaction?.property.district}
												, {transaction?.property.city.name}
											</p>
											<span className={css.Badge} style={{textTransform: "capitalize"}}>{transaction?.status}</span>
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
														{moment(transaction?.checkin).format("DD MMMM YYYY")}
													</span>
												</div>
												<div>
													<strong className='d-block'>Checkout</strong>
													<span className='text-secondary'>
														{moment(transaction?.checkout).format("DD MMMM YYYY")}
													</span>
												</div>
											</div>
										</div>
										<div className=''>
											<div>
												<strong className='d-block'>Amenities</strong>
												<ul>
													{transaction?.property.amenities.map((x, k) => {
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
													{transaction?.property.type_rent}
												</span>
											</div>
										</div>
									</div>
								</div>
								<div className={css.CardRight}>
									<div>
										<h1 className='fw-bold'>Booking</h1>

										<p>
											<strong>{moment(transaction?.checkin).format("dddd")}</strong>,{" "}
											{moment(transaction?.checkin).format("DD MMMM YYYY")}
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
											<td>{transaction?.user.fullname}</td>
											<td>{transaction?.user.gender}</td>
											<td>{transaction?.user.phone}</td>
											<td className='fw-semibold text-black'>
												Long Time Rent : 1 {transaction?.property.type_rent}
											</td>
										</tr>
										<tr>
											<td colSpan='4'></td>
											<td className='fw-semibold' style={{ width: "18rem" }}>
												total <span style={{ padding: "0 2.45rem" }}></span> :{" "}
												<span className='text-danger'>
													Rp. {transaction?.property.price}
												</span>
											</td>
										</tr>
									</tbody>
								</Table>
							</div>
							
						</div>
						<div className='mt-4 me-5'>
							<div className='d-flex justify-content-end'>
								<Button
									type='button'
									onClick={() => handlePay.mutate()}
									className={"btn btn-primary fw-bold fs-5 ms-auto"}
									style={{ padding: "1rem 6rem" }}
								>
									PAY
								</Button>
							</div>
						</div>
						</>

					)}
				</div>
			</div>
		</Layout>	
	);
}