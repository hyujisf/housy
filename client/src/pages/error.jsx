import React from "react";

export default function NoMatch() {
	return (
		<>
			<div className=''>
				<div
					className='d-flex align-items-center justify-content-center flex-column'
					style={{ minHeight: "100vh" }}
				>
					<h1 style={{ fontSize: "12rem" }} className='fw-bold'>
						404
					</h1>
					<h2 className='d-block'>Page Not Found</h2>
				</div>
			</div>
		</>
	);
}
