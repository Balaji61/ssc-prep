import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">

      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">

          <Link
            href="/"
            className="text-2xl font-extrabold text-blue-800"
          >
            SSC PREP
          </Link>

          <Link
            href="/"
            className="font-semibold text-gray-700 hover:text-blue-700"
          >
            ← Home
          </Link>

        </div>
      </header>

      <section className="px-5 py-16">

        <div className="mx-auto max-w-2xl">

          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">

            <div className="text-center">

              <div className="text-5xl">
                📧
              </div>

              <h1 className="mt-5 text-3xl font-extrabold text-gray-900">
                Contact SSC PREP
              </h1>

              <p className="mt-4 leading-7 text-gray-700">
                Have a question, found a problem, or want to contact
                SSC PREP? You can reach us by email.
              </p>

            </div>

            <div className="mt-8 rounded-2xl bg-blue-50 p-6 text-center">

              <p className="text-sm font-semibold text-gray-600">
                Email
              </p>

              <a
                href="mailto:sscprepcontact@gmail.com"
                className="mt-2 block break-all text-lg font-bold text-blue-700 hover:text-blue-900"
              >
                sscprepcontact@gmail.com
              </a>

            </div>

            <div className="mt-8 text-center">

              <p className="text-sm text-gray-600">
                Want to report a question error, suggest a feature,
                or share feedback?
              </p>

              <Link
                href="/feedback"
                className="mt-4 inline-block rounded-xl bg-blue-700 px-6 py-3 font-bold text-white hover:bg-blue-800"
              >
                Send Feedback
              </Link>

            </div>

          </div>

        </div>

      </section>

      <footer className="border-t bg-white px-5 py-8">

        <div className="mx-auto text-center text-sm text-gray-600">

          <p>
            © 2026 SSC PREP
          </p>

          <div className="mt-2">
            <Link
              href="/feedback"
              className="font-semibold hover:text-blue-700"
            >
              Feedback
            </Link>
          </div>

        </div>

      </footer>

    </main>
  );
}