import React from "react";
import { Link } from "react-router-dom";
import Layout from "layouts/withoutSearchbar";

import { Image, Table } from "react-bootstrap";
import logo from "assets/icons/Logo.svg";
import Stepper from "assets/icons/Stepper.svg";

import css from "./History.module.css";
// import { toCurrency } from "lib/Currency";
import { useQuery } from "react-query";
import { API } from "lib/api";

import moment from "moment/moment";
export default function History() {
	let { data: history } = useQuery("getHistoryTenantCache", async () => {
		const response = await API.get("/historyTenant");
		return response.data.data;
	});

	console.log("history", history)

	return (
		<Layout className='bg-tertiary'>
			<div className=''>
				<div className={css.MaxWidth}>
					{history === undefined || history.length === 0 ? (
						<div
							className='d-flex align-items-center justify-content-center'
							style={{ minHeight: "90vh" }}
						>
							<div className='text-center bg-white rounded-4 p-5 shadow'>
								<h2>History Kosong</h2>
								<p>Silahkan lakukan transaksi terlebih dahulu</p>
								<Link to='/' className='btn btn-primary px-4 py-2 mt-2'>
									Kembali
								</Link>
							</div>
						</div>
					) : (
						<>
						{history?.map((history, k) => {
						return (
							<div className={css.Card}>
								<div className='d-flex justify-content-between'>
									<div className={css.CardLeft}>
										<Image src={logo} alt='Logo' className={css.ImgLogo} />
										<div className='d-flex gap-3 align-items-center'>
											<div className='pe-4'>
												<h2>{history.property.name}</h2>
												<p style={{ width: "19.5rem" }}>
													{history.property.address}, <br></br>{history.property.district}
													, {history.property.city.name}
												</p>
												{history.status === "pending" || history.status === "waiting payment" ? (
													<span className={css.BadgeWarning} style={{textTransform: "capitalize"}}>
														{history.status}
													</span>
												) : (
													<>
													{history.status === "success" ? (
														<span className={css.BadgeSuccess} style={{textTransform: "capitalize"}}>success</span>
													) : (
														<span className={css.BadgeError} style={{textTransform: "capitalize"}}>failed</span>
													)}
													</>
												)}
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
														<span className='text-secondary'>{moment(history.checkin).format("DD MMMM YYYY")}</span>
													</div>
													<div>
														<strong className='d-block'>Checkout</strong>
														<span className='text-secondary'>
														{moment(history.checkout).format("DD MMMM YYYY")}
														</span>
													</div>
												</div>
											</div>
											<div className=''>
												<div>
													<strong className='d-block'>Amenities</strong>
													<ul>
													{history.property.amenities.map((x, k) => {
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
													<span className='text-secondary ps-4'>{history.property.type_rent}</span>
												</div>
											</div>
										</div>
									</div>
									<div className={css.CardRight}>
										<div>
											<h1 className='fw-bold'>Booking</h1>

											<p>
												<strong>{moment(history.checkin).format("dddd")}</strong>,{" "}
												{moment(history.checkin).format("DD MMMM YYYY")}
											</p>
										</div>
										<div className={css.WrapperCardImage}>
											<Image
												className={css.CardImage}
												src={process.env.PUBLIC_URL + "/img/Uploads/qr-code.png"}
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
												<td>{history.user.fullname}</td>
												<td>{history.user.gender}</td>
												<td>{history.user.phone}</td>
												<td className='fw-semibold text-black'>
													Long Time Rent : 1 {history.property.type_rent}
												</td>
											</tr>
											<tr>
												<td colSpan='4'></td>
												<td className='fw-semibold' style={{ width: "18rem" }}>
													total <span style={{ padding: "0 2.45rem" }}></span> :{" "}
													{history.status === "pending" || history.status === "waiting payment" ? (
														<span className={"text-danger"}>
															Rp. {history.total}
														</span>
													) : (
														<span className='text-success'>
															Rp. {history.total}
														</span>
													)}
												</td>
											</tr>
										</tbody>
									</Table>
								</div>
							</div>	
						);
						})}
						</>
					)}
				</div>
			</div>
		</Layout>
	);
}
