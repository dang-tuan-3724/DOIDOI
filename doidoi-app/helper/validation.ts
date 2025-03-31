export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex kiểm tra email hợp lệ
  return emailRegex.test(email);
}

export function isValidPhone(phoneNum: string): boolean {
  const phoneRegex = /^\d{10}$/; // Chỉ chấp nhận đúng 10 số
  return phoneRegex.test(phoneNum);
}
