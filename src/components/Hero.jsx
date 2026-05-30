export default function Hero({ onBookingClick }) {
  return (
    <section
      id="home"
      className="pt-32 pb-20 md:pt-40 md:pb-32 px-4 md:px-8 bg-white"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-slate-900 mb-6 leading-tight">
          Strategic Consulting for Growing Businesses
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Data-driven strategies to scale your business
        </p>
        <button
          onClick={onBookingClick}
          className="bg-slate-900 text-white px-8 py-3 rounded-md hover:bg-slate-800 font-medium transition inline-block"
        >
          Schedule a Consultation
        </button>
      </div>
    </section>
  );
}
