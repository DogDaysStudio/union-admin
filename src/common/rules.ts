export const rules = {
  required: (message = '必填项') => ({required: true, message}),
  verifyCode: (message = '请输入6位验证码') => ({required: true, len: 6, message}),
  mobile: (message = '请输入正确的手机号') => ({pattern: /^1[3456789]\d{9}$/, message}),
  email: (message = '请输入正确的邮箱') => ({
    pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
    message,
  }),
  idCard: (message = '请输入正确的身份证号') => ({pattern: /^\d{17}[\dXx]|\d{15}$/, message}),
}
