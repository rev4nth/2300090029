import axios from 'axios';

const baseurl = 'http://4.224.186.213/evaluation-service';
export function getEvalToken() {
  return localStorage.getItem('eval_token');
}
const evaluationApi = axios.create({
  baseURL: baseurl,
  headers: {
    'Content-Type': 'application/json',
  },
});
const logApi = axios.create({
  baseURL: baseurl,
  headers: {
    'Content-Type': 'application/json',
  },
});
evaluationApi.interceptors.request.use((config) => {
  const token = getEvalToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

logApi.interceptors.request.use((config) => {
  const token = getEvalToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getEvaluationNotificationsApi = (params = {}) =>
  evaluationApi.get('/notifications', { params });

export const sendLogApi = (body) =>
  logApi.post('/logs', body);