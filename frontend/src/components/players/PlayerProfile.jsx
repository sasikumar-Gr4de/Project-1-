import {
  Calendar,
  MapPin,
  Users,
  Target,
  TrendingUp,
  Star,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PerformanceChart from "@/components/common/PerformanceChart";
import FootballPitch from "@/components/common/FootballPitch";
import MetricCard from "@/components/common/MetricCard";

const PlayerProfile = ({ player, metrics, isPdf = false }) => {
  if (!player || !metrics) return null;

  return (
    // <div className={`space-y-6 ${isPdf ? "p-8" : "p-6"}`}>
    //   {/* Player Header */}
    //   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    //     {/* Player Info Card */}
    //     <Card className="lg:col-span-1">
    //       <CardHeader className="pb-4">
    //         <CardTitle className="flex items-center gap-2">
    //           <Award className="h-5 w-5 text-primary" />
    //           Player Profile
    //         </CardTitle>
    //       </CardHeader>
    //       <CardContent className="space-y-4">
    //         <div className="flex items-center gap-4">
    //           <div className="w-20 h-20 rounded-full bg-linear-to-br from-primary to-primary/70 flex items-center justify-center border-4 border-primary/20">
    //             <span className="text-2xl font-bold text-white">
    //               {player.full_name
    //                 .split(" ")
    //                 .map((n) => n[0])
    //                 .join("")}
    //             </span>
    //           </div>
    //           <div>
    //             <h3 className="text-xl font-bold">{player.full_name}</h3>
    //             <p className="text-muted-foreground">{player.position}</p>
    //             <div className="flex items-center gap-1 mt-1">
    //               <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
    //               <span className="text-sm font-semibold">
    //                 {metrics.talent_index_score} GR4DE
    //               </span>
    //             </div>
    //           </div>
    //         </div>

    //         <div className="grid grid-cols-2 gap-4 text-sm">
    //           <div>
    //             <div className="font-semibold">Club</div>
    //             <div className="text-muted-foreground">
    //               {player.current_club_name}
    //             </div>
    //           </div>
    //           <div>
    //             <div className="font-semibold">Jersey</div>
    //             <div className="text-muted-foreground">
    //               #{player.jersey_number}
    //             </div>
    //           </div>
    //           <div>
    //             <div className="font-semibold">Nationality</div>
    //             <div className="text-muted-foreground">
    //               {player.nationality}
    //             </div>
    //           </div>
    //           <div>
    //             <div className="font-semibold">Preferred Foot</div>
    //             <div className="text-muted-foreground">
    //               {player.preferred_foot}
    //             </div>
    //           </div>
    //           <div>
    //             <div className="font-semibold">Age</div>
    //             <div className="text-muted-foreground">25</div>
    //           </div>
    //           <div>
    //             <div className="font-semibold">Height</div>
    //             <div className="text-muted-foreground">
    //               {player.height_cm}cm
    //             </div>
    //           </div>
    //         </div>
    //       </CardContent>
    //     </Card>

    //     {/* Stats Overview */}
    //     <Card className="lg:col-span-2">
    //       <CardHeader>
    //         <CardTitle>Performance Overview</CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    //           {profileStats.map((stat, index) => (
    //             <MetricCard
    //               key={index}
    //               title={stat.label}
    //               value={stat.value}
    //               icon={stat.icon}
    //               progress={stat.progress}
    //               trend={stat.trend}
    //               className="text-center"
    //             />
    //           ))}
    //         </div>
    //       </CardContent>
    //     </Card>
    //   </div>

    //   {/* Talent Assessment */}
    //   <Card>
    //     <CardHeader>
    //       <CardTitle className="flex items-center gap-2">
    //         <TrendingUp className="h-5 w-5 text-primary" />
    //         GR4DE Talent Assessment
    //       </CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       <PerformanceChart metrics={talentMetrics} />
    //     </CardContent>
    //   </Card>

    //   {/* Pitch Visualizations */}
    //   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    //     <Card>
    //       <CardHeader>
    //         <CardTitle>Activity Field & Distribution Map</CardTitle>
    //       </CardHeader>
    //       <CardContent className="flex flex-col items-center space-y-4">
    //         <FootballPitch
    //           width={400}
    //           height={280}
    //           activities={mockActivities}
    //           distribution={mockDistribution}
    //           showHeatmap={true}
    //         />
    //         <div className="grid grid-cols-3 gap-4 w-full text-sm">
    //           <div className="text-center">
    //             <div className="font-semibold">Successful Attempts</div>
    //             <div className="text-2xl text-green-500 font-bold">24</div>
    //           </div>
    //           <div className="text-center">
    //             <div className="font-semibold">Total Actions</div>
    //             <div className="text-2xl font-bold">32</div>
    //           </div>
    //           <div className="text-center">
    //             <div className="font-semibold">Success Rate</div>
    //             <div className="text-2xl text-primary font-bold">75%</div>
    //           </div>
    //         </div>
    //       </CardContent>
    //     </Card>

    //     <Card>
    //       <CardHeader>
    //         <CardTitle>Vector Field Analysis</CardTitle>
    //       </CardHeader>
    //       <CardContent className="flex flex-col items-center space-y-4">
    //         <FootballPitch width={400} height={280} vectors={mockVectors} />
    //         <div className="grid grid-cols-2 gap-4 w-full text-sm">
    //           <div className="text-center">
    //             <div className="font-semibold">Progressive Vectors</div>
    //             <div className="text-2xl text-blue-500 font-bold">18</div>
    //           </div>
    //           <div className="text-center">
    //             <div className="font-semibold">Avg Vector Length</div>
    //             <div className="text-2xl font-bold">24m</div>
    //           </div>
    //         </div>
    //       </CardContent>
    //     </Card>
    //   </div>

    //   {/* Performance Metrics Grid */}
    //   <Card>
    //     <CardHeader>
    //       <CardTitle>Key Performance Metrics</CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    //         {performanceMetrics.map((metric, index) => (
    //           <MetricCard
    //             key={index}
    //             title={metric.label}
    //             value={metric.value}
    //             progress={metric.value}
    //             className="text-center"
    //           />
    //         ))}
    //       </div>
    //     </CardContent>
    //   </Card>
    // </div>
    <></>
  );
};

export default PlayerProfile;
