import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api', // Thay thế bằng base URL API backend của bạn
  // Các cấu hình chung khác cho Axios có thể được thêm vào đây
  // ví dụ: timeout, headers mặc định, v.v.
});

// Bạn có thể thêm các interceptors ở đây để xử lý token, lỗi, v.v.
// Ví dụ (như chúng ta đã thảo luận trước đó về xử lý token hết hạn):
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const refreshResponse = await axios.post('/api/auth/refresh', { refreshToken });
          if (refreshResponse.data.accessToken) {
            const newAccessToken = refreshResponse.data.accessToken;
            localStorage.setItem('token', newAccessToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
          } else {
            // Xóa token và chuyển hướng đến trang đăng nhập
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login'; // Sử dụng window.location.href trong client component
          }
        } catch (refreshError) {
          // Xóa token và chuyển hướng đến trang đăng nhập
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login'; // Sử dụng window.location.href trong client component
          return Promise.reject(refreshError);
        }
      } else if (token) {
        // Xóa token và chuyển hướng đến trang đăng nhập
        localStorage.removeItem('token');
        window.location.href = '/login'; // Sử dụng window.location.href trong client component
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;