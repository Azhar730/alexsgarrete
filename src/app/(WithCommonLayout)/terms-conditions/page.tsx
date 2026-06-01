"use client";

import { Scale, ChevronRight, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/header";
import Footer from "@/app/component/home/Footer";

export default function TermsConditionsPage() {
  return (
    <>
    <Header />
    <div className="min-h-screen bg-gray-50/50 py-16 lg:py-24">
      {/* Header */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-[#5B6BBF]/10 rounded-2xl mb-6">
          <Scale className="w-8 h-8 text-[#5B6BBF]" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          Terms & Conditions
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Please read these terms carefully before using our website and services.
        </p>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden">
          <div className="p-8 md:p-12 lg:p-16">
            <div className="prose prose-blue max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-600 prose-li:text-gray-600">
              
              <p className="lead text-lg text-gray-500 font-medium mb-8">
                Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}<br/>
                These Terms and Conditions ("Terms") govern your access to and use of the K9 Encore LLC website and related services. By accessing or using our website, you agree to be bound by these Terms and our Privacy Policy.
              </p>

              <div className="space-y-10">
                <section>
                  <h3 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-[#5B6BBF]" />
                    1. Acceptance of Terms
                  </h3>
                  <p>
                    By accessing, browsing, or otherwise using this website, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-[#5B6BBF]" />
                    2. Service Description
                  </h3>
                  <p>
                    K9 Encore LLC ("we", "our", or "us") provides pet guardianship, future care planning, and related services. While this website serves to facilitate onboarding, account management, and service descriptions, the specific obligations and rights regarding pet care are governed entirely by the individual <strong>Pet Guardianship Agreement</strong> signed between the Client and K9 Encore LLC.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-[#5B6BBF]" />
                    3. User Accounts & Responsibilities
                  </h3>
                  <p>When you create an account on our platform, you agree to:</p>
                  <ul className="list-none space-y-3 pl-0">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Provide accurate, current, and complete information during the registration process.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Maintain the security and confidentiality of your account credentials.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Promptly update any information to keep it accurate, including contact and veterinary details.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Accept full responsibility for all activities that occur under your account.</span>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-[#5B6BBF]" />
                    4. Intellectual Property Rights
                  </h3>
                  <p>
                    All content, features, and functionality on this website, including but not limited to text, graphics, logos, images, audio clips, digital downloads, data compilations, and software, are the exclusive property of K9 Encore LLC or its licensors and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property laws.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-[#5B6BBF]" />
                    5. Disclaimer of Warranties
                  </h3>
                  <p>
                    The information provided on this website is for general informational purposes only. While we strive to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information contained on the website for any purpose.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-[#5B6BBF]" />
                    6. Limitation of Liability
                  </h3>
                  <p>
                    In no event shall K9 Encore LLC, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-[#5B6BBF]" />
                    7. Governing Law
                  </h3>
                  <p>
                    These Terms shall be governed and construed in accordance with the laws of the State of Texas, United States, without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms will be brought exclusively in the state or federal courts located in Bexar County, Texas, and the parties hereby irrevocably consent to the personal jurisdiction and venue therein.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-[#5B6BBF]" />
                    8. Changes to Terms
                  </h3>
                  <p>
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                  </p>
                </section>
                
                <div className="pt-8 border-t border-gray-100 mt-12">
                  <p className="text-sm text-gray-500">
                    If you have any questions about these Terms, please contact us through our website.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
