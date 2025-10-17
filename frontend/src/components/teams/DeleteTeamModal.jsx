import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const DeleteTeamModal = ({ isOpen, onClose, onConfirm, team }) => {
  if (!team) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-400">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Delete Team
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Are you sure you want to delete the team "{team.name}"? This action
            cannot be undone. All team data and player associations will be
            permanently removed.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-600 text-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete Team
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTeamModal;
