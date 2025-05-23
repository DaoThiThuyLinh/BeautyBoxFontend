export default function isPhoneNumberValid(phoneNumber: string) {
  return /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/.test(phoneNumber)
}
