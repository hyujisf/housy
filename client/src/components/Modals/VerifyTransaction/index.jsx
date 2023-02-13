import React from "react";
import { Image, Table, Modal, Button } from "react-bootstrap";
import moment from "moment/moment";
import { useQuery } from "react-query";
import { API } from "lib/api";

import logo from "../../../assets/icons/Logo.svg";
import Stepper from "../../../assets/icons/Stepper.svg";

import { toCurrency } from "lib/Currency";

import css from "./index.module.css";

export default function VerifyTransaction(props) {
	
	const oneTransaction = props.transaction;

	// let { data: oneTransaction } = useQuery("getOneTransactionCache", async () => {
	// 	const response = await API.get("/getTransaction/" + id);
	// 	return response.data.data;
	// });

	console.log("getTrannnnnnn", oneTransaction)

	return (
		<Modal {...props} size='xl' centered>
			<Modal.Body className='p-4'>
				<div className='d-flex justify-content-between'>
					<div className={css.CardLeft}>
						<Image src={logo} alt='Logo' className={css.ImgLogo} />
						<div className='d-flex gap-3 align-items-center'>
							<div className='pe-4'>
								<h2>{oneTransaction?.name}</h2>
								<p style={{ width: "19.5rem" }}>
									{oneTransaction?.property.address}, <br></br>{oneTransaction?.property.district}
									, {oneTransaction?.property.city.name}
								</p>
								{oneTransaction?.status === "pending" || oneTransaction?.status === "waiting payment"? (
									<span className={css.BadgeWarning} style={{textTransform: "capitalize"}}>
										{oneTransaction?.status}
									</span>
								) : (
									<>
									{oneTransaction?.status === "success" ? (
										<span className={css.BadgeSuccess} style={{textTransform: "capitalize"}}>success</span>
									) : (
										<span className={css.BadgeDanger} style={{textTransform: "capitalize"}}>failed</span>
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
										<span className='text-secondary'>{moment(oneTransaction?.checkin).format("DD MMMM YYYY")}</span>
									</div>
									<div>
										<strong className='d-block'>Checkout</strong>
										<span className='text-secondary'>
											{moment(oneTransaction?.checkout).format("DD MMMM YYYY")}
										</span>
									</div>
								</div>
							</div>
							<div className=''>
								<div>
									<strong className='d-block'>Amenities</strong>
									<ul>
										{oneTransaction?.property.amenities.map((x, k) => {
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
									<span className='text-secondary ps-4'>{oneTransaction?.property.type_rent}</span>
								</div>
							</div>
						</div>
					</div>
					<div className={css.CardRight}>
						<div>
							<h1 className='fw-bold'>INVOICE</h1>

							<p>
								<strong>{moment(oneTransaction?.checkin).format("dddd")}</strong>,{" "}
								{moment(oneTransaction?.checkin).format("DD MMMM YYYY")}
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
								<td>{oneTransaction?.user.fullname}</td>
								<td>{oneTransaction?.user.gender}</td>
								<td>{oneTransaction?.user.phone}</td>
								<td className='fw-semibold text-black'>
									Long Time Rent : 1 {oneTransaction?.property.type_rent}
								</td>
							</tr>
							<tr>
								<td colSpan='4'></td>
								<td className='fw-semibold' style={{ width: "18rem" }}>
									total <span style={{ padding: "0 2.45rem" }}></span> :{" "}
									{oneTransaction?.status === "pending" || oneTransaction?.status === "waiting payment" ? (
										<span className={"text-danger"}>
											Rp. {oneTransaction?.total}
										</span>
									) : (
										<span className='text-success'>
											Rp. {oneTransaction?.total}
										</span>
									)}
								</td>
							</tr>
						</tbody>
					</Table>
				</div>
				
			</Modal.Body>
		</Modal>
	);
}
