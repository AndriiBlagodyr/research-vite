import axios, { AxiosRequestConfig } from 'axios';

type Method = 'GET' | 'POST' | 'DELETE' | 'PUT';

type Options = Omit<AxiosRequestConfig, 'data'> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: Record<string, any>;
  fullPath?: string;
  headers?: Record<string, string>;
  method: Method;
  responseType?: 'json' | 'text' | 'blob';
  timeout?: number;
  token?: string;
  url?: string;
};

async function request<TData>({
  url,
  fullPath,
  method,
  headers = {},
  body,
  ...rest
}: Options): Promise<TData> {
  try {
    const { data } = await axios({
      data: body,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      method,
      responseType: 'json',
      url: `${url}`,
      ...rest,
    });

    return data;
  } catch (error) {
    return Promise.reject(error);
  }
}

function get<TData>(options: Omit<Options, 'method'>) {
  return request<TData>({
    method: 'GET',
    ...options,
  });
}

function post<TData>(options: Omit<Options, 'method'>) {
  return request<TData>({
    method: 'POST',
    ...options,
  });
}

function put<TData>(options: Omit<Options, 'method'>) {
  return request<TData>({
    method: 'PUT',
    ...options,
  });
}

function del<TData>(options: Omit<Options, 'method'>) {
  return request<TData>({
    method: 'DELETE',
    ...options,
  });
}

const apiClient = {
  delete: del,
  get,
  post,
  put,
};

export { apiClient };
