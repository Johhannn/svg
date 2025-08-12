import axios from 'axios';

const API_URL = 'http://localhost:8000/api/page-permissions/';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.access) {
    return { Authorization: 'Bearer ' + user.access };
  }
  return {};
};

export const getPermissions = async (pageId) => {
  return await axios.get(API_URL + `?page=${pageId}`, { headers: getAuthHeader() });
};

export const createPermission = async (permissionData) => {
  return await axios.post(API_URL, permissionData, { headers: getAuthHeader() });
};

export const updatePermission = async (id, permissionData) => {
  return await axios.put(API_URL + id + '/', permissionData, { headers: getAuthHeader() });
};

export const deletePermission = async (id) => {
  return await axios.delete(API_URL + id + '/', { headers: getAuthHeader() });
};