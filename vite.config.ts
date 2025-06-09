import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, ".env"));
  return {
    resolve: {
      alias: [
        { find: "@config", replacement: "/src/config" },
        { find: "@components", replacement: "/src/components" },
        { find: "@", replacement: "/src" },
      ],
    },
    base: "./",

    plugins: [react()],
    build: {
      outDir: "dist",
      sourcemap: true, // 소스 맵 생성 여부 설정
      minify: "terser", // 코드 압축 방식 설정 (기본값은 'terser')
    },
  };
});
