import Image from "next/image";

function PaymentHeader() {
  return (
    <div className="w-full border-b border-gray-200 mb-4">
      <div className="flex items-center justify-center">
        <Image
          src="/payment-header.png"
          alt="Encore Logo"
          width={160}
          height={63}
          className="object-contain"
        />
      </div>
    </div>
  );
}

export default PaymentHeader;