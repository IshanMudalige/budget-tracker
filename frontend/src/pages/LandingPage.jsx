export default function LandingPage() {
  return (
    <div className="min-h-screen px-6 md:px-16 py-10 text-gray-700">
      <section className="flex flex-col-reverse lg:flex-row items-center justify-between gap-20">
        <div className="flex-1 space-y-6 max-w-xl mx-20">
          <h2 className="text-4xl font-extrabold text-gray-800">
            Take Control of Your Finances
          </h2>
          <p className="text-gray-500">
            Manage your budget, track expenses, and plan for the future — all in one simple platform.
          </p>
          <button onClick={() => window.location.href = "/login"} className="bg-[#A855F7] text-white px-6 py-3 rounded-lg font-medium shadow hover:bg-purple-600 transition">
            Get Start
          </button>
        </div>

        <div className="flex-1 flex justify-center">
          <img
            src="./landing.png"
            alt="Girl using laptop"
            className="w-[80%] max-w-md"
          />
        </div>
      </section>

      <section className="mt-16 mx-20">
        <h3 className="text-2xl mb-6 text-gray-500 text-center">What we Offer</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center gap-2">
            <i className="fas fa-money-bill-wave text-purple-500 text-3xl" />
            <h4 className="font-bold">Expense & Income</h4>
            <p className="text-sm text-gray-500 text-center">Easily record and categorize your daily expenses and income to stay on top of your finances.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center gap-2">
            <i className="fas fa-trophy text-purple-500 text-3xl" />

            <h4 className="font-bold">Budget Goals</h4>
            <p className="text-sm text-gray-500 text-center">Visualize your spending habits with clear, insightful charts and monthly breakdowns.</p>

          </div>
          <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center gap-2">
            <i className="fas fa-chart-line text-purple-500 text-3xl" />

            <h4 className="font-bold">Reports</h4>
            <p className="text-sm text-gray-500 text-center">Set custom budget limits and track your progress to avoid overspending and save smarter.</p>

          </div>
        </div>
      </section>
    </div>
  );
}
