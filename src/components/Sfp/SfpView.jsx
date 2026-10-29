// src/components/Sfp/SfpView.jsx
import { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { api } from '../../services/api';
import { SfpTable } from './SfpTable';
import { SfpModal } from './SfpModal';
import { SfpHistory } from './SfpHistory';
import { Plus, Search, RotateCcw, FileSpreadsheet, FileJson } from 'lucide-react';

export const SfpView = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [historyItem, setHistoryItem] = useState(null);
  
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await api.getSfpList();
      const list = res?.data?.data || res?.data || res || [];
      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error('❌ Ошибка загрузки SFP:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const filteredItems = useMemo(() => {
    let result = items;
    if (statusFilter !== 'all') result = result.filter(item => item.status === statusFilter);
    const term = searchTerm.toLowerCase().trim();
    if (term) {
      result = result.filter(item => 
        [item.vendor, item.model, item.specs, item.serialNumber, item.location, item.color, item.comment]
          .some(field => field?.toLowerCase().includes(term))
      );
    }
    return result;
  }, [items, statusFilter, searchTerm]);

  // ✅ Подсчёт физического количества (сумма поля quantity)
  const visibleQuantity = useMemo(() => 
    filteredItems.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0),
    [filteredItems]
  );

  const totalQuantity = useMemo(() => 
    items.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0),
    [items]
  );

  // ✅ ЭКСПОРТ В EXCEL
  const exportToExcel = () => {
    if (filteredItems.length === 0) return alert('Нет данных для выгрузки');
    const dateStr = new Date().toISOString().slice(0, 10);
    const flatData = filteredItems.map(item => ({
      'Вендор': item.vendor || '', 'Модель': item.model || '', 'Характеристики': item.specs || '',
      'Дальность': item.distance || '', 'Серийный номер': item.serialNumber || '', 'Статус': item.status || '',
      'Цвет': item.color || '', 'Где находится': item.location || '', 'Количество (шт)': item.quantity || 0, 'Комментарий': item.comment || ''
    }));
    const ws = XLSX.utils.json_to_sheet(flatData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SFP Modules');
    XLSX.writeFile(wb, `sfp-export-${dateStr}.xlsx`);
  };

  // ✅ ЭКСПОРТ В JSON
  const exportToJson = () => {
    if (filteredItems.length === 0) return alert('Нет данных для выгрузки');
    const dateStr = new Date().toISOString().slice(0, 10);
    const blob = new Blob([JSON.stringify(filteredItems, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sfp-export-${dateStr}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSave = async (data) => {
    try {
      if (editingItem?.id) await api.updateSfp(editingItem.id, data);
      else await api.createSfp(data);
      setIsModalOpen(false); setEditingItem(null); loadData();
    } catch (e) { console.error(e); alert('Ошибка сохранения'); }
  };

  const handleEdit = (item) => { setEditingItem(item); setIsModalOpen(true); };
  const handleCopy = (item) => {
    const { id, createdAt, updatedAt, history, documents, ...rest } = item;
    setEditingItem({ ...rest, quantity: 1 }); setIsModalOpen(true);
  };
  const handleDelete = async (id) => {
    if (window.confirm('Удалить этот SFP модуль?')) {
      try { await api.deleteSfp(id); loadData(); } catch (e) { alert('Ошибка удаления'); }
    }
  };

  if (isLoading) return <div className="text-center py-12 text-gray-500">⏳ Загрузка...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* ✅ КОМПАКТНЫЙ ХЕДЕР */}
      <div className="p-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
        
        {/* Заголовок + Умный счётчик штук */}
        <div className="flex items-center gap-3 shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">📡 Учёт SFP модулей</h2>
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition-colors ${
            (searchTerm || statusFilter !== 'all') 
              ? 'bg-blue-50 text-blue-700 border-blue-200' 
              : 'bg-gray-100 text-gray-700 border-gray-200'
          }`}>
            {visibleQuantity} шт.
            {(searchTerm || statusFilter !== 'all') && (
              <span className="text-blue-400 ml-1">/ {totalQuantity}</span>
            )}
          </span>
        </div>

        {/* Контролы справа */}
        <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
          <div className="relative w-48 lg:w-64 shrink-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Поиск по вендору, модели, S/N..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 bg-white outline-none whitespace-nowrap">
            <option value="all">📋 Все</option>
            <option value="ЗИП">📦 ЗИП</option>
            <option value="В работе">⚙️ В работе</option>
            <option value="Заказано">🚚 Заказано</option>
          </select>
          {(searchTerm || statusFilter !== 'all') && (
            <button onClick={() => { setSearchTerm(''); setStatusFilter('all'); }} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors shrink-0" title="Сбросить фильтры">
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          <button onClick={exportToExcel} className="flex items-center gap-1 px-2.5 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition shrink-0" title="Выгрузить в Excel">
            <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
          </button>
          <button onClick={exportToJson} className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-600 text-white text-xs font-medium rounded hover:bg-gray-700 transition shrink-0" title="Выгрузить в JSON">
            <FileJson className="w-3.5 h-3.5" /> JSON
          </button>
          <button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0">
            <Plus className="w-4 h-4" /> Добавить
          </button>
        </div>
      </div>

      <SfpTable items={filteredItems} onEdit={handleEdit} onDelete={handleDelete} onViewHistory={(item) => setHistoryItem(item)} onCopy={handleCopy} />

      {isModalOpen && <SfpModal initialData={editingItem} onSubmit={handleSave} onClose={() => { setIsModalOpen(false); setEditingItem(null); }} />}
      {historyItem && <SfpHistory switchId={historyItem.id} switchName={`${historyItem.vendor} ${historyItem.model}`} onClose={() => setHistoryItem(null)} />}
    </div>
  );
};

export default SfpView;