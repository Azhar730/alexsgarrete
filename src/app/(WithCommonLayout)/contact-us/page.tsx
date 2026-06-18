"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Send, MessageSquare, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/header";
import Footer from "@/app/component/home/Footer";
import { toast } from "sonner";

export default function ContactUsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const baseApiUrl =
        process.env.NEXT_PUBLIC_BASE_API_URL?.trim() ||
        process.env.NEXT_PUBLIC_BASE_API?.trim() ||
        "http://localhost:3030";

      const response = await fetch(`${baseApiUrl}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitted(true);
        toast.success(result.message || "Message sent successfully!");
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        toast.error(result.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen  py-16 lg:py-24">
        {/* Header */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Have questions about our pet guardianship services? We're here to help. Send us a message and our team will respond shortly.
          </p>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white  rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-5">

              {/* Contact Information Sidebar */}
              <div className="lg:col-span-2 bg-[#5B6BBF] p-8 md:p-12 text-white flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Contact Information</h3>
                  <p className="text-[#E0E7FF] mb-12">
                    Fill out the form and our team will get back to you within 24 hours.
                  </p>

                  <div className="space-y-8">


                    <div className="flex items-start gap-4">
                      <Mail className="w-6 h-6 text-[#93C5FD] shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-white mb-1">Email</h4>
                        <p className="text-[#E0E7FF]">contact@k9encore.com</p>
                      </div>
                    </div>


                  </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/20">
                  <p className="text-sm text-[#E0E7FF]">
                    Dedicated to ensuring lifelong care and peace of mind for you and your beloved dogs.
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-3 p-8 md:p-12 lg:p-16">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5B6BBF]/20 focus:border-[#5B6BBF] transition-colors bg-gray-50/50"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5B6BBF]/20 focus:border-[#5B6BBF] transition-colors bg-gray-50/50"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5B6BBF]/20 focus:border-[#5B6BBF] transition-colors bg-gray-50/50"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5B6BBF]/20 focus:border-[#5B6BBF] transition-colors bg-gray-50/50 appearance-none"
                    >
                      <option value="">Select a topic...</option>
                      <option value="general">General Inquiry</option>
                      <option value="services">Guardianship Services</option>
                      <option value="billing">Billing & Pricing</option>
                      <option value="support">Technical Support</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5B6BBF]/20 focus:border-[#5B6BBF] transition-colors bg-gray-50/50 resize-none"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full md:w-auto px-8 py-3.5 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 ${isSubmitting
                          ? "bg-[#5B6BBF]/70 cursor-not-allowed"
                          : submitted
                            ? "bg-emerald-500"
                            : "bg-[#5B6BBF] hover:bg-[#4a58a6] hover:shadow-lg hover:shadow-[#5B6BBF]/25 hover:-translate-y-0.5"
                        }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Sending...
                        </>
                      ) : submitted ? (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          Message Sent!
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
