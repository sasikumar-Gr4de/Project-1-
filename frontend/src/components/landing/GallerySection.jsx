const GallerySection = ({ content }) => {
  const defaultImages = [
    {
      id: 1,
      src: "https://amzn-gr4de-bucket.s3.eu-north-1.amazonaws.com/server1.jpg-1761338438160-rmsqr6wybrn",
      alt: "Football match analysis",
      title: "Match Performance Tracking",
      description: "Real-time data collection during live matches",
    },
    {
      id: 2,
      src: "https://amzn-gr4de-bucket.s3.eu-north-1.amazonaws.com/server2.jpg-1761338488620-0rdjp464vtg",
      alt: "Player analytics dashboard",
      title: "Performance Dashboard",
      description: "Comprehensive player insights and metrics",
    },
    {
      id: 3,
      src: "https://amzn-gr4de-bucket.s3.eu-north-1.amazonaws.com/server3.jpg-1761338527588-i8o4q27ndl",
      alt: "Team strategic analysis",
      title: "Team Performance",
      description: "Team-wide analytics and strategic insights",
    },
    {
      id: 4,
      src: "https://amzn-gr4de-bucket.s3.eu-north-1.amazonaws.com/server8.jpg-1761338560319-85ae20q13as",
      alt: "Youth football training",
      title: "Talent Development",
      description: "Identifying and nurturing young football talent",
    },
  ];

  const galleryImages = content?.gallerySection?.images || defaultImages;

  return (
    <section className="py-16 px-4 bg-[#1A1A1A]">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-['Orbitron'] mb-4 bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
            {content?.gallerySection?.heading || "GR4DE In Action"}
          </h2>
          <p className="text-[#B0AFAF] max-w-2xl mx-auto font-['Orbitron']">
            {content?.gallerySection?.subheading ||
              "See how clubs and academies are transforming talent assessment with our platform"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className="group bg-[#262626] border border-[#343434] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-primary/30"
            >
              <div className="aspect-square overflow-hidden relative">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 text-white group-hover:text-primary transition-colors">
                  {image.title}
                </h3>
                <p className="text-sm text-[#B0AFAF] group-hover:text-white/80 transition-colors">
                  {image.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Gallery Info */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center justify-center space-x-8 text-sm text-[#B0AFAF]">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Used by 100+ clubs worldwide</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>10,000+ players analyzed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>98% customer satisfaction</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
