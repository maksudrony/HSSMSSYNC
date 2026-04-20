import api from './api';

// Define the shape of what we expect back from the .NET API
export interface LoginResponse {
  success: boolean;
  message?: string;
  employeeName?: string;
  enrollmentId?: number;
}

export const authService = {
  login: async (enrollmentId: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/Auth/login', {
        enrollmentId: parseInt(enrollmentId, 10),
        password: password,
      });
      return response.data;
    } catch (error: any) {
        console.log("AXIOS FULL ERROR:", error);
        console.log("AXIOS RESPONSE:", error?.response);
        console.log("AXIOS MESSAGE:", error?.message);
      // If the API returns a 401 Unauthorized or 400 Bad Request, 
      // Axios throws it to the catch block. We extract the API's custom message.
      if (error.response && error.response.data) {
        return error.response.data as LoginResponse;
      }
      // If the server is completely down or unreachable
      throw new Error(error.message); // 'Could not reach the authentication server.'
    }
  },
};