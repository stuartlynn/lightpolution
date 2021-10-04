import jwt from 'jsonwebtoken'
import {zooniverseApi} from 'zooApi'
import {UserToken, User} from 'shared/types'
import useSWR from 'swr'

export const useUser= () => {
    const token = localStorage.getItem('token')
    const userDetails: any = token ? jwt.decode(token) : null
    const {data,error} = useSWR(userDetails ? `/users/${userDetails.data.id}` : null, zooniverseApi)

    const signOut = ()=> {localStorage.removeItem('token')}
    const signIn = ()=> {window.location.href= 'http://localhost:8080/login'}

    if(data) {
      return {user: data.users[0], error, signOut, signIn}  
    }
    return {user: {}, error:null, signOut, signIn}
   // return null
}
