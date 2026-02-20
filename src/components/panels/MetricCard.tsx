import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Pickaxe, 
  Ship, 
  Warehouse, 
  Users, 
  Wallet, 
  ShieldCheck,
  BarChart3,
  Factory,
  Truck,
  Globe,
  Zap,
  Settings,
  Pencil,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { MetricCard as MetricCardType } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  Pickaxe,
  Ship,
  Warehouse,
  Users,
  Wallet,
  ShieldCheck,
  BarChart3,
  Factory,
  Truck,
  Globe,
  Zap,
  Settings,
};

interface MetricCardProps {
  data: MetricCardType;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function MetricCardComponent({ data, onEdit, onDelete }: MetricCardProps) {
  const Icon = iconMap[data.icon] || BarChart3;
  
  const getGrowthColor = () => {
    switch (data.growthType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  const getGrowthIcon = () => {
    switch (data.growthType) {
      case 'positive':
        return <TrendingUp className="w-4 h-4" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  return (
    <Card className="relative group bg-white border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-500 hover:text-[#1E3A5F] hover:bg-blue-50"
          onClick={() => onEdit(data.id)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => onDelete(data.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#1E3A5F]/10">
            <Icon className="w-5 h-5 text-[#1E3A5F]" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 pr-16">{data.title}</h3>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">{data.value}</span>
          <span className="text-sm text-gray-500">{data.unit}</span>
        </div>
        
        <div className={`flex items-center gap-1 mt-2 text-sm ${getGrowthColor()}`}>
          {getGrowthIcon()}
          <span className="font-medium">{data.growth}</span>
        </div>
      </CardContent>
    </Card>
  );
}
