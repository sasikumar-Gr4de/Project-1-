import { useState, useEffect } from "react";
import { useToast } from "@/contexts/ToastContext";
import { usePassportStore } from "@/store/passportStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  User,
  Eye,
  Shield,
} from "lucide-react";

const VerificationReview = () => {
  const { fetchPendingVerifications } = usePassportStore();
  const { toast } = useToast();
  const [verifications, setVerifications] = useState([]);
  const [filteredVerifications, setFilteredVerifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [reviewNote, setReviewNote] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    status: "pending",
    document_type: "all",
  });

  useEffect(() => {
    loadVerifications();
  }, []);

  useEffect(() => {
    filterVerifications();
  }, [verifications, filters]);

  const loadVerifications = async () => {
    try {
      setIsLoading(true);
      // This would come from your admin service
      const response = await fetchPendingVerifications();
      console.log(response);

      // if (data.success) {
      //   setVerifications(data.data.items || []);
      // } else {
      //   throw new Error(data.message);
      // }
    } catch (error) {
      console.error("Failed to load verifications:", error);
      toast({
        title: "Error",
        description: "Failed to load verification requests",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterVerifications = () => {
    let filtered = verifications;

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((v) => v.status === filters.status);
    }

    // Document type filter
    if (filters.document_type !== "all") {
      filtered = filtered.filter(
        (v) => v.document_type === filters.document_type
      );
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.users?.player_name?.toLowerCase().includes(searchLower) ||
          v.document_type?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredVerifications(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReview = async (verificationId, action) => {
    try {
      const response = await fetch(
        `/api/verifications/${verificationId}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
            note: reviewNote,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: `Document ${action} successfully`,
          variant: "success",
        });

        // Refresh the list
        loadVerifications();
        setSelectedVerification(null);
        setReviewNote("");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Review failed:", error);
      toast({
        title: "Error",
        description: `Failed to ${action} document`,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  const getDocumentTypeBadge = (type) => {
    switch (type) {
      case "passport":
        return (
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-400 border-blue-500/20"
          >
            Passport
          </Badge>
        );
      case "club_letter":
        return (
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20"
          >
            Club Letter
          </Badge>
        );
      case "consent":
        return (
          <Badge
            variant="outline"
            className="bg-purple-500/10 text-purple-400 border-purple-500/20"
          >
            Consent Form
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-[var(--surface-2)] text-[var(--muted-text)] border-[var(--surface-2)]"
          >
            {type}
          </Badge>
        );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-['Orbitron'] bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
            Document Verification
          </h1>
          <p className="text-[var(--muted-text)] text-lg mt-2 font-['Orbitron']">
            Review and verify player identity documents
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={loadVerifications}
            className="bg-[var(--surface-1)] border-[var(--surface-2)] text-foreground hover:bg-[var(--surface-2)]"
          >
            Refresh
          </Button>
          <Button className="bg-linear-to-r from-primary to-[var(--accent-2)] text-[var(--ink)] hover:from-[var(--accent-2)] hover:to-primary font-semibold">
            <Shield className="w-4 h-4 mr-2" />
            Verification Stats
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-[var(--surface-1)] border-[var(--surface-2)]">
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--muted-text)]" />
              <Input
                placeholder="Search players..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10 bg-[var(--surface-0)] border-[var(--surface-2)] text-foreground placeholder:text-[var(--muted-text)]"
              />
            </div>

            {/* Status Filter */}
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger className="bg-[var(--surface-0)] border-[var(--surface-2)] text-foreground">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-[var(--surface-1)] border-[var(--surface-2)] text-foreground">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            {/* Document Type Filter */}
            <Select
              value={filters.document_type}
              onValueChange={(value) =>
                handleFilterChange("document_type", value)
              }
            >
              <SelectTrigger className="bg-[var(--surface-0)] border-[var(--surface-2)] text-foreground">
                <SelectValue placeholder="Document Type" />
              </SelectTrigger>
              <SelectContent className="bg-[var(--surface-1)] border-[var(--surface-2)] text-foreground">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="passport">Passport</SelectItem>
                <SelectItem value="club_letter">Club Letter</SelectItem>
                <SelectItem value="consent">Consent Form</SelectItem>
              </SelectContent>
            </Select>

            {/* Results Count */}
            <div className="flex items-center justify-end">
              <span className="text-sm text-[var(--muted-text)]">
                {filteredVerifications.length} documents
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-[var(--surface-1)] border-[var(--surface-2)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--muted-text)]">
                  Pending Review
                </p>
                <p className="text-2xl font-bold text-white mt-1">
                  {verifications.filter((v) => v.status === "pending").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--surface-1)] border-[var(--surface-2)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--muted-text)]">Approved</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {verifications.filter((v) => v.status === "approved").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--surface-1)] border-[var(--surface-2)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--muted-text)]">Rejected</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {verifications.filter((v) => v.status === "rejected").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--surface-1)] border-[var(--surface-2)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--muted-text)]">Total</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {verifications.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification List */}
      <div className="grid gap-6">
        {isLoading ? (
          // Loading skeleton
          [...Array(5)].map((_, i) => (
            <Card
              key={i}
              className="animate-pulse bg-[var(--surface-1)] border-[var(--surface-2)]"
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[var(--surface-2)] rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[var(--surface-2)] rounded w-1/4"></div>
                    <div className="h-3 bg-[var(--surface-2)] rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredVerifications.length > 0 ? (
          filteredVerifications.map((verification) => (
            <Card
              key={verification.verification_id}
              className="bg-[var(--surface-1)] border-[var(--surface-2)] hover:border-primary/30 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Player Avatar */}
                    <div className="w-12 h-12 bg-linear-to-br from-primary to-[var(--accent-2)] rounded-full flex items-center justify-center shadow-lg">
                      {verification.users?.avatar_url ? (
                        <img
                          src={verification.users.avatar_url}
                          alt={verification.users.player_name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[var(--surface-0)]"
                        />
                      ) : (
                        <User className="w-6 h-6 text-[var(--ink)]" />
                      )}
                    </div>

                    {/* Verification Info */}
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-white">
                          {verification.users?.player_name || "Unknown Player"}
                        </h3>
                        {getStatusBadge(verification.status)}
                        {getDocumentTypeBadge(verification.document_type)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-[var(--muted-text)] mt-1">
                        <span>
                          Submitted {formatDate(verification.created_at)}
                        </span>
                        <span>•</span>
                        <span>Document: {verification.document_type}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedVerification(verification)}
                      className="bg-[var(--surface-2)] border-[var(--surface-2)] text-foreground hover:bg-[var(--surface-3)]"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Review
                    </Button>

                    {verification.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleReview(
                              verification.verification_id,
                              "approved"
                            )
                          }
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleReview(
                              verification.verification_id,
                              "rejected"
                            )
                          }
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          // Empty state
          <Card className="bg-[var(--surface-1)] border-[var(--surface-2)]">
            <CardContent className="p-12 text-center">
              <Shield className="w-16 h-16 text-[var(--muted-text)] mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-white mb-2">
                {filters.status === "pending"
                  ? "No pending verifications"
                  : "No documents found"}
              </h3>
              <p className="text-[var(--muted-text)]">
                {filters.status === "pending"
                  ? "All documents have been reviewed. Check back later for new submissions."
                  : "Try adjusting your filters to see more results."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Review Modal */}
      {selectedVerification && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-[var(--surface-0)] border-[var(--surface-2)] max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <CardHeader className="border-b border-[var(--surface-2)]">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-white">
                    Review Document
                  </CardTitle>
                  <CardDescription className="text-[var(--muted-text)]">
                    {selectedVerification.users?.player_name} -{" "}
                    {selectedVerification.document_type}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedVerification(null)}
                  className="text-[var(--muted-text)] hover:text-foreground"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 max-h-[calc(90vh-80px)] overflow-y-auto">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Document Preview */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-white">Document Preview</h3>
                  <div className="border-2 border-[var(--surface-2)] rounded-lg bg-[var(--surface-1)] aspect-video flex items-center justify-center">
                    {selectedVerification.file_url ? (
                      <iframe
                        src={selectedVerification.file_url}
                        className="w-full h-full rounded-lg"
                        title="Document preview"
                      />
                    ) : (
                      <div className="text-center">
                        <FileText className="w-16 h-16 text-[var(--muted-text)] mx-auto mb-4 opacity-50" />
                        <p className="text-[var(--muted-text)]">
                          Document preview not available
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() =>
                            window.open(selectedVerification.file_url, "_blank")
                          }
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Document
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Review Actions */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-white">Review Details</h3>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-white">
                        Player
                      </label>
                      <p className="text-[var(--muted-text)]">
                        {selectedVerification.users?.player_name}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-white">
                        Document Type
                      </label>
                      <p className="text-[var(--muted-text)] capitalize">
                        {selectedVerification.document_type}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-white">
                        Submitted
                      </label>
                      <p className="text-[var(--muted-text)]">
                        {formatDate(selectedVerification.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white">
                      Review Notes
                    </label>
                    <Textarea
                      placeholder="Add notes about your review decision..."
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      className="bg-[var(--surface-1)] border-[var(--surface-2)] text-foreground placeholder:text-[var(--muted-text)] min-h-[100px]"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button
                      onClick={() =>
                        handleReview(
                          selectedVerification.verification_id,
                          "approved"
                        )
                      }
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Document
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() =>
                        handleReview(
                          selectedVerification.verification_id,
                          "rejected"
                        )
                      }
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Document
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default VerificationReview;
