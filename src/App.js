import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Save, X, Wifi, Server, HardDrive, Paperclip, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

const App = () => {
  const [switches, setSwitches] = useState(() => {
    const saved = localStorage.getItem('switches');
    const defaults = [
  {
    "name": "DLINK (свитч)",
    "model": "DES-1008D",
    "ip": "неупр.",
    "location": "АБК ЦХП, каб. 219 (Харитонова О.М.)",
    "ports": 8,
    "status": "active",
    "vendor": "Dlink",
    "purchaseDate": "2025-05-29",
    "serialNumber": "QS42233001807",
    "requestNumber": "SR01385632",
    "technician": "Ковалев Д.С.",
    "id": 1754469579089,
    "documents": [
      {
        "name": "SR01385632.jpg",
        "path": "/uploads/1754556355043-SR01385632.jpg",
        "type": "image/jpeg",
        "size": 673516,
        "uploadDate": "2025-08-07T08:45:55.341Z"
      }
    ]
  },
  {
    "name": "DLINK (свитч)",
    "model": "DES-1008D",
    "ip": "неупр.",
    "location": "АБК ЦХП, каб. 219 (инж.2к. БУОП Кондакова В.А.)",
    "ports": 8,
    "status": "active",
    "vendor": "Dlink",
    "purchaseDate": "2025-06-09",
    "serialNumber": "QS42233001802",
    "requestNumber": "SR01406657",
    "technician": "Ковалев Д.С.",
    "id": 1754469773805,
    "documents": [
      {
        "name": "SR01406657.jpg",
        "path": "/uploads/1754556542873-SR01406657.jpg",
        "type": "image/jpeg",
        "size": 658962,
        "uploadDate": "2025-08-07T08:49:03.196Z"
      }
    ]
  },
  {
    "name": "DLINK (свитч)",
    "model": "DGS-1005A",
    "ip": "неупр.",
    "location": "АБК МЦ-2, каб. 2-20 (инж. по экспл. зданий Шаломанов М.Ю)",
    "ports": 5,
    "status": "active",
    "vendor": "Dlink",
    "purchaseDate": "2025-06-17",
    "serialNumber": "U8ED132045037",
    "requestNumber": "SR01416821",
    "technician": "Ковалев Д.С.",
    "id": 1754470014089,
    "documents": [
      {
        "name": "SR01416821.jpg",
        "path": "/uploads/1754557678074-SR01416821.jpg",
        "type": "image/jpeg",
        "size": 715968,
        "uploadDate": "2025-08-07T09:07:58.421Z"
      }
    ]
  },
  {
    "name": "DLINK (свитч)",
    "model": "DGS-1005A",
    "ip": "неупр.",
    "location": "(инж. ЦТК Лунёва Анаст. Вад.)",
    "ports": 5,
    "status": "active",
    "vendor": "Dlink",
    "purchaseDate": "2025-06-25",
    "serialNumber": "U8ED132045023",
    "requestNumber": "SR01431386",
    "technician": "Ковалев Д.С.",
    "id": 1754470216653,
    "documents": [
      {
        "name": "SR01431386.jpg",
        "path": "/uploads/1754557788422-SR01431386.jpg",
        "type": "image/jpeg",
        "size": 656188,
        "uploadDate": "2025-08-07T09:09:48.797Z"
      }
    ]
  },
  {
    "name": "DLINK (свитч)",
    "model": "DGS-1005A",
    "ip": "неупр.",
    "location": "АБК ЦХП, каб. 219 (вед. эксп. Агринская С.А.)",
    "ports": 5,
    "status": "active",
    "vendor": "Dlink",
    "purchaseDate": "2025-07-02",
    "serialNumber": "U8ED132045031",
    "requestNumber": "SR01444319",
    "technician": "Ковалев Д.С.",
    "id": 1754470451975,
    "documents": [
      {
        "name": "SR01444319.jpg",
        "path": "/uploads/1754557803763-SR01444319.jpg",
        "type": "image/jpeg",
        "size": 760384,
        "uploadDate": "2025-08-07T09:10:04.113Z"
      }
    ]
  },
  {
    "name": "DLINK (свитч)",
    "model": "DES-1008D",
    "ip": "неупр.",
    "location": "АБК ЦХП, каб. 227 (СЦ)",
    "ports": 8,
    "status": "active",
    "vendor": "Dlink",
    "purchaseDate": "2025-06-01",
    "serialNumber": "QS42233001806",
    "requestNumber": "для нужд СЦ",
    "technician": "Ковалев Д.С.",
    "id": 1754471730741,
    "documents": []
  },
  {
    "name": "DLINK (свитч)",
    "model": "DGS-1005A",
    "ip": "неупр.",
    "location": "(спец. 2р ОЛиТ Афанасьева Н.М.) ",
    "ports": 5,
    "status": "active",
    "vendor": "Dlink",
    "purchaseDate": "2025-07-10",
    "serialNumber": "U8ED132045035",
    "requestNumber": "SR01459599",
    "technician": "Ситьков В.Р.",
    "id": 1754474061216,
    "documents": [
      {
        "name": "SR01459599.jpg",
        "path": "/uploads/1754557844331-SR01459599.jpg",
        "type": "image/jpeg",
        "size": 718631,
        "uploadDate": "2025-08-07T09:10:44.675Z"
      }
    ]
  },
  {
    "name": "DLINK (свитч)",
    "model": "DGS-1005A",
    "ip": "неупр.",
    "location": "АБК МЦ-2, каб. 2.21 (вед. инж. ОГЭ Красиков Е.А.) ",
    "ports": 5,
    "status": "active",
    "vendor": "Dlink",
    "purchaseDate": "2025-07-23",
    "serialNumber": "U8ED132045040",
    "requestNumber": "SR01479156",
    "technician": "Михеев В.Г.",
    "id": 1754474257901,
    "documents": [
      {
        "name": "SR01479156.jpg",
        "path": "/uploads/1754557862360-SR01479156.jpg",
        "type": "image/jpeg",
        "size": 758609,
        "uploadDate": "2025-08-07T09:11:02.728Z"
      }
    ]
  },
  {
    "name": "DLINK (свитч)",
    "model": "DGS-1005A",
    "ip": "неупр.",
    "location": "АБК ТЭСЦ, 3 эт., акт. зал (нач. смены Тимофеев Н.С.)",
    "ports": 5,
    "status": "active",
    "vendor": "Dlink",
    "purchaseDate": "2025-07-24",
    "serialNumber": "U8ED132045027",
    "requestNumber": "SR01480283",
    "technician": "Михеев В.Г.",
    "id": 1754474380761,
    "documents": [
      {
        "name": "SR01480283.jpg",
        "path": "/uploads/1754557922647-SR01480283.jpg",
        "type": "image/jpeg",
        "size": 774410,
        "uploadDate": "2025-08-07T09:12:02.906Z"
      }
    ]
  },
  {
    "name": "DLINK (свитч)",
    "model": "DGS-1005A",
    "ip": "неупр.",
    "location": "АБК ТЭСЦ, 2 эт., каб. 212 (нач. бюро Сазонов А.Н.)",
    "ports": 5,
    "status": "active",
    "vendor": "Dlink",
    "purchaseDate": "2025-06-18",
    "serialNumber": "U8ED132045029",
    "requestNumber": "SR01420195",
    "technician": "Михеев В.Г.",
    "id": 1754474543581,
    "documents": [
      {
        "name": "SR01480283_2.jpg",
        "path": "/uploads/1754558037828-SR01480283_2.jpg",
        "type": "image/jpeg",
        "size": 1328554,
        "uploadDate": "2025-08-07T09:13:58.359Z"
      }
    ]
  },
  {
    "name": "DLINK (свитч)",
    "model": "DES-1008D",
    "ip": "неупр.",
    "location": "АБК ТЭСЦ, 3 эт., акт. зал, шкаф СКС",
    "ports": 8,
    "status": "active",
    "vendor": "Dlink",
    "purchaseDate": "2025-07-24",
    "serialNumber": "QS9G24B002097",
    "requestNumber": "SR01480283",
    "technician": "Михеев В.Г.",
    "id": 1754474705313,
    "documents": [
      {
        "name": "SR01480283_2.jpg",
        "path": "/uploads/1754558060125-SR01480283_2.jpg",
        "type": "image/jpeg",
        "size": 1328554,
        "uploadDate": "2025-08-07T09:14:20.663Z"
      }
    ]
  },
  {
    "name": "DLINK (свитч)",
    "model": "DGS-1005A",
    "ip": "неупр.",
    "location": "Склад (Калашникова Н.М.)",
    "ports": 5,
    "status": "active",
    "vendor": "Dlink",
    "purchaseDate": "2025-07-29",
    "serialNumber": "U8ED132045028",
    "requestNumber": "SR01487687",
    "technician": "Ковалев Д.С.",
    "id": 1754474830155,
    "documents": [
      {
        "name": "SR01487687.jpg",
        "path": "/uploads/1754558080914-SR01487687.jpg",
        "type": "image/jpeg",
        "size": 641146,
        "uploadDate": "2025-08-07T09:14:41.218Z"
      }
    ]
  },
  {
    "name": "DLINK (свитч)",
    "model": "DES-1008D",
    "ip": "неупр.",
    "location": "АБК ЦХП, каб. 219 (секрет. руковод. Попова А.А.)",
    "ports": 8,
    "status": "active",
    "vendor": "Dlink",
    "purchaseDate": "2025-07-29",
    "serialNumber": "QS9G24B002100",
    "requestNumber": "SR01488538",
    "technician": "Ковалев Д.С.",
    "id": 1754475223582,
    "documents": [
      {
        "name": "SR01488538.jpg",
        "path": "/uploads/1754558103466-SR01488538.jpg",
        "type": "image/jpeg",
        "size": 698828,
        "uploadDate": "2025-08-07T09:15:03.791Z"
      }
    ]
  },
  {
    "name": "DLINK (свитч)",
    "model": "DES-1008D",
    "ip": "неупр.",
    "location": "АБК ЦХП, каб. 227 (складирован)",
    "ports": 8,
    "status": "maintenance",
    "vendor": "Dlink",
    "purchaseDate": "2025-08-06",
    "serialNumber": "QS9G24B002096",
    "requestNumber": "---",
    "technician": "---",
    "id": 1754475496037,
    "documents": []
  },
  {
    "name": "DLINK (свитч)",
    "model": "DES-1008D",
    "ip": "неупр.",
    "location": "АБК ЦХП, каб. 227 (складирован)",
    "ports": 8,
    "status": "maintenance",
    "vendor": "Dlink",
    "purchaseDate": "2025-08-06",
    "serialNumber": "QS42233001810",
    "requestNumber": "---",
    "technician": "---",
    "id": 1754475581193,
    "documents": []
  },
  {
    "name": "DLINK (свитч)",
    "model": "DES-1008D",
    "ip": "неупр.",
    "location": "АБК ЦХП, каб. 227 (складирован)",
    "ports": 8,
    "status": "maintenance",
    "vendor": "Dlink",
    "purchaseDate": "2025-08-06",
    "serialNumber": "QS42233001801",
    "requestNumber": "---",
    "technician": "---",
    "id": 1754475621892,
    "documents": []
  },
  {
    "name": "DLINK (свитч)",
    "model": "DES-1008D",
    "ip": "неупр.",
    "location": "АБК ЦХП, каб. 227 (складирован)",
    "ports": 8,
    "status": "maintenance",
    "vendor": "Dlink",
    "purchaseDate": "2025-08-06",
    "serialNumber": "QS42233001809",
    "requestNumber": "---",
    "technician": "---",
    "id": 1754475654220,
    "documents": []
  },
  {
    "name": "DLINK (свитч)",
    "model": "DGS-1005D",
    "location": "Склад (Калашникова Н.М.)",
    "ports": 5,
    "status": "maintenance",
    "vendor": "Dlink",
    "purchaseDate": "2025-08-08",
    "serialNumber": "QS9F255001321",
    "requestNumber": "---",
    "technician": "Калашникова Н.М.",
    "documents": [],
    "id": 1754638844360
  },
  {
    "name": "DLINK (свитч)",
    "model": "DGS-1005D",
    "location": "Склад (Калашникова Н.М.)",
    "ports": 5,
    "status": "maintenance",
    "vendor": "Dlink",
    "purchaseDate": "2025-08-08",
    "serialNumber": "QS9F255001322",
    "requestNumber": "---",
    "technician": "Калашникова Н.М.",
    "documents": [],
    "id": 1754638900841
  },
  {
    "name": "DLINK (свитч)",
    "model": "DGS-1005D",
    "location": "Склад (Калашникова Н.М.)",
    "ports": 5,
    "status": "maintenance",
    "vendor": "Dlink",
    "purchaseDate": "2025-08-08",
    "serialNumber": "QS9F255001323",
    "requestNumber": "---",
    "technician": "Калашникова Н.М.",
    "documents": [],
    "id": 1754638910690
  },
  {
    "name": "DLINK (свитч)",
    "model": "DGS-1005D",
    "location": "Склад (Калашникова Н.М.)",
    "ports": 5,
    "status": "maintenance",
    "vendor": "Dlink",
    "purchaseDate": "2025-08-08",
    "serialNumber": "QS9F255001324",
    "requestNumber": "---",
    "technician": "Калашникова Н.М.",
    "documents": [],
    "id": 1754638917866
  },
  {
    "name": "DLINK (свитч)",
    "model": "DGS-1005D",
    "location": "Склад (Калашникова Н.М.)",
    "ports": 5,
    "status": "maintenance",
    "vendor": "Dlink",
    "purchaseDate": "2025-08-08",
    "serialNumber": "QS9F255001325",
    "requestNumber": "---",
    "technician": "Калашникова Н.М.",
    "documents": [],
    "id": 1754638924457
  },
  {
    "name": "DLINK (свитч)",
    "model": "DGS-1005D",
    "location": "Склад (Калашникова Н.М.)",
    "ports": 5,
    "status": "maintenance",
    "vendor": "Dlink",
    "purchaseDate": "2025-08-08",
    "serialNumber": "QS9F255001326",
    "requestNumber": "---",
    "technician": "Калашникова Н.М.",
    "documents": [],
    "id": 1754638931386
  },
  {
    "name": "DLINK (свитч)",
    "model": "DGS-1005D",
    "location": "Склад (Калашникова Н.М.)",
    "ports": 5,
    "status": "maintenance",
    "vendor": "Dlink",
    "purchaseDate": "2025-08-08",
    "serialNumber": "QS9F255001327",
    "requestNumber": "---",
    "technician": "Калашникова Н.М.",
    "documents": [],
    "id": 1754638938169
  },
  {
    "name": "DLINK (свитч)",
    "model": "DGS-1005D",
    "location": "Склад (Калашникова Н.М.)",
    "ports": 5,
    "status": "maintenance",
    "vendor": "Dlink",
    "purchaseDate": "2025-08-08",
    "serialNumber": "QS9F255001328",
    "requestNumber": "---",
    "technician": "Калашникова Н.М.",
    "documents": [],
    "id": 1754638944649
  },
  {
    "name": "DLINK (свитч)",
    "model": "DGS-1005D",
    "location": "Склад (Калашникова Н.М.)",
    "ports": 5,
    "status": "maintenance",
    "vendor": "Dlink",
    "purchaseDate": "2025-08-08",
    "serialNumber": "QS9F255001329",
    "requestNumber": "---",
    "technician": "Калашникова Н.М.",
    "documents": [],
    "id": 1754638955836
  },
  {
    "name": "DLINK (свитч)",
    "model": "DGS-1005D",
    "location": "Склад (Калашникова Н.М.)",
    "ports": 5,
    "status": "maintenance",
    "vendor": "Dlink",
    "purchaseDate": "2025-08-08",
    "serialNumber": "QS9F255001330",
    "requestNumber": "---",
    "technician": "Калашникова Н.М.",
    "documents": [],
    "id": 1754638963132
  },
  {
    "name": "DLINK (свитч)",
    "model": "DGS-1005A",
    "location": "АБК ЦХП, каб. 227 (складирован)",
    "ports": 5,
    "status": "maintenance",
    "vendor": "Dlink",
    "purchaseDate": "2025-08-08",
    "serialNumber": "UF01124021337",
    "requestNumber": "---",
    "technician": "---",
    "documents": [],
    "id": 1754656056687
  },
  {
    "name": "DLINK (свитч)",
    "model": "DGS-1005A",
    "location": "неизвестно",
    "ports": 5,
    "status": "offline",
    "vendor": "Dlink",
    "purchaseDate": "2025-08-08",
    "serialNumber": "UF01124012962",
    "requestNumber": "---",
    "technician": "---",
    "documents": [],
    "id": 1754656212097
  },
  {
    "name": "DLINK (свитч)",
    "model": "DGS-1005A",
    "location": "неизвестно",
    "ports": 5,
    "status": "offline",
    "vendor": "Dlink",
    "purchaseDate": "2025-08-08",
    "serialNumber": "UF01124012965",
    "requestNumber": "---",
    "technician": "---",
    "documents": [],
    "id": 1754656231409
  },
  {
    "name": "DLINK (свитч)",
    "model": "DGS-1005A",
    "location": "АБК ЦХП, каб. 208 (Мешков О.С.)",
    "ports": 5,
    "status": "active",
    "vendor": "Dlink",
    "purchaseDate": "2025-08-08",
    "serialNumber": "UF01124012967",
    "requestNumber": "---",
    "technician": "Мешков О.С.",
    "documents": [],
    "id": 1754889714705
  }
];

const data = saved ? JSON.parse(saved) : defaults;

  // Гарантируем, что у каждого коммутатора есть documents
   return data.map(item => ({
    ...item,
    documents: item.documents || []
  }));
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
    location: '',
    ports: '',
    status: 'active',
    vendor: '',
    purchaseDate: '',
    serialNumber: '',
    requestNumber: '',
    technician: '',
    documents: [] // <-- Новое поле
  });

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    maintenance: 'bg-yellow-100 text-yellow-800',
    offline: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    active: 'Активен',
    maintenance: 'На складе',
    offline: 'Место установки неизвестно'
  };

  const vendorIcons = {
    Dlink: Server,
    Cisco: Server,
    Huawei: HardDrive,
    MikroTik: Wifi,
    Other: Server
  };

  // Сброс формы при открытии/закрытии модалки
  useEffect(() => {
  if (editingSwitch) {
    setFormData({
      ...editingSwitch,
      documents: editingSwitch.documents || [] // ← гарантируем массив
    });
  } else {
    setFormData({
      name: '',
      model: '',
      location: '',
      ports: '',
      status: 'active',
      vendor: '',
      purchaseDate: '',
      serialNumber: '',
      requestNumber: '',
      technician: '',
      documents: [] // ← уже есть, но напоминаем
    });
  }
}, [editingSwitch]);


  // Обработчик выбора файлов
  const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    alert('Неподдерживаемый формат файла');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`http://10.182.62.50:5000/api/upload/${editingSwitch.id}`, {
  method: 'POST',
  body: formData
});

    const result = await response.json();
    if (response.ok) {
      setEditingSwitch(result); // обновляем текущий объект
      setSwitches(prev => prev.map(s => s.id === result.id ? result : s));
    } else {
      alert('Ошибка загрузки: ' + result.error);
    }
  } catch (err) {
    alert('Не удалось подключиться к серверу');
  }
};

  // Удаление прикреплённого файла
  const removeDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

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
    const { name, model, location, serialNumber, requestNumber, technician } = switchItem;
    const term = searchTerm.toLowerCase();

								  
    const matchesSearch =
      name.toLowerCase().includes(term) ||
      model.toLowerCase().includes(term) ||
      location.toLowerCase().includes(term) ||
      (serialNumber && serialNumber.toString().toLowerCase().includes(term)) ||
      (requestNumber && requestNumber.toString().toLowerCase().includes(term)) ||
      (technician && technician.toString().toLowerCase().includes(term));

														
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
                placeholder="Поиск по названию, модели, серийному номеру, № заявки или сотруднику СЦ..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

										
            <div className="flex-1 max-w-xs">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Все статусы</option>
                <option value="active">Активен</option>
                <option value="maintenance">На складе</option>
                <option value="offline">Место установки неизвестно</option>
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
      'Место установки': s.location,
      'Порты': s.ports,
      'Статус': { active: 'Активен', maintenance: 'На складе', offline: 'Место установки неизвестно' }[s.status],
      'Вендор': s.vendor,
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
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Место установки</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Серийный №</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">№ заявки</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Сотрудник СЦ</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Порты</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Статус</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Вендор</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Документы</th>
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
                      {switchItem.documents && switchItem.documents.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {switchItem.documents.map((doc, index) => (
                            <a
                              key={index}
                              href={`http://10.182.62.50:5000${doc.path}`}
                              download={doc.name}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
                            >
                              <Download className="w-4 h-4" />
                              {doc.name}
                            </a>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Нет</span>
                      )}
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
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-screen overflow-y-auto">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Место установки *</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Вендор *</label>
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
                      <option value="offline">Место установки неизвестно</option>
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
                  {/* Новое поле: Документы */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Документы</label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      multiple
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {formData.documents && formData.documents.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-sm font-medium text-gray-700">Прикреплённые файлы:</p>
                        <ul className="space-y-1">
                          {formData.documents.map((doc, index) => (
                            <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                              <span className="flex items-center gap-2 text-blue-600">
                                <Paperclip className="w-4 h-4" />
                                <a href={`http://10.182.62.50:5000${doc.path}`} download target="_blank">
                                    {doc.name}
                                </a>
                              </span>
                              <button
                                type="button"
                                onClick={() => removeDocument(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Удалить
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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