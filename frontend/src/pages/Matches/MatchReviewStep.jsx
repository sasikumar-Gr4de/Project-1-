import { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  MessageSquare,
  Send,
  AlertCircle,
  Download,
  Users,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/common/DataTable";
import { mockReviews, mockAnalysisResults } from "@/mock/annotationData";
import { useAuthStore } from "@/store/auth.store";

const MatchReviewStep = ({ matchId, currentStep, onStepComplete }) => {
  const [reviews, setReviews] = useState([]);
  const [analysisResults, setAnalysisResults] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";
  const isDataReviewer = user?.role === "data_reviewer";

  useEffect(() => {
    // Load reviews and analysis data
    setReviews(mockReviews);
    setAnalysisResults(mockAnalysisResults);
  }, []);

  if (currentStep < 2) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          Complete Analysis First
        </h3>
        <p className="text-muted-foreground">
          You have to complete the Performance Analysis step first
        </p>
      </div>
    );
  }

  // Admin View - Review Progress Dashboard
  if (isAdmin) {
    const reviewColumns = [
      {
        header: "Annotator",
        accessorKey: "annotator_name",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">
                {row.original.annotator_name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "NA"}
              </span>
            </div>
            <span>{row.original.annotator_name || "Not Assigned"}</span>
          </div>
        ),
      },
      {
        header: "Reviewer",
        accessorKey: "reviewer_name",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {row.original.reviewer_name ? (
              <>
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-green-800">
                    {row.original.reviewer_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <span>{row.original.reviewer_name}</span>
              </>
            ) : (
              <span className="text-muted-foreground">Not Assigned</span>
            )}
          </div>
        ),
      },
      {
        header: "Rating",
        accessorKey: "rating",
        cell: ({ row }) =>
          row.original.rating ? (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="font-medium">{row.original.rating}/5</span>
            </div>
          ) : (
            <span className="text-muted-foreground">Not Rated</span>
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
                : row.original.status === "pending"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {row.original.status === "completed" && (
              <CheckCircle className="h-3 w-3" />
            )}
            {row.original.status === "pending" && <Clock className="h-3 w-3" />}
            {row.original.status.replace("_", " ")}
          </span>
        ),
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            {row.original.reviewer_id && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSendMessage(row.original.reviewer_id)}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAssignReviewer(row.original.annotation_id)}
            >
              <Users className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ];

    const handleSendMessage = (reviewerId) => {
      console.log(`Send message to reviewer: ${reviewerId}`);
    };

    const handleAssignReviewer = (annotationId) => {
      console.log(`Assign reviewer to annotation: ${annotationId}`);
    };

    const handleSubmitReview = () => {
      const ratedReviews = reviews.filter((r) => r.rating !== null);
      if (ratedReviews.length > 0) {
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
          onStepComplete({ reviewSubmitted: true });
          setIsSubmitting(false);
        }, 1000);
      }
    };

    const ratedCount = reviews.filter((r) => r.rating !== null).length;
    const totalCount = reviews.length;

    return (
      <div className="space-y-6">
        {/* Review Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Total Reviews</span>
            </div>
            <div className="text-2xl font-bold text-primary">{totalCount}</div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Rated</span>
            </div>
            <div className="text-2xl font-bold text-yellow-500">
              {ratedCount}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <div className="text-2xl font-bold text-blue-500">
              {totalCount - ratedCount}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Avg. Rating</span>
            </div>
            <div className="text-2xl font-bold text-primary">
              {ratedCount > 0
                ? (
                    reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
                    ratedCount
                  ).toFixed(1)
                : "0.0"}
            </div>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Review Progress
            </h3>
            <Button
              onClick={handleSubmitReview}
              disabled={ratedCount === 0 || isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>Submitting...</>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Review ({ratedCount}/{totalCount})
                </>
              )}
            </Button>
          </div>

          <DataTable
            columns={reviewColumns}
            data={reviews}
            searchable={true}
            searchPlaceholder="Search reviews..."
          />
        </div>

        {/* Analysis Results */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Analysis Results
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysisResults.map((result) => (
              <div
                key={result.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedAnalysis?.id === result.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedAnalysis(result)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{result.annotator_name}</span>
                  {result.overall_quality && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">
                        {result.overall_quality}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {result.metrics_count} metrics
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(`Download analysis: ${result.file_url}`);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV
                </Button>
              </div>
            ))}
          </div>

          {selectedAnalysis && (
            <div className="mt-6 p-4 border border-primary/20 bg-primary/5 rounded-lg">
              <h4 className="font-semibold mb-2">
                Selected Analysis: {selectedAnalysis.annotator_name}
              </h4>
              <p className="text-sm text-muted-foreground">
                Ready for final review and conclusion. Click the button below to
                mark this as the perfect match.
              </p>
              <Button
                className="mt-3 gap-2"
                onClick={() => {
                  console.log(`Finalize analysis: ${selectedAnalysis.id}`);
                  onStepComplete({
                    finalAnalysisSelected: selectedAnalysis.id,
                  });
                }}
              >
                <CheckCircle className="h-4 w-4" />
                Select as Perfect Match
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Data Reviewer View - Review Interface
  if (isDataReviewer) {
    const userReviews = reviews.filter((r) => r.reviewer_id === user.id);
    const pendingReviews = userReviews.filter((r) => r.status === "pending");

    const handleSubmitReview = (reviewId) => {
      if (rating === 0) {
        alert("Please provide a rating before submitting.");
        return;
      }

      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        const updatedReviews = reviews.map((review) =>
          review.id === reviewId
            ? { ...review, rating, comments, status: "completed" }
            : review
        );
        setReviews(updatedReviews);
        setRating(0);
        setComments("");
        setIsSubmitting(false);
      }, 1000);
    };

    if (pendingReviews.length === 0) {
      return (
        <div className="text-center py-12">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            No Pending Reviews
          </h3>
          <p className="text-muted-foreground">
            All assigned reviews have been completed.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {pendingReviews.map((review) => (
          <div
            key={review.id}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold">Review Analysis</h3>
                <p className="text-muted-foreground">
                  Annotator: {review.annotator_name}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() =>
                  console.log(
                    `Download analysis for review: ${review.annotation_id}`
                  )
                }
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download Analysis
              </Button>
            </div>

            {/* Rating System */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Rating (1-5 Stars)
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`h-8 w-8 transition-all ${
                          star <= rating
                            ? "text-yellow-500 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>

              {/* Comments */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Comments & Feedback
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Provide detailed feedback about the analysis..."
                  className="w-full p-3 border border-border rounded-lg min-h-[100px] resize-vertical"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  onClick={() => handleSubmitReview(review.id)}
                  disabled={rating === 0 || isSubmitting}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <>Submitting Review...</>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Review
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Completed Reviews */}
        {userReviews.filter((r) => r.status === "completed").length > 0 && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">
              Your Completed Reviews
            </h3>
            <div className="space-y-3">
              {userReviews
                .filter((r) => r.status === "completed")
                .map((review) => (
                  <div
                    key={review.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{review.annotator_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {review.comments}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{review.rating}/5</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default view for other roles
  return (
    <div className="text-center py-12">
      <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-muted-foreground mb-2">
        Access Restricted
      </h3>
      <p className="text-muted-foreground">
        You don't have permission to access the review interface.
      </p>
    </div>
  );
};

export default MatchReviewStep;
