import { useState, useEffect } from "react";
import {
  BarChart3,
  Target,
  Brain,
  TrendingUp,
  Users,
  Award,
  Activity,
  Upload,
  Cpu,
  CheckCircle,
  Clock,
  AlertCircle,
  Send,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/common/DataTable";
import { mockAnnotations } from "@/mock/annotationData";
import { useAuthStore } from "@/store/auth.store";

const MatchAnalysisStep = ({ matchId, currentStep, onStepComplete }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("core");
  const [annotations, setAnnotations] = useState([]);
  const [annotationType, setAnnotationType] = useState("manual");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [modelEndpoint, setModelEndpoint] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";
  const isAnnotator = user?.role === "annotator";

  useEffect(() => {
    // Load annotations data
    setAnnotations(mockAnnotations);
  }, []);

  if (currentStep < 1) {
    return (
      <div className="text-center py-12">
        <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          Complete match preparation first
        </h3>
        <p className="text-muted-foreground">
          Please complete the match previous step to start analysis.
        </p>
      </div>
    );
  }

  // Admin View - Annotation Progress Dashboard
  if (isAdmin) {
    const annotationColumns = [
      {
        header: "Annotator",
        accessorKey: "annotator_name",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">
                {row.original.annotator_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <span>{row.original.annotator_name}</span>
          </div>
        ),
      },
      {
        header: "Type",
        accessorKey: "annotation_type",
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              row.original.annotation_type === "ai_model"
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {row.original.annotation_type === "ai_model"
              ? "AI Model"
              : "Manual"}
          </span>
        ),
      },
      {
        header: "Progress",
        accessorKey: "progress",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="w-24 bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  row.original.progress === 100 ? "bg-green-500" : "bg-primary"
                }`}
                style={{ width: `${row.original.progress}%` }}
              />
            </div>
            <span className="text-sm font-medium w-8">
              {row.original.progress}%
            </span>
          </div>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => (
          <span
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              row.original.status === "completed"
                ? "bg-green-100 text-green-800"
                : row.original.status === "in_progress"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {row.original.status === "completed" && (
              <CheckCircle className="h-3 w-3" />
            )}
            {row.original.status === "in_progress" && (
              <Clock className="h-3 w-3" />
            )}
            {row.original.status.replace("_", " ")}
          </span>
        ),
      },
      {
        header: "Last Updated",
        accessorKey: "updated_at",
        cell: ({ row }) =>
          new Date(row.original.updated_at).toLocaleDateString(),
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSendMessage(row.original.annotator_id)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ];

    const handleSendMessage = (annotatorId) => {
      // Implement message sending functionality
      console.log(`Send message to annotator: ${annotatorId}`);
    };

    const handleSubmitAnalysis = () => {
      const completedAnnotations = annotations.filter(
        (a) => a.status === "completed"
      );
      if (completedAnnotations.length > 0) {
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
          onStepComplete({ analysisSubmitted: true });
          setIsSubmitting(false);
        }, 1000);
      }
    };

    const completedCount = annotations.filter(
      (a) => a.status === "completed"
    ).length;
    const totalCount = annotations.length;

    return (
      <div className="space-y-6 p-3">
        {/* Analysis Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Total Annotators</span>
            </div>
            <div className="text-2xl font-bold text-primary">{totalCount}</div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Completed</span>
            </div>
            <div className="text-2xl font-bold text-green-500">
              {completedCount}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">In Progress</span>
            </div>
            <div className="text-2xl font-bold text-blue-500">
              {totalCount - completedCount}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Completion Rate</span>
            </div>
            <div className="text-2xl font-bold text-primary">
              {totalCount > 0
                ? Math.round((completedCount / totalCount) * 100)
                : 0}
              %
            </div>
          </div>
        </div>

        {/* Annotations Table */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Annotation Progress
            </h3>
            <Button
              onClick={handleSubmitAnalysis}
              disabled={completedCount === 0 || isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>Submitting...</>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Analysis ({completedCount}/{totalCount})
                </>
              )}
            </Button>
          </div>

          <DataTable
            columns={annotationColumns}
            data={annotations}
            searchable={true}
            searchPlaceholder="Search annotators..."
          />
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Admin Instructions
          </h4>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>• Monitor annotator progress in real-time</li>
            <li>• Send messages to annotators for coordination</li>
            <li>
              • Submit analysis only when all required annotations are completed
            </li>
            <li>• At least one completed analysis is required to proceed</li>
          </ul>
        </div>
      </div>
    );
  }

  // Annotator View - Annotation Interface
  if (isAnnotator) {
    const userAnnotation = annotations.find(
      (a) => a.annotator_id === user.id
    ) || {
      progress: 0,
      status: "not_started",
      annotation_type: "manual",
    };

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            // Update annotation progress
            const updatedAnnotations = annotations.map((ann) =>
              ann.annotator_id === user.id
                ? { ...ann, progress: 100, status: "completed" }
                : ann
            );
            setAnnotations(updatedAnnotations);
          }
        }, 200);
      }
    };

    const handleModelAnnotation = () => {
      if (!modelEndpoint) {
        alert("Please enter a model endpoint URL");
        return;
      }

      setIsSubmitting(true);
      // Simulate AI model processing
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          const updatedAnnotations = annotations.map((ann) =>
            ann.annotator_id === user.id
              ? {
                  ...ann,
                  progress: 100,
                  status: "completed",
                  annotation_type: "ai_model",
                  model_endpoint: modelEndpoint,
                }
              : ann
          );
          setAnnotations(updatedAnnotations);
          setIsSubmitting(false);
        }
      }, 300);
    };

    const handleManualProgressUpdate = (newProgress) => {
      const updatedAnnotations = annotations.map((ann) =>
        ann.annotator_id === user.id
          ? {
              ...ann,
              progress: newProgress,
              status: newProgress === 100 ? "completed" : "in_progress",
            }
          : ann
      );
      setAnnotations(updatedAnnotations);
    };

    const handleSubmitAnnotation = () => {
      if (userAnnotation.progress === 100) {
        onStepComplete({ annotationCompleted: true });
      } else {
        alert(
          "Please complete your annotation (100% progress) before submitting."
        );
      }
    };

    return (
      <div className="space-y-6">
        {/* Current Progress */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Your Annotation Progress</h3>
            <div className="text-2xl font-bold text-primary">
              {userAnnotation.progress}%
            </div>
          </div>

          <div className="w-full bg-muted rounded-full h-4 mb-2">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${
                userAnnotation.progress === 100 ? "bg-green-500" : "bg-primary"
              }`}
              style={{ width: `${userAnnotation.progress}%` }}
            />
          </div>

          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Not Started</span>
            <span>In Progress</span>
            <span>Completed</span>
          </div>
        </div>

        {/* Annotation Method Selection */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Annotation Method</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                annotationType === "manual"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => setAnnotationType("manual")}
            >
              <div className="flex items-center gap-3 mb-2">
                <Upload className="h-5 w-5 text-primary" />
                <span className="font-semibold">Manual Annotation</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Upload CSV file with your analysis data
              </p>
            </div>

            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                annotationType === "ai_model"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => setAnnotationType("ai_model")}
            >
              <div className="flex items-center gap-3 mb-2">
                <Cpu className="h-5 w-5 text-primary" />
                <span className="font-semibold">AI Model Annotation</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Use AI model endpoint for automated analysis
              </p>
            </div>
          </div>

          {/* Manual Annotation Interface */}
          {annotationType === "manual" && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-4">
                  Upload your CSV analysis file
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-upload"
                />
                <Button asChild>
                  <label htmlFor="csv-upload" className="cursor-pointer">
                    Choose CSV File
                  </label>
                </Button>

                {uploadProgress > 0 && (
                  <div className="mt-4">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Uploading... {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>

              {/* Manual Progress Control */}
              <div className="bg-muted rounded-lg p-4">
                <label className="text-sm font-medium mb-2 block">
                  Manual Progress Update
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={userAnnotation.progress}
                    onChange={(e) =>
                      handleManualProgressUpdate(parseInt(e.target.value))
                    }
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-12">
                    {userAnnotation.progress}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* AI Model Annotation Interface */}
          {annotationType === "ai_model" && (
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Model Endpoint URL
                </label>
                <input
                  type="url"
                  value={modelEndpoint}
                  onChange={(e) => setModelEndpoint(e.target.value)}
                  placeholder="https://api.example.com/ai-annotation/v1"
                  className="w-full p-2 border border-border rounded-lg"
                />
                <p className="text-xs text-muted-foreground">
                  Output URL will be automatically generated by the server
                </p>
              </div>

              <Button
                onClick={handleModelAnnotation}
                disabled={!modelEndpoint || isSubmitting}
                className="w-full gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing with AI Model... {uploadProgress}%
                  </>
                ) : (
                  <>
                    <Cpu className="h-4 w-4" />
                    Start AI Model Annotation
                  </>
                )}
              </Button>

              {uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-primary transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    AI Model Processing... {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmitAnnotation}
            disabled={userAnnotation.progress < 100}
            className="gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Submit Annotation ({userAnnotation.progress}%)
          </Button>
        </div>
      </div>
    );
  }

  // Default view for other roles
  return (
    <div className="text-center py-12 p-3">
      <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-muted-foreground mb-2">
        Access Restricted
      </h3>
      <p className="text-muted-foreground">
        You don't have permission to access the analysis interface.
      </p>
    </div>
  );
};

export default MatchAnalysisStep;
