import React from "react";

interface AgreementTemplateProps {
  clientName?: string;
  clientAddress?: string;
  clientPhone?: string;
  clientEmail?: string;
  representativeName?: string;
  representativeEmail?: string;
  representativePhone?: string;
  adminName?: string;
  pets?: Array<{
    name: string;
    species?: string;
    gender?: string;
    spayedNeutered?: string;
    primaryBreed: string;
    additionalBreed?: string;
    colorsAndCoat?: string;
    birthday?: string | null;
    age?: string | number;
    isMicrochipped?: string | boolean;
    microchipNumber?: string | null;
    petCharge: number;
  }>;
  setupFee?: number;
  totalMonthlyCharge?: number;
  healthAnswers?: any[];
  familyHealthHistories?: any[];
  isSigned: boolean;
  signatureDocUrl?: string | null;
  representativeSignatureUrl?: string | null;
  signedDate?: string | Date | null;

  // Detailed fields from onboarding form (Appendix A)
  clientFirstName?: string;
  clientLastName?: string;
  clientMiddleInitial?: string;
  clientSsnLast4?: string;
  clientHomePhone?: string;
  clientWorkPhone?: string;

  representativeFirstName?: string;
  representativeLastName?: string;
  representativeMiddleInitial?: string;
  representativeAddress?: string;
  representativeCityStateZip?: string;
  representativeRelation?: string;
  representativeHomePhone?: string;
  representativeWorkPhone?: string;

  // Fee configs
  transportFeePerDog?: number;
  spayNeuterFeePerDog?: number;
  dueDay?: number;
  lateFee?: number;
}

