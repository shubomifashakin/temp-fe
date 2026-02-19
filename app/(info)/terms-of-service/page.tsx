const LAST_UPDATED_AT = "February 19, 2025";

export default function Page() {
  return (
    <section className="min-h-screen pt-20">
      <div className="max-w-4xl space-y-12 px-4 mx-auto w-full">
        <div className="space-y-3">
          <h1 className="text-6xl font-playfair font-bold text-foreground text-balance tracking-tight">
            Terms of Service
          </h1>

          <p className="text-muted-foreground font-light text-sm">
            Last updated: {LAST_UPDATED_AT}
          </p>
        </div>

        <div className="space-y-12 pb-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
              1. Acceptance of Terms
            </h2>

            <p className="text-foreground font-light text-sm leading-relaxed">
              By accessing and using Temp (&quot;Service&quot;), you accept and
              agree to be bound by the terms and provisions of this agreement.
              If you do not agree to abide by the above, please do not use this
              service.
            </p>

            <p className="text-foreground font-light text-sm leading-relaxed">
              You must be at least 13 years old (or the age of majority in your
              jurisdiction) to use our Services. If you are using the Services
              on behalf of an organization, you represent that you have the
              authority to bind that organization to these Terms.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
              2. Description of Service
            </h2>

            <p className="text-foreground font-light text-sm leading-relaxed">
              Temp provides secure temporary file sharing services that allow
              users to upload files, generate shareable links with optional
              password protection, and automatically delete files after a
              specified retention period (7, 14, or 31 days). The Service
              includes features such as:
            </p>

            <ul className="list-disc font-light text-sm list-inside space-y-2 text-foreground">
              <li>File upload and storage with virus scanning</li>
              <li>Shareable links with individual analytics</li>
              <li>Password-protected links</li>
              <li>Automatic file deletion after retention period</li>
              <li>Download tracking and analytics</li>
            </ul>

            <p className="text-foreground font-light text-sm leading-relaxed">
              We may update or modify the Services at any time to improve
              performance, introduce new features, or comply with legal
              requirements.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
              3. User Accounts
            </h2>

            <p className="text-foreground font-light text-sm leading-relaxed">
              To access certain features of the Service, you may need to create
              an account. You agree to:
            </p>

            <ul className="list-disc font-light text-sm list-inside space-y-2 text-foreground">
              <li>
                Provide accurate and complete information during registration
              </li>

              <li>Maintain the confidentiality of your login credentials</li>

              <li>
                Be responsible for all activities that occur under your account
              </li>

              <li>
                Notify us immediately of any unauthorized use of your account
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
              4. User Responsibilities
            </h2>

            <p className="text-foreground font-light text-sm leading-relaxed">
              You agree not to use the Service to:
            </p>

            <ul className="list-disc font-light text-sm list-inside space-y-2 text-foreground">
              <li>Upload files that violate any laws or regulations</li>
              <li>Share copyrighted material without permission</li>
              <li>Upload malware, viruses, or harmful code</li>
              <li>Harass, threaten, or harm other users</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Interfere with or disrupt the Service</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
              5. File Retention and Deletion
            </h2>

            <p className="text-foreground font-light text-sm leading-relaxed">
              Files uploaded to Temp are automatically deleted after the
              specified retention period (7, 14, or 31 days). You acknowledge
              that once deleted, files cannot be recovered. We are not
              responsible for any loss of data resulting from automatic
              deletion.
            </p>

            <p className="text-foreground font-light text-sm leading-relaxed">
              We reserve the right to immediately delete files that violate
              these Terms or applicable laws without prior notice.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
              6. Intellectual Property
            </h2>
            <p className="text-foreground font-light text-sm leading-relaxed">
              You retain all rights to files you upload to Temp. By uploading
              content, you grant Temp a limited license to store, process, and
              serve that content as necessary to provide the Service. You remain
              responsible for ensuring you have the rights to share any uploaded
              content.
            </p>
          </div>

          {/* Section 7 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
              7. Virus Scanning
            </h2>
            <p className="text-foreground font-light text-sm leading-relaxed">
              All uploaded files are scanned for viruses and malware. Files
              flagged as unsafe cannot be shared. However, we do not guarantee
              that all threats will be detected. Users are responsible for
              ensuring uploaded content is safe.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
              8. Limitation of Liability
            </h2>
            <p className="text-foreground font-light text-sm leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, TEMP AND ITS AFFILIATES
              SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL,
              SPECIAL, OR PUNITIVE DAMAGES ARISING FROM OR RELATED TO YOUR USE
              OF THE SERVICES.
            </p>
            <p className="text-foreground font-light text-sm leading-relaxed">
              IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE AMOUNT YOU HAVE
              PAID TO US (IF ANY) IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
              9. Disclaimer of Warranties
            </h2>
            <p className="text-foreground font-light text-sm leading-relaxed">
              The Service is provided on an &quot;as-is&quot; and
              &quot;as-available&quot; basis. We make no warranties that the
              Services will be uninterrupted, secure, or error-free.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
              10. Termination
            </h2>
            <p className="text-foreground font-light text-sm leading-relaxed">
              We reserve the right to suspend or terminate your account and
              access to the Service immediately and without notice if we
              reasonably believe you have violated these Terms or applicable
              laws.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
              11. Changes to Terms
            </h2>
            <p className="text-foreground font-light text-sm leading-relaxed">
              We may update these Terms at any time. If we make material
              changes, we will notify you via email or through the Service. Your
              continued use of the Services after such updates constitutes your
              acceptance of the revised Terms.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
              12. Governing Law
            </h2>
            <p className="text-foreground font-light text-sm leading-relaxed">
              These Terms shall be governed by and construed in accordance with
              the laws of your jurisdiction, without regard to conflict of law
              provisions.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-playfair tracking-tight">
              13. Contact Information
            </h2>

            <p className="text-foreground font-light text-sm leading-relaxed">
              If you have any questions about these Terms, please contact us at:
            </p>

            <div className="space-y-2 text-foreground">
              <a
                href="mailto:apps@545plea.xyz"
                className="block text-sm font-light border-b border-orange-500 transition-colors duration-150 w-fit border-dashed text-orange-500"
              >
                <span className="font-medium text-sm">Email:</span>{" "}
                apps@545plea.xyz
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
