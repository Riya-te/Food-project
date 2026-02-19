import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Clock, MessageCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send to backend
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: "+91 6206772179",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Mail,
      title: "Email",
      details: "riyakumari1011.2006@gmail.com",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: MapPin,
      title: "Address",
      details: "Getalsud,Ranchi,Jharkhand, India",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Clock,
      title: "Hours",
      details: "24/7 Support Available",
      color: "from-green-500 to-emerald-500",
    },
  ];

  const faqItems = [
    {
      question: "How long does delivery take?",
      answer: "Average delivery time is 25-30 minutes from the restaurant.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept UPI, Debit/Credit Cards, Wallets, and Cash on Delivery.",
    },
    {
      question: "Can I cancel my order?",
      answer: "Yes, you can cancel within 2 minutes of placing the order.",
    },
    {
      question: "Are there any delivery charges?",
      answer: "Delivery charges are ₹40 for orders below ₹500. Free for above ₹500.",
    },
    {
      question: "How do I track my order?",
      answer: "You can track in real-time from the Orders page after placing.",
    },
    {
      question: "What if my order arrives late?",
      answer: "Contact support immediately and we'll resolve it for you.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative py-20 bg-gradient-to-r from-cyan-500 via-blue-400 to-teal-500 text-white overflow-hidden">
        <motion.div
          className="absolute top-10 right-10 text-6xl opacity-20"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
        >
          📞
        </motion.div>
        <motion.div
          className="absolute bottom-10 left-10 text-6xl opacity-20"
          animate={{ y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 7 }}
        >
          💬
        </motion.div>

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Get in Touch
          </motion.h1>
          <motion.p
            className="text-xl text-gray-50 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            We're here to help! Have questions? We'd love to hear from you. Contact us anytime.
          </motion.p>
        </div>
      </section>

      {/* ================= CONTACT INFO CARDS ================= */}
      <section className="relative py-16 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition text-center border-t-4 border-orange-400"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className={`bg-gradient-to-br ${info.color} p-5 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-white`}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2, delay: index * 0.2 }}
              >
                <info.icon size={32} />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{info.title}</h3>
              <p className="text-gray-600 text-sm">{info.details}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= CONTACT FORM & INFO SECTION ================= */}
      <section className="relative py-16 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          
          {/* LEFT: FORM */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Send us a Message</h2>

            {submitted ? (
              <motion.div
                className="bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-2xl p-8 text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                <p>Thank you for contacting us. We'll respond within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-3 rounded-xl bg-gray-100 border-2 border-gray-200 focus:border-blue-500 focus:bg-white transition outline-none"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-3 rounded-xl bg-gray-100 border-2 border-gray-200 focus:border-blue-500 focus:bg-white transition outline-none"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-3 rounded-xl bg-gray-100 border-2 border-gray-200 focus:border-blue-500 focus:bg-white transition outline-none"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    className="w-full px-6 py-3 rounded-xl bg-gray-100 border-2 border-gray-200 focus:border-blue-500 focus:bg-white transition outline-none resize-none"
                    placeholder="Tell us your message..."
                  />
                </div>

                <motion.button
                  type="submit"
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:shadow-2xl transition flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send size={20} />
                  Send Message
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* RIGHT: FAQ */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8">FAQ</h2>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl p-6 border-l-4 border-orange-400 shadow-md hover:shadow-lg transition"
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-start gap-2">
                    <span className="text-orange-500 mt-1">Q:</span>
                    {item.question}
                  </h3>
                  <p className="text-gray-600 ml-6">
                    <span className="text-blue-500 font-semibold">A: </span>
                    {item.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="relative py-16 px-6 max-w-6xl mx-auto">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl p-12 text-white text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">Need Immediate Assistance?</h2>
          <p className="text-xl mb-8 text-blue-50">
            Call our support team or chat with us live!
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <motion.button
              onClick={() => navigate("/call-support")}
              className="px-10 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone size={20} />
              Call Support
            </motion.button>
            <motion.button
              onClick={() => navigate("/menu")}
              className="px-10 py-4 bg-white text-blue-500 font-bold rounded-xl hover:bg-gray-100 transition flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Menu
            </motion.button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
