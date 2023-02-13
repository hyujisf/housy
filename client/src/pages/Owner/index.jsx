import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { RxMagnifyingGlass } from "react-icons/rx";

import Layout from "layouts/withoutSearchbar";
import VerifyModal from "components/Modals/VerifyTransaction";
import css from "./index.module.css";
import { useQuery } from "react-query";
import { API } from "lib/api";

export default function Home() {
	const [verifyModal, setVerifyModal] = useState(false);
	const [transId, setTransId] = useState(0);
	let { data: Transaction } = useQuery("getOwnerAllTransactionCache", async () => {
		const response = await API.get("/allTransaction");
		return response.data.data;
	});

	console.log("newnew", Transaction)


	const handleAction = (id) => {
		setVerifyModal(true);
		setTransId(id);
		
	};
	useEffect(() => {
		console.log('transId changed', transId);
		// Lakukan apa yang ingin Anda lakukan ketika transId berubah di sini
		
	
	}, [transId]);
	let { data: oneTransaction } = useQuery("getOneTransactionCache", async () => {
		const response = await API.get("/getTransaction/" + String(transId));
		return response.data.data;
	});
	

	console.log("allTrans", oneTransaction)
	
	return (
		<Layout className={"bg-tertiary"}>
			<div className={css.MaxWidth}>
				<div className={css.Card}>
					<h2 className='fw-bold fs-1 my-4'>Incoming Transaction</h2>
					<Table hover size='lg' className={css.TableData}>
						<thead>
							<tr>
								<th>No</th>
								<th>Users</th>
								<th>Type of Rent</th>
								<th>Status Payment</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{Transaction ? (
								<>
									{Transaction?.map((b, i) => {
										return (
											<tr key={i}>
												<td>{i + 1}</td>
												<td>{b.user.fullname}</td>
												<td>{b.property.type_rent}</td>
												{b.status === "pending" || b.status === "waiting payment" ? (
													<td className={css.TextWarning}>{b.status}</td>
												) : (
													<>
														{b.status === "success" ? (
															<td className={css.TextSuccess}>Success</td>
														) : (
															<td className={css.TextDanger}>Failed</td>
														)}
													</>
												)}
												<td>
													<span onClick={() => handleAction(b.id)}>
														<RxMagnifyingGlass className={css.IconButton} />
													</span>
												</td>
											</tr>
										);
									})}
									<VerifyModal
										transaction={oneTransaction}
										show={verifyModal}
										onHide={() => setVerifyModal(false)}
									/>
								</>
							) : (
								<tr>
									{" "}
									<td colSpan={6} className='text-center'>
										Data Kosong
									</td>
								</tr>
							)}
						</tbody>
					</Table>
				</div>
			</div>
		</Layout>
	);
}
