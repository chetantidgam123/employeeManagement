import axios from "axios"
const Url = "http://localhost:4000/api/v1/uat/"
// const Url = "https://ecomservice.onrender.com/"
const token = JSON.parse(localStorage.getItem('token')) || ''
const config = {
    headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`
    },
}


function registration(body) {
    return axios.post(Url + "signup", body, config)
}
function login(body) {
    return axios.post(Url + "users/login", body, config)
}
function getAllEmployee() {
    return axios.get(Url + "users/getAllEmployee", config)
}


export { registration, login,getAllEmployee}