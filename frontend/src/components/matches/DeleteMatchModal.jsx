import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { AlertTriangle } from "lucide-react";

const DeleteMatchModal = ({ isOpen, onClose, onConfirm, match }) => {
  if (!match) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-400">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Delete Match
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Are you sure you want to delete the match between "
            {match.team_a_name}" and "{match.team_b_name}"? This action cannot
            be undone. All match data, statistics, and events will be
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
            Delete Match
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMatchModal;
