// VerificationReview.jsx - Updated with DataTable
import { useState, useEffect } from "react";
import { useToast } from "@/contexts/ToastContext";
import { usePassportStore } from "@/store/passportStore";
import AdminSection from "@/components/admin/AdminSection";
import DataTable from "@/components/common/DataTable";
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
  Filter,
  RefreshCw,
} from "lucide-react";

const VerificationReview = () => {
  const { fetchPendingVerifications, handleReviewVerification } =
    usePassportStore();
  const { toast } = useToast();
  const [verifications, setVerifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [reviewNote, setReviewNote] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    document_type: "all",
  });

  useEffect(() => {
    loadVerifications();
  }, [filters, pagination.page, pagination.limit]);

  const loadVerifications = async () => {
    try {
      setIsLoading(true);
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      };

      const data = await fetchPendingVerifications(params);
      setVerifications(data.items || []);
      setPagination((prev) => ({
        ...prev,
        total: data.total || 0,
        totalPages: data.totalPages || 0,
      }));
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

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when filters change
  };

  const handleReview = async (verificationId, action) => {
    try {
      const data = await handleReviewVerification(verificationId, {
        action,
        note: reviewNote,
      });

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
            className="bg-(--surface-2) text-(--muted-text) border-(--surface-2)"
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

  // DataTable columns configuration
  const columns = [
    {
      header: "Player",
      accessor: "users",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-linear-to-br from-primary to-(--accent-2) rounded-full flex items-center justify-center">
            {row.users?.avatar_url ? (
              <img
                src={row.users.avatar_url}
                alt={row.users.player_name}
                className="w-10 h-10 rounded-full object-cover border-2 border-(--surface-0)"
              />
            ) : (
              <User className="w-5 h-5 text-(--ink)" />
            )}
          </div>
          <div>
            <div className="font-medium text-white">
              {row.users?.player_name || "Unknown Player"}
            </div>
            <div className="text-sm text-(--muted-text)">
              {row.users?.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Document Type",
      accessor: "document_type",
      cell: ({ row }) => getDocumentTypeBadge(row.document_type),
    },
    {
      header: "Status",
      accessor: "status",
      cell: ({ row }) => getStatusBadge(row.status),
    },
    {
      header: "Submitted",
      accessor: "created_at",
      cell: ({ row }) => formatDate(row.created_at),
    },
    {
      header: "Reviewed At",
      accessor: "reviewed_at",
      cell: ({ row }) => (row.reviewed_at ? formatDate(row.reviewed_at) : "-"),
    },
  ];

  // DataTable actions
  const actions = ({ row }) => (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setSelectedVerification(row)}
        className="bg-(--surface-2) border-(--surface-2) text-foreground hover:bg-(--surface-3)"
      >
        <Eye className="w-4 h-4" />
      </Button>

      {row.status === "pending" && (
        <>
          <Button
            size="sm"
            onClick={() => handleReview(row.verification_id, "approved")}
            className="bg-green-600 hover:bg-green-700 text-white h-8 w-8 p-0"
          >
            <CheckCircle className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleReview(row.verification_id, "rejected")}
            className="h-8 w-8 p-0"
          >
            <XCircle className="w-4 h-4" />
          </Button>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-['Orbitron'] bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
            Document Verification
          </h1>
          <p className="text-(--muted-text) text-lg mt-2 font-['Orbitron']">
            Review and verify player identity documents
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={loadVerifications}
            className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold rounded-xl px-6 py-3 h-12"
          >
            <RefreshCw
              className={`w-5 h-5 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <AdminSection
        title="Filters & Search"
        description="Filter verifications by status, document type, or search by player name"
        icon={Filter}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-(--muted-text)" />
              <Input
                placeholder="Search players..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10 bg-(--surface-0) border-(--surface-2) text-foreground placeholder:text-(--muted-text)"
              />
            </div>
          </div>

          {/* Status Filter */}
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger className="bg-(--surface-0) border-(--surface-2) text-foreground">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-(--surface-1) border-(--surface-2) text-foreground">
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
            <SelectTrigger className="bg-(--surface-0) border-(--surface-2) text-foreground">
              <SelectValue placeholder="Document Type" />
            </SelectTrigger>
            <SelectContent className="bg-(--surface-1) border-(--surface-2) text-foreground">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="passport">Passport</SelectItem>
              <SelectItem value="club_letter">Club Letter</SelectItem>
              <SelectItem value="consent">Consent Form</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </AdminSection>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-(--surface-1) border-(--surface-2)">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-(--muted-text)">
                  Pending Review
                </p>
                <p className="text-2xl font-bold text-white mt-1">
                  {pagination.total
                    ? verifications.filter((v) => v.status === "pending").length
                    : 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-(--surface-1) border-(--surface-2)">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-(--muted-text)">
                  Approved
                </p>
                <p className="text-2xl font-bold text-white mt-1">
                  {pagination.total
                    ? verifications.filter((v) => v.status === "approved")
                        .length
                    : 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-(--surface-1) border-(--surface-2)">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-(--muted-text)">
                  Rejected
                </p>
                <p className="text-2xl font-bold text-white mt-1">
                  {pagination.total
                    ? verifications.filter((v) => v.status === "rejected")
                        .length
                    : 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-(--surface-1) border-(--surface-2)">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-(--muted-text)">Total</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {pagination.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DataTable */}
      <DataTable
        data={verifications}
        columns={columns}
        actions={actions}
        isLoading={isLoading}
        pagination={{
          page: pagination.page,
          limit: pagination.limit,
          total: pagination.total,
          totalPages: pagination.totalPages,
        }}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
        onPageSizeChange={(limit) =>
          setPagination((prev) => ({ ...prev, limit, page: 1 }))
        }
        emptyStateTitle="No verifications found"
        emptyStateDescription="No verification requests match your current filters."
      />

      {/* Review Modal (keep existing modal code) */}
      {selectedVerification && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-(--surface-0) border-(--surface-2) max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <CardHeader className="border-b border-(--surface-2)">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-white">
                    Review Document
                  </CardTitle>
                  <CardDescription className="text-(--muted-text)">
                    {selectedVerification.users?.player_name} -{" "}
                    {selectedVerification.document_type}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedVerification(null)}
                  className="text-(--muted-text) hover:text-foreground"
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
                  <div className="border-2 border-(--surface-2) rounded-lg bg-(--surface-1)">
                    {selectedVerification.file_url ? (
                      <div className="border-2 border-(--surface-2) rounded-lg bg-(--surface-1) aspect-video ">
                        <iframe
                          src={`https://docs.google.com/gview?url=${encodeURIComponent(
                            selectedVerification.file_url
                          )}&embedded=true`}
                          className="w-full h-full rounded-lg"
                          title="Document preview"
                          frameBorder="0"
                        />
                      </div>
                    ) : (
                      <div className="text-center">
                        <FileText className="w-16 h-16 text-(--muted-text) mx-auto mb-4 opacity-50" />
                        <p className="text-(--muted-text)">
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
                      <p className="text-(--muted-text)">
                        {selectedVerification.users?.player_name}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-white">
                        Document Type
                      </label>
                      <p className="text-(--muted-text) capitalize">
                        {selectedVerification.document_type}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-white">
                        Submitted
                      </label>
                      <p className="text-(--muted-text)">
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
                      className="bg-(--surface-1) border-(--surface-2) text-foreground placeholder:text-(--muted-text) min-h-[100px]"
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
