"use client";

import { useState } from "react";
import { Shield, FileText, CheckCircle2, ChevronRight, Lock, Eye, BookOpen } from "lucide-react";
import { Header } from "@/components/header";
import Footer from "@/app/component/home/Footer";

export default function PrivacyPolicyPage() {
  const [activeTab, setActiveTab] = useState<"privacy" | "agreement">("privacy");

  return (
    <>
    <Header />
    <div className="min-h-screen bg-gray-50/50 py-16 lg:py-24">
      {/* Header */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-[#5B6BBF]/10 rounded-2xl mb-6">
          <Shield className="w-8 h-8 text-[#5B6BBF]" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          Legal & Privacy
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          We believe in complete transparency. Review our Privacy Policy and the terms of our Pet Guardianship Agreement.
        </p>
      </div>

      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button
            onClick={() => setActiveTab("privacy")}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
              activeTab === "privacy"
                ? "bg-[#5B6BBF] text-white shadow-lg shadow-[#5B6BBF]/25 scale-105"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <Lock className="w-4 h-4" />
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab("agreement")}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
              activeTab === "agreement"
                ? "bg-[#5B6BBF] text-white shadow-lg shadow-[#5B6BBF]/25 scale-105"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            Guardianship Agreement
          </button>
        </div>

        {/* Content Container */}
        <div className="bg-white    overflow-hidden">
          <div className="p-8 md:p-12 lg:p-16">
            
            {/* ─── PRIVACY POLICY TAB ─────────────────────────────────────────── */}
            {activeTab === "privacy" && (
              <div className="prose prose-blue max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-600 prose-li:text-gray-600">
                <h2 className="text-3xl mb-8 flex items-center gap-3">
                  <Eye className="w-8 h-8 text-[#5B6BBF]" />
                  Privacy Policy
                </h2>
                
                <p className="lead text-lg text-gray-500 font-medium mb-8">
                  Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}<br/>
                  At K9 Encore LLC, we take your privacy and the security of your information as seriously as we take the care of your pets. This Privacy Policy complies with applicable U.S. state and federal laws, including data protection standards.
                </p>

                <div className="space-y-10">
                  <section>
                    <h3 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
                      <ChevronRight className="w-5 h-5 text-[#5B6BBF]" />
                      1. Information We Collect
                    </h3>
                    <p>We collect information necessary to execute the Pet Guardianship Agreement and ensure the well-being of your dog(s). This includes:</p>
                    <ul className="list-none space-y-3 pl-0">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span><strong>Personal Identification:</strong> Name, address, email address, phone number, and emergency contact/Designated Representative details.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span><strong>Pet Health & Records:</strong> Veterinary records, microchip information, breed, age, and behavioral/health questionnaires.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span><strong>Financial Information:</strong> Payment details processed securely via ACH withdrawal or credit/debit card.</span>
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
                      <ChevronRight className="w-5 h-5 text-[#5B6BBF]" />
                      2. How We Use Your Information
                    </h3>
                    <p>Your information is utilized solely to provide our services, which include:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Executing the terms of the Pet Guardianship Agreement upon the Client's death.</li>
                      <li>Contacting your Designated Representative to facilitate the safe transfer of your dog(s).</li>
                      <li>Ensuring proper medical, nutritional, and behavioral care for your dog(s).</li>
                      <li>Processing monthly payments and service fees.</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
                      <ChevronRight className="w-5 h-5 text-[#5B6BBF]" />
                      3. Health Data & HIPAA Compliance
                    </h3>
                    <p>
                      We gather health-related data via our onboarding questionnaires solely for legitimate administrative purposes. While we are not a medical provider, we adhere to strict confidentiality practices inspired by the Health Insurance Portability and Accountability Act (HIPAA) to protect sensitive information regarding your health and your family's health history as it relates to the agreement.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
                      <ChevronRight className="w-5 h-5 text-[#5B6BBF]" />
                      4. Information Sharing & Disclosure
                    </h3>
                    <p>We do not sell, rent, or trade your personal information. We only share information in the following circumstances:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Veterinary & Care Partners:</strong> Sharing pet medical records with licensed veterinarians, transport providers, and affiliated foster/sanctuary homes to ensure the animal's welfare.</li>
                      <li><strong>Legal & Estate:</strong> Communicating with your Designated Representative, family members, or estate executors as stipulated in the Guardianship Agreement.</li>
                      <li><strong>Legal Requirements:</strong> When required by law or to protect the safety and rights of K9 Encore LLC, our clients, or the animals in our care.</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
                      <ChevronRight className="w-5 h-5 text-[#5B6BBF]" />
                      5. Data Security
                    </h3>
                    <p>
                      We implement robust administrative, technical, and physical security measures to protect your data against unauthorized access, alteration, or destruction. All payment processing is handled by secure, PCI-compliant third-party processors.
                    </p>
                  </section>
                </div>
              </div>
            )}

            {/* ─── AGREEMENT TAB ────────────────────────────────────────────── */}
            {activeTab === "agreement" && (
              <div className="prose prose-blue max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-600 prose-li:text-gray-600">
                <h2 className="text-3xl mb-8 flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-[#5B6BBF]" />
                  Pet Guardianship Agreement
                </h2>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
                  <p className="text-sm text-blue-800 m-0 font-medium">
                    This document outlines the transfer of ownership rights of your designated dog(s) to K9 Encore LLC upon the Client's death, ensuring ongoing care and placement. This Agreement is interpreted in accordance with Texas Estates Code §254.004.
                  </p>
                </div>

                <div className="space-y-8 text-sm md:text-base leading-relaxed">
                  
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">1. Purpose</h4>
                    <p>
                      This Agreement provides for the transfer of all ownership rights in the Client's designated dog(s) to Encore upon the Client's death and for the ongoing care or placement of such dog(s) by Encore. This Agreement is not an insurance policy or trust. Texas law (Texas Property Code §112.037) expressly permits the creation of pet trusts, and this Agreement serves a similar purpose as a legally enforceable arrangement for pet care after death.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-gray-900">2. Dog(s) Covered & Identification</h4>
                    <p>
                      This Agreement applies to the dog(s) listed during the application process. The Client affirms they are the sole legal owner and have the right to transfer ownership. Upon request, the Client will provide veterinary records, microchip information, and registration papers. Upon transfer, microchip registration will be updated to list Encore as the primary contact.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-gray-900">3. Designated Representative</h4>
                    <p>
                      The Client must designate a Representative responsible for promptly notifying Encore upon the Client's death and facilitating the transfer of the dog(s). Encore reserves the right to reject any proposed Representative and require a substitute. If the Representative cannot be reached, Encore is authorized to coordinate with family members, law enforcement, or veterinary facilities to ensure the dog's safety.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-gray-900">4. Fees and Payments</h4>
                    <p>
                      Service fees include a one-time transport fee, a one-time spay/neuter fee (if applicable), and a monthly maintenance payment. Payments are made via automated ACH withdrawal or debit/credit card. Failure to maintain payments may result in suspension or termination of the Agreement.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-gray-900">5. Transfer of Ownership & Relinquishment</h4>
                    <p>
                      Upon the Client's death and verification, Encore assumes full legal ownership of the dog(s), including custody, title, possession, and decision-making authority. The Client irrevocably relinquishes all legal or equitable claims. This serves as a valid contractual disposition of personal property under Texas Estates Code § 254.004.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-gray-900">6. Standard of Care & Placement</h4>
                    <p>
                      Encore will provide care meeting or exceeding Texas law requirements (Chapter 823), including nutrition, shelter, exercise, and veterinary care. Encore will make reasonable efforts to place the dog(s) in a suitable permanent home or foster environment. The dog(s) will not be euthanized for lack of space or inconvenience.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-gray-900">7. End-of-Life Care and Euthanasia</h4>
                    <p>
                      Encore is responsible for end-of-life decisions according to veterinary best practices. Euthanasia may be considered in cases of catastrophic injury, terminal illness, severe unmanageable behavioral issues posing a risk, or conditions causing prolonged suffering.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-gray-900">8. Liability, Waiver, and Indemnity</h4>
                    <p>
                      The Client acknowledges the inherent risks of animal transport and care. The Client waives and releases Encore from liabilities relating to the injury, illness, or death of the dog(s) while in Encore's care, barring gross negligence or intentional misconduct.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-gray-900">9. Term, Termination, and Nullification</h4>
                    <p>
                      The Client may terminate this Agreement with 15 days written notice before the next billing cycle. Encore may terminate with 30 days notice. Upon the Client's death, the Agreement becomes irrevocable. Encore reserves the right to nullify the Agreement if the Client's death results from suicide or criminal acts, or if material misrepresentations were made.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-gray-900">10. Dispute Resolution</h4>
                    <p>
                      Disputes shall be resolved through good faith negotiation. If unresolved, parties will submit to non-binding mediation, followed by binding arbitration administered by the AAA in Bexar County, Texas. This Agreement is governed by the laws of the State of Texas.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-gray-100 mt-8">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Digital Attestation</h4>
                    <p className="italic text-gray-600 bg-gray-50 p-5 rounded-lg border border-gray-200">
                      "I hereby attest that the information provided is true, accurate and complete to the best of my knowledge and I understand that any falsification, omission, or concealment of material fact may result in cancellation of the Pet Guardianship Agreement for which I am applying."
                    </p>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
