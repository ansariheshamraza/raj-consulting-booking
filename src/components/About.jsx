export default function About() {
  const features = [
    {
      icon: '📊',
      title: 'Data-Driven Approach',
      description: 'Decisions backed by real metrics and market insights',
    },
    {
      icon: '🎯',
      title: 'Proven Strategies',
      description: 'Tested frameworks that deliver measurable results',
    },
    {
      icon: '🤝',
      title: 'Dedicated Partnership',
      description: 'We invest in your success as our own',
    },
  ];

  return (
    <section id="about" className="py-20 md:py-32 px-4 md:px-8 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-16 text-center">
          Why Raj Consulting?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-md border border-slate-200 hover:border-slate-300 transition"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
