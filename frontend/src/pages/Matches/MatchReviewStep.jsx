// src/pages/Matches/MatchReviewStep.jsx
import { FileText, CheckCircle, XCircle, Clock } from "lucide-react";

const MatchReviewStep = ({ matchId, currentStep }) => {
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

  return (
    <div className="space-y-6">
      {/* QA Status */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Quality Assurance</h3>
        <div className="flex items-center gap-4 p-4 border border-primary/20 bg-primary/5 rounded-lg">
          <CheckCircle className="h-8 w-8 text-primary" />
          <div>
            <div className="font-semibold">Analysis Approved</div>
            <div className="text-sm text-muted-foreground">
              All metrics have been verified and approved by the QA team.
            </div>
          </div>
        </div>
      </div>

      {/* Coach Notes */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Coach's Assessment</h3>
        <div className="space-y-4">
          <div className="p-4 border border-border rounded-lg">
            <div className="font-medium mb-2">Strengths</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Excellent ball retention and possession play</li>
              <li>• Strong defensive transitions</li>
              <li>• Creative passing in final third</li>
            </ul>
          </div>

          <div className="p-4 border border-border rounded-lg">
            <div className="font-medium mb-2">Areas for Improvement</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Set piece defending needs work</li>
              <li>• Final third decision making could be quicker</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">
          Development Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-primary/20 bg-primary/5 rounded-lg">
            <div className="font-medium text-primary mb-2">Immediate Focus</div>
            <div className="text-sm">Set piece positioning drills</div>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <div className="font-medium mb-2">Long-term Development</div>
            <div className="text-sm text-muted-foreground">
              Advanced tactical awareness training
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchReviewStep;
