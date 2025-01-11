import axios from 'axios';

const BASE_URL = 'http://192.168.1.4:5000';

// Response Interceptor
// api.interceptors.response.use(
//   response => response,
//   error => {
//     if (!error.response) {
//       return Promise.reject({
//         message: 'Tidak dapat terhubung ke server. Periksa koneksi Anda.'
//       });
//     }
//     return Promise.reject(error);
//   }
// );

export const api = {
  async addHydrationEntry(data) {
    try {
      const response = await axios.post(`${BASE_URL}/add`, {
        userId: "user123",
        amount: data.amount,
        date: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getHydrationLogs() {
    try {
      const response = await axios.get(`${BASE_URL}/log`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
