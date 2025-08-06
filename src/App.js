import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Save, X, Wifi, Server, HardDrive } from 'lucide-react';
import * as XLSX from 'xlsx';

const App = () => {
const [switches, setSwitches] = useState(() => {
  const saved = localStorage.getItem('switches');
  const defaults = [
    {
      id: 1,
      name: 'Core Switch 1',
      model: 'Cisco Catalyst 9500',
      ip: '192.168.1.1',
      location: 'Серверная A',
      ports: 48,
      status: 'active',
      vendor: 'Cisco',
      purchaseDate: '2023-01-15',
      serialNumber: 'C9500-123456789',
      requestNumber: 'ЗЯ-001-2023',
      technician: 'Иванов А.А.'
    },
    {
      id: 2,
      name: 'Access Switch 2',
      model: 'Huawei S5720',
      ip: '192.168.1.2',
      location: 'Офис 2 этаж',
      ports: 24,
      status: 'active',
      vendor: 'Huawei',
      purchaseDate: '2023-03-22',
      serialNumber: 'S5720-987654321',
      requestNumber: 'ЗЯ-005-2023',
      technician: 'Петров С.В.'
    },
    {
      id: 3,
      name: 'Edge Switch 3',
      model: 'MikroTik CRS326',
      ip: '192.168.1.3',
      location: 'Конференц-зал',
      ports: 26,
      status: 'maintenance',
      vendor: 'MikroTik',
      purchaseDate: '2023-06-10',
      serialNumber: 'CRS326-ABC123',
      requestNumber: 'ЗЯ-012-2023',
      technician: ''
    }
  ];

  return saved ? JSON.parse(saved) : defaults;
});

// Сохраняем в localStorage при каждом изменении
useEffect(() => {
  localStorage.setItem('switches', JSON.stringify(switches));
}, [switches]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSwitch, setEditingSwitch] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    model: '',
    ip: '',
    location: '',
    ports: '',
    status: 'active',
    vendor: '',
    purchaseDate: '',
    serialNumber: '',
    requestNumber: '',
    technician: ''
  });

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    maintenance: 'bg-yellow-100 text-yellow-800',
    offline: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    active: 'Активен',
    maintenance: 'На складе',
    offline: 'Не в сети'
  };

  const vendorIcons = {
    Dlink: Server,
    Cisco: Server,
    Huawei: HardDrive,
    MikroTik: Wifi,
    Other: Server
  };

  useEffect(() => {
    if (editingSwitch) {
      setFormData(editingSwitch);
    } else {
      setFormData({
        name: '',
        model: '',
        ip: '',
        location: '',
        ports: '',
        status: 'active',
        vendor: '',
        purchaseDate: '',
        serialNumber: '',
        requestNumber: '',
        technician: ''
      });
    }
  }, [editingSwitch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      id: editingSwitch ? editingSwitch.id : Date.now(),
      ports: parseInt(formData.ports) || 0
    };

    if (editingSwitch) {
      setSwitches((prev) =>
        prev.map((s) => (s.id === editingSwitch.id ? updatedFormData : s))
      );
    } else {
      setSwitches((prev) => [...prev, updatedFormData]);
    }

    setIsModalOpen(false);
    setEditingSwitch(null);
  };

  const handleEdit = (switchItem) => {
    setEditingSwitch(switchItem);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setSwitches((prev) => prev.filter((s) => s.id !== id));
  };

const filteredSwitches = switches.filter((switchItem) => {
  const { name, model, ip, location, serialNumber, requestNumber, technician } = switchItem;
  const term = searchTerm.toLowerCase();

  // Проверка поиска
  const matchesSearch =
    name.toLowerCase().includes(term) ||
    model.toLowerCase().includes(term) ||
    ip.includes(searchTerm) ||
    location.toLowerCase().includes(term) ||
    (serialNumber && serialNumber.toString().toLowerCase().includes(term)) ||
    (requestNumber && requestNumber.toString().toLowerCase().includes(term)) ||
    (technician && technician.toString().toLowerCase().includes(term));

  // Проверка фильтра по статусу
  const matchesStatus = statusFilter === '' || switchItem.status === statusFilter;

  return matchesSearch && matchesStatus;
});

  const VendorIcon = ({ vendor }) => {
    const IconComponent = vendorIcons[vendor] || vendorIcons.Other;
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Учет неуправляемых коммутаторов</h1>
          <p className="text-gray-600">Система управления сетевым оборудованием</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Кнопки экспорта/импорта */}
