// src/components/Sfp/SfpView.jsx
import { useState, useEffect, useMemo } from 'react';
import { api } from '../../services/api';
import { SfpTable } from './SfpTable';
import { SfpModal } from './SfpModal';
import { SfpHistory } from './SfpHistory';
import { Plus, Search, RotateCcw } from 'lucide-react';

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

  const handleSave = async (data) => {
    try {
      if (editingItem?.id) await api.updateSfp(editingItem.id, data);
      else await api.createSfp(data); // ✅ Сработает и для копий, т.к. id = undefined
      setIsModalOpen(false);
      setEditingItem(null);
      loadData();
    } catch (e) {
      console.error(e);
      alert('Ошибка сохранения');
    }
  };

  const handleEdit = (item) => { setEditingItem(item); setIsModalOpen(true); };

  // ✅ Логика копирования
  const handleCopy = (item) => {
    const { id, createdAt, updatedAt, history, documents, ...rest } = item;
    setEditingItem({ ...rest, quantity: 1 }); // Убираем ID, сбрасываем кол-во до 1
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Удалить этот SFP модуль?')) {
      try { await api.deleteSfp(id); loadData(); } 
      catch (e) { alert('Ошибка удаления'); }
    }
  };

  if (isLoading) return <div className="text-center py-12 text-gray-500">⏳ Загрузка...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-900 shrink-0">📡 Учёт SFP модулей и дата-кабелей</h2>
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
          <button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0">
            <Plus className="w-4 h-4" /> Добавить
          </button>
        </div>
      </div>

      <SfpTable
        items={filteredItems}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewHistory={(item) => setHistoryItem(item)}
        onCopy={handleCopy}  // ✅ Передаём обработчик копирования
      />

      {isModalOpen && (
        <SfpModal
          initialData={editingItem}
          onSubmit={handleSave}
          onClose={() => { setIsModalOpen(false); setEditingItem(null); }}
        />
      )}

      {historyItem && (
        <SfpHistory switchId={historyItem.id} switchName={`${historyItem.vendor} ${historyItem.model}`} onClose={() => setHistoryItem(null)} />
      )}
    </div>
  );
};

export default SfpView;