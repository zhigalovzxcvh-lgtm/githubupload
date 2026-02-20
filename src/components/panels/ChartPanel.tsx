import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, TrendingUp } from 'lucide-react';
import type { ChartPanel as ChartPanelType } from '@/types';

interface ChartPanelProps {
  data: ChartPanelType;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ChartPanelComponent({ data, onEdit, onDelete }: ChartPanelProps) {
  return (
    <Card 
      className="relative group bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
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
            <TrendingUp className="w-5 h-5 text-[#1E3A5F]" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 pr-16">{data.title}</h3>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {data.type === 'line' ? (
              <LineChart data={data.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#757575"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#757575"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E0E0E0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#1E3A5F" 
                  strokeWidth={2}
                  dot={{ fill: '#1E3A5F', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#2E7D32' }}
                />
              </LineChart>
            ) : (
              <BarChart data={data.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#757575"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#757575"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E0E0E0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#1E3A5F"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
