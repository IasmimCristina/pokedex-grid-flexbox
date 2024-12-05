import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export interface HttpClient {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
}

type HttpClientOptions = {
  baseURL: string;
};

export const makeHttpClient = ({ baseURL }: HttpClientOptions): HttpClient => {
  const client = axios.create({ baseURL });

  return {
    get: client.get,
    post: client.post,
    put: client.put,
    patch: client.patch,
    delete: client.delete,
  };
};
