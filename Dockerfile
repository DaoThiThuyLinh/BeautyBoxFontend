# Sử dụng Node.js làm base image
FROM node:lts-alpine as build-stage

# Đặt thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép source code vào container
COPY . .

# Build ứng dụng
RUN npm run build

# Giai đoạn production
FROM nginx:stable-alpine as production-stage

# Sao chép các file đã build từ giai đoạn trước
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Thêm cấu hình nginx custom để chạy trên cổng 5173
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Mở cổng 5173
EXPOSE 5173

# Chạy nginx
CMD ["nginx", "-g", "daemon off;"]

# docker build -t beauty-box-app .
# docker rm -f beauty-box-container
# docker run -d -p 5173:5173 --name beauty-box-container beauty-box-app