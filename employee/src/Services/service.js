import axios from 'axios'
const Url = 'http://localhost:4000/api/v1/uat/'
const imgUrl = 'http://localhost:4000/'
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
    },
  })
}
function uploadsPost(url, body) {
  return axios({
    method: 'post',
    url: Url + url,
    data: body,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  })
}

function postCall(url, body) {
  return axios({
    method: 'post',
    url: Url + url,
    data: body,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')) || ''}`,
    },
  })
}
function getCall(url, body) {
  return axios({
    method: 'get',
    url: Url + url,
    data: body,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')) || ''}`,
    },
  })
}
function login(body) {
  return axios.post(Url + 'users/login', body, config)
}
function EmployeeId() {
  return axios.get(Url + 'users/getEmployeeId', config)
}
function getUserById(id) {
  return axios.get(Url + 'users/getUserById' + id, config)
}

export { registration, login, EmployeeId, getUserById, postCall, getCall, uploadsPost, imgUrl }
