import {useState,useEffect} from 'react';

export const useAuth = ()=>{
  useEffect(()=>{
    if(window.location.hash.includes("access_token")){
      const parts = window.location.hash.split("&")

      const token = parts[0].split('=')[1]
      const tokenType = parts[1].split('=')[1]
      const expires = parts[2].split('=')[1]
      const state= parts[3].split('=')[1]

      console.log("token ",token, 'token_type ', tokenType, 'state',state, 'expires', expires)
      localStorage.setItem('token', token)
      localStorage.setItem('expires', expires)
    }
  }
  ,[])
}
