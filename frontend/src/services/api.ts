const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

interface ChatRequest {
  message: string;
}

interface ChatResponse {
  response: string;
}

interface HealthResponse {
  status: string;
}

interface ApiError {
  message: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async healthCheck(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/');
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async sendChatMessage(chatRequest: ChatRequest, token: string): Promise<ChatResponse> {
    return this.request<ChatResponse>('/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(chatRequest),
    });
  }
}

const apiClient = new ApiClient(API_BASE_URL);

export const healthCheck = () => apiClient.healthCheck();
export const login = (credentials: LoginRequest) => apiClient.login(credentials);
export const sendChatMessage = (chatRequest: ChatRequest, token: string) => 
  apiClient.sendChatMessage(chatRequest, token);

export type { LoginRequest, LoginResponse, ChatRequest, ChatResponse, HealthResponse };