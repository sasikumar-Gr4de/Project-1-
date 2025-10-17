import React from "react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FORMATIONS } from "@/utils/constants";

const FormationSelector = ({
  team,
  teamName,
  formations,
  handleFormationChange,
}) => (
  <motion.div
    className="flex items-center space-x-3"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <span className="text-white text-sm font-medium">{teamName}</span>
    <Select
      value={formations[team]}
      onValueChange={(value) => handleFormationChange(team, value)}
    >
      <SelectTrigger className="w-28 bg-gray-800 border-gray-600 text-white text-xs hover:bg-gray-700">
        <SelectValue placeholder="Formation" />
      </SelectTrigger>
      <SelectContent className="bg-gray-800 border-gray-600 text-white">
        {Object.keys(FORMATIONS).map((formation) => (
          <SelectItem value={formation} key={`formation-${formation}`}>
            {formation}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    <motion.div
      className={`px-3 py-1 rounded-full text-xs font-bold ${
        team === "team_a" ? "bg-blue-500 text-white" : "bg-red-500 text-white"
      }`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500 }}
    >
      {formations[team]}
    </motion.div>
  </motion.div>
);

export default FormationSelector;
