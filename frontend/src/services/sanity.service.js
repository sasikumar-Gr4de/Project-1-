import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// Create Sanity client
const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || "production",
  useCdn: true,
  apiVersion: "2024-01-01",
  //   token: import.meta.env.VITE_SANITY_TOKEN, // Optional: for private datasets
});

// Initialize image URL builder
const builder = imageUrlBuilder(sanityClient);

export const sanityService = {
  /**
   * Fetch all landing page content from Sanity
   */
  async getLandingPageContent() {
    try {
      const query = `*[_type == "landingPage"][0]{
        heroSection {
          tagline,
          mainHeading,
          highlightedText,
          subheading,
          demoVideoUrl
        },
        aboutSection {
          heading,
          description,
          goalTitle,
          goalDescription,
          missionTitle,
          missionDescription
        },
        featuresSection {
          heading,
          subheading,
          features[] {
            title,
            description,
            icon
          }
        },
        howItWorksSection {
          heading,
          subheading,
          steps[] {
            stepNumber,
            title,
            description,
            icon
          }
        },
        testimonialsSection {
          heading,
          subheading,
          testimonials[] {
            name,
            role,
            club,
            content,
            avatar
          }
        },
        pricingSection {
          heading,
          subheading
        },
        ctaSection {
          heading,
          subheading,
          buttonText
        },
        gallerySection {
          heading,
          subheading,
          images[] {
            title,
            description,
            image
          }
        }
      }`;

      const content = await sanityClient.fetch(query);

      // Process images if they exist
      if (content?.gallerySection?.images) {
        content.gallerySection.images = content.gallerySection.images.map(
          (img) => ({
            ...img,
            imageUrl: img.image ? builder.image(img.image).url() : null,
          })
        );
      }

      if (content?.testimonialsSection?.testimonials) {
        content.testimonialsSection.testimonials =
          content.testimonialsSection.testimonials.map((testimonial) => ({
            ...testimonial,
            avatarUrl: testimonial.avatar
              ? builder.image(testimonial.avatar).width(100).height(100).url()
              : null,
          }));
      }

      return content || this.getDefaultContent();
    } catch (error) {
      console.error("Error fetching Sanity content:", error);
      return this.getDefaultContent();
    }
  },

  /**
   * Fetch specific section content
   */
  async getSectionContent(section) {
    try {
      const query = `*[_type == "landingPage"][0]{
        ${section} 
      }`;

      const content = await sanityClient.fetch(query);
      return content?.[section] || null;
    } catch (error) {
      console.error(`Error fetching ${section} content:`, error);
      return null;
    }
  },

  /**
   * Fetch multiple specific sections
   */
  async getMultipleSections(sections) {
    try {
      const fields = sections.join(", ");
      const query = `*[_type == "landingPage"][0]{
        ${fields}
      }`;

      const content = await sanityClient.fetch(query);
      return content || {};
    } catch (error) {
      console.error("Error fetching multiple sections:", error);
      return {};
    }
  },

  /**
   * Get default content as fallback
   */
  getDefaultContent() {
    return {
      heroSection: {
        tagline: "AI-Powered Football Analytics",
        mainHeading: "Measure Football Talent",
        highlightedText: "Objectively",
        subheading:
          "GR4DE transforms raw match data into actionable insights, combining data science, motion tracking, and elite benchmarks to standardize talent measurement.",
        demoVideoUrl: null,
      },
      aboutSection: {
        heading: "About GR4DE",
        description:
          "GR4DE is a performance analytics platform that scores youth footballers based on match data, GPS tracking, and elite benchmarks.",
        goalTitle: "Our Goal",
        goalDescription:
          "Standardize how football talent is measured, developed, and discovered globally.",
        missionTitle: "Our Mission",
        missionDescription:
          "Transform raw match data into actionable insights using AI-driven performance intelligence.",
      },
      featuresSection: {
        heading: "How GR4DE Works",
        subheading:
          "Our AI-driven platform combines multiple data sources to deliver comprehensive performance insights",
        features: [
          {
            title: "Data Analytics",
            description:
              "Comprehensive match data analysis with advanced metrics",
            icon: "BarChart3",
          },
          {
            title: "AI Processing",
            description:
              "Machine learning algorithms for accurate performance scoring",
            icon: "Cpu",
          },
          {
            title: "Elite Benchmarks",
            description:
              "Compare against professional standards and benchmarks",
            icon: "Shield",
          },
          {
            title: "Talent Discovery",
            description: "Identify and develop promising young football talent",
            icon: "Users",
          },
        ],
      },
      howItWorksSection: {
        heading: "How GR4DE Works",
        subheading:
          "Our AI-driven platform combines multiple data sources to deliver comprehensive performance insights",
        steps: [
          {
            stepNumber: "1",
            title: "Data Collection",
            description:
              "Capture match data, GPS tracking, and performance metrics through advanced sensors and video analysis",
            icon: "Cpu",
          },
          {
            stepNumber: "2",
            title: "AI Analysis",
            description:
              "Our algorithms process data against elite benchmarks to generate objective performance scores",
            icon: "BarChart3",
          },
          {
            stepNumber: "3",
            title: "Talent Scoring",
            description:
              "Receive comprehensive GR4DE scores and actionable insights for player development",
            icon: "Star",
          },
        ],
      },
      testimonialsSection: {
        heading: "Trusted by Football Experts",
        subheading:
          "Join leading clubs and academies transforming their talent assessment process",
        testimonials: [
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
        ],
      },
      pricingSection: {
        heading: "Simple, Transparent Pricing",
        subheading:
          "Choose the plan that works best for your needs. All plans include a 14-day free trial.",
      },
      ctaSection: {
        heading: "Ready to Transform Football Talent Assessment?",
        subheading:
          "Join clubs and academies worldwide using GR4DE to objectively measure and develop football talent",
        buttonText: "Start Your Free Trial",
      },
      gallerySection: {
        heading: "GR4DE In Action",
        subheading:
          "See how clubs and academies are transforming talent assessment with our platform",
        images: [
          {
            title: "Match Performance Tracking",
            description: "Real-time data collection during live matches",
            image: null,
          },
          {
            title: "Performance Dashboard",
            description: "Comprehensive player insights and metrics",
            image: null,
          },
          {
            title: "Team Performance",
            description: "Team-wide analytics and strategic insights",
            image: null,
          },
          {
            title: "Talent Development",
            description: "Identifying and nurturing young football talent",
            image: null,
          },
        ],
      },
    };
  },

  /**
   * Utility function to build image URLs
   */
  urlFor(source) {
    return builder.image(source);
  },

  /**
   * Health check for Sanity connection
   */
  async healthCheck() {
    try {
      const query = `count(*[_type == "landingPage"])`;
      const count = await sanityClient.fetch(query);
      return {
        healthy: true,
        message: `Successfully connected to Sanity. Found ${count} landing page documents.`,
      };
    } catch (error) {
      return {
        healthy: false,
        message: `Failed to connect to Sanity: ${error.message}`,
      };
    }
  },

  /**
   * Subscribe to real-time updates (optional)
   */
  subscribeToUpdates(callback) {
    const subscription = sanityClient
      .listen('*[_type == "landingPage"]')
      .subscribe((update) => {
        console.log("Sanity update received:", update);
        callback(update);
      });

    return subscription;
  },
};

export default sanityService;
