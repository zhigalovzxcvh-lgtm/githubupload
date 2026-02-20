import { useState, useEffect } from 'react';
import { Plus, Download, Upload, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetricCardComponent } from '@/components/panels/MetricCard';
import { ChartPanelComponent } from '@/components/panels/ChartPanel';
import { EditModal } from '@/components/EditModal';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { Panel, PanelType, MetricCard, ChartPanel } from '@/types';
import './App.css';

const defaultPanels: Panel[] = [
  {
    id: '1',
    type: 'metric',
    data: {
      id: '1',
      title: 'Добыча угля',
      value: '435',
      unit: 'млн тонн',
      growth: '+2.3%',
      growthType: 'positive',
      icon: 'Pickaxe',
    },
  },
  {
    id: '2',
    type: 'metric',
    data: {
      id: '2',
      title: 'Экспорт угля',
      value: '210',
      unit: 'млн тонн',
      growth: '+8.5%',
      growthType: 'positive',
      icon: 'Ship',
    },
  },
  {
    id: '3',
    type: 'metric',
    data: {
      id: '3',
      title: 'Запасы угля',
      value: '275',
      unit: 'млрд тонн',
      growth: '0%',
      growthType: 'neutral',
      icon: 'Warehouse',
    },
  },
  {
    id: '4',
    type: 'metric',
    data: {
      id: '4',
      title: 'Численность работников',
      value: '125',
      unit: 'тыс. чел.',
      growth: '-1.2%',
      growthType: 'negative',
      icon: 'Users',
    },
  },
  {
    id: '5',
    type: 'metric',
    data: {
      id: '5',
      title: 'Средняя зарплата',
      value: '85 400',
      unit: 'руб.',
      growth: '+5.7%',
      growthType: 'positive',
      icon: 'Wallet',
    },
  },
  {
    id: '6',
    type: 'metric',
    data: {
      id: '6',
      title: 'Уровень травматизма',
      value: '0.42',
      unit: 'на 1 млн чел.-часов',
      growth: '-12%',
      growthType: 'positive',
      icon: 'ShieldCheck',
    },
  },
  {
    id: '7',
    type: 'chart',
    data: {
      id: '7',
      title: 'Динамика добычи угля (2019-2023)',
      type: 'line',
      data: [
        { name: '2019', value: 441 },
        { name: '2020', value: 401 },
        { name: '2021', value: 438 },
        { name: '2022', value: 427 },
        { name: '2023', value: 435 },
      ],
    },
  },
  {
    id: '8',
    type: 'chart',
    data: {
      id: '8',
      title: 'Структура экспорта угля по странам',
      type: 'bar',
      data: [
        { name: 'Китай', value: 85 },
        { name: 'Турция', value: 32 },
        { name: 'Ю. Корея', value: 28 },
        { name: 'Япония', value: 24 },
        { name: 'ЕС', value: 18 },
      ],
    },
  },
];

function App() {
  const [panels, setPanels] = useLocalStorage<Panel[]>('coal-dashboard-panels', defaultPanels);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPanel, setEditingPanel] = useState<Panel | null>(null);
  const [deletingPanelId, setDeletingPanelId] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    const now = new Date();
    setLastUpdate(now.toLocaleString('ru-RU'));
  }, [panels]);

  const handleAddPanel = () => {
    setEditingPanel(null);
    setIsModalOpen(true);
  };

  const handleEditPanel = (id: string) => {
    const panel = panels.find((p) => p.id === id);
    if (panel) {
      setEditingPanel(panel);
      setIsModalOpen(true);
    }
  };

  const handleDeletePanel = (id: string) => {
    setDeletingPanelId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingPanelId) {
      setPanels((prev) => prev.filter((p) => p.id !== deletingPanelId));
      setDeletingPanelId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSavePanel = (data: MetricCard | ChartPanel, type: PanelType) => {
    if (editingPanel) {
      setPanels((prev) =>
        prev.map((p) =>
          p.id === editingPanel.id ? { ...p, type, data } : p
        )
      );
    } else {
      const newPanel: Panel = {
        id: Date.now().toString(),
        type,
        data: { ...data, id: Date.now().toString() },
      };
      setPanels((prev) => [...prev, newPanel]);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(panels, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `coal-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedPanels = JSON.parse(e.target?.result as string);
          if (Array.isArray(importedPanels)) {
            setPanels(importedPanels);
          }
        } catch (error) {
          alert('Ошибка при импорте файла');
        }
      };
      reader.readAsText(file);
    }
    event.target.value = '';
  };

  const handleReset = () => {
    if (confirm('Вы уверены, что хотите сбросить все данные к значениям по умолчанию?')) {
      setPanels(defaultPanels);
    }
  };

  const metricPanels = panels.filter((p) => p.type === 'metric');
  const chartPanels = panels.filter((p) => p.type === 'chart');

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1E3A5F]">
                Аналитическая панель
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Угольная промышленность России
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
                id="import-file"
              />
              <label htmlFor="import-file">
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  asChild
                >
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Импорт
                  </span>
                </Button>
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
              >
                <Download className="w-4 h-4 mr-2" />
                Экспорт
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Сброс
              </Button>
              <Button
                onClick={handleAddPanel}
                className="bg-[#1E3A5F] hover:bg-[#152a45]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Добавить панель
              </Button>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Последнее обновление: {lastUpdate}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {metricPanels.map((panel) => (
            <MetricCardComponent
              key={panel.id}
              data={panel.data as MetricCard}
              onEdit={handleEditPanel}
              onDelete={handleDeletePanel}
            />
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {chartPanels.map((panel) => (
            <ChartPanelComponent
              key={panel.id}
              data={panel.data as ChartPanel}
              onEdit={handleEditPanel}
              onDelete={handleDeletePanel}
            />
          ))}
        </div>

        {/* Empty State */}
        {panels.length === 0 && (
          <div className="text-center py-16">
            <div className="p-4 rounded-full bg-gray-100 inline-block mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Нет добавленных панелей
            </h3>
            <p className="text-gray-500 mb-4">
              Нажмите кнопку "Добавить панель", чтобы начать
            </p>
            <Button
              onClick={handleAddPanel}
              className="bg-[#1E3A5F] hover:bg-[#152a45]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Добавить панель
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-500">
            <p>© 2024 Аналитическая панель угольной промышленности</p>
            <p>В стиле Минэнерго России</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePanel}
        initialData={editingPanel?.data}
        initialType={editingPanel?.type || 'metric'}
        isEditing={!!editingPanel}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="эту панель"
      />
    </div>
  );
}

export default App;
