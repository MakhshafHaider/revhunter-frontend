import React from 'react'
import { Navigate } from 'react-router-dom'
export default function ProtectedRoute({isLoggedIn, children}) {

    console.log('children',isLoggedIn, children)
    if(isLoggedIn){
        return children;
    }else{
        return <Navigate to='/login' />
    }
}
