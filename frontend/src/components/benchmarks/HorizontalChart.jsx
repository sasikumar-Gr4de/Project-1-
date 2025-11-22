const HorizontalChart = ({ item }) => {
  return (
    <div className="flex flex-col items-start justify-center w-full">
      {/* Bar Label and Value */}
      <div className="flex justify-between items-center w-full mb-2">
        <div className="text-placeholder font-bold truncate">{item.label}</div>
        <div
          className={`text-lg font-bold font-['Orbitron'] ${item.textColor}`}
        >
          {item.value}%
        </div>
      </div>
      <div className={`w-full h-8 ${item.color} rounded-lg relative flex`}>
        {/* Rest of the chart (unfilled portion) */}
        <div
          className={`w-full h-full ${item.color} rounded-lg absolute top-0 left-0`}
        />
        <div
          className={`h-full bg-primary rounded-lg transition-all duration-1000 ease-out relative z-10`}
          style={{
            width: `${item.value}%`,
            minWidth: "4px",
          }}
        />
      </div>
    </div>
  );
};

export default HorizontalChart;
