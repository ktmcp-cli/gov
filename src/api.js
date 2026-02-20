import axios from 'axios';
import { getConfig } from './config.js';

function getClient() {
  const { baseUrl } = getConfig();
  return axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export async function searchJobs(params = {}) {
  const client = getClient();
  const response = await client.get('/jobs', { params });
  return response.data;
}

export async function getJob(id) {
  const client = getClient();
  const response = await client.get(`/jobs/${id}`);
  return response.data;
}

export async function getJobTypes() {
  const client = getClient();
  const response = await client.get('/job-types');
  return response.data;
}

export async function getIndustries() {
  const client = getClient();
  const response = await client.get('/industries');
  return response.data;
}

export async function getRegions() {
  const client = getClient();
  const response = await client.get('/regions');
  return response.data;
}
