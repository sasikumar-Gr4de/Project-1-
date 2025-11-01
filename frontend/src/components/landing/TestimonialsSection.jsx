import { Star, Quote } from "lucide-react";

const TestimonialsSection = ({ content }) => {
  const defaultTestimonials = [
    {
      name: "Alex Rodriguez",
      role: "Head Coach",
      club: "Metropolis FC",
      content:
        "GR4DE has revolutionized how we identify and develop young talent. The objective scoring system removes bias and helps us make data-driven decisions.",
      avatar: null,
    },
    {
      name: "Sarah Chen",
      role: "Technical Director",
      club: "Youth Academy EU",
      content:
        "The platform's ability to track player progress over time has been invaluable. We've seen a 40% improvement in talent identification accuracy.",
      avatar: null,
    },
    {
      name: "Marcus Johnson",
      role: "Sports Scientist",
      club: "Elite Performance Center",
      content:
        "Finally, a platform that combines technical, physical, and tactical metrics in a meaningful way. The GR4DE score is now our gold standard.",
      avatar: null,
    },
  ];

  const testimonials =
    content?.testimonialsSection?.testimonials || defaultTestimonials;

  return (
    <section className="py-16 px-4 bg-[#1A1A1A]">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-['Orbitron'] mb-4 bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
            {content?.testimonialsSection?.heading ||
              "Trusted by Football Experts"}
          </h2>
          <p className="text-[#B0AFAF] max-w-2xl mx-auto font-['Orbitron']">
            {content?.testimonialsSection?.subheading ||
              "Join leading clubs and academies transforming their talent assessment process"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-[#262626] border border-[#343434] rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4 shrink-0">
                  <Quote className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">
                    {testimonial.name}
                  </h3>
                  <p className="text-primary text-sm mb-1">
                    {testimonial.role}
                  </p>
                  <p className="text-[#B0AFAF] text-sm">{testimonial.club}</p>
                </div>
              </div>
              <p className="text-[#B0AFAF] italic">"{testimonial.content}"</p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-primary fill-current" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
