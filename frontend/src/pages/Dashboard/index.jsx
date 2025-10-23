import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/common/DataTable";
import AddClubModal from "@/components/modals/AddClubModal";
import AddPlayerModal from "@/components/modals/AddPlayerModal";
import AddMatchModal from "@/components/modals/AddMatchModal";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import ProgressModal from "@/components/common/ProgressModal";
import { mockClubs, mockPlayers, mockMatches, mockFiles } from "@/mock/data";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("clubs");
  const [clubs, setClubs] = useState(mockClubs);
  const [players, setPlayers] = useState(mockPlayers);
  const [matches, setMatches] = useState(mockMatches);
  const [files, setFiles] = useState(mockFiles);

  const [showClubModal, setShowClubModal] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: "",
    id: "",
  });
  const [progressModal, setProgressModal] = useState({
    isOpen: false,
    progress: 0,
    currentStep: "",
  });

  // Stats calculation
  const stats = useMemo(
    () => ({
      clubs: clubs.length,
      players: players.length,
      matches: matches.length,
      files: files.length,
    }),
    [clubs, players, matches, files]
  );

  // Club columns
  const clubColumns = [
    {
      header: "Club Mark",
      accessor: "mark_url",
      cell: ({ row }) => (
        <img
          src={row.mark_url || "/default-club.png"}
          alt={row.club_name}
          className="w-10 h-10 rounded-full object-cover"
        />
      ),
    },
    { header: "Club Name", accessor: "club_name" },
    { header: "Location", accessor: "location" },
    { header: "Founded", accessor: "founded_year" },
    {
      header: "Created",
      accessor: "created_at",
      cell: ({ row }) => new Date(row.created_at).toLocaleDateString(),
    },
  ];

  // Player columns
  const playerColumns = [
    {
      header: "Avatar",
      accessor: "avatar_url",
      cell: ({ row }) => (
        <img
          src={row.avatar_url || "/default-avatar.png"}
          alt={row.full_name}
          className="w-10 h-10 rounded-full object-cover"
        />
      ),
    },
    { header: "Full Name", accessor: "full_name" },
    { header: "Position", accessor: "position" },
    { header: "Club", accessor: "current_club" },
    { header: "Nationality", accessor: "nationality" },
    { header: "Jersey", accessor: "jersey_number" },
    {
      header: "Status",
      accessor: "status",
      badge: true,
    },
  ];

  // Match columns
  const matchColumns = [
    { header: "Home Club", accessor: "home_club_id" },
    { header: "Away Club", accessor: "away_club_id" },
    {
      header: "Match Date",
      accessor: "match_date",
      cell: ({ row }) => new Date(row.match_date).toLocaleDateString(),
    },
    { header: "Competition", accessor: "competition" },
    {
      header: "Status",
      accessor: "match_status",
      badge: true,
    },
    {
      header: "Score",
      accessor: "score",
      cell: ({ row }) =>
        row.match_status === "completed"
          ? `${row.score_home || 0} - ${row.score_away || 0}`
          : "-",
    },
    {
      header: "QA Status",
      accessor: "qa_status",
      badge: true,
    },
  ];

  // File columns
  const fileColumns = [
    { header: "File Name", accessor: "name" },
    { header: "Type", accessor: "type" },
    {
      header: "Size",
      accessor: "size",
      cell: ({ row }) => {
        const size = row.size;
        if (size < 1024) return `${size} B`;
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
      },
    },
    {
      header: "Last Modified",
      accessor: "lastModified",
      cell: ({ row }) => new Date(row.lastModified).toLocaleDateString(),
    },
  ];

  // Action handlers
  const handleAddClub = (clubData) => {
    const newClub = {
      ...clubData,
      club_id: `club-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setClubs((prev) => [...prev, newClub]);
  };

  const handleAddPlayer = (playerData) => {
    const newPlayer = {
      ...playerData,
      player_id: `player-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setPlayers((prev) => [...prev, newPlayer]);
  };

  const handleAddMatch = (matchData) => {
    const newMatch = {
      ...matchData,
      match_id: `match-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setMatches((prev) => [...prev, newMatch]);
  };

  const handleDelete = () => {
    const { type, id } = deleteModal;

    switch (type) {
      case "club":
        setClubs((prev) => prev.filter((club) => club.club_id !== id));
        break;
      case "player":
        setPlayers((prev) => prev.filter((player) => player.player_id !== id));
        break;
      case "match":
        setMatches((prev) => prev.filter((match) => match.match_id !== id));
        break;
      case "file":
        setFiles((prev) => prev.filter((file) => file.key !== id));
        break;
    }

    setDeleteModal({ isOpen: false, type: "", id: "" });
  };

  const handleCSVUpload = async (files) => {
    setProgressModal({
      isOpen: true,
      progress: 0,
      currentStep: "Uploading CSV",
    });

    // Simulate upload and analysis process
    const steps = [
      "Uploading CSV",
      "Validating Data",
      "Processing Records",
      "Complete",
    ];
    let progress = 0;

    for (let i = 0; i < steps.length; i++) {
      setProgressModal({
        isOpen: true,
        progress: progress,
        currentStep: steps[i],
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
      progress += 25;
    }

    setProgressModal({ isOpen: false, progress: 0, currentStep: "" });
    alert("CSV data processed successfully!");
  };

  const handleVideoUpload = async (files) => {
    setProgressModal({
      isOpen: true,
      progress: 0,
      currentStep: "Uploading Video",
    });

    // Simulate video upload process
    const steps = [
      "Uploading Video",
      "Processing Video",
      "Extracting Metadata",
      "Complete",
    ];
    let progress = 0;

    for (let i = 0; i < steps.length; i++) {
      setProgressModal({
        isOpen: true,
        progress: progress,
        currentStep: steps[i],
      });

      await new Promise((resolve) => setTimeout(resolve, 1500));
      progress += 25;
    }

    setProgressModal({ isOpen: false, progress: 0, currentStep: "" });
    alert("Video uploaded and processed successfully!");
  };

  // Action renderers
  const clubActions = ({ row }) => (
    <>
      <Button variant="outline" size="sm">
        Edit
      </Button>
      <Button variant="outline" size="sm">
        Report
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() =>
          setDeleteModal({ isOpen: true, type: "club", id: row.club_id })
        }
      >
        Delete
      </Button>
    </>
  );

  const playerActions = ({ row }) => (
    <>
      <Button variant="outline" size="sm">
        Edit
      </Button>
      <Button variant="outline" size="sm">
        Report
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() =>
          setDeleteModal({ isOpen: true, type: "player", id: row.player_id })
        }
      >
        Delete
      </Button>
    </>
  );

  const matchActions = ({ row }) => (
    <>
      <Button variant="outline" size="sm">
        Edit
      </Button>
      <Button variant="outline" size="sm" onClick={() => handleVideoUpload([])}>
        Upload Video
      </Button>
      <Button variant="outline" size="sm" onClick={() => handleCSVUpload([])}>
        Upload CSV
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() =>
          setDeleteModal({ isOpen: true, type: "match", id: row.match_id })
        }
      >
        Delete
      </Button>
    </>
  );

  const fileActions = ({ row }) => (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => awsService.downloadFile(row.key, row.name)}
      >
        Download
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() =>
          setDeleteModal({ isOpen: true, type: "file", id: row.key })
        }
      >
        Delete
      </Button>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <img src="/GR4DE.png" alt="GR4DE" className="h-8 w-8" />
                <h1 className="text-2xl font-bold text-foreground">
                  GR4DE Platform
                </h1>
              </div>

              <nav className="flex space-x-6">
                <button
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "clubs"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setActiveTab("clubs")}
                >
                  Clubs
                </button>
                <button
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "players"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setActiveTab("players")}
                >
                  Players
                </button>
                <button
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "matches"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setActiveTab("matches")}
                >
                  Matches
                </button>
                <button
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "files"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setActiveTab("files")}
                >
                  File Manager
                </button>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex space-x-6 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {stats.clubs}
                  </div>
                  <div className="text-muted-foreground">Clubs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {stats.players}
                  </div>
                  <div className="text-muted-foreground">Players</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {stats.matches}
                  </div>
                  <div className="text-muted-foreground">Matches</div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => setShowClubModal(true)}
                  className="bg-primary hover:bg-primary/90"
                >
                  Add Club
                </Button>
                <Button
                  onClick={() => setShowPlayerModal(true)}
                  className="bg-primary hover:bg-primary/90"
                >
                  Add Player
                </Button>
                <Button
                  onClick={() => setShowMatchModal(true)}
                  className="bg-primary hover:bg-primary/90"
                >
                  Add Match
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === "clubs" && (
          <DataTable
            data={clubs}
            columns={clubColumns}
            title="Clubs Management"
            searchPlaceholder="Search clubs..."
            actions={clubActions}
          />
        )}

        {activeTab === "players" && (
          <DataTable
            data={players}
            columns={playerColumns}
            title="Players Management"
            searchPlaceholder="Search players..."
            actions={playerActions}
          />
        )}

        {activeTab === "matches" && (
          <DataTable
            data={matches}
            columns={matchColumns}
            title="Matches Management"
            searchPlaceholder="Search matches..."
            actions={matchActions}
          />
        )}

        {activeTab === "files" && (
          <DataTable
            data={files}
            columns={fileColumns}
            title="File Manager"
            searchPlaceholder="Search files..."
            actions={fileActions}
          />
        )}
      </main>

      {/* Sticky Footer */}
      <footer className="sticky bottom-0 z-40 bg-background border-t">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>© 2024 GR4DE Platform. All rights reserved.</div>
            <div>Total Files: {stats.files} | Storage Used: 245 MB</div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddClubModal
        isOpen={showClubModal}
        onClose={() => setShowClubModal(false)}
        onSave={handleAddClub}
      />

      <AddPlayerModal
        isOpen={showPlayerModal}
        onClose={() => setShowPlayerModal(false)}
        onSave={handleAddPlayer}
        clubs={clubs}
      />

      <AddMatchModal
        isOpen={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        onSave={handleAddMatch}
        clubs={clubs}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, type: "", id: "" })}
        onConfirm={handleDelete}
      />

      <ProgressModal
        isOpen={progressModal.isOpen}
        progress={progressModal.progress}
        currentStep={progressModal.currentStep}
      />
    </div>
  );
};

export default Dashboard;
