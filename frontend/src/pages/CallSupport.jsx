import React, { useState } from "react";
import { motion } from "framer-motion";
import { Phone, MessageCircle, Clock, User, MapPin, AlertCircle, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const CallSupport = () => {
  const navigate = useNavigate();
  const [selectedReason, setSelectedReason] = useState("");
  const [callStarted, setCallStarted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  React.useEffect(() => {
    if (callStarted) {
      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [callStarted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const callReasons = [
    { icon: "🍔", title: "Order Issue", desc: "Problem with current order" },
    { icon: "💰", title: "Payment Problem", desc: "Payment-related issues" },
    { icon: "🚚", title: "Delivery Tracking", desc: "Track your delivery" },
    { icon: "⭐", title: "Feedback", desc: "Share your experience" },
    { icon: "🔄", title: "Refund Request", desc: "Request a refund" },
    { icon: "❓", title: "Other", desc: "Something else" },
  ];

  const supportTeam = [
    { name: "Raj Kumar", status: "Available", avatar: "👨‍💼", speciality: "Orders" },
    { name: "Priya Singh", status: "Available", avatar: "👩‍💼", speciality: "Payments" },
    { name: "Amit Patel", status: "Busy", avatar: "👨‍💼", speciality: "Delivery" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative py-20 bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 text-white overflow-hidden">
        <motion.div
          className="absolute top-10 right-10 text-6xl opacity-20"
          animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          ☎️
        </motion.div>

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Call Support
          </motion.h1>
          <motion.p
            className="text-xl text-rose-50 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Talk to our support team instantly. Available 24/7 to help you!
          </motion.p>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <section className="relative py-16 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          
          {/* LEFT: CALL INTERFACE */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Start a Call</h2>

            {!callStarted ? (
              <div className="space-y-6">
                {/* SELECT REASON */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">What's your issue?</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {callReasons.map((reason, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setSelectedReason(reason.title)}
                        className={`p-4 rounded-xl border-2 transition text-center ${
                          selectedReason === reason.title
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 bg-white hover:border-red-500"
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="text-3xl mb-2">{reason.icon}</div>
                        <p className="font-bold text-sm text-gray-900">{reason.title}</p>
                        <p className="text-xs text-gray-600">{reason.desc}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* AVAILABLE AGENTS */}
                {selectedReason && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Available Agents</h3>
                    <div className="space-y-3">
                      {supportTeam.map((agent, index) => (
                        <motion.div
                          key={index}
                          className={`p-4 rounded-xl border-2 flex items-center justify-between ${
                            agent.status === "Available"
                              ? "bg-green-50 border-green-300"
                              : "bg-gray-50 border-gray-300"
                          }`}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{agent.avatar}</span>
                            <div>
                              <p className="font-bold text-gray-900">{agent.name}</p>
                              <p className="text-xs text-gray-600">{agent.speciality} Specialist</p>
                            </div>
                          </div>
                          <div
                            className={`px-3 py-1 rounded-full text-sm font-bold ${
                              agent.status === "Available"
                                ? "bg-green-500 text-white"
                                : "bg-gray-400 text-white"
                            }`}
                          >
                            {agent.status}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* START CALL BUTTON */}
                <motion.button
                  onClick={() => setCallStarted(true)}
                  disabled={!selectedReason}
                  className={`w-full py-4 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2 transition ${
                    selectedReason
                      ? "bg-gradient-to-r from-red-500 to-pink-500 hover:shadow-2xl"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                  whileHover={selectedReason ? { scale: 1.05 } : {}}
                  whileTap={selectedReason ? { scale: 0.95 } : {}}
                >
                  <Phone size={24} />
                  Start Call Now
                </motion.button>
              </div>
            ) : (
              /* ACTIVE CALL */
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white text-center"
              >
                <motion.div
                  className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-500 flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Phone size={48} />
                </motion.div>

                <h3 className="text-3xl font-bold mb-2">Connected to Support</h3>
                <p className="text-gray-300 mb-8">Call duration:</p>

                <div className="text-6xl font-bold text-red-400 mb-8 font-mono">
                  {formatTime(callDuration)}
                </div>

                <p className="text-lg mb-8 text-gray-400">
                  Issue: <span className="text-white font-bold">{selectedReason}</span>
                </p>

                <div className="flex gap-4 justify-center mb-8">
                  <motion.button
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-bold flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <MessageCircle size={20} />
                    Chat
                  </motion.button>
                  <motion.button
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-bold flex items-center gap-2"
                    onClick={() => setCallStarted(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Phone size={20} />
                    End Call
                  </motion.button>
                </div>

                {/* AUDIO CONTROLS */}
                <div className="flex gap-4 justify-center">
                  {[
                    { icon: "🎤", label: "Mute", color: "gray-700" },
                    { icon: "🔊", label: "Volume", color: "gray-700" },
                    { icon: "📹", label: "Video", color: "gray-700" },
                  ].map((control, index) => (
                    <motion.button
                      key={index}
                      className={`px-4 py-2 bg-${control.color} hover:bg-gray-600 rounded-lg text-white font-bold`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {control.icon} {control.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* RIGHT: INFO & TIPS */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Why Call Support?</h2>

            <div className="space-y-6 mb-8">
              {[
                {
                  icon: Clock,
                  title: "Quick Resolution",
                  desc: "Get immediate answers to your questions",
                },
                {
                  icon: User,
                  title: "Personalized Help",
                  desc: "Talk to trained specialists",
                },
                {
                  icon: CheckCircle,
                  title: "Real-time Assistance",
                  desc: "No waiting, instant support",
                },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl p-6 border-l-4 border-red-500 shadow-md"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex gap-4">
                    <div className="bg-red-100 p-4 rounded-lg text-red-500 h-fit">
                      <benefit.icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* SUPPORT HOURS */}
            <motion.div
              className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-8 text-white"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-2xl font-bold mb-4">Support Hours</h3>
              <div className="space-y-2 text-lg">
                <p>
                  <span className="font-bold">Monday - Friday:</span> 9:00 AM - 11:00 PM
                </p>
                <p>
                  <span className="font-bold">Saturday - Sunday:</span> 10:00 AM - 10:00 PM
                </p>
                <p className="mt-4 pt-4 border-t border-white/30">
                  <span className="font-bold text-yellow-300">🌙 24/7 Emergency:</span> Available for
                  critical issues
                </p>
              </div>
            </motion.div>

            {/* TIPS */}
            <motion.div
              className="mt-8 bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <AlertCircle size={20} className="text-blue-500" />
                Pro Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Have your order ID ready for quick resolution</li>
                <li>✓ Check FAQ before calling for common issues</li>
                <li>✓ Calls are recorded for quality improvement</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= BACK TO MENU ================= */}
      <section className="relative py-16 px-6 max-w-6xl mx-auto text-center">
        <motion.button
          onClick={() => navigate("/menu")}
          className="px-10 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:shadow-2xl transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Back to Menu
        </motion.button>
      </section>

      <Footer />
    </div>
  );
};

export default CallSupport;
