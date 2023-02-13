import React, { useContext } from 'react'
import { AppContext } from 'context/AppContext';

import { Navigate, Outlet } from 'react-router-dom'

export default function PrivateRoute() {
  const [state, dispatch] = useContext(AppContext)
  return state.isLogin === true ? <Outlet /> : <Navigate to="/" />
}