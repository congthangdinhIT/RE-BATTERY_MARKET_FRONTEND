import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { initStorage } from './lib/storage';
import './index.css';

// Khởi tạo dữ liệu mẫu vào LocalStorage nếu chưa có
initStorage();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

