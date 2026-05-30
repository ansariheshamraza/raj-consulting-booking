export default function Services() {
  const services = [
    {
      title: 'Business Strategy',
      description: 'Comprehensive strategy sessions to align your vision with market opportunities',
      duration: '45 min',
      price: '$150',
    },
    {
      title: 'Marketing Audit',
      description: 'In-depth analysis of your current marketing efforts and competitive landscape',
      duration: '60 min',
      price: '$200',
    },
    {
      title: 'Growth Planning',
      description: 'Detailed roadmap for scaling your business with actionable milestones',
      duration: '90 min',
      price: '$300',
    },
    {
      title: 'One-on-One Coaching',
      description: 'Personalized guidance on leadership, strategy, and business challenges',
      duration: '60 min',
      price: '$250',
    },
  ];

  return (
    <section id="services" className="py-20 md:py-32 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-16 text-center">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-md p-6 hover:border-slate-300 transition"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                {service.title}
              </h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                {service.description}
              </p>
              <div className="border-t border-slate-200 pt-4 mt-4">
                <p className="text-xs text-slate-500 mb-2">{service.duration}</p>
                <p className="text-lg font-semibold text-slate-900">
                  {service.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