<div className="flex flex-wrap gap-3 mt-4">
  <button
    type="button"
    onClick={() => {
      const dataStr = JSON.stringify(switches, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `switches-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }}
    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors duration-200 flex items-center gap-2"
  >
    <Save className="w-4 h-4" />
    Экспорт в JSON
  </button>

  <label className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg cursor-pointer transition-colors duration-200 flex items-center gap-2">
    <Search className="w-4 h-4" />
    Импорт из JSON
    <input
      type="file"
      accept=".json"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const json = JSON.parse(e.target?.result);
            if (Array.isArray(json)) {
              setSwitches(json);
              alert(`Успешно импортировано: ${json.length} коммутаторов`);
            } else {
              alert('Ошибка: файл должен содержать массив коммутаторов');
            }
          } catch (err) {
            alert('Ошибка чтения файла. Убедитесь, что это корректный JSON.');
          }
        };
        reader.readAsText(file);
      }}
    />
  </label>
</div>



            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Поиск по названию, модели, IP, серийному номеру, № заявки или сотруднику СЦ..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

{/* Фильтр по статусу */}
<div className="flex-1 max-w-xs">
  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
  >
    <option value="">Все статусы</option>
    <option value="active">Активен</option>
    <option value="maintenance">На складе</option>
    <option value="offline">Местонахождения неизвестно</option>
  </select>
</div>

            <button
              onClick={() => {
                setEditingSwitch(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
            >
              <Plus className="w-5 h-5" />
              Добавить коммутатор
            </button>

<button
  type="button"
  onClick={() => {
    // Подготовка данных для Excel
    const worksheetData = switches.map(s => ({
      'Название': s.name,
      'Модель': s.model,
      'IP-адрес': s.ip,
      'Местоположение': s.location,
      'Порты': s.ports,
      'Статус': { active: 'Активен', maintenance: 'На складе', offline: 'Местонахождения неизвестно' }[s.status],
      'Производитель': s.vendor,
      'Дата установки': s.purchaseDate,
      'Серийный номер': s.serialNumber || '',
      '№ заявки': s.requestNumber || '',
      'Сотрудник СЦ': s.technician || ''
    }));

    // Создаём рабочую книгу и лист
    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Коммутаторы');

    // Выгружаем файл
    XLSX.writeFile(wb, `Коммутаторы_${new Date().toISOString().slice(0,10)}.xlsx`);
  }}
  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors duration-200 flex items-center gap-2"
>
  <Save className="w-4 h-4" />
  Экспорт в Excel
</button>

          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Всего коммутаторов</p>
                <p className="text-3xl font-bold text-gray-800">{switches.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Server className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Активные</p>
                <p className="text-3xl font-bold text-green-600">
                  {switches.filter((s) => s.status === 'active').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Wifi className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">На складе</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {switches.filter((s) => s.status === 'maintenance').length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <HardDrive className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Switches List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Коммутатор</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Модель</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">IP адрес</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Местоположение</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Серийный №</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">№ заявки</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Сотрудник СЦ</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Порты</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Статус</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Производитель</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSwitches.map((switchItem) => (
                  <tr key={switchItem.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <VendorIcon vendor={switchItem.vendor} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{switchItem.name}</p>
                          <p className="text-sm text-gray-500">{switchItem.purchaseDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-700">{switchItem.model}</td>
                    <td className="py-4 px-6 text-gray-700 font-mono">{switchItem.ip}</td>
                    <td className="py-4 px-6 text-gray-700">{switchItem.location}</td>
                    <td className="py-4 px-6">
                      <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-sm font-mono">
                        {switchItem.serialNumber}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm font-medium">
                        {switchItem.requestNumber}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded text-sm font-medium">
                        {switchItem.technician || '—'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                        {switchItem.ports}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[switchItem.status]}`}>
                        {statusLabels[switchItem.status]}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                        {switchItem.vendor}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(switchItem)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(switchItem.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredSwitches.length === 0 && (
            <div className="text-center py-12">
              <Server className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Коммутаторы не найдены</p>
              <p className="text-gray-400">Попробуйте изменить параметры поиска</p>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingSwitch ? 'Редактировать коммутатор' : 'Добавить новый коммутатор'}
                  </h2>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingSwitch(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Название *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Модель *</label>
                    <input
                      type="text"
                      name="model"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.model}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">IP адрес *</label>
                    <input
                      type="text"
                      name="ip"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                      value={formData.ip}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Количество портов *</label>
                    <input
                      type="number"
                      name="ports"
                      required
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.ports}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Местоположение *</label>
                    <input
                      type="text"
                      name="location"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Производитель *</label>
                    <select
                      name="vendor"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.vendor}
                      onChange={handleInputChange}
                    >
                      <option value="">Выберите производителя</option>
                      <option value="Dlink">Dlink</option>
                      <option value="Cisco">Cisco</option>
                      <option value="Huawei">Huawei</option>
                      <option value="MikroTik">MikroTik</option>
                      <option value="Other">Другой</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Серийный номер *</label>
                    <input
                      type="text"
                      name="serialNumber"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                      value={formData.serialNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">№ заявки *</label>
                    <input
                      type="text"
                      name="requestNumber"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.requestNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Сотрудник СЦ</label>
                    <input
                      type="text"
                      name="technician"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.technician}
                      onChange={handleInputChange}
                      placeholder="Иванов А.А."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Статус</label>
                    <select
                      name="status"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="active">Активен</option>
                      <option value="maintenance">На складе</option>
                      <option value="offline">Местонахождения неизвестно</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Дата установки/проверки</label>
                    <input
                      type="date"
                      name="purchaseDate"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.purchaseDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {editingSwitch ? 'Сохранить изменения' : 'Добавить коммутатор'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingSwitch(null);
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;