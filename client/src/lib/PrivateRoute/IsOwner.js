import React from 'react'

import { Outlet, Navigate, useNavigate } from 'react-router-dom'

export default function PrivateRoute() {
  const Redirect = useNavigate()
  const isLogin = JSON.parse(localStorage.getItem("isLogin"));
  const user = JSON.parse(localStorage.getItem("userData")).find(
    (obj) => obj.username === isLogin.username
  );
  return user.role === "Owner" ? <Outlet /> : <Redirect to="/" />
}