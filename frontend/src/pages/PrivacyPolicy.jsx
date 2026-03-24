const PrivacyPolicy = () => {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="glass p-6 sm:p-8 md:p-12 rounded-3xl">
        <h1 className="text-4xl font-black mb-8 py-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 text-center">
          Privacy Policy
        </h1>
        
        <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">1. Information We Collect</h2>
            <p>We collect information you provide directly to us when you create an account, make a purchase, or contact our support team. This includes your name, email address, shipping address, and payment method details.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">2. How We Use Your Information</h2>
            <p>We use the information we collect to process your orders, maintain your account, and provide customer support. We may also use this information to send you promotional communications, which you can opt out of at any time.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">3. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage. We use industry-standard encryption for all transactions.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">4. Information Sharing</h2>
            <p>We do not sell your personal data. We may share your information with trusted third-party service providers who assist us in operating our website, conducting our business, or serving our users (e.g., payment processors like Razorpay, Delivery Services, etc).</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
