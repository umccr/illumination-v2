import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ProjectPagedList } from "../openapi/api";

export const basicAxiosConfig: AxiosRequestConfig = {
  baseURL: "http://localhost:5000/ica/rest",
  method: "GET",
  // headers: some secure token to access lambda
};

export async function runAxios(additionalAxiosConfig?: AxiosRequestConfig) {
  const axiosConfig = { ...basicAxiosConfig, ...additionalAxiosConfig };

  const axiosResponse = await axios(axiosConfig);

  return axiosResponse;
}
