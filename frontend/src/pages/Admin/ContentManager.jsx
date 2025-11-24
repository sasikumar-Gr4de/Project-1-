import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import Tabs from "@/components/common/Tabs";
import {
  Save,
  RefreshCw,
  Trash2,
  Eye,
  Download,
  FileText,
  Settings,
  Users,
  Star,
  Camera,
  Play,
  Target,
} from "lucide-react";
import { sanityService } from "@/services/sanity.service";
import AdminSection from "@/components/admin/AdminSection";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const ContentManager = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [uploadingImages, setUploadingImages] = useState({});
  const [health, setHealth] = useState(null);

  useEffect(() => {
    loadContent();
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const healthStatus = await sanityService.healthCheck();
      setHealth(healthStatus);
    } catch (error) {
      console.error("Health check failed:", error);
      setHealth({ healthy: false, message: "Connection failed" });
    }
  };

  const loadContent = async () => {
    setLoading(true);
    try {
      const data = await sanityService.getLandingPageContent();
      setContent(data);
    } catch (error) {
      console.error("Error loading content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await sanityService.updateLandingPageContent(content);
      await loadContent();
    } catch (error) {
      console.error("Error saving content:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (
      confirm(
        "Are you sure you want to reset all content to default? This cannot be undone."
      )
    ) {
      try {
        await sanityService.resetToDefault();
        await loadContent();
      } catch (error) {
        console.error("Error resetting content:", error);
      }
    }
  };

  const handleImageUpload = async (event, imageField) => {
    const file = event.target.files[0];
    if (!file) return;

    const fieldPath = imageField.split(".");
    setUploadingImages((prev) => ({ ...prev, [imageField]: true }));

    try {
      const result = await sanityService.uploadImage(file);

      setContent((prev) => {
        const newContent = { ...prev };
        let current = newContent;

        for (let i = 0; i < fieldPath.length - 1; i++) {
          current = current[fieldPath[i]];
        }

        current[fieldPath[fieldPath.length - 1]] = {
          _type: "image",
          asset: {
            _ref: result._id,
            _type: "reference",
          },
        };

        return newContent;
      });
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploadingImages((prev) => ({ ...prev, [imageField]: false }));
      event.target.value = "";
    }
  };

  const addArrayItem = (path, newItem) => {
    setContent((prev) => {
      const newContent = JSON.parse(JSON.stringify(prev));
      const pathParts = path.split(".");
      let current = newContent;

      for (let i = 0; i < pathParts.length - 1; i++) {
        current = current[pathParts[i]];
      }

      const lastKey = pathParts[pathParts.length - 1];
      current[lastKey] = [...(current[lastKey] || []), newItem];

      return newContent;
    });
  };

  const removeArrayItem = (path, index) => {
    setContent((prev) => {
      const newContent = JSON.parse(JSON.stringify(prev));
      const pathParts = path.split(".");
      let current = newContent;

      for (let i = 0; i < pathParts.length - 1; i++) {
        current = current[pathParts[i]];
      }

      const lastKey = pathParts[pathParts.length - 1];
      current[lastKey] = current[lastKey].filter((_, i) => i !== index);

      return newContent;
    });
  };

  const updateField = (path, value) => {
    setContent((prev) => {
      const newContent = JSON.parse(JSON.stringify(prev));
      const pathParts = path.split(".");
      let current = newContent;

      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!current[pathParts[i]]) current[pathParts[i]] = {};
        current = current[pathParts[i]];
      }

      current[pathParts[pathParts.length - 1]] = value;
      return newContent;
    });
  };

  const exportContent = () => {
    const dataStr = JSON.stringify(content, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `gr4de-content-${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  // Define tabs for the Tabs component - COMPLETE VERSION
  const tabs = [
    {
      id: "hero",
      label: "Hero",
      content: (
        <AdminSection
          title="Hero Section"
          description="Main landing page hero content"
          icon={Target}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Tagline
              </label>
              <Input
                value={content?.heroSection?.tagline || ""}
                onChange={(e) =>
                  updateField("heroSection.tagline", e.target.value)
                }
                placeholder="AI-Powered Football Analytics"
                className="bg-[#1A1A1A] border-[#343434] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Main Heading
              </label>
              <Input
                value={content?.heroSection?.mainHeading || ""}
                onChange={(e) =>
                  updateField("heroSection.mainHeading", e.target.value)
                }
                placeholder="Measure Football Talent"
                className="bg-[#1A1A1A] border-[#343434] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Highlighted Text
              </label>
              <Input
                value={content?.heroSection?.highlightedText || ""}
                onChange={(e) =>
                  updateField("heroSection.highlightedText", e.target.value)
                }
                placeholder="Objectively"
                className="bg-[#1A1A1A] border-[#343434] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Subheading
              </label>
              <Textarea
                value={content?.heroSection?.subheading || ""}
                onChange={(e) =>
                  updateField("heroSection.subheading", e.target.value)
                }
                placeholder="Description of your platform..."
                rows={3}
                className="bg-[#1A1A1A] border-[#343434] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Demo Video URL
              </label>
              <Input
                value={content?.heroSection?.demoVideoUrl || ""}
                onChange={(e) =>
                  updateField("heroSection.demoVideoUrl", e.target.value)
                }
                placeholder="https://youtube.com/watch?v=..."
                className="bg-[#1A1A1A] border-[#343434] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                CTA Button Text
              </label>
              <Input
                value={content?.heroSection?.ctaButtonText || ""}
                onChange={(e) =>
                  updateField("heroSection.ctaButtonText", e.target.value)
                }
                placeholder="Start Free Trial"
                className="bg-[#1A1A1A] border-[#343434] text-white"
              />
            </div>
          </div>
        </AdminSection>
      ),
    },
    {
      id: "about",
      label: "About",
      content: (
        <AdminSection
          title="About Section"
          description="Company information and mission"
          icon={Users}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Heading
              </label>
              <Input
                value={content?.aboutSection?.heading || ""}
                onChange={(e) =>
                  updateField("aboutSection.heading", e.target.value)
                }
                className="bg-[#1A1A1A] border-[#343434] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Description
              </label>
              <Textarea
                value={content?.aboutSection?.description || ""}
                onChange={(e) =>
                  updateField("aboutSection.description", e.target.value)
                }
                rows={3}
                className="bg-[#1A1A1A] border-[#343434] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Goal Title
              </label>
              <Input
                value={content?.aboutSection?.goalTitle || ""}
                onChange={(e) =>
                  updateField("aboutSection.goalTitle", e.target.value)
                }
                className="bg-[#1A1A1A] border-[#343434] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Goal Description
              </label>
              <Textarea
                value={content?.aboutSection?.goalDescription || ""}
                onChange={(e) =>
                  updateField("aboutSection.goalDescription", e.target.value)
                }
                rows={2}
                className="bg-[#1A1A1A] border-[#343434] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Mission Title
              </label>
              <Input
                value={content?.aboutSection?.missionTitle || ""}
                onChange={(e) =>
                  updateField("aboutSection.missionTitle", e.target.value)
                }
                className="bg-[#1A1A1A] border-[#343434] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Mission Description
              </label>
              <Textarea
                value={content?.aboutSection?.missionDescription || ""}
                onChange={(e) =>
                  updateField("aboutSection.missionDescription", e.target.value)
                }
                rows={2}
                className="bg-[#1A1A1A] border-[#343434] text-white"
              />
            </div>
          </div>
        </AdminSection>
      ),
    },
    {
      id: "features",
      label: "Features",
      content: (
        <AdminSection
          title="Features Section"
          description="Platform features and capabilities"
          icon={Settings}
          action={true}
          actionText="Add Feature"
          onAction={() =>
            addArrayItem("featuresSection.features", {
              title: "New Feature",
              description: "Feature description",
              icon: "BarChart3",
            })
          }
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Heading
              </label>
              <Input
                value={content?.featuresSection?.heading || ""}
                onChange={(e) =>
                  updateField("featuresSection.heading", e.target.value)
                }
                className="bg-[#1A1A1A] border-[#343434] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Subheading
              </label>
              <Textarea
                value={content?.featuresSection?.subheading || ""}
                onChange={(e) =>
                  updateField("featuresSection.subheading", e.target.value)
                }
                rows={2}
                className="bg-[#1A1A1A] border-[#343434] text-white"
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-white">Features</h3>
              {content?.featuresSection?.features?.map((feature, index) => (
                <Card key={index} className="bg-[#1A1A1A] border-[#343434]">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-white">
                        Feature {index + 1}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          removeArrayItem("featuresSection.features", index)
                        }
                        className="text-[#EF4444] hover:bg-[#EF4444]/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-[#B0AFAF]">
                          Title
                        </label>
                        <Input
                          value={feature.title || ""}
                          onChange={(e) => {
                            const newFeatures = [
                              ...content.featuresSection.features,
                            ];
                            newFeatures[index].title = e.target.value;
                            updateField(
                              "featuresSection.features",
                              newFeatures
                            );
                          }}
                          className="bg-[#1A1A1A] border-[#343434] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-[#B0AFAF]">
                          Description
                        </label>
                        <Textarea
                          value={feature.description || ""}
                          onChange={(e) => {
                            const newFeatures = [
                              ...content.featuresSection.features,
                            ];
                            newFeatures[index].description = e.target.value;
                            updateField(
                              "featuresSection.features",
                              newFeatures
                            );
                          }}
                          rows={2}
                          className="bg-[#1A1A1A] border-[#343434] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-[#B0AFAF]">
                          Icon Name
                        </label>
                        <Input
                          value={feature.icon || ""}
                          onChange={(e) => {
                            const newFeatures = [
                              ...content.featuresSection.features,
                            ];
                            newFeatures[index].icon = e.target.value;
                            updateField(
                              "featuresSection.features",
                              newFeatures
                            );
                          }}
                          placeholder="BarChart3, Cpu, Shield, Users"
                          className="bg-[#1A1A1A] border-[#343434] text-white"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </AdminSection>
      ),
    },
    {
      id: "howitworks",
      label: "How It Works",
      content: (
        <AdminSection
          title="How It Works Section"
          description="Step-by-step process explanation"
          icon={Play}
          action={true}
          actionText="Add Step"
          onAction={() =>
            addArrayItem("howItWorksSection.steps", {
              stepNumber: `${
                (content?.howItWorksSection?.steps?.length || 0) + 1
              }`,
              title: "New Step",
              description: "Step description",
              icon: "Cpu",
            })
          }
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Heading
              </label>
              <Input
                value={content?.howItWorksSection?.heading || ""}
                onChange={(e) =>
                  updateField("howItWorksSection.heading", e.target.value)
                }
                className="bg-[#1A1A1A] border-[#343434] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Subheading
              </label>
              <Textarea
                value={content?.howItWorksSection?.subheading || ""}
                onChange={(e) =>
                  updateField("howItWorksSection.subheading", e.target.value)
                }
                rows={2}
                className="bg-[#1A1A1A] border-[#343434] text-white"
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-white">Steps</h3>
              {content?.howItWorksSection?.steps?.map((step, index) => (
                <Card key={index} className="bg-[#1A1A1A] border-[#343434]">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-white">
                        Step {step.stepNumber}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          removeArrayItem("howItWorksSection.steps", index)
                        }
                        className="text-[#EF4444] hover:bg-[#EF4444]/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-[#B0AFAF]">
                          Step Number
                        </label>
                        <Input
                          value={step.stepNumber || ""}
                          onChange={(e) => {
                            const newSteps = [
                              ...content.howItWorksSection.steps,
                            ];
                            newSteps[index].stepNumber = e.target.value;
                            updateField("howItWorksSection.steps", newSteps);
                          }}
                          className="bg-[#1A1A1A] border-[#343434] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-[#B0AFAF]">
                          Title
                        </label>
                        <Input
                          value={step.title || ""}
                          onChange={(e) => {
                            const newSteps = [
                              ...content.howItWorksSection.steps,
                            ];
                            newSteps[index].title = e.target.value;
                            updateField("howItWorksSection.steps", newSteps);
                          }}
                          className="bg-[#1A1A1A] border-[#343434] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-[#B0AFAF]">
                          Description
                        </label>
                        <Textarea
                          value={step.description || ""}
                          onChange={(e) => {
                            const newSteps = [
                              ...content.howItWorksSection.steps,
                            ];
                            newSteps[index].description = e.target.value;
                            updateField("howItWorksSection.steps", newSteps);
                          }}
                          rows={2}
                          className="bg-[#1A1A1A] border-[#343434] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-[#B0AFAF]">
                          Icon Name
                        </label>
                        <Input
                          value={step.icon || ""}
                          onChange={(e) => {
                            const newSteps = [
                              ...content.howItWorksSection.steps,
                            ];
                            newSteps[index].icon = e.target.value;
                            updateField("howItWorksSection.steps", newSteps);
                          }}
                          placeholder="Cpu, BarChart3, Star"
                          className="bg-[#1A1A1A] border-[#343434] text-white"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </AdminSection>
      ),
    },
    {
      id: "testimonials",
      label: "Testimonials",
      content: (
        <AdminSection
          title="Testimonials Section"
          description="Customer testimonials and reviews"
          icon={Star}
          action={true}
          actionText="Add Testimonial"
          onAction={() =>
            addArrayItem("testimonialsSection.testimonials", {
              name: "New Customer",
              role: "Role",
              club: "Club",
              content: "Testimonial content...",
              avatar: null,
            })
          }
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Heading
              </label>
              <Input
                value={content?.testimonialsSection?.heading || ""}
                onChange={(e) =>
                  updateField("testimonialsSection.heading", e.target.value)
                }
                className="bg-[#1A1A1A] border-[#343434] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Subheading
              </label>
              <Textarea
                value={content?.testimonialsSection?.subheading || ""}
                onChange={(e) =>
                  updateField("testimonialsSection.subheading", e.target.value)
                }
                rows={2}
                className="bg-[#1A1A1A] border-[#343434] text-white"
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-white">Testimonials</h3>
              {content?.testimonialsSection?.testimonials?.map(
                (testimonial, index) => (
                  <Card key={index} className="bg-[#1A1A1A] border-[#343434]">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium text-white">
                          Testimonial {index + 1}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            removeArrayItem(
                              "testimonialsSection.testimonials",
                              index
                            )
                          }
                          className="text-[#EF4444] hover:bg-[#EF4444]/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium mb-1 text-[#B0AFAF]">
                              Name
                            </label>
                            <Input
                              value={testimonial.name || ""}
                              onChange={(e) => {
                                const newTestimonials = [
                                  ...content.testimonialsSection.testimonials,
                                ];
                                newTestimonials[index].name = e.target.value;
                                updateField(
                                  "testimonialsSection.testimonials",
                                  newTestimonials
                                );
                              }}
                              className="bg-[#1A1A1A] border-[#343434] text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1 text-[#B0AFAF]">
                              Role
                            </label>
                            <Input
                              value={testimonial.role || ""}
                              onChange={(e) => {
                                const newTestimonials = [
                                  ...content.testimonialsSection.testimonials,
                                ];
                                newTestimonials[index].role = e.target.value;
                                updateField(
                                  "testimonialsSection.testimonials",
                                  newTestimonials
                                );
                              }}
                              className="bg-[#1A1A1A] border-[#343434] text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-[#B0AFAF]">
                            Club
                          </label>
                          <Input
                            value={testimonial.club || ""}
                            onChange={(e) => {
                              const newTestimonials = [
                                ...content.testimonialsSection.testimonials,
                              ];
                              newTestimonials[index].club = e.target.value;
                              updateField(
                                "testimonialsSection.testimonials",
                                newTestimonials
                              );
                            }}
                            className="bg-[#1A1A1A] border-[#343434] text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-[#B0AFAF]">
                            Content
                          </label>
                          <Textarea
                            value={testimonial.content || ""}
                            onChange={(e) => {
                              const newTestimonials = [
                                ...content.testimonialsSection.testimonials,
                              ];
                              newTestimonials[index].content = e.target.value;
                              updateField(
                                "testimonialsSection.testimonials",
                                newTestimonials
                              );
                            }}
                            rows={3}
                            className="bg-[#1A1A1A] border-[#343434] text-white"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </div>
        </AdminSection>
      ),
    },
    // {
    //   id: "pricing",
    //   label: "Pricing",
    //   content: (
    //     <AdminSection
    //       title="Pricing Section"
    //       description="Subscription plans and pricing"
    //       icon={FileText}
    //     >
    //       <div className="space-y-4">
    //         <div>
    //           <label className="block text-sm font-medium mb-2 text-white">
    //             Heading
    //           </label>
    //           <Input
    //             value={content?.pricingSection?.heading || ""}
    //             onChange={(e) =>
    //               updateField("pricingSection.heading", e.target.value)
    //             }
    //             className="bg-[#1A1A1A] border-[#343434] text-white"
    //           />
    //         </div>
    //         <div>
    //           <label className="block text-sm font-medium mb-2 text-white">
    //             Subheading
    //           </label>
    //           <Textarea
    //             value={content?.pricingSection?.subheading || ""}
    //             onChange={(e) =>
    //               updateField("pricingSection.subheading", e.target.value)
    //             }
    //             rows={2}
    //             className="bg-[#1A1A1A] border-[#343434] text-white"
    //           />
    //         </div>
    //       </div>
    //     </AdminSection>
    //   ),
    // },
    {
      id: "gallery",
      label: "Gallery",
      content: (
        <AdminSection
          title="Gallery Section"
          description="Image gallery and visual content"
          icon={Camera}
          action={true}
          actionText="Add Image"
          onAction={() =>
            addArrayItem("gallerySection.images", {
              title: "New Image",
              description: "Image description",
              image: null,
            })
          }
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Heading
              </label>
              <Input
                value={content?.gallerySection?.heading || ""}
                onChange={(e) =>
                  updateField("gallerySection.heading", e.target.value)
                }
                className="bg-[#1A1A1A] border-[#343434] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Subheading
              </label>
              <Textarea
                value={content?.gallerySection?.subheading || ""}
                onChange={(e) =>
                  updateField("gallerySection.subheading", e.target.value)
                }
                rows={2}
                className="bg-[#1A1A1A] border-[#343434] text-white"
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-white">Gallery Images</h3>
              {content?.gallerySection?.images?.map((image, index) => (
                <Card key={index} className="bg-[#1A1A1A] border-[#343434]">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-white">
                        Image {index + 1}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          removeArrayItem("gallerySection.images", index)
                        }
                        className="text-[#EF4444] hover:bg-[#EF4444]/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-[#B0AFAF]">
                          Title
                        </label>
                        <Input
                          value={image.title || ""}
                          onChange={(e) => {
                            const newImages = [
                              ...content.gallerySection.images,
                            ];
                            newImages[index].title = e.target.value;
                            updateField("gallerySection.images", newImages);
                          }}
                          className="bg-[#1A1A1A] border-[#343434] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-[#B0AFAF]">
                          Description
                        </label>
                        <Textarea
                          value={image.description || ""}
                          onChange={(e) => {
                            const newImages = [
                              ...content.gallerySection.images,
                            ];
                            newImages[index].description = e.target.value;
                            updateField("gallerySection.images", newImages);
                          }}
                          rows={2}
                          className="bg-[#1A1A1A] border-[#343434] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-[#B0AFAF]">
                          Image Upload
                        </label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageUpload(
                                e,
                                `gallerySection.images.${index}.image`
                              )
                            }
                            disabled={
                              uploadingImages[
                                `gallerySection.images.${index}.image`
                              ]
                            }
                            className="bg-[#1A1A1A] border-[#343434] text-white"
                          />
                          {uploadingImages[
                            `gallerySection.images.${index}.image`
                          ] && (
                            <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </AdminSection>
      ),
    },
  ];

  if (!content) {
    return (
      <LoadingSpinner
        type="pulse"
        size="lg"
        text="Loading data..."
        centered={true}
        color="primary"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-['Orbitron'] bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
            Content Manager
          </h1>
          <p className="text-[#B0AFAF] mt-2 font-['Orbitron']">
            Manage landing page content and structure
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={exportContent}
            className="bg-[#1A1A1A] border-[#343434] text-white hover:bg-[#262626]"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          {/* <Button
            variant="outline"
            onClick={handleReset}
            className="bg-[#1A1A1A] border-[#343434] text-white hover:bg-[#262626]"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button> */}
          <Button
            variant="outline"
            onClick={() => window.open("/", "_blank")}
            className="bg-[#1A1A1A] border-[#343434] text-white hover:bg-[#262626]"
          >
            <Eye className="h-4 w-4 mr-2" />
            Open Landing Page
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Content Tabs */}
      <Card className="bg-[#1A1A1A] border-[#343434]">
        <CardContent className="p-6">
          <Tabs
            tabs={tabs}
            defaultTab={activeTab}
            onTabChange={setActiveTab}
            variant="pills"
            size="md"
            fullWidth={true}
            responsive={true}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentManager;
