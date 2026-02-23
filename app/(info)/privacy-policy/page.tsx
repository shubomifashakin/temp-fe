const LAST_UPDATED_AT = "February 19, 2025";

export default function Page() {
  return (
    <section className="min-h-screen pt-20">
      <div className="max-w-4xl space-y-12 px-4 mx-auto w-full">
        <div className="space-y-3">
          <h1 className="text-6xl font-playfair font-bold text-foreground text-balance tracking-tight">
            Privacy Policy
          </h1>

          <p className="text-leading text-sm">
            Last updated: {LAST_UPDATED_AT}
          </p>
        </div>

        <div className="space-y-12 pb-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
              1. Introduction
            </h2>

            <p className="text-foreground font-light text-sm leading-relaxed">
              Temp (&quot;we,&quot; &quot;us,&quot; &quot;our,&quot; or
              &quot;Company&quot;) is committed to protecting your privacy. This
              Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you visit our website and use our
              services.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
              2. Information We Collect
            </h2>

            <p className="text-foreground font-light text-sm leading-relaxed">
              We collect information in the following ways:
            </p>

            <ul className="list-disc font-light text-sm list-inside space-y-2 text-foreground">
              <li>
                <span className="font-semibold">Account Information:</span> When
                you create an account, we collect your email address and profile
                information.
              </li>
              <li>
                <span className="font-semibold">File Information:</span> We
                collect metadata about files you upload, including file name,
                size, type, and upload time.
              </li>
              <li>
                <span className="font-semibold">Usage Data:</span> We
                automatically collect information about how you interact with
                our Service, including downloads, shares, and access times.
              </li>
              <li>
                <span className="font-semibold">Device Information:</span> We
                collect information about your device, browser type, IP address,
                and referral source.
              </li>
              <li>
                <span className="font-semibold">Cookies:</span> We use cookies
                to enhance your experience and track usage patterns.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
              3. How We Use Your Information
            </h2>

            <p className="text-foreground font-light text-sm leading-relaxed">
              We use the information we collect to:
            </p>

            <ul className="list-disc font-light text-sm list-inside space-y-2 text-foreground">
              <li>Provide, maintain, and improve our Services</li>
              <li>Process transactions and send related information</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Generate analytics and improve user experience</li>
              <li>Detect and prevent fraud and abuse</li>
              <li>Comply with legal obligations</li>
              <li>Send marketing communications (with your consent)</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
              4. File Security and Scanning
            </h2>

            <p className="text-foreground font-light text-sm leading-relaxed">
              All files uploaded to Temp are automatically scanned for viruses
              and malware. We may analyze file contents to ensure compliance
              with our Terms of Service. Your files are encrypted during
              transmission and storage, but we cannot guarantee absolute
              security.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
              5. Data Retention
            </h2>

            <p className="text-foreground font-light text-sm leading-relaxed">
              Files are automatically deleted from our servers after the
              retention period you selected (7, 14, or 31 days). Account
              information and usage analytics are retained until you delete your
              account. Deleted data cannot be recovered.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
              6. Data Sharing and Disclosure
            </h2>

            <p className="text-foreground font-light text-sm leading-relaxed">
              We do not sell your personal information to third parties. We may
              share information with:
            </p>

            <ul className="list-disc list-inside font-light space-y-2 text-sm text-foreground">
              <li>
                <span className="font-semibold">Service Providers:</span>{" "}
                Third-party vendors who help us operate our Service (hosting,
                analytics, payment processing).
              </li>

              <li>
                <span className="font-semibold">Legal Authorities:</span> When
                required by law or to protect our rights and safety.
              </li>

              <li>
                <span className="font-semibold">Business Transfers:</span> In
                the event of merger, acquisition, or asset sale.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
              7. Your Privacy Rights
            </h2>

            <p className="text-foreground font-light text-sm leading-relaxed">
              Depending on your location, you may have the following rights:
            </p>

            <ul className="list-disc list-inside font-light space-y-2 text-sm text-foreground">
              <li>Right to access your personal information</li>
              <li>Right to correct inaccurate information</li>
              <li>Right to delete your information</li>
              <li>Right to opt-out of marketing communications</li>
              <li>Right to data portability</li>
            </ul>

            <p className="text-foreground font-light text-sm leading-relaxed">
              To exercise these rights, please contact us at{" "}
              <a
                href="mailto:apps@545plea.xyz"
                className="text-sm font-light border-b border-orange-500 transition-colors duration-150 w-fit border-dashed text-orange-500"
              >
                apps@545plea.xyz.
              </a>
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
              8. Third-Party Links
            </h2>

            <p className="text-foreground font-light text-sm leading-relaxed">
              Our Service may contain links to third-party websites. We are not
              responsible for their privacy practices. We encourage you to
              review their privacy policies before sharing information.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
              9. Children&apos;s Privacy
            </h2>

            <p className="text-foreground font-light text-sm leading-relaxed">
              Our Service is not intended for children under 13. We do not
              knowingly collect information from children under 13. If we become
              aware of such collection, we will delete the information
              immediately.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
              10. Security
            </h2>

            <p className="text-foreground font-light text-sm leading-relaxed">
              We implement industry-standard security measures to protect your
              information from unauthorized access, alteration, and disclosure.
              However, no method of transmission over the internet is 100%
              secure. We cannot guarantee absolute security.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
              11. Changes to This Privacy Policy
            </h2>

            <p className="text-foreground font-light text-sm leading-relaxed">
              We may update this Privacy Policy to reflect changes in our
              practices or legal requirements. We will notify you of material
              changes via email or by posting the updated policy on our website.
              Your continued use constitutes acceptance of the updated policy.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
              12. Contact Us
            </h2>

            <p className="text-foreground font-light text-sm leading-relaxed">
              If you have questions about this Privacy Policy or our privacy
              practices, please contact us at:{" "}
              <a
                href="mailto:apps@545plea.xyz"
                className="block text-sm font-light border-b border-orange-500 transition-colors duration-150 w-fit border-dashed text-orange-500"
              >
                apps@545plea.xyz
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
