export interface ApiCallerOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  token?: string;
}

export async function apiCaller<T = any>(endpoint: string, options: ApiCallerOptions = {}): Promise<T> {
  const { method = 'GET', headers = {}, body, token } = options;
  const fetchHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };
  if (token) fetchHeaders['Authorization'] = `Bearer ${token}`;

  let fetchOptions: RequestInit = {
    method,
    headers: fetchHeaders,
  };

  switch (method.toUpperCase()) {
    case 'GET':
      break;
    case 'POST':
    case 'PUT':
    case 'PATCH':
      fetchOptions = { ...fetchOptions, body: JSON.stringify(body) };
      break;
    case 'DELETE':
      break;
    default:
      throw new Error(`HTTP method not supported: ${method}`);
  }

  const response = await fetch(endpoint, fetchOptions);
  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }
  if (!response.ok) throw new Error(data.message || 'API error');
  return data;
}
