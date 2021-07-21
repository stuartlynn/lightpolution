const ZOONIVERSE_API = "https://www.zooniverse.org/api"

export const zooniverseApi= (resource:any, options:any)=>{
    const token = localStorage.getItem("token");
    const headers = new Headers();
    if(token){
      headers.append("Authorization", `Bearer ${token}`)
      headers.append("Content-Type", "application/json")
      headers.append("Accept", "application/vnd.api+json; version=1")
    }
    return fetch(`${ZOONIVERSE_API}${resource}`, {
            headers
        }).then(res => res.json())

}
