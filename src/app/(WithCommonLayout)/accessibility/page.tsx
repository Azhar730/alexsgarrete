"use client";

import { Accessibility, ChevronRight } from "lucide-react";
import { Header } from "@/components/header";
import Footer from "@/app/component/home/Footer";

export default function AccessibilityStatementPage() {
  return (
    <>
    <Header />
    <div className="min-h-screen bg-gray-50/50 py-16 lg:py-24">
      {/* Header */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-[#5B6BBF]/10 rounded-2xl mb-6">
          <Accessibility className="w-8 h-8 text-[#5B6BBF]" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          Accessibility Statement
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          We are committed to ensuring digital accessibility for people with disabilities.
        </p>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden">
          <div className="p-8 md:p-12 lg:p-16">
            <div className="prose prose-blue max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-600 prose-li:text-gray-600">
              
              <p className="lead text-lg text-gray-500 font-medium mb-8">
                Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}<br/>
                K9 Encore LLC is committed to making our website accessible to everyone, including individuals with disabilities. We continually improve the user experience for all and strive to apply the relevant accessibility standards.
              </p>

              <div className="space-y-10">
                <section>
                  <h3 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-[#5B6BBF]" />
                    1. Conformance Status
                  </h3>
                  <p>
                    The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.
                  </p>
                  <p>
                    K9 Encore LLC is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the content do not fully conform to the accessibility standard. We are actively working to increase the accessibility and usability of our website to adhere to these standards.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-[#5B6BBF]" />
                    2. Measures to Support Accessibility
                  </h3>
                  <p>K9 Encore LLC takes the following measures to ensure accessibility of our platform:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Include accessibility as a core requirement in our internal web development guidelines.</li>
                    <li>Integrate accessibility into our procurement practices.</li>
                    <li>Provide continual accessibility training for our staff.</li>
                    <li>Assign clear accessibility targets and responsibilities within our organization.</li>
                    <li>Employ formal accessibility quality assurance methods.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-[#5B6BBF]" />
                    3. Technical Specifications
                  </h3>
                  <p>Accessibility of this website relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>HTML</li>
                    <li>WAI-ARIA</li>
                    <li>CSS</li>
                    <li>JavaScript</li>
                  </ul>
                  <p>These technologies are relied upon for conformance with the accessibility standards used.</p>
                </section>

                <section>
                  <h3 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-[#5B6BBF]" />
                    4. Limitations and Alternatives
                  </h3>
                  <p>
                    Despite our best efforts to ensure accessibility of the K9 Encore LLC website, there may be some limitations. Please contact us if you observe an issue not listed below:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Uploaded Documents:</strong> Some uploaded documents (e.g., legacy PDFs or scanned veterinary records) may not be fully accessible to screen readers. We are working on providing text alternatives or accessible formats upon request.</li>
                    <li><strong>Third-party Content:</strong> We may use third-party tools or integrations that we do not fully control. We cannot guarantee the accessibility of these external components but will work with vendors to encourage compliance.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-[#5B6BBF]" />
                    5. Feedback & Contact Information
                  </h3>
                  <p>
                    We welcome your feedback on the accessibility of the K9 Encore LLC website. If you encounter any accessibility barriers, please let us know so that we may assist you and improve our platform.
                  </p>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mt-4">
                    <ul className="list-none space-y-2 pl-0 m-0">
                      <li><strong>Email:</strong> accessibility@k9encore.com</li>
                      <li><strong>Response Time:</strong> We try to respond to feedback within 2 business days.</li>
                    </ul>
                  </div>
                </section>
                
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
