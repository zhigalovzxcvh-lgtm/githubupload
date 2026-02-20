import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { MetricCard, ChartPanel, PanelType } from '@/types';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MetricCard | ChartPanel, type: PanelType) => void;
  initialData?: MetricCard | ChartPanel;
  initialType?: PanelType;
  isEditing?: boolean;
}

const availableIcons = [
  { value: 'Pickaxe', label: 'Кирка (добыча)' },
  { value: 'Ship', label: 'Корабль (экспорт)' },
  { value: 'Warehouse', label: 'Склад (запасы)' },
  { value: 'Users', label: 'Люди (работники)' },
  { value: 'Wallet', label: 'Кошелёк (зарплата)' },
  { value: 'ShieldCheck', label: 'Щит (безопасность)' },
  { value: 'BarChart3', label: 'График' },
  { value: 'Factory', label: 'Завод' },
  { value: 'Truck', label: 'Грузовик' },
  { value: 'Globe', label: 'Глобус' },
  { value: 'Zap', label: 'Молния (энергия)' },
  { value: 'Settings', label: 'Настройки' },
];

const defaultMetricData: MetricCard = {
  id: '',
  title: '',
  value: '',
  unit: '',
  growth: '',
  growthType: 'neutral',
  icon: 'BarChart3',
};

const defaultChartData: ChartPanel = {
  id: '',
  title: '',
  type: 'line',
  data: [
    { name: '2019', value: 0 },
    { name: '2020', value: 0 },
    { name: '2021', value: 0 },
    { name: '2022', value: 0 },
    { name: '2023', value: 0 },
  ],
};

export function EditModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData, 
  initialType = 'metric',
  isEditing = false 
}: EditModalProps) {
  const [activeTab, setActiveTab] = useState<PanelType>(initialType);
  const [metricData, setMetricData] = useState<MetricCard>(defaultMetricData);
  const [chartData, setChartData] = useState<ChartPanel>(defaultChartData);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialType);
      if (initialData) {
        if (initialType === 'metric') {
          setMetricData(initialData as MetricCard);
        } else {
          setChartData(initialData as ChartPanel);
        }
      } else {
        setMetricData({ ...defaultMetricData, id: Date.now().toString() });
        setChartData({ ...defaultChartData, id: Date.now().toString() });
      }
    }
  }, [isOpen, initialData, initialType]);

  const handleSave = () => {
    if (activeTab === 'metric') {
      onSave(metricData, 'metric');
    } else {
      onSave(chartData, 'chart');
    }
    onClose();
  };

  const updateChartDataPoint = (index: number, field: 'name' | 'value', value: string | number) => {
    const newData = [...chartData.data];
    newData[index] = { ...newData[index], [field]: value };
    setChartData({ ...chartData, data: newData });
  };

  const addChartDataPoint = () => {
    setChartData({
      ...chartData,
      data: [...chartData.data, { name: '', value: 0 }],
    });
  };

  const removeChartDataPoint = (index: number) => {
    if (chartData.data.length > 2) {
      const newData = chartData.data.filter((_, i) => i !== index);
      setChartData({ ...chartData, data: newData });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#1E3A5F]">
            {isEditing ? 'Редактировать панель' : 'Добавить панель'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as PanelType)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="metric">Карточка показателя</TabsTrigger>
            <TabsTrigger value="chart">График</TabsTrigger>
          </TabsList>

          <TabsContent value="metric" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Заголовок</Label>
              <Input
                id="title"
                value={metricData.title}
                onChange={(e) => setMetricData({ ...metricData, title: e.target.value })}
                placeholder="Например: Добыча угля"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">Значение</Label>
                <Input
                  id="value"
                  value={metricData.value}
                  onChange={(e) => setMetricData({ ...metricData, value: e.target.value })}
                  placeholder="Например: 435"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Единица измерения</Label>
                <Input
                  id="unit"
                  value={metricData.unit}
                  onChange={(e) => setMetricData({ ...metricData, unit: e.target.value })}
                  placeholder="Например: млн тонн"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="growth">Прирост/изменение</Label>
                <Input
                  id="growth"
                  value={metricData.growth}
                  onChange={(e) => setMetricData({ ...metricData, growth: e.target.value })}
                  placeholder="Например: +5.2%"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="growthType">Тип прироста</Label>
                <Select
                  value={metricData.growthType}
                  onValueChange={(v: 'positive' | 'negative' | 'neutral') => 
                    setMetricData({ ...metricData, growthType: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="positive">Положительный (зелёный)</SelectItem>
                    <SelectItem value="negative">Отрицательный (красный)</SelectItem>
                    <SelectItem value="neutral">Нейтральный (серый)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Иконка</Label>
              <Select
                value={metricData.icon}
                onValueChange={(v) => setMetricData({ ...metricData, icon: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableIcons.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value}>
                      {icon.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="chart" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="chartTitle">Заголовок графика</Label>
              <Input
                id="chartTitle"
                value={chartData.title}
                onChange={(e) => setChartData({ ...chartData, title: e.target.value })}
                placeholder="Например: Динамика добычи угля"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chartType">Тип графика</Label>
              <Select
                value={chartData.type}
                onValueChange={(v: 'line' | 'bar') => setChartData({ ...chartData, type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Линейный</SelectItem>
                  <SelectItem value="bar">Столбчатый</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Данные для графика</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addChartDataPoint}
                >
                  Добавить точку
                </Button>
              </div>
              <div className="space-y-2">
                {chartData.data.map((point, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      placeholder="Подпись (год, месяц)"
                      value={point.name}
                      onChange={(e) => updateChartDataPoint(index, 'name', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Значение"
                      value={point.value}
                      onChange={(e) => updateChartDataPoint(index, 'value', parseFloat(e.target.value) || 0)}
                      className="w-28"
                    />
                    {chartData.data.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeChartDataPoint(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-[#1E3A5F] hover:bg-[#152a45]"
          >
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
