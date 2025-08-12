import axios from 'axios';

const API_URL = 'http://localhost:8000/api/comments/';
const HISTORY_URL = 'http://localhost:8000/api/comment-histories/';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.access) {
    return { Authorization: 'Bearer ' + user.access };
  }
  return {};
};

export const getComments = async (pageId) => {
  return await axios.get(API_URL + `?page=${pageId}`, { headers: getAuthHeader() });
};

export const createComment = async (commentData) => {
  return await axios.post(API_URL, commentData, { headers: getAuthHeader() });
};

export const updateComment = async (id, commentData) => {
  return await axios.put(API_URL + id + '/', commentData, { headers: getAuthHeader() });
};

export const deleteComment = async (id) => {
  return await axios.delete(API_URL + id + '/', { headers: getAuthHeader() });
};

export const getCommentHistory = async (commentId) => {
  return await axios.get(HISTORY_URL + `?comment=${commentId}`, { headers: getAuthHeader() });
};