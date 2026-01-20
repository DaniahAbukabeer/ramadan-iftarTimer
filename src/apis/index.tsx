import { View, Text } from 'react-native'
import React from 'react'
import Axios from 'axios';
import type { AxiosError, AxiosRequestConfig, AxiosResponse, AxiosStatic } from 'axios';
import { Alert, Platform } from 'react-native';
import _, { get } from 'lodash';
export const PRAIER_BASEAPI = 'https://api.aladhan.com/v1';


const request = Axios as AxiosStatic & {
  setSession: any;
  removeSession: any;
  setUrl: any;
};

export async function getBaseUrl() {
  const baseURL = PRAIER_BASEAPI;
  return baseURL;
}

const onSuccess: any = function (response: AxiosResponse) {
  console.log('Request Successful!', response);
  return response?.data;
};
const onError = async function (error: AxiosError) {
  console.error('FAILED Response!:', get(error, 'response'));
  console.error('FAILED Status:', get(error, 'response?.status'));
  console.error('FAILED Data:', get(error, 'response?.data'));
  console.error('FAILED Headers:', get(error, 'response?.headers'));

  if (Axios.isCancel(error)) {
    return Promise.reject(error);
  }

  const originalRequest = get(error, 'config', {}) as any;
  const errorStatus = get(error, 'response.status', 0);
  // eslint-disable-next-line no-empty
  if (errorStatus === '422') {
  } else {
    // @ts-ignore
    return Promise.reject(error?.response);
  }
};

request.interceptors.request.use((config) => {
  console.log('Request Headers:', JSON.stringify(config.headers, null, 2)); // Debugging
  console.log('Request Body:', JSON.stringify(config.data, null, 2)); // Log the body of the request
  console.log('Request config:', JSON.stringify(config, null, 2)); // Log the body of the request

  return config;
});

request.interceptors.response.use(onSuccess, onError);

// eslint-disable-next-line func-names
request.setUrl = async function () {
  const url = await getBaseUrl();
  this.defaults.baseURL = url;
};

request.defaults.baseURL = PRAIER_BASEAPI;

export default request;
