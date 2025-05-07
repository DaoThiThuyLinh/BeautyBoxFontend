export default function toSlug(str: string) {
  return str
    .toLowerCase() // Chuyển về chữ thường trước
    .replace(/đ/g, 'd') // Thay 'đ' thành 'd'
    .normalize('NFD') // Tách dấu ra khỏi ký tự
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
    .trim() // Xóa khoảng trắng đầu/cuối
    .replace(/\s+/g, '-') // Thay khoảng trắng bằng '-'
    .replace(/[^\w\-]+/g, '') // Xóa ký tự không hợp lệ
    .replace(/\-\-+/g, '-') // Gộp nhiều '-' lại
}
