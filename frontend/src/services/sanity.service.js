import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// Create Sanity client
const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || "production",
  useCdn: true,
  apiVersion: "2024-01-01",
  //   token: import.meta.env.VITE_SANITY_TOKEN,
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
        _id,
        _rev,
        title,
        heroSection {
          tagline,
          mainHeading,
          highlightedText,
          subheading,
          demoVideoUrl,
          ctaButtonText
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
   * Update landing page content
   */
  async updateLandingPageContent(newContent) {
    try {
      // First, get the document ID
      const existingDoc = await sanityClient.fetch(
        '*[_type == "landingPage"][0]{_id, _rev}'
      );

      if (existingDoc?._id) {
        // Update existing document
        const result = await sanityClient
          .patch(existingDoc._id)
          .set({
            ...newContent,
            _updatedAt: new Date().toISOString(),
          })
          .commit();

        console.log("Content updated successfully:", result);
        return result;
      } else {
        // Create new document
        const result = await sanityClient.create({
          _type: "landingPage",
          ...newContent,
          _createdAt: new Date().toISOString(),
          _updatedAt: new Date().toISOString(),
        });

        console.log("Content created successfully:", result);
        return result;
      }
    } catch (error) {
      console.error("Error updating Sanity content:", error);
      throw new Error(`Failed to update content: ${error.message}`);
    }
  },

  /**
   * Update specific section
   */
  async updateSection(sectionName, sectionData) {
    try {
      const existingDoc = await sanityClient.fetch(
        '*[_type == "landingPage"][0]{_id}'
      );

      if (existingDoc?._id) {
        const result = await sanityClient
          .patch(existingDoc._id)
          .set({
            [sectionName]: sectionData,
            _updatedAt: new Date().toISOString(),
          })
          .commit();

        return result;
      } else {
        throw new Error("No landing page document found to update");
      }
    } catch (error) {
      console.error(`Error updating ${sectionName}:`, error);
      throw error;
    }
  },

  /**
   * Upload image to Sanity
   */
  async uploadImage(file) {
    try {
      console.log("Uploading image:", file.name);

      const result = await sanityClient.assets.upload("image", file, {
        contentType: file.type,
        filename: file.name,
      });

      console.log("Image uploaded successfully:", result);
      return result;
    } catch (error) {
      console.error("Error uploading image to Sanity:", error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  },

  /**
   * Delete image from Sanity
   */
  async deleteImage(imageId) {
    try {
      const result = await sanityClient.delete(imageId);
      console.log("Image deleted successfully:", result);
      return result;
    } catch (error) {
      console.error("Error deleting image from Sanity:", error);
      throw error;
    }
  },

  /**
   * Delete entire landing page content
   */
  async deleteLandingPageContent() {
    try {
      const existingDoc = await sanityClient.fetch(
        '*[_type == "landingPage"][0]{_id}'
      );

      if (existingDoc?._id) {
        const result = await sanityClient.delete(existingDoc._id);
        console.log("Landing page content deleted successfully");
        return result;
      }

      console.log("No landing page content found to delete");
      return null;
    } catch (error) {
      console.error("Error deleting Sanity content:", error);
      throw error;
    }
  },

  /**
   * Reset to default content
   */
  async resetToDefault() {
    try {
      const defaultContent = this.getDefaultContent();
      return await this.updateLandingPageContent(defaultContent);
    } catch (error) {
      console.error("Error resetting to default content:", error);
      throw error;
    }
  },

  /**
   * Get default content as fallback
   */
  getDefaultContent() {
    return {
      title: "GR4DE Landing Page",
      heroSection: {
        tagline: "AI-Powered Football Analytics",
        mainHeading: "Measure Football Talent",
        highlightedText: "Objectively",
        subheading:
          "GR4DE transforms raw match data into actionable insights, combining data science, motion tracking, and elite benchmarks to standardize talent measurement.",
        demoVideoUrl: "",
        ctaButtonText: "Start Free Trial",
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
        heading: "Powerful Features",
        subheading:
          "Everything you need to measure, analyze, and develop football talent with precision",
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
        count: count,
      };
    } catch (error) {
      return {
        healthy: false,
        message: `Failed to connect to Sanity: ${error.message}`,
        error: error.message,
      };
    }
  },

  /**
   * Subscribe to real-time updates
   */
  subscribeToUpdates(callback) {
    try {
      const subscription = sanityClient
        .listen('*[_type == "landingPage"]')
        .subscribe((update) => {
          console.log("Sanity update received:", update);
          if (callback) callback(update);
        });

      return subscription;
    } catch (error) {
      console.error("Error setting up subscription:", error);
      return null;
    }
  },

  /**
   * Get content history (revisions)
   */
  async getContentHistory() {
    try {
      const query = `*[_type == "landingPage"] | order(_updatedAt desc)`;
      const history = await sanityClient.fetch(query);
      return history;
    } catch (error) {
      console.error("Error fetching content history:", error);
      return [];
    }
  },
};

export default sanityService;
