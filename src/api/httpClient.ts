import axios from 'axios'

export type HttpClient = {
  get: typeof axios.get
  post: typeof axios.post
  put: typeof axios.put
  patch: typeof axios.patch
}

type HttpClientOptions = {
  baseURL: string
}

export const makeHttpClient = ({ baseURL }: HttpClientOptions): HttpClient => {
  const client = axios.create({ baseURL })

  return client
}

