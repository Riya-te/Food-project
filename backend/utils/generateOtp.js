const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString(); // STRING OTP
};

export default generateOtp;
