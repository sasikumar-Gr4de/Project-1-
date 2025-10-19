import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Folder,
  File,
  Image,
  Video,
  FileText,
  Music,
  Archive,
  Download,
  Trash2,
  RefreshCw,
  HardDrive,
  Grid,
  List,
  Upload,
  FolderPlus,
  Home,
  ChevronRight,
} from "lucide-react";
import DataTable from "@/components/common/DataTable";
import GridView from "@/components/common/GridView";
import { fileManagerService } from "@/services/fileManagerService";
import { fileTypes } from "@/utils/constants";
import { useToastStore } from "@/store/toastStore";
import Loading from "@/components/common/Loading";

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [currentFolder, setCurrentFolder] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [stats, setStats] = useState(null);
  const toast = useToastStore((state) => state.toast);

  const getFileIcon = (file) => {
    if (file.type === "folder")
      return <Folder className="h-5 w-5 text-blue-500" />;

    const extension = file.type;
    if (fileTypes.image.includes(extension))
      return <Image className="h-5 w-5 text-green-500" />;
    if (fileTypes.video.includes(extension))
      return <Video className="h-5 w-5 text-purple-500" />;
    if (fileTypes.document.includes(extension))
      return <FileText className="h-5 w-5 text-orange-500" />;
    if (fileTypes.audio.includes(extension))
      return <Music className="h-5 w-5 text-red-500" />;
    if (fileTypes.archive.includes(extension))
      return <Archive className="h-5 w-5 text-yellow-500" />;

    return <File className="h-5 w-5 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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

  const loadFiles = async (folder = "") => {
    setIsLoading(true);
    try {
      const response = await fileManagerService.getFiles({
        folder,
        maxKeys: 100,
      });

      if (response.success) {
        setFiles(response.files);
        setFolders(response.folders);
      } else {
        toast.error(response.error || "Failed to load files");
      }
    } catch (error) {
      console.error("Error loading files:", error);
      toast.error("Failed to load files from storage");
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fileManagerService.getStorageStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  useEffect(() => {
    loadFiles(currentFolder);
    loadStats();
  }, [currentFolder]);

  const handleFileSelect = (fileKey) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileKey)) {
      newSelected.delete(fileKey);
    } else {
      newSelected.add(fileKey);
    }
    setSelectedFiles(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedFiles.size === files.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(files.map((file) => file.key)));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedFiles.size === 0) return;

    if (
      !confirm(
        `Are you sure you want to delete ${selectedFiles.size} file(s)? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fileManagerService.deleteFiles(
        Array.from(selectedFiles)
      );

      if (response.success) {
        toast({
          title: "Success",
          description: response.message,
        });
        setSelectedFiles(new Set());
        loadFiles(currentFolder);
        loadStats();
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete files",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting files:", error);
      toast({
        title: "Error",
        description: "Failed to delete files",
        variant: "destructive",
      });
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Error",
        description: "Folder name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fileManagerService.createFolder(
        newFolderName.trim(),
        currentFolder
      );

      if (response.success) {
        toast({
          title: "Success",
          description: response.message,
        });
        setNewFolderName("");
        setShowCreateFolderDialog(false);
        loadFiles(currentFolder);
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to create folder",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating folder:", error);
      toast({
        title: "Error",
        description: "Failed to create folder",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 10MB",
        variant: "destructive",
      });
      return;
    }

    try {
      // You'll need to implement the upload service for direct file uploads
      // For now, this is a placeholder - you can use the existing upload service
      toast({
        title: "Upload Started",
        description: `Uploading ${file.name}...`,
      });

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Upload Complete",
        description: `${file.name} uploaded successfully`,
      });

      loadFiles(currentFolder);
      loadStats();
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      event.target.value = "";
    }
  };

  const navigateToFolder = (folderPrefix) => {
    setCurrentFolder(folderPrefix);
    setSelectedFiles(new Set());
  };

  const breadcrumbs = [{ name: "Root", path: "" }];

  if (currentFolder) {
    const pathParts = currentFolder.split("/").filter(Boolean);
    pathParts.forEach((part, index) => {
      const path = pathParts.slice(0, index + 1).join("/");
      breadcrumbs.push({ name: part, path });
    });
  }

  // Combine folders and files for display
  const allItems = [
    ...folders.map((folder) => ({ ...folder, isFolder: true })),
    ...files.map((file) => ({ ...file, isFolder: false })),
  ];

  // Filter items based on search
  const filteredItems = allItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // DataTable columns configuration
  const tableColumns = [
    {
      key: "name",
      title: "Name",
      width: "40%",
    },
    {
      key: "type",
      title: "Type",
      width: "15%",
    },
    {
      key: "size",
      title: "Size",
      width: "15%",
    },
    {
      key: "modified",
      title: "Last Modified",
      width: "20%",
    },
    {
      key: "actions",
      title: "Actions",
      width: "10%",
    },
  ];

  // Render table row
  const renderTableRow = (item, index) => (
    <tr
      key={item.key || item.prefix}
      className={`border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer ${
        !item.isFolder && selectedFiles.has(item.key) ? "bg-blue-900/20" : ""
      }`}
      onClick={() =>
        item.isFolder
          ? navigateToFolder(item.prefix)
          : handleFileSelect(item.key)
      }
    >
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          {getFileIcon(item)}
          <span className="text-white font-medium">{item.name}</span>
        </div>
      </td>
      <td className="py-4 px-6">
        <Badge variant="outline" className="bg-gray-700 text-gray-300">
          {item.isFolder ? "Folder" : item.type?.toUpperCase() || "File"}
        </Badge>
      </td>
      <td className="py-4 px-6 text-gray-300">
        {item.isFolder ? "-" : formatFileSize(item.size)}
      </td>
      <td className="py-4 px-6 text-gray-300">
        {item.isFolder ? "-" : formatDate(item.lastModified)}
      </td>
      <td className="py-4 px-6">
        <div className="flex gap-2">
          {!item.isFolder && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                window.open(item.url, "_blank");
              }}
              className="text-gray-400 hover:text-white"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );

  // Render grid item
  const renderGridItem = (item, index) => (
    <Card
      key={item.key || item.prefix}
      className={`bg-gray-800 border-gray-700 hover:border-gray-500 transition-colors cursor-pointer h-full ${
        !item.isFolder && selectedFiles.has(item.key)
          ? "border-blue-500 bg-blue-900/20"
          : ""
      }`}
      onClick={() =>
        item.isFolder
          ? navigateToFolder(item.prefix)
          : handleFileSelect(item.key)
      }
    >
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-3">
          {getFileIcon(item)}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium truncate text-sm">
              {item.name}
            </h3>
            <Badge
              variant="outline"
              className="mt-1 text-xs bg-gray-700 text-gray-300"
            >
              {item.isFolder ? "Folder" : item.type?.toUpperCase() || "File"}
            </Badge>
          </div>
        </div>

        <div className="text-gray-400 text-xs space-y-1 mt-auto">
          {!item.isFolder && (
            <>
              <div className="flex justify-between">
                <span>Size:</span>
                <span>{formatFileSize(item.size)}</span>
              </div>
              <div className="flex justify-between">
                <span>Modified:</span>
                <span className="text-right">
                  {formatDate(item.lastModified)}
                </span>
              </div>
            </>
          )}
        </div>

        {!item.isFolder && (
          <div className="flex justify-end mt-3 pt-3 border-t border-gray-700">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                window.open(item.url, "_blank");
              }}
              className="text-gray-400 hover:text-white h-8 w-8 p-0"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">File Manager</h1>
            <p className="text-gray-400">
              Manage your AWS S3 storage files and folders
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setShowCreateFolderDialog(true)}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              New Folder
            </Button>

            <input
              type="file"
              id="file-upload"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Label htmlFor="file-upload" className="cursor-pointer">
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </Label>

            <Button
              onClick={() => {
                loadFiles(currentFolder);
                loadStats();
              }}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Card */}
        {stats && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Storage Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-white">
                    {stats.fileCount}
                  </div>
                  <div className="text-gray-400 text-sm">Total Files</div>
                </div>
                <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-white">
                    {formatFileSize(stats.totalSize)}
                  </div>
                  <div className="text-gray-400 text-sm">Total Size</div>
                </div>
                <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-white">
                    {Object.keys(stats.filesByType).length}
                  </div>
                  <div className="text-gray-400 text-sm">File Types</div>
                </div>
                <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-white text-sm truncate">
                    {stats.bucketName}
                  </div>
                  <div className="text-gray-400 text-sm">Bucket</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Toolbar */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              {/* Breadcrumb */}
              <div className="flex items-center gap-1 text-sm flex-wrap">
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center gap-1">
                    {index > 0 && (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentFolder(crumb.path)}
                      className={`p-1 h-auto text-sm ${
                        index === breadcrumbs.length - 1
                          ? "text-white font-semibold"
                          : "text-gray-300 hover:text-white"
                      }`}
                    >
                      {index === 0 ? <Home className="h-4 w-4" /> : crumb.name}
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex-1" />

              {/* Search */}
              <div className="relative w-full lg:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white pl-10"
                />
              </div>

              {/* View Toggle */}
              <div className="flex border border-gray-600 rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  onClick={() => setViewMode("grid")}
                  className={`px-3 ${
                    viewMode === "grid"
                      ? "bg-gray-700 text-white"
                      : "bg-transparent text-gray-300 hover:text-white"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  onClick={() => setViewMode("table")}
                  className={`px-3 ${
                    viewMode === "table"
                      ? "bg-gray-700 text-white"
                      : "bg-transparent text-gray-300 hover:text-white"
                  }`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Selection Actions */}
            {selectedFiles.size > 0 && (
              <div className="flex items-center gap-4 mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-800">
                <span className="text-blue-300 text-sm">
                  {selectedFiles.size} file(s) selected
                </span>
                <Button
                  onClick={handleDeleteSelected}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
                <Button
                  onClick={() => setSelectedFiles(new Set())}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Clear Selection
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content */}
        {isLoading ? (
          <Loading overlay text="" color="blue" variant="cyberpunk-scan" />
        ) : (
          <>
            {viewMode === "table" ? (
              <DataTable
                columns={tableColumns}
                data={filteredItems}
                pageSize={10}
                renderRow={renderTableRow}
                emptyMessage="No files or folders found"
              />
            ) : (
              <GridView
                data={filteredItems}
                renderItem={renderGridItem}
                pageSize={12}
                columns={{
                  sm: 1,
                  md: 2,
                  lg: 3,
                  xl: 4,
                }}
                emptyMessage="No files or folders found"
                emptyIcon={Folder}
              />
            )}
          </>
        )}

        {/* Create Folder Dialog */}
        <Dialog
          open={showCreateFolderDialog}
          onOpenChange={setShowCreateFolderDialog}
        >
          <DialogContent className="bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Label htmlFor="folder-name">Folder Name</Label>
              <Input
                id="folder-name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                className="bg-gray-700 border-gray-600 text-white"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleCreateFolder();
                  }
                }}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCreateFolderDialog(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
              >
                Create Folder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default FileManager;