export const AgreementTemplate = ({
  clientName = "",
  clientAddress = "",
  clientPhone = "",
  clientEmail = "",
  representativeName = "",
  representativeEmail = "",
  representativePhone = "",
  adminName = "",
  pets = [],
  setupFee = 10,
  totalMonthlyCharge = 0,
  healthAnswers = [],
  familyHealthHistories = [],
  isSigned,
  signatureDocUrl,
  representativeSignatureUrl,
  signedDate,

  clientFirstName,
  clientLastName,
  clientMiddleInitial = "",
  clientSsnLast4 = "",
  clientHomePhone = "",
  clientWorkPhone = "",

  representativeFirstName = "",
  representativeLastName = "",
  representativeMiddleInitial = "",
  representativeAddress = "",
  representativeCityStateZip = "",
  representativeRelation = "",
  representativeHomePhone = "",
  representativeWorkPhone = "",

  transportFeePerDog = 50,
  spayNeuterFeePerDog = 150,
  dueDay = 1,
  lateFee = 25,
}: AgreementTemplateProps) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formatSignedDate = (dateStr?: string | Date | null) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "";
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  const displayDate = signedDate ? formatSignedDate(signedDate) : currentDate;

  // Derived Client info helper
  const finalClientFirstName = clientFirstName || clientName.split(" ")[0] || "";
  const finalClientLastName = clientLastName || clientName.split(" ").slice(1).join(" ") || "";
  const finalClientFullName = `${finalClientFirstName} ${clientMiddleInitial ? clientMiddleInitial + " " : ""}${finalClientLastName}`.trim() || clientName;

  // Derived Representative info helper
  const finalReprFirstName = representativeFirstName || representativeName.split(" ")[0] || "";
  const finalReprLastName = representativeLastName || representativeName.split(" ").slice(1).join(" ") || "";
  const finalReprFullName = `${finalReprFirstName} ${representativeMiddleInitial ? representativeMiddleInitial + " " : ""}${finalReprLastName}`.trim() || representativeName;

  const finalAdminName = representativeSignatureUrl?.startsWith("TYPED:")
    ? representativeSignatureUrl.substring(6)
    : (adminName || "Alex Garrett");

  return (
    <div 
      className="bg-white p-6 md:p-8 w-full my-3 border border-slate-200 rounded-xl shadow-sm text-slate-800 text-[11px] md:text-xs leading-relaxed select-none" 
      style={{ fontFamily: "Georgia, serif" }}
    >
      {/* Brand Header */}
      <div className="text-center border-b pb-3 mb-4">
        <h1 className="text-lg font-bold uppercase tracking-wide text-slate-900">K9 Encore LLC</h1>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Pet Guardianship &amp; Future Care Services</p>
      </div>

      <h2 className="text-sm font-bold text-center uppercase tracking-wide mb-4 text-slate-900">
        Appendix F: PET GUARDIANSHIP AGREEMENT
      </h2>

      <p className="mb-3 text-justify">
        This Pet Guardianship Agreement (the <strong>&quot;Agreement&quot;</strong>) is entered into on <strong><u>{displayDate}</u></strong> (the <strong>&quot;Effective Date&quot;</strong>) by <strong><u>{finalClientFullName || "[Pet Owner Name]"}</u></strong> (the <strong>&quot;Client&quot;</strong>) and <strong>K9 Encore LLC</strong>, a Texas limited liability company (<strong>&quot;Encore&quot;</strong>).
      </p>

      {/* Purpose */}
      <p className="mb-3 text-justify">
        1.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Purpose</strong></u>. This Agreement provides for the transfer of all ownership rights in the Client&apos;s designated dog(s) to Encore upon the Client&apos;s death and for the ongoing care or placement of such dog(s) by Encore. This Agreement is not an insurance policy or trust and is not intended to constitute either.
      </p>
      <p className="mb-3 text-justify pl-6">
        The Client acknowledges that Texas law (Texas Property Code §112.037) expressly permits the creation of pet trusts for the care of animals. While this Agreement is not a formal trust, the parties intend for it to serve a similar purpose as a legally enforceable arrangement for pet care after the Client&apos;s death. The Client has the option to provide for the pet in their Will or through a pet trust; however, such measures (or lack thereof) shall not affect the validity of this Agreement. This Agreement shall be interpreted, to the extent possible, in a manner consistent with Texas Estates Code §254.004 regarding contracts to make a will or devise.
      </p>

      {/* Dogs Covered */}
      <div className="space-y-2 mb-3">
        <p className="text-justify">
          2.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Dog(s) Covered</strong></u>. This Agreement applies to the dog(s) listed in Appendix A. The Client affirms that they are the sole legal owner of such dog(s) and have the right to transfer ownership upon death.
        </p>
        <p className="pl-6 text-justify">
          a.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Identification and Records</strong></u>. The Client will, upon request, provide Encore with copies of veterinary records, microchip information, and any registration or pedigree papers for the dog(s) to facilitate future care and placement. The Client consents that upon transfer of the dog(s) to Encore, any microchip registration will be updated to list Encore (or any subsequent adopter) as the primary contact. The Client&apos;s estate or Designated Representative shall also transfer any remaining pet medications, special diets, or necessary items to Encore along with the dog.
        </p>
        <p className="pl-6 text-justify">
          b.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Adding Additional Dog(s)</strong></u>. If the Client acquires one or more additional dog(s) during the term of this Agreement and wishes to include them under its terms, the Client shall notify Encore in writing and provide the required information. Encore reserves the right to approve or deny the inclusion of the new dog(s). If approved, the parties shall execute a written addendum and adjust any fees accordingly. If not approved, the Agreement shall remain in force only for the previously covered dog(s).
        </p>
        <p className="pl-6 text-justify">
          c.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Death or Permanent Loss of Dog(s)</strong></u>. If any dog listed in this Agreement or its Appendix A dies, is permanently lost, or is lawfully transferred to another owner prior to the Client&apos;s death, the Client (or their Designated Representative) shall promptly notify Encore in writing. Upon verification, that dog will be removed from coverage under this Agreement effective as of the date of death or permanent transfer.
        </p>
      </div>

      {/* Designated Representative */}
      <div className="space-y-2 mb-3">
        <p className="text-justify">
          3.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Designated Representative</strong></u>. The Client hereby designates the individual identified in Appendix A as the &quot;Designated Representative.&quot; The Designated Representative shall be responsible for promptly notifying Encore upon the Client&apos;s death and providing all information, documentation, and reasonable assistance requested by Encore to facilitate the timely and unimpeded transfer of the dog(s) to Encore. Encore shall have the right, in its sole and absolute discretion, to reject any proposed Designated Representative and to require the Client to appoint a substitute Designated Representative acceptable to Encore. The Client acknowledges and agrees that the appointment and cooperation of a Designated Representative satisfactory to Encore is a material condition to Encore&apos;s obligations under this Agreement. Encore shall not be liable for any delay or failure in assuming ownership of the dog(s) resulting from any failure or delay by the Designated Representative or from any deficiencies in the information or cooperation provided.
        </p>
        <p className="pl-6 text-justify">
          If the Designated Representative cannot be reached or is unable or unwilling to act promptly, the Client authorizes Encore to coordinate with any available family member, executor, law enforcement officer, or veterinary facility to ensure the safety and transfer of the dog(s).
        </p>
      </div>

      {/* Fees and Payments */}
      <div className="space-y-2 mb-3">
        <p className="font-bold text-justify">
          4.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Fees and Payments</strong></u>
        </p>
        <p className="pl-6 text-justify">
          a.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Service Fees</strong></u>. In consideration of the services described in this Agreement, the Client agrees to pay the following fees:
        </p>
        <div className="pl-12 space-y-1.5">
          <p className="text-justify">
            i.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; A one-time <strong>transport fee</strong> of $<strong><u>{transportFeePerDog ? Number(transportFeePerDog).toFixed(2) : "________"}</u></strong> per dog is required. The transport fee is due at the execution of this Agreement. This fee will cover the costs of transporting the dog(s) from their current location to an Encore facility or an Encore-affiliated facility. Transportation of the dog(s) may involve third-party providers.
          </p>
          <p className="text-justify">
            ii.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; A one-time <strong>spay/neuter fee</strong> of $<strong><u>{spayNeuterFeePerDog ? Number(spayNeuterFeePerDog).toFixed(2) : "________"}</u></strong> per unaltered dog will be required. This fee will cover the costs of neutering or spaying the dog(s) once Encore takes ownership.
          </p>
          <p className="text-justify">
            iii.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; A <strong>monthly payment</strong> of $<strong><u>{totalMonthlyCharge ? Number(totalMonthlyCharge).toFixed(2) : "________"}</u></strong>, due on the <strong><u>{dueDay || "____"}</u></strong> day of each month, is required to maintain this Agreement in active status.
          </p>
        </div>
        <p className="pl-6 text-justify">
          All amounts are stated in U.S. dollars and are <strong>non-refundable</strong> unless expressly provided otherwise in this Agreement.
        </p>
        <p className="pl-6 text-justify">
          b.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Method of Payment</strong></u>. Monthly payments shall be made via automated ACH withdrawal or debit/credit card. The Client authorizes Encore to initiate monthly charges to the Client&apos;s designated account on the scheduled payment date. The Client is responsible for keeping payment information up to date.
        </p>
        <p className="pl-6 text-justify">
          c.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Fee Adjustments</strong></u>. Encore may review and adjust the monthly payment amount no more than once every twelve (12) months. Encore shall provide the Client with at least forty-five (45) days&apos; advance written notice of any proposed adjustment. Continued payment by the Client after such notice constitutes acceptance of the revised fee. If the Client objects to the adjusted fee, the Client may terminate this Agreement in accordance with Section 11(b).
        </p>
        <p className="pl-6 text-justify">
          d.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Late Payment and Suspension</strong></u>. If a monthly payment is not received within five (5) days of the scheduled due date, the Agreement will be deemed to be in <strong>suspended status</strong>. During the suspension: (i) Encore shall have no obligation to perform or guarantee any services under this Agreement; (ii) no transfer rights or benefits under this Agreement shall apply; and (iii) the suspension shall remain in effect until all outstanding payments are current.
        </p>
        <p className="pl-6 text-justify">
          e.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Late Fees and Interest</strong></u>. If any payment remains unpaid for more than thirty (30) days after the due date, the Client shall be charged a <strong>late fee</strong> of $<strong><u>{lateFee ? Number(lateFee).toFixed(2) : "________"}</u></strong> and <strong>interest</strong> on the overdue amount at the lesser of 1.5% per month or the maximum rate permitted by Texas law, calculated from the original due date until paid in full.
        </p>
        <p className="pl-6 text-justify">
          f.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Termination for Non-Payment</strong></u>. If the Client fails to make full payment within sixty (60) days of the original due date, Encore may, upon written notice, terminate this Agreement due to material breach. Upon termination, Encore shall have no further obligation to provide services or accept custody of the Client&apos;s dog(s). All fees accrued prior to termination, including interest and late fees, shall remain due and payable.
        </p>
      </div>

      {/* Transfer of Ownership */}
      <div className="space-y-2 mb-3">
        <p className="font-bold text-justify">
          5.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Transfer of Ownership and Relinquishment of Rights</strong></u>
        </p>
        <p className="pl-6 text-justify">
          a.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Legal Transfer of Ownership</strong></u>. Upon the Client&apos;s death and verification thereof as provided in this Agreement, Encore shall assume full legal ownership of the dog(s) described herein, including all rights of custody, title, possession, and decision-making authority. The term &quot;guardianship&quot; as used in this Agreement is intended to reflect the compassionate nature of Encore&apos;s role, but the Client expressly acknowledges and agrees that the transfer of guardianship includes the full transfer of ownership under applicable law.
        </p>
        <p className="pl-6 text-justify">
          b.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Relinquishment by Client</strong></u>. By signing this Agreement, the Client irrevocably agrees that, upon the occurrence of the transfer event described above, all ownership rights in the covered dog(s) shall immediately and permanently vest in Encore. The Client hereby waives and relinquishes any and all legal or equitable claims to the dog(s) and authorizes Encore to act as the sole legal owner, including but not limited to the rights of adoption, rehoming, medical decision-making, and end-of-life care.
        </p>
        <p className="pl-6 text-justify">
          c.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Binding Effect Under Texas Law</strong></u>. This Agreement is intended to serve as a valid and enforceable contractual disposition of personal property under Texas Estates Code § 254.004. The Client agrees that the dog(s) shall not be subject to separate disposition under the Client&apos;s will or trust instruments, and that this Agreement shall be binding upon the Client&apos;s estate, heirs, executors, and personal representatives. In the event of any conflict between this Agreement and other estate planning documents, the terms of this Agreement shall prevail regarding the disposition of the dog(s).
        </p>
        <p className="pl-6 text-justify">
          d.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Instructions to Estate</strong></u>. The Client directs their Designated Representative and personal representative (if different) to fully cooperate with Encore in executing the terms of this Agreement and to deliver possession of the dog(s) promptly upon request.
        </p>
      </div>

      {/* Standard of Care */}
      <p className="mb-3 text-justify">
        6.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Standard of Care</strong></u>. Encore agrees that upon taking custody of the dog(s), it will provide care that meets or exceeds the minimum standards required for animal shelters under Texas law and in accordance with generally accepted humane practices. This includes providing appropriate nutrition, water, shelter, exercise, socialization, and veterinary care (including prompt medical attention for any illness or injury). The dog(s) will be housed in safe, clean, and secure facilities, with separation by compatibility as needed, and will receive affection and humane treatment for the duration of their stay. Encore shall also comply with any applicable Texas Health &amp; Safety Code provisions (such as Chapter 823 for animal shelters), including scanning for microchips upon intake and obtaining veterinary examinations as required.
      </p>

      {/* Placement and Adoption */}
      <div className="space-y-2 mb-3">
        <p className="text-justify">
          7.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Placement and Adoption</strong></u>. Encore will make reasonable efforts to place the dog(s) in a suitable permanent home or foster environment that meets Encore&apos;s adoption criteria. Any individual or organization assuming guardianship of the dog(s) through Encore will be required to sign an agreement to provide proper care and to return the animal to Encore if they are unable to continue care. Encore will conduct due diligence in screening potential adopters or placements, which may include reference checks, home visits, and veterinary checks as applicable, to ensure the welfare of the dog(s). If no suitable home is found immediately, the dog(s) will remain in the care of Encore or an Encore-affiliated sanctuary or foster home, and the Client&apos;s dog(s) will <strong>not</strong> be euthanized for lack of space or inconvenience (euthanasia will only be considered in accordance with the End-of-Life Care clause for health and welfare reasons). Encore may keep the Client&apos;s dog(s) in its program for the remainder of the dog&apos;s natural life if necessary to ensure humane care.
        </p>
        <p className="pl-6 text-justify">
          Client may provide Encore with written input or preferences regarding the placement of their dog(s), such as preferred individuals, types of homes, or specific organizations. Encore agrees to consider the Client&apos;s preferences in good faith when selecting a future home or caretaker for the dog(s). However, the Client acknowledges and agrees that Encore has sole and final authority to decide on any transfer or adoption and will act in what Encore deems to be the best interest of the animal(s).
        </p>
      </div>

      {/* End of Life Care */}
      <div className="space-y-2 mb-3">
        <p className="font-bold text-justify">
          8.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>End-of-Life Care and Euthanasia</strong></u>
        </p>
        <p className="pl-6 text-justify">
          a.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Veterinary Consultation and Standard of Care</strong></u>. Upon taking custody of the Client&apos;s dog(s), Encore shall be solely responsible for making end-of-life care decisions according to veterinary best practices and humane animal welfare standards. Encore may consult with licensed veterinary professionals to assess the dog&apos;s quality of life and determine suitable treatment or palliative care options.
        </p>
        <p className="pl-6 text-justify">
          b.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Scope of Conditions Considered</strong></u>. The Client acknowledges that euthanasia may be considered in cases of:
        </p>
        <div className="pl-12 space-y-1">
          <p className="text-justify">i.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Catastrophic or untreatable injury;</p>
          <p className="text-justify">ii.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Degenerative or terminal illness causing intractable pain or severe disability;</p>
          <p className="text-justify">iii.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Advanced age accompanied by progressive deterioration;</p>
          <p className="text-justify">iv.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Severe, unmanageable behavioral issues (including chronic aggression or uncontrollable anxiety) that pose a risk to the animal&apos;s welfare or the safety of others; or</p>
          <p className="text-justify">v.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Any other physical, neurological, or psychological condition that, in the judgment of veterinary professionals and Encore, causes the animal to undergo prolonged suffering or renders it unfit for adoption, foster placement, or humane long-term care.</p>
        </div>
        <p className="pl-6 text-justify">
          c.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Decision-Making Process</strong></u>. Encore will make all euthanasia decisions in consultation with a licensed veterinarian and only after reasonable consideration of alternative care options. The decision will be based on the dog&apos;s best interest and the feasibility of providing a humane and manageable quality of life.
        </p>
        <p className="pl-6 text-justify">
          d.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Waiver of Claims</strong></u>. The Client waives any claims against Encore for decisions made in good faith pursuant to this section, including compassionate euthanasia where appropriate under the circumstances.
        </p>
        <p className="pl-6 text-justify">
          e.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Survival</strong></u>. The provisions of this section shall survive the death of the Client and shall apply regardless of any disagreement from the Client&apos;s estate or heirs regarding the care provided.
        </p>
      </div>

      {/* Liability and Indemnity */}
      <div className="space-y-2 mb-3">
        <p className="font-bold text-justify">
          9.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Liability, Waiver, and Indemnity</strong></u>
        </p>
        <p className="pl-6 text-justify">
          a.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Acknowledged Risks</strong></u>. The Client acknowledges and accepts that participating in activities such as transport, group play, boarding, grooming, socialization, medical treatment, and general care—whether provided directly by Encore or its affiliates—poses inherent risks to animals. These risks include, but are not limited to, injury, illness, exposure to communicable diseases, parasites, bites, scratches, stress-related behaviors, loss of appetite, allergic reactions, escape, straying, theft, or death.
        </p>
        <p className="pl-6 text-justify">
          b.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Waiver and Release of Claims</strong></u>. The Client, on behalf of themselves, their estate, heirs, executors, and assigns, hereby waives, releases, and discharges Encore, its owners, employees, contractors, volunteers, and affiliates from any and all liabilities, claims, suits, causes of action, demands, losses, costs, and expenses (including attorneys&apos; fees), whether known or unknown, arising out of or related to: (i) injury, illness, loss, or death of the Client&apos;s dog(s) while in the custody or care of Encore; (ii) any act or omission of another dog, animal, person, or third party while the dog(s) are under Encore&apos;s care; and (iii) the provision or failure to provide any medical treatment or services in accordance with Section 8 (End-of-Life Care). This waiver applies regardless of whether such harm results from negligence, as long as it does not arise from gross negligence or intentional misconduct.
        </p>
        <p className="pl-6 text-justify">
          c.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Indemnity for Harm Caused by Dog(s)</strong></u>. The Client, and the Client&apos;s estate following death, shall indemnify, defend, and hold harmless Encore and its affiliates from any and all claims, demands, liabilities, damages, injuries, losses, and expenses (including reasonable attorneys&apos; fees) arising out of or related to: (i) injuries or damages caused by the Client&apos;s dog(s) to any person, animal, or property, occurring after the dog(s) are transferred to Encore under this Agreement; and (ii) any failure by the Client or their estate to disclose known behavioral or medical conditions that materially affect the dog(s)&apos; temperament, safety, or adoptability.
        </p>
        <p className="pl-6 text-justify">
          d.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Survival</strong></u>. The waivers and indemnification obligations under this Section shall survive the termination of this Agreement and the death of the Client.
        </p>
      </div>

      {/* No Reliance */}
      <p className="mb-3 text-justify">
        10.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>No Reliance; No Future Changes Guaranteed</strong></u>. The Client acknowledges that they are entering into this Agreement based on their current personal circumstances and the services and capacity offered by Encore at this time. The Client is not relying on any representation or guarantee that any specific future event or change in circumstances (such as the Client&apos;s future health, moving to assisted living, financial changes, or the addition of new pets) will be accommodated by Encore outside the express terms of this Agreement. The Client waives any right to claim that this Agreement should continue or be adjusted due to any changes in the Client&apos;s life or expectations, except as expressly provided herein.
      </p>

      {/* Term and Termination */}
      <div className="space-y-2 mb-3">
        <p className="font-bold text-justify">
          11.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Term and Termination</strong></u>
        </p>
        <p className="pl-6 text-justify">
          a.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Term</strong></u>. This Agreement shall become effective on the Effective Date and shall remain in effect until terminated in accordance with this Section.
        </p>
        <p className="pl-6 text-justify">
          b.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Termination by Client</strong></u>. The Client may terminate this Agreement at any time by providing written notice to Encore at least fifteen (15) days before the next scheduled payment date. Termination will take effect on the last day of the current billing period. Upon termination, Encore shall have no further obligation to accept or care for the Client&apos;s dog(s), and all fees paid prior to the effective termination date shall be non-refundable.
        </p>
        <p className="pl-6 text-justify">
          c.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Termination by Encore</strong></u>. Encore may terminate this Agreement at any time, with or without cause, by providing at least thirty (30) days&apos; written notice to the Client. Upon termination, Encore shall have no obligation to accept or provide care for the Client&apos;s dog(s) in the event of the Client&apos;s death. All fees paid prior to the effective termination date shall be non-refundable.
        </p>
        <p className="pl-6 text-justify">
          d.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Automatic Termination—No Covered Dog(s)</strong></u>. If all dog(s) covered under this Agreement die, are permanently lost, or are lawfully rehomed before the Client&apos;s death, and the Client does not add new dog(s) in accordance with Section 2(b), either party may terminate this Agreement with written notice. Following such termination, Encore shall have no further obligations, and the Client shall not be required to make future payments. Payments made before the date of such notice shall remain non-refundable.
        </p>
        <p className="pl-6 text-justify">
          e.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>No Termination Upon Client&apos;s Death</strong></u>. Upon the Client&apos;s death, this Agreement shall be considered irrevocable by the Client and shall continue in effect as necessary to facilitate the transfer of guardianship and care of the dog(s) to Encore.
        </p>
        <p className="pl-6 text-justify">
          f.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Effect of Termination</strong></u>. Upon any termination of this Agreement, Encore shall have no further obligation to accept, transport, house, or care for the Client&apos;s dog(s) following the Client&apos;s death, and all waivers and liability limitations shall remain in effect for any services rendered prior to termination.
        </p>
      </div>

      {/* Nullification */}
      <div className="space-y-2 mb-3">
        <p className="font-bold text-justify">
          12.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Nullification by Encore</strong></u>
        </p>
        <p className="pl-6 text-justify">
          a.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Grounds for Nullification</strong></u>. Encore shall have the right, at its sole discretion, to declare this Agreement null and void and refuse to accept custody of the Client&apos;s dog(s) upon the occurrence of any of the following events: (i) The Client&apos;s death results from suicide, homicide, or the commission of a criminal act; (ii) The Client materially misrepresents the identity, age, breed, health condition, or number of the dog(s); or (iii) The dog(s) presented for transfer are not the same dog(s) described in this Agreement or any addendum.
        </p>
        <p className="pl-6 text-justify">
          b.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Effect of Nullification</strong></u>. If Encore exercises its right to nullify this Agreement, all Encore obligations shall immediately and permanently cease. Encore shall not be required to transport, house, adopt, or care for the dog(s) under any circumstances. The Client (or the Client&apos;s estate) shall remain solely responsible for arranging care or placement of the dog(s), and Encore shall have no liability arising from its refusal to accept custody.
        </p>
        <p className="pl-6 text-justify">
          c.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>No Refund</strong></u>. In the event of nullification pursuant to this Section, all fees and payments previously made shall remain non-refundable and shall not be subject to credit or reimbursement. The Client acknowledges and agrees that such payments were made in consideration of Encore&apos;s general readiness to provide services, and not in exchange for guaranteed future performance under high-risk or materially misrepresented conditions.
        </p>
      </div>

      {/* Force Majeure */}
      <p className="mb-3 text-justify">
        13.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Force Majeure</strong></u>. &quot;Force Majeure&quot; refers to any event outside a party&apos;s reasonable control that materially prevents or delays performance, including natural disasters (e.g., floods, hurricanes, wildfires), war, terrorism, civil unrest, epidemics, pandemics, government actions, power or transportation failures, or similar events. If Force Majeure temporarily prevents a party from fulfilling obligations, then performance is suspended only for the duration of the delay. The affected party must promptly notify the other party in writing and resume performance as soon as reasonably possible. If Force Majeure lasts for more than sixty (60) consecutive days and significantly hinders Encore from accepting or caring for the dog(s), Encore may terminate this Agreement by providing written notice to the Client (or, if deceased, the Designated Representative or estate). Encore will be released from further obligations, and the Client (or estate) waives any claims against Encore for non-performance due to Force Majeure. Force Majeure does not excuse any payment obligations or other liabilities that arose before the event.
      </p>

      {/* Operational Inability */}
      <p className="mb-3 text-justify">
        14.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Operational Inability to Perform</strong></u>. Encore&apos;s obligations under this Agreement are conditional upon its continued ability to accept and care for the Client&apos;s dog(s) at the time of the Client&apos;s death. While Encore intends in good faith to fulfill this Agreement, its performance may be excused if, despite reasonable efforts, Encore cannot accept custody of the dog(s) due to closure, insolvency, a lack of facilities or foster resources, or other substantial limitations beyond Encore&apos;s control that are not covered by Force Majeure. In such cases, Encore may, but is not obligated to, refer the dog(s) to or transfer this Agreement to a qualified third party, such as a licensed rescue, animal sanctuary, or affiliated care provider able to assume custody in accordance with this Agreement&apos;s intent. Any such assignment shall be promptly communicated to the Client&apos;s estate or Designated Representative. If Encore determines that it cannot reasonably perform and no suitable assignment is possible, Encore is released from further obligations under this Agreement. The Client waives any claims against Encore for such non-performance and acknowledges that all payments under this Agreement are non-refundable.
      </p>

      {/* Not Insurance */}
      <p className="mb-3 text-justify">
        15.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Not Insurance or Prepaid Funeral Contract</strong></u>. The Client acknowledges and agrees that this Agreement is not a contract of insurance, a prepaid funeral benefits contract, or a prepaid services contract governed by the Texas Insurance Code or any similar regulatory scheme. This Agreement does not provide for the payment of money or benefits to the Client, the Client&apos;s estate, or any third party upon the Client&apos;s death. Instead, the Agreement specifies the performance of services by Encore, which is conditional upon certain factual circumstances, including the continued operation and capacity of Encore and the timely payment of service fees by the Client during their lifetime. No part of the payments made under this Agreement is held in trust, escrow, or reserve for future payout or performance.
      </p>

      {/* Estate Cooperation */}
      <div className="space-y-2 mb-3">
        <p className="font-bold text-justify">
          16.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Estate Cooperation and Non-Interference</strong></u>
        </p>
        <p className="pl-6 text-justify">
          a.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Instructions for Estate and Representatives</strong></u>. The Client expressly directs that, upon their death, any person or entity in possession or control of the Client&apos;s dog(s)—including but not limited to family members, caregivers, heirs, beneficiaries, executors, administrators, trustees, and estate representatives—shall fully cooperate with Encore to ensure the prompt and unconditional release and delivery of the dog(s) to Encore or its designated agent.
        </p>
        <p className="pl-6 text-justify">
          b.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Non-Interference by Heirs or Estate</strong></u>. The Client further directs that no person or representative of the Client&apos;s estate shall interfere with, delay, condition, or dispute the transfer of the dog(s) to Encore pursuant to this Agreement. Any such challenge shall be deemed contrary to the Client&apos;s express intent and shall be legally ineffective to prevent or postpone performance.
        </p>
        <p className="pl-6 text-justify">
          c.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Pre-Consent by Estate</strong></u>. The Client, by entering into this Agreement, pre-consents on behalf of their estate and all successors-in-interest to the posthumous transfer of ownership and physical custody of the dog(s) to Encore in accordance with the terms outlined herein.
        </p>
      </div>

      {/* Survival */}
      <p className="mb-3 text-justify">
        17.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Survival, Binding Effect, and Enforceability</strong></u>. This Agreement shall be binding upon and enforceable against the Client&apos;s estate, heirs, executors, administrators, personal representatives, assigns, and any other successors in interest. All obligations and rights intended to survive the death of the Client—including, without limitation, the transfer of guardianship, the waivers, releases, and indemnities—shall remain in full force and effect and shall be enforceable by Encore to the maximum extent permitted by law.
      </p>

      {/* Dispute Resolution */}
      <div className="space-y-2 mb-3">
        <p className="font-bold text-justify">
          18.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Dispute Resolution</strong></u>
        </p>
        <p className="pl-6 text-justify">
          a.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Negotiation</strong></u>. If a dispute arises from or relates to this Agreement, the parties shall first endeavor in good faith to resolve it through informal discussion and direct negotiation.
        </p>
        <p className="pl-6 text-justify">
          b.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Mediation</strong></u>. If not resolved through negotiation, the parties will submit the matter to non-binding mediation administered by the American Arbitration Association (&quot;AAA&quot;) under its Commercial Commercial Mediation Procedures in Bexar County, Texas.
        </p>
        <p className="pl-6 text-justify">
          c.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Arbitration</strong></u>. If the dispute remains unresolved after mediation, it will be finally settled through binding arbitration before a single arbitrator, administered by the AAA in accordance with its Commercial Arbitration Rules in Bexar County, Texas.
        </p>
        <p className="pl-6 text-justify">
          d.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Provisional Relief</strong></u>. Either party may seek temporary injunctive or equitable relief from a court of competent jurisdiction to prevent immediate and irreparable harm.
        </p>
        <p className="pl-6 text-justify">
          e.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Waiver of Jury Trial and Class Actions</strong></u>. The parties waive any right to a jury trial or to participate in any class, consolidated, or representative actions.
        </p>
        <p className="pl-6 text-justify">
          f.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Governing Law</strong></u>. This Agreement shall be governed by the laws of the State of Texas. The exclusive venue for any court proceedings arising out of this Agreement shall be the state courts in Bexar County, Texas.
        </p>
      </div>

      {/* General Terms */}
      <div className="space-y-2 mb-3">
        <p className="font-bold text-justify">
          19.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>General Terms</strong></u>
        </p>
        <p className="pl-6 text-justify">
          a.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Notices</strong></u>. Any notice required or permitted under this Agreement must be in writing and will be considered given when delivered by email with confirmation of receipt, or by certified mail.
        </p>
        <p className="pl-6 text-justify">
          b.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Amendments</strong></u>. This Agreement may only be amended in writing and signed by both the Client and an authorized Encore representative.
        </p>
        <p className="pl-6 text-justify">
          c.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Severability</strong></u>. If any provision of this Agreement is determined to be invalid, illegal, or unenforceable, that provision shall be considered severed from this Agreement, and the remaining provisions shall remain in full force.
        </p>
        <p className="pl-6 text-justify">
          d.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Assignment</strong></u>. The Client may not assign this Agreement without Encore&apos;s prior written consent. Encore may assign this Agreement to any successor entity, affiliated nonprofit, or licensed rescue organization.
        </p>
        <p className="pl-6 text-justify">
          e.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><strong>Entire Agreement</strong></u>. This Agreement constitutes the entire agreement between the parties regarding the subject matter herein and supersedes all prior oral or written agreements.
        </p>
      </div>

      <p className="mb-4 font-semibold italic text-slate-700 text-[10px] text-justify leading-normal">
        By signing below, Client attests that the information provided is true, accurate and complete to the best of my knowledge and I understand that any falsification, omission, or concealment of material fact may result in cancellation of this Agreement. Each party acknowledges that they have read and understood this Agreement in its entirety and agree to be bound by its terms.
      </p>

      {/* Signatures */}
      <div className="border-t pt-4 mt-4 grid grid-cols-2 gap-8 mb-6">
        {/* Client Column */}
        <div className="space-y-4">
          <p className="font-bold text-slate-900 text-xs">Client:</p>
          
          {/* Signature Row */}
          <div>
            <div className="flex items-end w-full">
              <span className="font-bold text-[10px] text-slate-800 mr-2 w-16 shrink-0 mb-1">Signature:</span>
              <div className="flex-grow border-b border-slate-400 relative h-16 flex items-center justify-start pb-0.5">
                {isSigned && signatureDocUrl ? (
                  signatureDocUrl.startsWith("TYPED:") ? (
                    <span style={{ fontFamily: "'Caveat', cursive" }} className="text-4xl text-slate-800 absolute bottom-2 left-2">
                      {signatureDocUrl.substring(6)}
                    </span>
                  ) : signatureDocUrl.endsWith(".pdf") || signatureDocUrl.endsWith(".doc") || signatureDocUrl.endsWith(".docx") ? (
                    <span className="text-[10px] text-emerald-600 font-bold absolute bottom-2 left-2">Document Signed</span>
                  ) : (
                    <img
                      src={signatureDocUrl}
                      alt="Client Signature"
                      className="max-h-14 object-contain absolute bottom-2 left-2"
                    />
                  )
                ) : (
                  <span className="text-[10px] text-slate-300 italic absolute bottom-2 left-2">Signature Pending</span>
                )}
              </div>
            </div>
          </div>

          {/* Full Name Row */}
          <div>
            <div className="flex items-end w-full">
              <span className="font-bold text-[10px] text-slate-800 mr-2 w-16 shrink-0 mb-1">Full Name:</span>
              <div className="flex-grow border-b border-slate-400 relative h-8 flex items-end justify-start pb-0.5">
                <span className="text-[11px] text-slate-800 pl-2 font-medium">
                  {finalClientFullName}
                </span>
              </div>
            </div>
          </div>

          {/* Date Row */}
          <div>
            <div className="flex items-end w-full">
              <span className="font-bold text-[10px] text-slate-800 mr-2 w-16 shrink-0 mb-1">Date:</span>
              <div className="flex-grow border-b border-slate-400 relative h-8 flex items-end justify-start pb-0.5">
                <span className="text-[11px] text-slate-800 pl-2 font-medium">
                  {isSigned ? displayDate : ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* K9 Encore LLC Column */}
        <div className="space-y-4">
          <p className="font-bold text-slate-900 text-xs">K9 Encore LLC:</p>
          
          {/* Signature Row */}
          <div>
            <div className="flex items-end w-full">
              <span className="font-bold text-[10px] text-slate-800 mr-2 w-16 shrink-0 mb-1">Signature:</span>
              <div className="flex-grow border-b border-slate-400 relative h-16 flex items-center justify-start pb-0.5">
                {representativeSignatureUrl ? (
                  representativeSignatureUrl.startsWith("TYPED:") ? (
                    <span style={{ fontFamily: "'Caveat', cursive" }} className="text-4xl text-slate-800 absolute bottom-2 left-2">
                      {representativeSignatureUrl.substring(6)}
                    </span>
                  ) : (
                    <img
                      src={representativeSignatureUrl}
                      alt="Representative Signature"
                      className="max-h-14 object-contain absolute bottom-2 left-2"
                    />
                  )
                ) : (
                  <span style={{ fontFamily: "'Caveat', cursive" }} className="text-4xl text-slate-600 absolute bottom-2 left-2">
                    {finalAdminName}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Full Name Row */}
          <div>
            <div className="flex items-end w-full">
              <span className="font-bold text-[10px] text-slate-800 mr-2 w-16 shrink-0 mb-1">Full Name:</span>
              <div className="flex-grow border-b border-slate-400 relative h-8 flex items-end justify-start pb-0.5">
                <span className="text-[11px] text-slate-800 pl-2 font-medium">
                  {finalAdminName}
                </span>
              </div>
            </div>
          </div>

          {/* Date Row */}
          <div>
            <div className="flex items-end w-full">
              <span className="font-bold text-[10px] text-slate-800 mr-2 w-16 shrink-0 mb-1">Date:</span>
              <div className="flex-grow border-b border-slate-400 relative h-8 flex items-end justify-start pb-0.5">
                <span className="text-[11px] text-slate-800 pl-2 font-medium">
                  {isSigned ? displayDate : currentDate}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t-2 border-dashed border-slate-300 my-6 pt-4">
        <h2 className="text-xs font-bold text-center uppercase tracking-wider text-slate-900 mb-4">
          APPENDIX A<br />
          Client, Designated Representative, &amp; Dog Information
        </h2>

        {/* 1. Client Information Table */}
        <div className="mb-4">
          <h3 className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-1 border border-slate-300 uppercase tracking-wider">
            Client Information
          </h3>
          <table className="w-full border-collapse border border-slate-300 text-[10px]">
            <tbody>
              <tr>
                <td className="w-1/3 bg-slate-50 border border-slate-300 px-2 py-1 font-bold">First Name:</td>
                <td className="w-2/3 border border-slate-300 px-2 py-1">{finalClientFirstName || "N/A"}</td>
              </tr>
              <tr>
                <td className="bg-slate-50 border border-slate-300 px-2 py-1 font-bold">Last Name:</td>
                <td className="border border-slate-300 px-2 py-1">{finalClientLastName || "N/A"}</td>
              </tr>
              <tr>
                <td className="bg-slate-50 border border-slate-300 px-2 py-1 font-bold">Middle Initial:</td>
                <td className="border border-slate-300 px-2 py-1">{clientMiddleInitial || "N/A"}</td>
              </tr>
              <tr>
                <td className="bg-slate-50 border border-slate-300 px-2 py-1 font-bold">Last 4 of SSN:</td>
                <td className="border border-slate-300 px-2 py-1">{clientSsnLast4 || "N/A"}</td>
              </tr>
              <tr>
                <td className="bg-slate-50 border border-slate-300 px-2 py-1 font-bold">Street Address:</td>
                <td className="border border-slate-300 px-2 py-1">{clientAddress || "N/A"}</td>
              </tr>
              <tr>
                <td className="bg-slate-50 border border-slate-300 px-2 py-1 font-bold">City, State, Zip:</td>
                <td className="border border-slate-300 px-2 py-1">
                  {clientAddress ? "" : "N/A"}
                  {clientAddress && "Address Listed Above"}
                </td>
              </tr>
              <tr>
                <td className="bg-slate-50 border border-slate-300 px-2 py-1 font-bold">Email Address:</td>
                <td className="border border-slate-300 px-2 py-1">{clientEmail || "N/A"}</td>
              </tr>
              <tr>
                <td className="bg-slate-50 border border-slate-300 px-2 py-1 font-bold">Home Phone:</td>
                <td className="border border-slate-300 px-2 py-1">{clientHomePhone || "N/A"}</td>
              </tr>
              <tr>
                <td className="bg-slate-50 border border-slate-300 px-2 py-1 font-bold">Cell Phone:</td>
                <td className="border border-slate-300 px-2 py-1">{clientPhone || "N/A"}</td>
              </tr>
              <tr>
                <td className="bg-slate-50 border border-slate-300 px-2 py-1 font-bold">Work Phone:</td>
                <td className="border border-slate-300 px-2 py-1">{clientWorkPhone || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 2. Designated Representative Information Table */}
        <div className="mb-4">
          <h3 className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-1 border border-slate-300 uppercase tracking-wider">
            Designated Representative Information
          </h3>
          <table className="w-full border-collapse border border-slate-300 text-[10px]">
            <tbody>
              <tr>
                <td className="w-1/3 bg-slate-50 border border-slate-300 px-2 py-1 font-bold">First Name:</td>
                <td className="w-2/3 border border-slate-300 px-2 py-1">{finalReprFirstName || "N/A"}</td>
              </tr>
              <tr>
                <td className="bg-slate-50 border border-slate-300 px-2 py-1 font-bold">Last Name:</td>
                <td className="border border-slate-300 px-2 py-1">{finalReprLastName || "N/A"}</td>
              </tr>
              <tr>
                <td className="bg-slate-50 border border-slate-300 px-2 py-1 font-bold">Middle Initial:</td>
                <td className="border border-slate-300 px-2 py-1">{representativeMiddleInitial || "N/A"}</td>
              </tr>
              <tr>
                <td className="bg-slate-50 border border-slate-300 px-2 py-1 font-bold">Street Address:</td>
                <td className="border border-slate-300 px-2 py-1">{representativeAddress || "N/A"}</td>
              </tr>
              <tr>
                <td className="bg-slate-50 border border-slate-300 px-2 py-1 font-bold">City, State, Zip:</td>
                <td className="border border-slate-300 px-2 py-1">{representativeCityStateZip || "N/A"}</td>
              </tr>
              <tr>
                <td className="bg-slate-50 border border-slate-300 px-2 py-1 font-bold">Email Address:</td>
                <td className="border border-slate-300 px-2 py-1">{representativeEmail || "N/A"}</td>
              </tr>
              <tr>
                <td className="bg-slate-50 border border-slate-300 px-2 py-1 font-bold">Home Phone:</td>
                <td className="border border-slate-300 px-2 py-1">{representativeHomePhone || "N/A"}</td>
              </tr>
              <tr>
                <td className="bg-slate-50 border border-slate-300 px-2 py-1 font-bold">Cell Phone:</td>
                <td className="border border-slate-300 px-2 py-1">{representativePhone || "N/A"}</td>
              </tr>
              <tr>
                <td className="bg-slate-50 border border-slate-300 px-2 py-1 font-bold">Work Phone:</td>
                <td className="border border-slate-300 px-2 py-1">{representativeWorkPhone || "N/A"}</td>
              </tr>
              <tr>
                <td className="bg-slate-50 border border-slate-300 px-2 py-1 font-bold">Relation to Client:</td>
                <td className="border border-slate-300 px-2 py-1">{representativeRelation || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 3. Dog Information Tables */}
        <div>
          <h3 className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-1 border border-slate-300 uppercase tracking-wider">
            Dog Information
          </h3>
          {pets && pets.length > 0 ? (
            pets.map((pet, idx) => {
              const formattedBirthday = pet.birthday 
                ? new Date(pet.birthday).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                : "";
              const formattedAge = pet.age ? `${pet.age} years old` : "N/A";
              
              const isMicrochippedStr = pet.isMicrochipped === true || String(pet.isMicrochipped).toLowerCase() === "yes" || String(pet.isMicrochipped).toLowerCase() === "y"
                ? `Yes (${pet.microchipNumber || "No number listed"})`
                : "No";

              return (
                <div key={idx} className="mt-3 first:mt-0">
                  <div className="bg-slate-100 text-slate-700 text-[9px] font-bold px-2 py-1 border border-slate-300">
                    Dog #{idx + 1}
                  </div>
                  <table className="w-full border-collapse border border-slate-300 text-[10px]">
                    <tbody>
                      <tr>
                        <td className="w-1/3 bg-slate-50 border border-slate-300 px-2 py-1 font-bold">Name of Dog:</td>
                        <td className="w-2/3 border border-slate-300 px-2 py-1">{pet.name}</td>
                      </tr>
                      <tr>
                        <td className="bg-slate-50 border border-slate-300 px-2 py-1 font-bold">Gender:</td>
                        <td className="border border-slate-300 px-2 py-1 capitalize">{String(pet.gender || "").toLowerCase()}</td>
                      </tr>
                      <tr>
                        <td className="bg-slate-50 border border-slate-300 px-2 py-1 font-bold">Spayed/Neutered:</td>
                        <td className="border border-slate-300 px-2 py-1">{pet.spayedNeutered || "N/A"}</td>
                      </tr>
                      <tr>
                        <td className="bg-slate-50 border border-slate-300 px-2 py-1 font-bold">Primary Breed:</td>
                        <td className="border border-slate-300 px-2 py-1">{pet.primaryBreed}</td>
                      </tr>
                      <tr>
                        <td className="bg-slate-50 border border-slate-300 px-2 py-1 font-bold">Additional Breed(s):</td>
                        <td className="border border-slate-300 px-2 py-1">{pet.additionalBreed || "None"}</td>
                      </tr>
                      <tr>
                        <td className="bg-slate-50 border border-slate-300 px-2 py-1 font-bold">Color(s) &amp; coat description:</td>
                        <td className="border border-slate-300 px-2 py-1">{pet.colorsAndCoat || "N/A"}</td>
                      </tr>
                      <tr>
                        <td className="bg-slate-50 border border-slate-300 px-2 py-1 font-bold">Birthday If Known/Age of Pet(s):</td>
                        <td className="border border-slate-300 px-2 py-1">
                          {formattedBirthday ? `${formattedBirthday} (${formattedAge})` : formattedAge}
                        </td>
                      </tr>
                      <tr>
                        <td className="bg-slate-50 border border-slate-300 px-2 py-1 font-bold">Microchipped(Y/N)/Phone Number:</td>
                        <td className="border border-slate-300 px-2 py-1">{isMicrochippedStr}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              );
            })
          ) : (
            <div className="p-3 border border-slate-300 border-t-0 text-center text-slate-400 italic text-[10px]">
              No dogs listed yet.
            </div>
          )}
        </div>

        {/* 4. Appendix D: Basic Health Information */}
        {healthAnswers && healthAnswers.length > 0 && (
          <div className="mt-4 break-inside-avoid">
            <h3 className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-1 border border-slate-300 uppercase tracking-wider">
              Appendix D: Basic Health Information
            </h3>
            <table className="w-full border-collapse border border-slate-300 text-[10px]">
              <tbody>
                {healthAnswers.map((answer: any, idx: number) => {
                  const qText = answer.question?.questionText || answer.nestedQuestion?.questionText || "Question";
                  const isYes = answer.answerBoolean === true;
                  const associatedFamilyHistories = (familyHealthHistories || []).filter(
                    (fh: any) => fh.questionId === answer.questionId
                  );

                  return (
                    <React.Fragment key={answer.id || idx}>
                      {/* Question Text & Yes/No Checkbox */}
                      <tr className="border-t border-slate-300">
                        <td className="w-2/3 border border-slate-300 px-2 py-1.5 align-middle text-justify">
                          {qText}
                        </td>
                        <td className="w-1/6 border border-slate-300 px-2 py-1.5 align-middle text-center whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 justify-center">
                            <span className="w-3.5 h-3.5 border border-slate-500 bg-white flex items-center justify-center text-[10px] leading-none">
                              {isYes ? "✓" : ""}
                            </span>
                            <span>Yes</span>
                          </div>
                        </td>
                        <td className="w-1/6 border border-slate-300 px-2 py-1.5 align-middle text-center whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 justify-center">
                            <span className="w-3.5 h-3.5 border border-slate-500 bg-white flex items-center justify-center text-[10px] leading-none">
                              {!isYes ? "✓" : ""}
                            </span>
                            <span>No</span>
                          </div>
                        </td>
                      </tr>

                      {/* Explanation Row (If exists) */}
                      {answer.inputValue && (
                        <tr>
                          <td colSpan={3} className="border border-slate-300 bg-slate-50/50 px-4 py-1.5 text-slate-600 font-semibold">
                            If yes, please explain including dates of diagnosis:
                            <span className="block mt-0.5 text-slate-800 font-normal italic underline">
                              {answer.inputValue}
                            </span>
                          </td>
                        </tr>
                      )}

                      {/* Family Histories Row (If exists) */}
                      {associatedFamilyHistories.length > 0 && (
                        <tr>
                          <td colSpan={3} className="border border-slate-300 bg-slate-50/50 px-4 py-2 text-slate-600 font-semibold">
                            If yes, provide the details below. Relation (mother, father, brother, sister), Diagnosis, Approximate age of disease onset, age at death:
                            <div className="mt-1.5 overflow-hidden rounded border border-slate-200">
                              <table className="w-full border-collapse border border-slate-200 text-[9px] bg-white">
                                <thead>
                                  <tr className="bg-slate-100/80 text-slate-700">
                                    <th className="border border-slate-200 px-2 py-1 text-left font-bold w-1/4">Relation</th>
                                    <th className="border border-slate-200 px-2 py-1 text-left font-bold w-1/4">Diagnosis</th>
                                    <th className="border border-slate-200 px-2 py-1 text-left font-bold w-1/4">Age of Onset</th>
                                    <th className="border border-slate-200 px-2 py-1 text-left font-bold w-1/4">Age at Death</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {associatedFamilyHistories.map((fh: any, fIdx: number) => (
                                    <tr key={fIdx} className="text-slate-800">
                                      <td className="border border-slate-200 px-2 py-1">{fh.relation || "N/A"}</td>
                                      <td className="border border-slate-200 px-2 py-1">{fh.diagnosis || "N/A"}</td>
                                      <td className="border border-slate-200 px-2 py-1">
                                        {fh.approxAgeOfOnset !== null && fh.approxAgeOfOnset !== undefined ? `${fh.approxAgeOfOnset} yrs` : "N/A"}
                                      </td>
                                      <td className="border border-slate-200 px-2 py-1">
                                        {fh.ageAtDeath !== null && fh.ageAtDeath !== undefined ? `${fh.ageAtDeath} yrs` : "N/A"}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
