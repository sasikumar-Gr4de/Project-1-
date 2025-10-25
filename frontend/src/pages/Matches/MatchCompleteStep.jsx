// src/pages/Matches/MatchCompleteStep.jsx
import { CheckCircle, Download, Share2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const MatchCompleteStep = ({ matchId, currentStep }) => {
  if (currentStep < 3) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          Complete Review First
        </h3>
        <p className="text-muted-foreground">
          Please complete the match review to finalize the analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Completion Status */}
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Analysis Complete!</h2>
        <p className="text-muted-foreground mb-6">
          The match analysis has been successfully completed and is ready for
          distribution.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
          <Button variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share Results
          </Button>
        </div>
      </div>

      {/* Next Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-2">24h</div>
          <div className="text-sm text-muted-foreground">
            Player Feedback Window
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-2">3</div>
          <div className="text-sm text-muted-foreground">Coaches Notified</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-2">100%</div>
          <div className="text-sm text-muted-foreground">Data Accuracy</div>
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Next Actions</h3>
        <div className="space-y-3">
          {[
            "Schedule individual player review sessions",
            "Update player development plans",
            "Prepare for next match analysis",
            "Share insights with scouting department",
          ].map((action, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 border border-border rounded-lg"
            >
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-sm">{action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchCompleteStep;
