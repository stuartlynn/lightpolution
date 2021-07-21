import useSWR from 'swr'


export const useProject= ()=>{
  const {data,error} = useSWR('/projects/16495')
  console.log("project fetch ", data, error)
  return {data,error}
}
