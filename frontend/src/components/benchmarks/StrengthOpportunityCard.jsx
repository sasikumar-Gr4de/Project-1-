import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const StrengthOpportunityCard = ({
  title,
  description,
  items = [],
  icon: Icon,
  gradient = "from-primary to-[#94D44A]",
  badgeClass = "bg-primary text-[#0F0F0E]",
  // type = "strength",
}) => {
  return (
    <Card className="bg-[#262626] border-[#343434]">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white flex items-center">
          <div
            className={`w-8 h-8 bg-linear-to-br ${gradient} rounded-lg flex items-center justify-center mr-3`}
          >
            <Icon className="w-4 h-4 text-white" />
          </div>
          {title}
        </CardTitle>
        <CardDescription className="text-placeholder">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 p-4 bg-black/60 rounded-xl border border-[#343434]"
          >
            <div
              className={`w-12 h-12 bg-linear-to-br ${
                item.gradient || gradient
              } rounded-xl flex items-center justify-center shrink-0`}
            >
              <item.icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-white">{item.title}</h4>
                <p className="text-sm text-placeholder mt-1">
                  {item.description}
                </p>
              </div>
              <div
                className={`${
                  item.badgeClass || badgeClass
                } font-bold font-['Orbitron'] ml-4 text-2xl`}
              >
                {item.improvement}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default StrengthOpportunityCard;
