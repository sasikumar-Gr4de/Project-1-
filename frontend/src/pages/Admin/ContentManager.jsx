import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Tabs from "@/components/common/Tabs";
import {
  Save,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  Eye,
  Download,
} from "lucide-react";
import { sanityService } from "@/services/sanity.service";

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
    const healthStatus = await sanityService.healthCheck();
    setHealth(healthStatus);
  };

  const loadContent = async () => {
    setLoading(true);
    try {
      const data = await sanityService.getLandingPageContent();
      setContent(data);
    } catch (error) {
      console.error("Error loading content:", error);
      alert("Error loading content from CMS");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await sanityService.updateLandingPageContent(content);
      alert("Content saved successfully!");
      await loadContent(); // Reload to get latest _rev
    } catch (error) {
      console.error("Error saving content:", error);
      alert(`Error saving content: ${error.message}`);
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
        alert("Content reset to default successfully!");
        await loadContent();
      } catch (error) {
        console.error("Error resetting content:", error);
        alert(`Error resetting content: ${error.message}`);
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

      // Update content with new image reference
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

      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(`Error uploading image: ${error.message}`);
    } finally {
      setUploadingImages((prev) => ({ ...prev, [imageField]: false }));
      event.target.value = ""; // Reset file input
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

  // Define tabs for the Tabs component
  const tabs = [
    {
      id: "hero",
      label: "Hero",
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tagline</label>
              <Input
                value={content?.heroSection?.tagline || ""}
                onChange={(e) =>
                  updateField("heroSection.tagline", e.target.value)
                }
                placeholder="AI-Powered Football Analytics"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Main Heading
              </label>
              <Input
                value={content?.heroSection?.mainHeading || ""}
                onChange={(e) =>
                  updateField("heroSection.mainHeading", e.target.value)
                }
                placeholder="Measure Football Talent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Highlighted Text
              </label>
              <Input
                value={content?.heroSection?.highlightedText || ""}
                onChange={(e) =>
                  updateField("heroSection.highlightedText", e.target.value)
                }
                placeholder="Objectively"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Subheading
              </label>
              <Textarea
                value={content?.heroSection?.subheading || ""}
                onChange={(e) =>
                  updateField("heroSection.subheading", e.target.value)
                }
                placeholder="Description of your platform..."
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Demo Video URL
              </label>
              <Input
                value={content?.heroSection?.demoVideoUrl || ""}
                onChange={(e) =>
                  updateField("heroSection.demoVideoUrl", e.target.value)
                }
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                CTA Button Text
              </label>
              <Input
                value={content?.heroSection?.ctaButtonText || ""}
                onChange={(e) =>
                  updateField("heroSection.ctaButtonText", e.target.value)
                }
                placeholder="Start Free Trial"
              />
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      id: "about",
      label: "About",
      content: (
        <Card>
          <CardHeader>
            <CardTitle>About Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Heading</label>
              <Input
                value={content?.aboutSection?.heading || ""}
                onChange={(e) =>
                  updateField("aboutSection.heading", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <Textarea
                value={content?.aboutSection?.description || ""}
                onChange={(e) =>
                  updateField("aboutSection.description", e.target.value)
                }
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Goal Title
              </label>
              <Input
                value={content?.aboutSection?.goalTitle || ""}
                onChange={(e) =>
                  updateField("aboutSection.goalTitle", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Goal Description
              </label>
              <Textarea
                value={content?.aboutSection?.goalDescription || ""}
                onChange={(e) =>
                  updateField("aboutSection.goalDescription", e.target.value)
                }
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Mission Title
              </label>
              <Input
                value={content?.aboutSection?.missionTitle || ""}
                onChange={(e) =>
                  updateField("aboutSection.missionTitle", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Mission Description
              </label>
              <Textarea
                value={content?.aboutSection?.missionDescription || ""}
                onChange={(e) =>
                  updateField("aboutSection.missionDescription", e.target.value)
                }
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      id: "features",
      label: "Features",
      content: (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Features Section</CardTitle>
            <Button
              size="sm"
              onClick={() =>
                addArrayItem("featuresSection.features", {
                  title: "New Feature",
                  description: "Feature description",
                  icon: "BarChart3",
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Feature
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Heading</label>
              <Input
                value={content?.featuresSection?.heading || ""}
                onChange={(e) =>
                  updateField("featuresSection.heading", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Subheading
              </label>
              <Textarea
                value={content?.featuresSection?.subheading || ""}
                onChange={(e) =>
                  updateField("featuresSection.subheading", e.target.value)
                }
                rows={2}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Features</h3>
              {content?.featuresSection?.features?.map((feature, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium">Feature {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          removeArrayItem("featuresSection.features", index)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">
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
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
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
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
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
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      id: "howitworks",
      label: "How It Works",
      content: (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>How It Works Section</CardTitle>
            <Button
              size="sm"
              onClick={() =>
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
              <Plus className="h-4 w-4 mr-2" />
              Add Step
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Heading</label>
              <Input
                value={content?.howItWorksSection?.heading || ""}
                onChange={(e) =>
                  updateField("howItWorksSection.heading", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Subheading
              </label>
              <Textarea
                value={content?.howItWorksSection?.subheading || ""}
                onChange={(e) =>
                  updateField("howItWorksSection.subheading", e.target.value)
                }
                rows={2}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Steps</h3>
              {content?.howItWorksSection?.steps?.map((step, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium">Step {step.stepNumber}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          removeArrayItem("howItWorksSection.steps", index)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">
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
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
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
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
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
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
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
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      id: "testimonials",
      label: "Testimonials",
      content: (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Testimonials Section</CardTitle>
            <Button
              size="sm"
              onClick={() =>
                addArrayItem("testimonialsSection.testimonials", {
                  name: "New Customer",
                  role: "Role",
                  club: "Club",
                  content: "Testimonial content...",
                  avatar: null,
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Heading</label>
              <Input
                value={content?.testimonialsSection?.heading || ""}
                onChange={(e) =>
                  updateField("testimonialsSection.heading", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Subheading
              </label>
              <Textarea
                value={content?.testimonialsSection?.subheading || ""}
                onChange={(e) =>
                  updateField("testimonialsSection.subheading", e.target.value)
                }
                rows={2}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Testimonials</h3>
              {content?.testimonialsSection?.testimonials?.map(
                (testimonial, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium">Testimonial {index + 1}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            removeArrayItem(
                              "testimonialsSection.testimonials",
                              index
                            )
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">
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
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
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
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
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
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
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
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Avatar
                          </label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleImageUpload(
                                  e,
                                  `testimonialsSection.testimonials.${index}.avatar`
                                )
                              }
                              disabled={
                                uploadingImages[
                                  `testimonialsSection.testimonials.${index}.avatar`
                                ]
                              }
                            />
                            {uploadingImages[
                              `testimonialsSection.testimonials.${index}.avatar`
                            ] && <RefreshCw className="h-4 w-4 animate-spin" />}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      id: "pricing",
      label: "Pricing",
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Pricing Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Heading</label>
              <Input
                value={content?.pricingSection?.heading || ""}
                onChange={(e) =>
                  updateField("pricingSection.heading", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Subheading
              </label>
              <Textarea
                value={content?.pricingSection?.subheading || ""}
                onChange={(e) =>
                  updateField("pricingSection.subheading", e.target.value)
                }
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      id: "gallery",
      label: "Gallery",
      content: (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Gallery Section</CardTitle>
            <Button
              size="sm"
              onClick={() =>
                addArrayItem("gallerySection.images", {
                  title: "New Image",
                  description: "Image description",
                  image: null,
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Heading</label>
              <Input
                value={content?.gallerySection?.heading || ""}
                onChange={(e) =>
                  updateField("gallerySection.heading", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Subheading
              </label>
              <Textarea
                value={content?.gallerySection?.subheading || ""}
                onChange={(e) =>
                  updateField("gallerySection.subheading", e.target.value)
                }
                rows={2}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Gallery Images</h3>
              {content?.gallerySection?.images?.map((image, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium">Image {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          removeArrayItem("gallerySection.images", index)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">
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
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
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
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
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
                          />
                          {uploadingImages[
                            `gallerySection.images.${index}.image`
                          ] && <RefreshCw className="h-4 w-4 animate-spin" />}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading content...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Content Found</h1>
          <Button onClick={handleReset}>Initialize Default Content</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Landing Page Content Manager</h1>
            <p className="text-muted-foreground mt-2">
              Manage all content for the GR4DE landing page
              {health && (
                <span
                  className={`ml-2 px-2 py-1 rounded text-xs ${
                    health.healthy
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {health.healthy ? "✓ Connected" : "✗ Disconnected"}
                </span>
              )}
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={exportContent}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Tabs Component */}
        <Tabs
          tabs={tabs}
          defaultTab={activeTab}
          onTabChange={setActiveTab}
          variant="pills"
          size="md"
          fullWidth={true}
          responsive={true}
          className="space-y-6"
        />

        {/* Preview Button */}
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => window.open("/", "_blank")}>
            <Eye className="h-4 w-4 mr-2" />
            Preview Landing Page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentManager;
