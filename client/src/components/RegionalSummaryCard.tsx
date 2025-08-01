interface RegionalSummaryCardProps {
  region: string;
  data: {
    totalOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
    topCategories: string[];
  };
}

const regionConfig = {
  APAC: {
    name: 'Asia Pacific',
    currency: 'AUD',
    flag: '🇦🇺',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-900',
    indicatorColor: 'bg-blue-500',
    badgeColor: 'bg-blue-100 text-blue-800'
  },
  UK: {
    name: 'United Kingdom',
    currency: 'GBP',
    flag: '🇬🇧',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-900',
    indicatorColor: 'bg-green-500',
    badgeColor: 'bg-green-100 text-green-800'
  },
  US: {
    name: 'United States',
    currency: 'USD',
    flag: '🇺🇸',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-900',
    indicatorColor: 'bg-purple-500',
    badgeColor: 'bg-purple-100 text-purple-800'
  }
};

export default function RegionalSummaryCard({ region, data }: RegionalSummaryCardProps) {
  const config = regionConfig[region as keyof typeof regionConfig];
  
  if (!config) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    const currencySymbols = {
      AUD: '$',
      GBP: '£',
      USD: '$'
    };
    return `${currencySymbols[config.currency as keyof typeof currencySymbols]}${amount.toFixed(2)}M`;
  };

  const formatOrderValue = (amount: number) => {
    const currencySymbols = {
      AUD: '$',
      GBP: '£',
      USD: '$'
    };
    return `${currencySymbols[config.currency as keyof typeof currencySymbols]}${amount.toFixed(0)}K`;
  };

  return (
    <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-lg p-6 transition-all hover:shadow-lg`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{config.flag}</span>
          <div>
            <h3 className={`text-lg font-semibold tracking-tighter ${config.textColor}`}>
              {config.name}
            </h3>
            <p className="text-sm text-gray-600">{region}</p>
          </div>
        </div>
        <div className={`w-3 h-3 rounded-full ${config.indicatorColor}`}></div>
      </div>

      {/* Metrics */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Orders</span>
          <span className={`text-xl font-bold ${config.textColor}`}>
            {data.totalOrders.toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Revenue</span>
          <span className={`text-xl font-bold ${config.textColor}`}>
            {formatCurrency(data.totalRevenue)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Avg Order</span>
          <span className={`text-xl font-bold ${config.textColor}`}>
            {formatOrderValue(data.avgOrderValue)}
          </span>
        </div>
      </div>

      {/* Top Categories */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Top Categories</h4>
        <div className="flex flex-wrap gap-1">
          {data.topCategories.slice(0, 3).map((category, index) => (
            <span
              key={index}
              className={`px-2 py-1 text-xs rounded-full ${config.badgeColor}`}
            >
              {category}
            </span>
          ))}
          {data.topCategories.length > 3 && (
            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
              +{data.topCategories.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
