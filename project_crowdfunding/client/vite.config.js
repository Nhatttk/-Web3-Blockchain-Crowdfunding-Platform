import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis",
    "process.env": {},
  },
  server: {
    host: '0.0.0.0', // Cho phép truy cập từ mọi địa chỉ IP
    port: 5173, // Port mặc định của Vite
  },
});