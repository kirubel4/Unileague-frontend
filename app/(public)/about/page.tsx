"use client";

import { useState } from "react";
import {
  Trophy,
  Users,
  Target,
  Shield,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  Award,
  Globe,
  Heart,
} from "lucide-react";

export default function AboutPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }, 1500);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const features = [
    {
      icon: Trophy,
      title: "Tournament Management",
      description:
        "Comprehensive tournament organization with scheduling, brackets, and real-time updates",
    },
    {
      icon: Users,
      title: "Team & Player Tracking",
      description:
        "Detailed statistics and profiles for all teams and individual players",
    },
    {
      icon: Target,
      title: "Live Match Center",
      description:
        "Real-time scoring, commentary, and match statistics for all games",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description:
        "Enterprise-grade security ensuring data privacy and system reliability",
    },
    {
      icon: Globe,
      title: "Mobile Responsive",
      description:
        "Fully responsive design accessible from any device anywhere",
    },
    {
      icon: Award,
      title: "Advanced Analytics",
      description: "In-depth performance analysis and predictive insights",
    },
  ];

  const contactInfo = [
    {
      icon: MapPin,
      title: "Our Location",
      details: "Adama Science and Technology University\nAdama, Ethiopia",
      description: "Main Campus, Sports Complex Building",
    },
    {
      icon: Mail,
      title: "Email Us",
      details: "football@astu.edu.et",
      description: "Response within 24 hours",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+251 11 234 5678",
      description: "Mon-Fri, 8AM-6PM",
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: "Monday - Friday",
      description: "8:00 AM - 6:00 PM",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 blur-3xl" />

        <div className="relative px-6 py-24 md:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <Shield className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">
                  About ASTU Football
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                Empowering{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  University Football
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
                Discover our comprehensive platform designed to revolutionize
                how university football tournaments are managed, experienced,
                and celebrated across Adama Science and Technology University.
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-white/80">
                  <Heart className="w-5 h-5" />
                  <span>Made for Students</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Target className="w-5 h-5" />
                  <span>Real-time Updates</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Award className="w-5 h-5" />
                  <span>Award-winning Platform</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        {/* Platform Overview */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Platform{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Overview
              </span>
            </h2>

            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-lg leading-relaxed mb-6">
                The ASTU Football Management System is a state-of-the-art
                platform designed to manage university football tournaments with
                precision, efficiency, and user-centric design. Our system
                brings together cutting-edge technology with deep understanding
                of sports management needs.
              </p>

              <p className="text-lg leading-relaxed mb-8">
                Since our launch in 2023, we've successfully managed over 50
                tournaments, tracked 500+ matches, and provided real-time
                updates to thousands of students, faculty, and football
                enthusiasts. Our platform continues to evolve with feedback from
                our community, ensuring we deliver the best possible experience.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <div className="text-3xl font-bold text-purple-700 mb-2">
                    50+
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    Tournaments Managed
                  </div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                  <div className="text-3xl font-bold text-blue-700 mb-2">
                    500+
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    Matches Tracked
                  </div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="text-3xl font-bold text-green-700 mb-2">
                    1K+
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    Active Users
                  </div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                  <div className="text-3xl font-bold text-orange-700 mb-2">
                    24/7
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    Uptime Support
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Platform{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
              Features
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow group"
                >
                  <div className="inline-flex p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  Get In Touch
                </h2>
                <p className="text-gray-600 mt-2">
                  Have questions or suggestions? We'd love to hear from you.
                </p>
              </div>

              <div className="p-6">
                {submitStatus === "success" ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <h3 className="font-semibold text-green-800">
                          Message Sent Successfully!
                        </h3>
                        <p className="text-green-700 mt-1">
                          We'll get back to you within 24 hours. Thank you for
                          reaching out!
                        </p>
                      </div>
                    </div>
                  </div>
                ) : submitStatus === "error" ? (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                      <div>
                        <h3 className="font-semibold text-red-800">
                          Something went wrong
                        </h3>
                        <p className="text-red-700 mt-1">
                          Please try again or contact us directly via email.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="technical">Technical Support</option>
                      <option value="tournament">
                        Tournament Registration
                      </option>
                      <option value="feedback">Feedback & Suggestions</option>
                      <option value="partnership">
                        Partnership Opportunities
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                      placeholder="Tell us about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>

                  <p className="text-sm text-gray-500 text-center">
                    By submitting this form, you agree to our Privacy Policy.
                    We'll never share your information.
                  </p>
                </form>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden sticky top-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  Contact Information
                </h2>
                <p className="text-gray-600 mt-2">
                  Reach out to us through any of these channels
                </p>
              </div>

              <div className="p-6 space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {info.title}
                        </h3>
                        <p className="text-gray-800 font-medium whitespace-pre-line">
                          {info.details}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* FAQ Section */}
              <div className="p-6 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">
                  Frequently Asked
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900">
                      How do I register a team?
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Contact the Sports Committee via the contact form above.
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900">
                      Are matches streamed live?
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Yes, all major matches are streamed on our platform.
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900">
                      Can alumni participate?
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Alumni can participate in special exhibition matches.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-8 mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Our platform is developed and maintained by a dedicated team of
              students, faculty, and sports enthusiasts committed to enhancing
              the football experience at ASTU.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">
                  Sports Committee
                </div>
                <div className="text-sm text-gray-600">
                  Tournament Management
                </div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">Tech Team</div>
                <div className="text-sm text-gray-600">
                  Platform Development
                </div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">Media Team</div>
                <div className="text-sm text-gray-600">Content & Coverage</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
