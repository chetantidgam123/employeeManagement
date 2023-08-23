import axios from 'axios'
const Url = 'http://localhost:4000/api/v1/uat/'
// const Url = "https://ecomservice.onrender.com/"
var token = JSON.parse(localStorage.getItem('token')) || ''
const config = {
  headers: {
    "Content-type": "application/json",
    Authorization: `Bearer ${token}`,
  },
}

function registration(body) {
  return axios({
    method: 'post',
    url: Url + "users/create_account",
    data: body,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
       // Important: Set the content type to multipart/form-data
    },
  })
  // return axios.post(Url + "users/create_account", body, config)
}
function login(body) {
  return axios.post(Url + 'users/login', body, config)
}
function getAllEmployee() {
  token = JSON.parse(localStorage.getItem('token')) || ''
  return axios.get(Url + 'users/getAllEmployee', config)
}
function EmployeeId() {
  return axios.get(Url + 'users/getEmployeeId', config)
}
function getUserById(id) {
  return axios.get(Url + 'users/getUserById'+id, config)
}

export { registration, login, getAllEmployee, EmployeeId,getUserById }
