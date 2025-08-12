import axios from 'axios';

const API_URL = 'http://localhost:8000/api/pages/';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.access) {
    return { Authorization: 'Bearer ' + user.access };
  }
  return {};
};

export const getPages = async () => {
  return await axios.get(API_URL, { headers: getAuthHeader() });
};

export const getPage = async (id) => {
  return await axios.get(API_URL + id + '/', { headers: getAuthHeader() });
};

export const createPage = async (pageData) => {
  return await axios.post(API_URL, pageData, { headers: getAuthHeader() });
};

export const updatePage = async (id, pageData) => {
  return await axios.put(API_URL + id + '/', pageData, { headers: getAuthHeader() });
};

export const deletePage = async (id) => {
  return await axios.delete(API_URL + id + '/', { headers: getAuthHeader() });
};