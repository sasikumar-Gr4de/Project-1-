import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const DeleteTournamentModal = ({ isOpen, onClose, onConfirm, tournament }) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <DialogTitle>Delete Tournament</DialogTitle>
          </div>
          <DialogDescription className="text-gray-400 pt-2">
            Are you sure you want to delete the tournament{" "}
            <span className="text-white font-semibold">{tournament?.name}</span>
            ? This action cannot be undone and all associated data will be
            permanently removed.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-600 text-gray-300 hover:bg-gray-700 flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700 text-white flex-1"
          >
            Delete Tournament
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTournamentModal;
