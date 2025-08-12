import axios from 'axios';

const API_URL = 'http://localhost:8000/api/users/';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.access) {
    return { Authorization: 'Bearer ' + user.access };
  }
  return {};
};

export const getUsers = async () => {
  return await axios.get(API_URL, { headers: getAuthHeader() });
};

export const getUser = async (id) => {
  return await axios.get(API_URL + id + '/', { headers: getAuthHeader() });
};

export const createUser = async (userData) => {
  return await axios.post(API_URL, userData, { headers: getAuthHeader() });
};

export const updateUser = async (id, userData) => {
  return await axios.put(API_URL + id + '/', userData, { headers: getAuthHeader() });
};

export const deleteUser = async (id) => {
  return await axios.delete(API_URL + id + '/', { headers: getAuthHeader() });
};