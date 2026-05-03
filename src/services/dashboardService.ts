import api from './api';

export const getDashboardStats = async () => {
  try {
    const response = await api.get('/Dashboard/stats');
    return response.data; // { success: true, data: { processedCount, invalidCount, totalDbCount } }
  } catch (error) {
    console.error('Error in getDashboardStats service:', error);
    throw error;
  }
};