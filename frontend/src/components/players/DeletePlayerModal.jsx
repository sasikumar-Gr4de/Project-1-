// components/DeletePlayerModal.jsx
import React from "react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import { AlertTriangle } from "lucide-react";

const DeletePlayerModal = ({ isOpen, onClose, onConfirm, player }) => {
  if (!player) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2 text-red-400">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle>Delete Player</DialogTitle>
          </div>
          <DialogDescription className="text-gray-400">
            Are you sure you want to delete{" "}
            <strong className="text-white">{player.name}</strong>? This action
            cannot be undone and all player data will be permanently removed.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete Player
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePlayerModal;
