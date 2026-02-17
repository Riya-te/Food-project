import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) console.error("❌ Mail error:", error);
  else console.log("✅ Mail server ready");
});

export const sendOtpMail = async (to, otp) => {
  await transporter.sendMail({
    from: `"SwadWala" <${process.env.EMAIL_USER}>`,
    to,
    subject: "SwadWala Password Reset OTP",
    html: `
      <h2>Your OTP</h2>
      <h1>${otp}</h1>
      <p>Valid for 5 minutes</p>
    `,
  });
};

export const sendOrderConfirmation = async (to, order) => {
  const itemsHtml = (order.shopOrder || [])
    .map((shop) => {
      const shopItems = (shop.shopOrderItems || [])
        .map(
          (it) => `<li>${it.items} — ₹${it.price} × ${it.quantity}</li>`
        )
        .join("");

      return `
        <h4>Shop: ${shop.shop || "N/A"} — Subtotal: ₹${shop.subTotal || 0}</h4>
        <ul>${shopItems}</ul>
      `;
    })
    .join("");

  const html = `
    <h2>Order Confirmation</h2>
    <p>Thank you for your order. Order ID: <strong>${order._id}</strong></p>
    <p>Total: <strong>₹${order.totalAmount}</strong></p>
    <h3>Delivery Address</h3>
    <p>${order.deliveryAddress?.text || "-"}</p>
    ${itemsHtml}
    <p>We will notify you when your order is out for delivery.</p>
  `;

  await transporter.sendMail({
    from: `"SwadWala" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Order Confirmation - ${order._id}`,
    html,
  });
};

export default transporter;
