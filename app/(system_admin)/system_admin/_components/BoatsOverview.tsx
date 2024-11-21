// components/BoatsOverview.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Ship, Download, Upload, Clock } from "lucide-react";

const BoatsOverview = () => {
  const statuses = [
    { label: "On the way", time: "2hr 10min", percentage: 39.7, icon: Ship },
    { label: "Unloading", time: "3hr 15min", percentage: 28.3, icon: Download },
    { label: "Loading", time: "1hr 24min", percentage: 17.4, icon: Upload },
    { label: "Waiting", time: "5hr 19min", percentage: 14.6, icon: Clock },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Boats Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex h-4 rounded-full overflow-hidden">
            <div className="bg-blue-500" style={{ width: "39.7%" }} />
            <div className="bg-indigo-500" style={{ width: "28.3%" }} />
            <div className="bg-cyan-500" style={{ width: "17.4%" }} />
            <div className="bg-gray-700" style={{ width: "14.6%" }} />
          </div>
        </div>

        {/* Status List */}
        <div className="space-y-4">
          {statuses.map((status, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <status.icon size={16} />
                <span>{status.label}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-500">{status.time}</span>
                <span className="w-16 text-right">{status.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BoatsOverview;
