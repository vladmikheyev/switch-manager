// src/components/Sfp/SfpView.jsx
import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { SfpTable } from "./SfpTable";
import { SfpModal } from "./SfpModal";
import { Plus } from "lucide-react";
import { SfpHistory } from "./SfpHistory";

export const SfpView = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [historyItem, setHistoryItem] = useState(null);

  // Загрузка данных
  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await api.getSfpList();

      // 🔍 ОТЛАДКА: посмотрите в F12 → Console, что именно пришло
      console.log("📡 Сырой ответ от /api/sfp:", res);

      // ✅ Безопасно извлекаем массив независимо от структуры ответа
      const list = res?.data?.data || res?.data || res || [];

      if (Array.isArray(list)) {
        setItems(list);
        console.log(`✅ В таблице теперь ${list.length} записей`);
      } else {
        console.warn("⚠️ Ответ не является массивом:", list);
        setItems([]);
      }
    } catch (e) {
      console.error("❌ Ошибка загрузки SFP:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Сохранение (создание или обновление)
  const handleSave = async (data) => {
    try {
      if (editingItem) {
        await api.updateSfp(editingItem.id, data);
      } else {
        await api.createSfp(data);
      }
      setIsModalOpen(false);
      setEditingItem(null);
      loadData(); // Обновляем таблицу
    } catch (e) {
      console.error(e);
      alert("Ошибка сохранения. Проверьте консоль (F12).");
    }
  };

  // Открытие формы редактирования
  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // Удаление
  const handleDelete = async (id) => {
    if (window.confirm("Вы уверены, что хотите удалить этот SFP модуль?")) {
      try {
        await api.deleteSfp(id);
        loadData();
      } catch (e) {
        alert("Ошибка удаления");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500">
        ⏳ Загрузка SFP модулей...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Верхняя панель */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Учёт SFP модулей
        </h2>
        <button
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" /> Добавить SFP
        </button>
      </div>

      {/* Таблица */}
      <SfpTable
        items={items}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewHistory={(item) => setHistoryItem(item)} // Пока выводим в консоль
      />

      {/* Модальное окно */}
      {isModalOpen && (
        <SfpModal
          initialData={editingItem}
          onSubmit={handleSave}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
        />
      )}
      {historyItem && (
        <SfpHistory
          switchId={historyItem.id}
          switchName={`${historyItem.vendor} ${historyItem.model}`}
          onClose={() => setHistoryItem(null)}
        />
      )}
      {historyItem && (
        <SfpHistory
          switchId={historyItem.id}
          switchName={`${historyItem.vendor} ${historyItem.model}`}
          onClose={() => setHistoryItem(null)}
        />
      )}
    </div>
  );
};

export default SfpView;
