// src/components/Sfp/SfpModal.jsx
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export const SfpModal = ({ initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    vendor: "",
    model: "",
    specs: "",
    distance: "",
    serialNumber: "",
    status: "ЗИП",
    color: "",
    location: "",
    quantity: 1,
    technician: "Михеев В.Г.", // Значение по умолчанию, можно менять
    comment: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {initialData ? "Редактировать SFP модуль" : "Добавить SFP модуль"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Вендор *
              </label>
              <input
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Например: FANG HANG"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Модель *
              </label>
              <input
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Например: FH-SB5312CDS3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Характеристики
              </label>
              <input
                name="specs"
                value={formData.specs}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="1.25G SFP SC 1550/1310nm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дальность
              </label>
              <input
                name="distance"
                value={formData.distance}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="3km"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Серийный номер
              </label>
              <input
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="SN:FLU..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Статус *
              </label>
              <select
                name="status"
                value={formData.status || "ЗИП"}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="ЗИП">📦 ЗИП (Свободен на складе)</option>
                <option value="В работе">⚙️ В работе (Установлен)</option>
                <option value="Заказано">🚚 Заказано (Ожидается)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Цвет
              </label>
              <input
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="желтая, синяя..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Где находится *
              </label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="ЗИП в тумбочке"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Количество (шт.)
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Сотрудник
              </label>
              <input
                name="technician"
                value={formData.technician}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Комментарий
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Дополнительная информация..."
            />
          </div>

          {/* Кнопки */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              {initialData ? "Сохранить изменения" : "Добавить модуль"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SfpModal;
