export interface ApiCallerOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
}

export class ApiCaller {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  async call<T>(endpoint: string, options: ApiCallerOptions = {}): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body
    } = options;

    const url = this.baseUrl ? `${this.baseUrl}${endpoint}` : endpoint;

    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error(`API call failed for ${url}:`, error);
      throw error;
    }
  }
}

export const externalApiCaller = new ApiCaller();
