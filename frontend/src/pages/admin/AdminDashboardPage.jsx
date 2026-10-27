import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RevenueCharts from '../../components/features/reports/RevenueCharts';
import ExportReportButtons from '../../components/features/reports/ExportReportButtons';
import { isDemoMode } from '../../utils/constants';

export const AdminDashboardPage = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('tab-dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Filters & Search
  const [eventFilter, setEventFilter] = useState('ALL');
  const [eventTypeFilter, setEventTypeFilter] = useState('ALL');
  const [customerFilter, setCustomerFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals visibility state
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showDishModal, setShowDishModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showVenueModal, setShowVenueModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedPaymentReceipt, setSelectedPaymentReceipt] = useState(null);
  const [showContractDetailModal, setShowContractDetailModal] = useState(false);
  const [selectedContractDetail, setSelectedContractDetail] = useState(null);

  // Venue CRUD State
  const [editingVenueId, setEditingVenueId] = useState(null);
  const [venueSearchTerm, setVenueSearchTerm] = useState('');
  const [venueStatusFilter, setVenueStatusFilter] = useState('ALL');
  const [venueFormData, setVenueFormData] = useState({
    name: '',
    capacity: '300 khách',
    price: '4500000',
    address: 'GEM Center, Q.1',
    status: 'Sẵn sàng',
    desc: '',
  });

  const handleOpenAddVenue = () => {
    setEditingVenueId(null);
    setVenueFormData({
      name: '',
      capacity: '300 khách',
      price: '4500000',
      address: 'GEM Center, Q.1',
      status: 'Sẵn sàng',
      desc: '',
    });
    setShowVenueModal(true);
  };

  const handleEditVenue = (v) => {
    setEditingVenueId(v.id);
    setVenueFormData({
      name: v.name,
      capacity: v.capacity,
      price: String(v.price || 0),
      address: v.address || 'TP. Hồ Chí Minh',
      status: v.status || 'Sẵn sàng',
      desc: v.desc || '',
    });
    setShowVenueModal(true);
  };

  const handleDeleteVenue = (id) => {
    const target = venues.find((v) => v.id === id);
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa sảnh tiệc "${target?.name || id}"?`);
    if (confirmDelete) {
      setVenues((prev) => prev.filter((v) => v.id !== id));
      showToast(`Đã xóa sảnh tiệc #${id} thành công!`, 'success');
    }
  };

  const handleSaveVenue = (e) => {
    e.preventDefault();
    if (!venueFormData.name.trim()) {
      alert('Vui lòng nhập tên sảnh tiệc!');
      return;
    }

    if (editingVenueId) {
      setVenues((prev) =>
        prev.map((v) => {
          if (v.id === editingVenueId) {
            return {
              ...v,
              name: venueFormData.name,
              capacity: venueFormData.capacity,
              price: Number(venueFormData.price) || 0,
              address: venueFormData.address,
              status: venueFormData.status,
              desc: venueFormData.desc,
            };
          }
          return v;
        })
      );
      showToast('Cập nhật sảnh tiệc thành công!', 'success');
    } else {
      const newId = `S-0${venues.length + 1}`;
      const newVenue = {
        id: newId,
        name: venueFormData.name,
        capacity: venueFormData.capacity || '200 khách',
        price: Number(venueFormData.price) || 0,
        address: venueFormData.address || 'TP. Hồ Chí Minh',
        status: venueFormData.status || 'Sẵn sàng',
        desc: venueFormData.desc,
      };
      setVenues((prev) => [newVenue, ...prev]);
      showToast('Thêm sảnh tiệc mới thành công!', 'success');
    }
    setShowVenueModal(false);
  };

  // Task CRUD State
  const [tasks, setTasks] = useState([
    {
      id: 'TK-01',
      name: 'Kiểm tra hệ thống âm thanh Line Array & Soundcheck',
      event: 'Liveshow Âm Nhạc Đêm Hội Mùa Thu',
      assignee: 'Trần Quốc Huy (Kỹ thuật)',
      deadline: '2026-11-05 14:00',
      progress: 80,
      status: 'Đang thực hiện',
      notes: 'Yêu cầu kiểm tra kỹ mic không dây và mixer kỹ thuật số',
    },
    {
      id: 'TK-02',
      name: 'Chốt danh sách bàn tiệc & Set Menu Kim Cương VIP',
      event: 'Tiệc Cưới Hoàng Gia - Anh Minh & Chị Mai',
      assignee: 'Lê Thu Trang (Điều phối)',
      deadline: '2026-10-12 18:00',
      progress: 100,
      status: 'Đã hoàn thành',
      notes: 'Đã đối chiếu với phía đại diện gia đình cô dâu chú rể',
    },
    {
      id: 'TK-03',
      name: 'Lắp ráp backdrop chụp ảnh & Màn hình LED 4K sân khấu',
      event: 'Gala Kỷ Niệm 10 Năm TechCorp',
      assignee: 'Nguyễn Hữu Nam (Sân khấu)',
      deadline: '2026-10-19 12:00',
      progress: 40,
      status: 'Đang tiến hành',
      notes: 'Đã tập kết vật tư tại sảnh White Palace',
    },
  ]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [taskFilter, setTaskFilter] = useState('ALL');
  const [taskSearchTerm, setTaskSearchTerm] = useState('');
  const [taskFormData, setTaskFormData] = useState({
    name: '',
    event: '',
    assignee: '',
    deadline: '2026-10-25T18:00',
    progress: 0,
    status: 'Đang thực hiện',
    notes: '',
  });

  const handleOpenAddTask = () => {
    setEditingTaskId(null);
    setTaskFormData({
      name: '',
      event: events[0]?.title || 'Tiệc Cưới Hoàng Gia - Anh Minh & Chị Mai',
      assignee: 'Trần Quốc Huy (Kỹ thuật)',
      deadline: '2026-10-25T18:00',
      progress: 0,
      status: 'Đang thực hiện',
      notes: '',
    });
    setShowTaskModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setTaskFormData({
      name: task.name,
      event: task.event,
      assignee: task.assignee,
      deadline: task.deadline ? task.deadline.replace(' ', 'T') : '2026-10-25T18:00',
      progress: task.progress || 0,
      status: task.status,
      notes: task.notes || '',
    });
    setShowTaskModal(true);
  };

  const handleDeleteTask = (id) => {
    const target = tasks.find((t) => t.id === id);
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa công việc "${target?.name || id}"?`);
    if (confirmDelete) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      showToast(`Đã xóa công việc #${id} thành công!`, 'success');
    }
  };

  const handleSaveTask = (e) => {
    e.preventDefault();
    if (!taskFormData.name.trim()) {
      alert('Vui lòng nhập tên công việc!');
      return;
    }

    if (editingTaskId) {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === editingTaskId) {
            return {
              ...t,
              name: taskFormData.name,
              event: taskFormData.event,
              assignee: taskFormData.assignee,
              deadline: taskFormData.deadline ? taskFormData.deadline.replace('T', ' ') : t.deadline,
              progress: Number(taskFormData.progress) || 0,
              status: taskFormData.status,
              notes: taskFormData.notes,
            };
          }
          return t;
        })
      );
      showToast('Cập nhật công việc thành công!', 'success');
    } else {
      const newId = `TK-0${tasks.length + 1}`;
      const newTask = {
        id: newId,
        name: taskFormData.name,
        event: taskFormData.event || (events[0]?.title || 'Sự kiện nội bộ'),
        assignee: taskFormData.assignee || 'Điều phối viên',
        deadline: taskFormData.deadline ? taskFormData.deadline.replace('T', ' ') : '2026-10-25 18:00',
        progress: Number(taskFormData.progress) || 0,
        status: taskFormData.status,
        notes: taskFormData.notes,
      };
      setTasks((prev) => [newTask, ...prev]);
      showToast('Thêm công việc mới thành công!', 'success');
    }
    setShowTaskModal(false);
  };

  // Event CRUD State
  const [editingEventId, setEditingEventId] = useState(null);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    client: '',
    type: 'Tiệc cưới',
    date: '2026-10-25T18:00',
    budget: '150000000',
    location: '',
    status: 'Đã xác nhận',
  });

  // Customer CRUD State
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [customerFormData, setCustomerFormData] = useState({
    name: '',
    phone: '',
    email: '',
    tier: 'VIP',
    totalSpent: '150000000',
    notes: '',
  });

  // Contract CRUD & Wizard State
  const [editingContractId, setEditingContractId] = useState(null);
  const [contractFilter, setContractFilter] = useState('ALL');
  const [contractSearchTerm, setContractSearchTerm] = useState('');
  const [contractStep, setContractStep] = useState(1);
  const [contractCustomer, setContractCustomer] = useState('');
  const [contractEvent, setContractEvent] = useState('');
  const [contractDate, setContractDate] = useState('2026-10-15');
  const [contractSelectedMenu, setContractSelectedMenu] = useState('');
  const [contractSelectedServices, setContractSelectedServices] = useState([]);
  const [contractFormData, setContractFormData] = useState({
    customer: '',
    event: '',
    total: '150000000',
    status: 'Chờ duyệt',
    date: '2026-10-15',
    notes: '',
  });

  // Payment CRUD & Receipt State
  const [payments, setPayments] = useState([
    {
      id: 'TT-901',
      contractId: 'HD-2026-001',
      customer: 'Nguyễn Văn Minh',
      amount: 66000000,
      method: 'Chuyển khoản (Vietcombank)',
      date: '2026-10-02',
      phase: 'Đặt cọc 30%',
      status: 'Đã thanh toán',
      notes: 'Đã nhận đủ tiền cọc đợt 1 qua VCB STK ...8888',
    },
    {
      id: 'TT-902',
      contractId: 'HD-2026-003',
      customer: 'Lê Thị Hồng',
      amount: 96000000,
      method: 'Chuyển khoản (BIDV)',
      date: '2026-10-08',
      phase: 'Đặt cọc 30%',
      status: 'Đã thanh toán',
      notes: 'Tiền cọc cho liveshow âm nhạc',
    },
    {
      id: 'TT-903',
      contractId: 'HD-2026-002',
      customer: 'Trần Văn Nam',
      amount: 93000000,
      method: 'Chuyển khoản doanh nghiệp',
      date: '2026-10-10',
      phase: 'Đặt cọc 30%',
      status: 'Chờ xác nhận',
      notes: 'UNC TechCorp gửi sang kế toán đang đối soát',
    },
  ]);
  const [editingPaymentId, setEditingPaymentId] = useState(null);
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [paymentSearchTerm, setPaymentSearchTerm] = useState('');
  const [paymentFormData, setPaymentFormData] = useState({
    contractId: 'HD-2026-001',
    customer: 'Nguyễn Văn Minh',
    amount: '66000000',
    method: 'Chuyển khoản (Vietcombank)',
    phase: 'Đặt cọc 30%',
    status: 'Đã thanh toán',
    date: '2026-10-10',
    notes: '',
  });

  // Revenue Report Filters State
  const [reportPeriod, setReportPeriod] = useState('ALL');
  const [reportStatusFilter, setReportStatusFilter] = useState('ALL');
  const [reportSearchTerm, setReportSearchTerm] = useState('');


  // Menu & Dish CRUD State
  const [editingMenuId, setEditingMenuId] = useState(null);
  const [menuFormData, setMenuFormData] = useState({
    name: '',
    description: '',
    price: '3500000',
    status: 'ACTIVE',
  });
  const [selectedMenuDishes, setSelectedMenuDishes] = useState([]);

  const [editingDishId, setEditingDishId] = useState(null);
  const [dishFormData, setDishFormData] = useState({
    name: '',
    category: 'MAIN',
    price: '250000',
    status: 'ACTIVE',
    desc: '',
  });

  // Service CRUD State
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [serviceFormData, setServiceFormData] = useState({
    name: '',
    price: '5000000',
    status: 'ACTIVE',
    description: '',
  });

  // User CRUD State
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedUserRole, setSelectedUserRole] = useState('ADMIN');
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ADMIN',
    status: 'ACTIVE',
  });

  // Mock data tương thích 100% với legacy/js/dashboard.js
  const [events, setEvents] = useState([
    { id: 'SK-101', title: 'Tiệc Cưới Hoàng Gia - Anh Minh & Chị Mai', client: 'Nguyễn Văn Minh', type: 'Tiệc cưới', date: '2026-10-15 17:30', location: 'GEM Center, Q.1', budget: 220000000, status: 'Đã xác nhận' },
    { id: 'SK-102', title: 'Gala Kỷ Niệm 10 Năm Tập Đoàn TechCorp', client: 'Trần Văn Nam', type: 'Hội nghị', date: '2026-10-20 18:00', location: 'White Palace, Q.Phú Nhuận', budget: 310000000, status: 'Đang chuẩn bị' },
    { id: 'SK-103', title: 'Liveshow Âm Nhạc Đêm Hội Mùa Thu', client: 'Lê Thị Hồng', type: 'Concert', date: '2026-11-05 19:00', location: 'Sân vận động Quân Khu 7', budget: 320000000, status: 'Đã xác nhận' },
    { id: 'SK-104', title: 'Tiệc Sinh Nhật Luxury 30 Tuổi', client: 'Phạm Quốc Tuấn', type: 'Sinh nhật', date: '2026-09-25 18:30', location: 'Sảnh Crystal Rooftop', budget: 45000000, status: 'Hoàn thành' },
  ]);

  const [customers, setCustomers] = useState([
    { id: 'KH-201', name: 'Nguyễn Văn Minh', phone: '0908123456', email: 'minh.nguyen@gmail.com', tier: 'VIP', eventsCount: 2, totalSpent: 220000000, dateAdded: '2026-01-15', notes: 'Khách thích hoa tươi tông pastel' },
    { id: 'KH-202', name: 'Trần Văn Nam', phone: '0912345678', email: 'nam.tran@techcorp.vn', tier: 'VIP', eventsCount: 3, totalSpent: 310000000, dateAdded: '2026-02-10', notes: 'Đại diện TechCorp, yêu cầu LED 4K' },
    { id: 'KH-203', name: 'Lê Thị Hồng', phone: '0934567890', email: 'hong.le@entertainment.com', tier: 'VIP', eventsCount: 1, totalSpent: 320000000, dateAdded: '2026-03-05', notes: 'Liveshow âm nhạc chuyên nghiệp' },
    { id: 'KH-204', name: 'Phạm Quốc Tuấn', phone: '0978112233', email: 'tuan.pham@tuanstar.com', tier: 'Thường', eventsCount: 1, totalSpent: 45000000, dateAdded: '2026-05-20', notes: 'Tiệc cá nhân riêng tư' },
    { id: 'KH-205', name: 'Vũ Hoàng Yến', phone: '0989001122', email: 'hoangyen@vinacoffee.com', tier: 'Tiềm năng', eventsCount: 1, totalSpent: 110000000, dateAdded: '2026-07-12', notes: 'Quan tâm quay phim 4K' },
    { id: 'KH-206', name: 'Đặng Hoàng Long', phone: '0903445566', email: 'long.dh@gmail.com', tier: 'Tiềm năng', eventsCount: 0, totalSpent: 0, dateAdded: '2026-09-18', notes: 'Báo giá hội thảo cuối năm' },
  ]);

  const [users, setUsers] = useState([
    { id: 'ND-01', name: 'Quản trị viên Hệ Thống', email: 'admin_demo@evmanager.vn', role: 'ADMIN', status: 'ACTIVE' },
    { id: 'ND-02', name: 'Nhân viên Tư Vấn Sales', email: 'sales@evmanager.vn', role: 'SALES', status: 'ACTIVE' },
    { id: 'ND-03', name: 'Điều phối viên Sự Kiện', email: 'coordinator@evmanager.vn', role: 'COORDINATOR', status: 'ACTIVE' },
    { id: 'ND-04', name: 'Khách hàng', email: 'khachhang1@gmail.com', role: 'CUSTOMER', status: 'ACTIVE' },
  ]);

  const [menus, setMenus] = useState([
    { id: 'MN-01', name: 'Thực đơn Cưới Bạc (Silver)', description: 'Súp măng tây, Gà quay, Tôm hấp, Bò sốt tiêu, Cơm hoàng bào, Chè hạt sen', price: 3500000, status: 'ACTIVE' },
    { id: 'MN-02', name: 'Thực đơn Cưới Vàng (Gold)', description: 'Gỏi củ hủ dừa, Súp vi cá, Cá chẽm hấp HK, Bò Úc sốt vang, Lẩu thái, Bánh tuyết mochi', price: 4500000, status: 'ACTIVE' },
    { id: 'MN-03', name: 'Thực đơn Kim Cương VIP', description: 'Bào ngư tiềm nấm, Tôm hùm baby nướng phô mai, Thăn bò Wagyu, Heo sữa quay, Yến chưng', price: 6000000, status: 'ACTIVE' },
  ]);

  const [dishes, setDishes] = useState([
    { id: 'DA-01', name: 'Súp măng tây cua bể', category: 'SOUP', price: 250000, status: 'ACTIVE', desc: 'Súp cua bể truyền thống nước dùng thanh mát' },
    { id: 'DA-02', name: 'Tôm hùm baby nướng phô mai', category: 'MAIN', price: 850000, status: 'ACTIVE', desc: 'Tôm hùm tươi sống đút lò phô mai Mozzarella' },
    { id: 'DA-03', name: 'Thịt bò Wagyu áp chảo sốt tiêu đen', category: 'MAIN', price: 950000, status: 'ACTIVE', desc: 'Bò Wagyu A5 mềm mọng cùng sốt tiêu đen Phú Quốc' },
    { id: 'DA-04', name: 'Chè hạt sen long nhãn tiến vua', category: 'DESSERT', price: 150000, status: 'ACTIVE', desc: 'Món tráng miệng thanh tao hạt sen Huế' },
    { id: 'DA-05', name: 'Gỏi củ hủ dừa tôm thịt', category: 'STARTER', price: 280000, status: 'ACTIVE', desc: 'Món khai vị giòn ngọt đặc sản Bến Tre' },
  ]);

  const [contracts, setContracts] = useState([
    { id: 'HD-2026-001', customer: 'Nguyễn Văn Minh', event: 'Tiệc Cưới Hoàng Gia', total: 220000000, status: 'Đã ký kết', date: '2026-10-01' },
    { id: 'HD-2026-002', customer: 'Trần Văn Nam', event: 'Gala 10 Năm TechCorp', total: 310000000, status: 'Chờ duyệt', date: '2026-10-05' },
    { id: 'HD-2026-003', customer: 'Lê Thị Hồng', event: 'Liveshow Âm Nhạc Đêm Hội', total: 320000000, status: 'Đã ký kết', date: '2026-10-08' },
  ]);

  const [services, setServices] = useState([
    { id: 'DV-01', name: 'Màn hình LED cong P3 4K (8m x 4m)', description: 'Bao gồm hệ thống xử lý tín hiệu và kỹ thuật viên vận hành 24/7', price: 15000000, status: 'ACTIVE' },
    { id: 'DV-02', name: 'Hệ thống âm thanh Line Array Concert', description: 'Âm thanh biểu diễn chuyên nghiệp ngoài trời & sảnh lớn chuẩn quốc tế', price: 25000000, status: 'ACTIVE' },
    { id: 'DV-03', name: 'Ban nhạc Live Acoustic Đêm Tiệc', description: '1 Ca sĩ chính, 1 Guitarist, 1 Cajon biểu diễn trong suốt 2 giờ tiệc', price: 8000000, status: 'ACTIVE' },
    { id: 'DV-04', name: 'Gói chụp ảnh & quay phim Cinematic 4K', description: '2 Thợ máy chụp ảnh và quay phim flycam, dựng teaser highlight trong ngày', price: 12000000, status: 'ACTIVE' },
  ]);

  const [venues, setVenues] = useState([
    { id: 'S-01', name: 'Sảnh Kim Cương (Diamond Hall)', capacity: '500 khách', price: 15000000, desc: 'Sảnh lớn phong cách hoàng gia, âm thanh Line Array cao cấp (Tầng 1)' },
    { id: 'S-02', name: 'Sảnh Hoàng Gia (Imperial Hall)', capacity: '300 khách', price: 10000000, desc: 'Tone màu sang trọng quý phái, phù hợp hội nghị & dạ tiệc lớn (Tầng 2)' },
    { id: 'S-03', name: 'Sảnh Ngọc Bích (Emerald Hall)', capacity: '150 khách', price: 6000000, desc: 'Thiết kế vườn ngọc bích hiện đại, không gian mở thoáng đãng (Tầng 3)' },
    { id: 'S-04', name: 'Sảnh Ruby (Ruby Hall)', capacity: '200 khách', price: 8000000, desc: 'Không gian ấm cúng, phù hợp thôi nôi, sinh nhật, tiệc thân mật (Tầng 4)' },
    { id: 'S-05', name: 'Sảnh Bạch Kim (Platinum Hall)', capacity: '400 khách', price: 12000000, desc: 'Không gian ngoài trời ngắm thành phố, view hoàng hôn cực đẹp (Tầng 5)' },
  ]);

  const formatVND = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);

  // -------------------------------------------------------------
  // XỬ LÝ SỰ KIỆN: THÊM MỚI, CHỈNH SỬA, XÓA (CRUD SỰ KIỆN)
  // -------------------------------------------------------------
  const handleOpenAddEvent = () => {
    setEditingEventId(null);
    setEventFormData({
      title: '',
      client: '',
      type: 'Tiệc cưới',
      date: '2026-10-25T18:00',
      budget: '150000000',
      location: 'GEM Center, Q.1',
      status: 'Đang chuẩn bị',
    });
    setShowEventModal(true);
  };

  const handleEditEvent = (ev) => {
    setEditingEventId(ev.id);
    setEventFormData({
      title: ev.title,
      client: ev.client,
      type: ev.type,
      date: ev.date ? ev.date.replace(' ', 'T') : '2026-10-25T18:00',
      budget: String(ev.budget),
      location: ev.location,
      status: ev.status,
    });
    setShowEventModal(true);
  };

  const handleDeleteEvent = (id) => {
    const target = events.find((e) => e.id === id);
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa sự kiện "${target?.title || id}"?`);
    if (confirmDelete) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
      showToast(`Đã xóa sự kiện #${id} thành công!`, 'success');
    }
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!eventFormData.title.trim()) {
      alert('Vui lòng nhập tên sự kiện!');
      return;
    }
    if (!eventFormData.client.trim()) {
      alert('Vui lòng nhập tên khách hàng!');
      return;
    }

    if (editingEventId) {
      // Cập nhật sự kiện hiện có
      setEvents((prev) =>
        prev.map((ev) => {
          if (ev.id === editingEventId) {
            return {
              ...ev,
              title: eventFormData.title,
              client: eventFormData.client,
              type: eventFormData.type,
              date: eventFormData.date ? eventFormData.date.replace('T', ' ') : ev.date,
              budget: Number(eventFormData.budget) || 0,
              location: eventFormData.location,
              status: eventFormData.status,
            };
          }
          return ev;
        })
      );
      showToast('Cập nhật sự kiện thành công!', 'success');
    } else {
      // Thêm mới sự kiện
      const newId = `SK-${Math.floor(100 + Math.random() * 900)}`;
      const newEv = {
        id: newId,
        title: eventFormData.title,
        client: eventFormData.client,
        type: eventFormData.type,
        date: eventFormData.date ? eventFormData.date.replace('T', ' ') : '2026-10-25 18:00',
        budget: Number(eventFormData.budget) || 0,
        location: eventFormData.location,
        status: eventFormData.status,
      };
      setEvents((prev) => [newEv, ...prev]);

      // Tự động kiểm tra/bổ sung khách hàng nếu chưa có
      const existCust = customers.find((c) => c.name.toLowerCase() === eventFormData.client.toLowerCase());
      if (existCust) {
        existCust.eventsCount = (existCust.eventsCount || 0) + 1;
        existCust.totalSpent = (existCust.totalSpent || 0) + newEv.budget;
      } else {
        setCustomers((prev) => [
          {
            id: `KH-${Math.floor(200 + Math.random() * 800)}`,
            name: eventFormData.client,
            phone: '0901234567',
            email: `${eventFormData.client.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
            tier: 'Thường',
            eventsCount: 1,
            totalSpent: newEv.budget,
            dateAdded: new Date().toISOString().split('T')[0],
            notes: `Đặt sự kiện: ${newEv.title}`,
          },
          ...prev,
        ]);
      }
      showToast('Thêm sự kiện mới thành công!', 'success');
    }

    setShowEventModal(false);
  };

  // -------------------------------------------------------------
  // XỬ LÝ KHÁCH HÀNG: THÊM MỚI, CHỈNH SỬA, XÓA (CRUD KHÁCH HÀNG)
  // -------------------------------------------------------------
  const handleOpenAddCustomer = () => {
    setEditingCustomerId(null);
    setCustomerFormData({
      name: '',
      phone: '',
      email: '',
      tier: 'VIP',
      totalSpent: '100000000',
      notes: '',
    });
    setShowCustomerModal(true);
  };

  const handleEditCustomer = (c) => {
    setEditingCustomerId(c.id);
    setCustomerFormData({
      name: c.name,
      phone: c.phone,
      email: c.email || '',
      tier: c.tier,
      totalSpent: String(c.totalSpent || 0),
      notes: c.notes || '',
    });
    setShowCustomerModal(true);
  };

  const handleDeleteCustomer = (id) => {
    const target = customers.find((c) => c.id === id);
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa khách hàng "${target?.name || id}"?`);
    if (confirmDelete) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      showToast(`Đã xóa khách hàng #${id} thành công!`, 'success');
    }
  };

  const handleSaveCustomer = (e) => {
    e.preventDefault();
    if (!customerFormData.name.trim() || !customerFormData.phone.trim()) {
      alert('Vui lòng điền tên và số điện thoại khách hàng!');
      return;
    }

    if (editingCustomerId) {
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id === editingCustomerId) {
            return {
              ...c,
              name: customerFormData.name,
              phone: customerFormData.phone,
              email: customerFormData.email,
              tier: customerFormData.tier,
              totalSpent: Number(customerFormData.totalSpent) || 0,
              notes: customerFormData.notes,
            };
          }
          return c;
        })
      );
      showToast('Cập nhật thông tin khách hàng thành công!', 'success');
    } else {
      const newCust = {
        id: `KH-${Math.floor(200 + Math.random() * 800)}`,
        name: customerFormData.name,
        phone: customerFormData.phone,
        email: customerFormData.email,
        tier: customerFormData.tier,
        eventsCount: 0,
        totalSpent: Number(customerFormData.totalSpent) || 0,
        dateAdded: new Date().toISOString().split('T')[0],
        notes: customerFormData.notes,
      };
      setCustomers((prev) => [newCust, ...prev]);
      showToast('Thêm khách hàng mới thành công!', 'success');
    }
    setShowCustomerModal(false);
  };

  // -------------------------------------------------------------
  // XỬ LÝ HỢP ĐỒNG: THÊM MỚI, CHỈNH SỬA, XÓA, XEM CHI TIẾT
  // -------------------------------------------------------------
  const handleOpenAddContract = () => {
    setEditingContractId(null);
    setContractCustomer(customers[0]?.name || '');
    setContractEvent(events[0]?.title || '');
    setContractDate('2026-10-15');
    setContractSelectedMenu(menus[0]?.id || '');
    setContractSelectedServices([services[0]?.id || '']);
    setContractStep(1);
    setContractFormData({
      customer: customers[0]?.name || '',
      event: events[0]?.title || '',
      total: '150000000',
      status: 'Chờ duyệt',
      date: '2026-10-15',
      notes: '',
    });
    setShowContractModal(true);
  };

  const handleEditContract = (c) => {
    setEditingContractId(c.id);
    setContractFormData({
      customer: c.customer,
      event: c.event,
      total: String(c.total || 0),
      status: c.status,
      date: c.date,
      notes: c.notes || '',
    });
    setShowContractModal(true);
  };

  const handleDeleteContract = (id) => {
    const target = contracts.find((c) => c.id === id);
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa hợp đồng "${target?.id} - ${target?.customer}"?`);
    if (confirmDelete) {
      setContracts((prev) => prev.filter((c) => c.id !== id));
      showToast(`Đã xóa hợp đồng #${id} thành công!`, 'success');
    }
  };

  const handleViewContractDetail = (c) => {
    setSelectedContractDetail(c);
    setShowContractDetailModal(true);
  };

  const handleSaveContract = (e) => {
    e.preventDefault();
    if (editingContractId) {
      setContracts((prev) =>
        prev.map((c) => {
          if (c.id === editingContractId) {
            return {
              ...c,
              customer: contractFormData.customer,
              event: contractFormData.event,
              total: Number(contractFormData.total) || 0,
              status: contractFormData.status,
              date: contractFormData.date,
              notes: contractFormData.notes,
            };
          }
          return c;
        })
      );
      showToast(`Cập nhật hợp đồng #${editingContractId} thành công!`, 'success');
      setShowContractModal(false);
    } else {
      const newCt = {
        id: `HD-2026-00${contracts.length + 1}`,
        customer: contractCustomer || contractFormData.customer || customers[0]?.name || 'Khách hàng mới',
        event: contractEvent || contractFormData.event || events[0]?.title || 'Sự kiện mới',
        total: totalVal > 0 ? totalVal : (Number(contractFormData.total) || 150000000),
        status: contractFormData.status || 'Chờ duyệt',
        date: contractDate || contractFormData.date || '2026-10-15',
        notes: contractFormData.notes || '',
      };
      setContracts((prev) => [newCt, ...prev]);
      showToast(`Đã tạo hợp đồng mới: ${newCt.id}!`, 'success');
      setShowContractModal(false);
      setContractStep(1);
    }
  };

  // -------------------------------------------------------------
  // XỬ LÝ THANH TOÁN: TẠO PHIẾU THU, SỬA, XÓA, XEM BIÊN LAI
  // -------------------------------------------------------------
  const handleOpenAddPayment = () => {
    setEditingPaymentId(null);
    setPaymentFormData({
      contractId: contracts[0]?.id || 'HD-2026-001',
      customer: contracts[0]?.customer || 'Nguyễn Văn Minh',
      amount: '50000000',
      method: 'Chuyển khoản (Vietcombank)',
      phase: 'Đặt cọc 30%',
      status: 'Đã thanh toán',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setShowPaymentModal(true);
  };

  const handleEditPayment = (p) => {
    setEditingPaymentId(p.id);
    setPaymentFormData({
      contractId: p.contractId,
      customer: p.customer,
      amount: String(p.amount || 0),
      method: p.method,
      phase: p.phase || 'Đặt cọc 30%',
      status: p.status,
      date: p.date,
      notes: p.notes || '',
    });
    setShowPaymentModal(true);
  };

  const handleDeletePayment = (id) => {
    const target = payments.find((p) => p.id === id);
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa phiếu thu "${target?.id} - ${target?.customer}"?`);
    if (confirmDelete) {
      setPayments((prev) => prev.filter((p) => p.id !== id));
      showToast(`Đã xóa phiếu thu #${id} thành công!`, 'success');
    }
  };

  const handleViewReceipt = (p) => {
    setSelectedPaymentReceipt(p);
    setShowReceiptModal(true);
  };

  const handleSavePayment = (e) => {
    e.preventDefault();
    if (!paymentFormData.amount || Number(paymentFormData.amount) <= 0) {
      alert('Vui lòng nhập số tiền thanh toán hợp lệ!');
      return;
    }

    if (editingPaymentId) {
      setPayments((prev) =>
        prev.map((p) => {
          if (p.id === editingPaymentId) {
            return {
              ...p,
              contractId: paymentFormData.contractId,
              customer: paymentFormData.customer,
              amount: Number(paymentFormData.amount) || 0,
              method: paymentFormData.method,
              phase: paymentFormData.phase,
              status: paymentFormData.status,
              date: paymentFormData.date,
              notes: paymentFormData.notes,
            };
          }
          return p;
        })
      );
      showToast(`Cập nhật phiếu thu #${editingPaymentId} thành công!`, 'success');
    } else {
      const newPayId = `TT-90${payments.length + 1}`;
      const newP = {
        id: newPayId,
        contractId: paymentFormData.contractId,
        customer: paymentFormData.customer,
        amount: Number(paymentFormData.amount) || 0,
        method: paymentFormData.method,
        phase: paymentFormData.phase,
        status: paymentFormData.status,
        date: paymentFormData.date,
        notes: paymentFormData.notes,
      };
      setPayments((prev) => [newP, ...prev]);
      showToast(`Tạo phiếu thu #${newPayId} thành công!`, 'success');
    }
    setShowPaymentModal(false);
  };

  // -------------------------------------------------------------
  // XỬ LÝ THỰC ĐƠN & MÓN ĂN: CRUD SET MENUS & DISHES
  // -------------------------------------------------------------
  const handleOpenAddMenu = () => {
    setEditingMenuId(null);
    setMenuFormData({
      name: '',
      description: '',
      price: '4500000',
      status: 'ACTIVE',
    });
    setSelectedMenuDishes([]);
    setShowMenuModal(true);
  };

  const handleEditMenu = (m) => {
    setEditingMenuId(m.id);
    setMenuFormData({
      name: m.name,
      description: m.description,
      price: String(m.price || 0),
      status: m.status,
    });
    setShowMenuModal(true);
  };

  const handleDeleteMenu = (id) => {
    const target = menus.find((m) => m.id === id);
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa thực đơn "${target?.name || id}"?`);
    if (confirmDelete) {
      setMenus((prev) => prev.filter((m) => m.id !== id));
      showToast(`Đã xóa thực đơn #${id} thành công!`, 'success');
    }
  };

  const handleSaveMenu = (e) => {
    e.preventDefault();
    if (!menuFormData.name.trim()) {
      alert('Vui lòng nhập tên thực đơn!');
      return;
    }
    const combinedDesc =
      menuFormData.description ||
      (selectedMenuDishes.length > 0
        ? selectedMenuDishes.map((dId) => dishes.find((d) => d.id === dId)?.name).filter(Boolean).join(', ')
        : 'Thực đơn chọn món tiêu chuẩn');

    if (editingMenuId) {
      setMenus((prev) =>
        prev.map((m) => {
          if (m.id === editingMenuId) {
            return {
              ...m,
              name: menuFormData.name,
              description: combinedDesc,
              price: Number(menuFormData.price) || 0,
              status: menuFormData.status,
            };
          }
          return m;
        })
      );
      showToast(`Cập nhật thực đơn #${editingMenuId} thành công!`, 'success');
    } else {
      const newMenu = {
        id: `MN-0${menus.length + 1}`,
        name: menuFormData.name,
        description: combinedDesc,
        price: Number(menuFormData.price) || 0,
        status: menuFormData.status,
      };
      setMenus((prev) => [...prev, newMenu]);
      showToast(`Thêm thực đơn "${newMenu.name}" thành công!`, 'success');
    }
    setShowMenuModal(false);
  };

  const handleOpenAddDish = () => {
    setEditingDishId(null);
    setDishFormData({
      name: '',
      category: 'MAIN',
      price: '300000',
      status: 'ACTIVE',
      desc: '',
    });
    setShowDishModal(true);
  };

  const handleEditDish = (d) => {
    setEditingDishId(d.id);
    setDishFormData({
      name: d.name,
      category: d.category,
      price: String(d.price || 0),
      status: d.status,
      desc: d.desc || '',
    });
    setShowDishModal(true);
  };

  const handleDeleteDish = (id) => {
    const target = dishes.find((d) => d.id === id);
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa món ăn "${target?.name || id}"?`);
    if (confirmDelete) {
      setDishes((prev) => prev.filter((d) => d.id !== id));
      showToast(`Đã xóa món ăn #${id} thành công!`, 'success');
    }
  };

  const handleSaveDish = (e) => {
    e.preventDefault();
    if (!dishFormData.name.trim()) {
      alert('Vui lòng nhập tên món ăn!');
      return;
    }
    if (editingDishId) {
      setDishes((prev) =>
        prev.map((d) => {
          if (d.id === editingDishId) {
            return {
              ...d,
              name: dishFormData.name,
              category: dishFormData.category,
              price: Number(dishFormData.price) || 0,
              status: dishFormData.status,
              desc: dishFormData.desc,
            };
          }
          return d;
        })
      );
      showToast(`Cập nhật món ăn #${editingDishId} thành công!`, 'success');
    } else {
      const newDish = {
        id: `DA-0${dishes.length + 1}`,
        name: dishFormData.name,
        category: dishFormData.category,
        price: Number(dishFormData.price) || 0,
        status: dishFormData.status,
        desc: dishFormData.desc,
      };
      setDishes((prev) => [...prev, newDish]);
      showToast(`Thêm món ăn "${newDish.name}" thành công!`, 'success');
    }
    setShowDishModal(false);
  };

  // -------------------------------------------------------------
  // XỬ LÝ DỊCH VỤ: THÊM MỚI, CHỈNH SỬA, XÓA (CRUD SERVICES)
  // -------------------------------------------------------------
  const handleOpenAddService = () => {
    setEditingServiceId(null);
    setServiceFormData({
      name: '',
      price: '5000000',
      status: 'ACTIVE',
      description: '',
    });
    setShowServiceModal(true);
  };

  const handleEditService = (s) => {
    setEditingServiceId(s.id);
    setServiceFormData({
      name: s.name,
      price: String(s.price || 0),
      status: s.status,
      description: s.description || '',
    });
    setShowServiceModal(true);
  };

  const handleDeleteService = (id) => {
    const target = services.find((s) => s.id === id);
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa dịch vụ "${target?.name || id}"?`);
    if (confirmDelete) {
      setServices((prev) => prev.filter((s) => s.id !== id));
      showToast(`Đã xóa dịch vụ #${id} thành công!`, 'success');
    }
  };

  const handleSaveService = (e) => {
    e.preventDefault();
    if (!serviceFormData.name.trim()) {
      alert('Vui lòng nhập tên dịch vụ!');
      return;
    }
    if (editingServiceId) {
      setServices((prev) =>
        prev.map((s) => {
          if (s.id === editingServiceId) {
            return {
              ...s,
              name: serviceFormData.name,
              price: Number(serviceFormData.price) || 0,
              status: serviceFormData.status,
              description: serviceFormData.description,
            };
          }
          return s;
        })
      );
      showToast(`Cập nhật dịch vụ #${editingServiceId} thành công!`, 'success');
    } else {
      const newSv = {
        id: `DV-0${services.length + 1}`,
        name: serviceFormData.name,
        price: Number(serviceFormData.price) || 0,
        status: serviceFormData.status,
        description: serviceFormData.description,
      };
      setServices((prev) => [...prev, newSv]);
      showToast(`Thêm dịch vụ "${newSv.name}" thành công!`, 'success');
    }
    setShowServiceModal(false);
  };

  // -------------------------------------------------------------
  // XỬ LÝ NGƯỜI DÙNG: THÊM MỚI, SỬA, KHÓA / MỞ, XÓA (CRUD USERS)
  // -------------------------------------------------------------
  const handleOpenAddUser = () => {
    setEditingUserId(null);
    setUserFormData({
      name: '',
      email: '',
      password: '',
      role: 'ADMIN',
      status: 'ACTIVE',
    });
    setSelectedUserRole('ADMIN');
    setShowUserModal(true);
  };

  const handleEditUser = (u) => {
    setEditingUserId(u.id);
    setUserFormData({
      name: u.name,
      email: u.email,
      password: '',
      role: u.role,
      status: u.status,
    });
    setSelectedUserRole(u.role);
    setShowUserModal(true);
  };

  const handleToggleUserStatus = (u) => {
    const nextStatus = u.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
    setUsers((prev) =>
      prev.map((item) => (item.id === u.id ? { ...item, status: nextStatus } : item))
    );
    showToast(`Đã ${nextStatus === 'ACTIVE' ? 'mở khóa' : 'khóa'} tài khoản ${u.name}!`, 'success');
  };

  const handleDeleteUser = (id) => {
    const target = users.find((u) => u.id === id);
    if (target?.role === 'ADMIN' && users.filter((u) => u.role === 'ADMIN').length <= 1) {
      alert('Không thể xóa quản trị viên duy nhất của hệ thống!');
      return;
    }
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${target?.name || id}"?`);
    if (confirmDelete) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      showToast(`Đã xóa người dùng #${id} thành công!`, 'success');
    }
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (!userFormData.name.trim() || !userFormData.email.trim()) {
      alert('Vui lòng nhập tên và email người dùng!');
      return;
    }
    if (editingUserId) {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === editingUserId) {
            return {
              ...u,
              name: userFormData.name,
              email: userFormData.email,
              role: userFormData.role,
              status: userFormData.status,
            };
          }
          return u;
        })
      );
      showToast(`Cập nhật người dùng #${editingUserId} thành công!`, 'success');
    } else {
      const newU = {
        id: `ND-0${users.length + 1}`,
        name: userFormData.name,
        email: userFormData.email,
        role: userFormData.role,
        status: userFormData.status || 'ACTIVE',
      };
      setUsers((prev) => [...prev, newU]);
      showToast(`Tạo người dùng mới "${newU.name}" thành công!`, 'success');
    }
    setShowUserModal(false);
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'tab-dashboard':
        return { title: 'Bảng tổng quan', subtitle: 'Tổng quan doanh thu, sự kiện & hoạt động mới nhất' };
      case 'tab-events':
        return { title: 'Quản lý sự kiện', subtitle: 'Danh sách, lọc và điều hành các sự kiện trong hệ thống' };
      case 'tab-tasks':
        return { title: 'Quản lý công việc', subtitle: 'Phân công, theo dõi tiến độ và kiểm soát đầu việc' };
      case 'tab-venues':
        return { title: 'Quản lý địa điểm', subtitle: 'Danh sách các sảnh tiệc, trung tâm và tình trạng trống' };
      case 'tab-contracts':
        return { title: 'Quản lý hợp đồng', subtitle: 'Theo dõi tình trạng phê duyệt và lưu trữ hợp đồng' };
      case 'tab-customers':
        return { title: 'Quản lý khách hàng', subtitle: 'Thông tin đối tác, khách hàng VIP và lịch sử hợp tác' };
      case 'tab-payments':
        return { title: 'Quản lý thanh toán', subtitle: 'Theo dõi công nợ, đợt thanh toán và xuất hóa đơn' };
      case 'tab-menus':
        return { title: 'Quản lý thực đơn', subtitle: 'Cấu hình set menu và danh mục món ăn ẩm thực' };
      case 'tab-services':
        return { title: 'Quản lý dịch vụ', subtitle: 'Quản lý âm thanh, ánh sáng, MC và dịch vụ đi kèm' };
      case 'tab-calendar':
        return { title: 'Lịch trình sự kiện', subtitle: 'Xem lịch trực quan, kiểm tra trùng lặp sảnh tiệc' };
      case 'tab-users':
        return { title: 'Quản lý người dùng', subtitle: 'Quản lý tài khoản, phân quyền quản trị và nhân viên' };
      case 'tab-reports':
        return { title: 'Báo cáo doanh thu', subtitle: 'Thống kê kết quả kinh doanh và chỉ số KPI' };
      case 'tab-settings':
        return { title: 'Cấu hình hệ thống', subtitle: 'Thiết lập tham số vận hành và chính sách hệ thống' };
      default:
        return { title: 'Hệ thống Quản trị Admin', subtitle: 'LV34 Event Operations Portal' };
    }
  };

  const { title, subtitle } = getPageTitle();

  // Tính toán sơ bộ tổng tiền hợp đồng trong Wizard
  const chosenMenuObj = menus.find((m) => m.id === contractSelectedMenu);
  const menuVal = chosenMenuObj ? chosenMenuObj.price * 20 : 0;
  const serviceVal = contractSelectedServices.reduce((sum, sId) => {
    const s = services.find((x) => x.id === sId);
    return sum + (s ? s.price : 0);
  }, 0);
  const totalVal = menuVal + serviceVal;
  const depositVal = totalVal * 0.3;

  return (
    <div className={`admin-wrapper ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Toast popup thông báo thành công / lỗi */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 9999,
            background: toastMessage.type === 'success' ? '#087f82' : '#e11d48',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <span>{toastMessage.type === 'success' ? '✔' : '⚠'}</span>
          <span>{toastMessage.message}</span>
        </div>
      )}

      {/* SIDEBAR NAVIGATION - 100% CẤU TRÚC VÀ CLASS TỪ LEGACY/ADMIN.HTML */}
      <aside className="admin-sidebar" id="adminSidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">◒</span>
          <div className="brand-info">
            <span className="brand-title">LV34 <span>EVENTS</span></span>
            <span className="brand-badge">{isDemoMode() ? 'DEMO MODE' : 'ADMIN PORTAL'}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">TỔNG QUAN & QUẢN LÝ</div>
          <button
            className={`nav-item ${activeTab === 'tab-dashboard' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTab('tab-dashboard')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Bảng tổng quan</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'tab-events' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTab('tab-events')}
          >
            <span className="nav-icon">🎉</span>
            <span className="nav-text">Quản lý sự kiện</span>
            <span className="nav-pill" id="badgeEventsCount">{events.length}</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'tab-tasks' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTab('tab-tasks')}
          >
            <span className="nav-icon">📋</span>
            <span className="nav-text">Quản lý công việc</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'tab-venues' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTab('tab-venues')}
          >
            <span className="nav-icon">🏛️</span>
            <span className="nav-text">Quản lý địa điểm</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'tab-contracts' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTab('tab-contracts')}
          >
            <span className="nav-icon">📝</span>
            <span className="nav-text">Quản lý hợp đồng</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'tab-customers' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTab('tab-customers')}
          >
            <span className="nav-icon">👥</span>
            <span className="nav-text">Quản lý khách hàng</span>
            <span className="nav-pill" id="badgeCustomersCount">{customers.length}</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'tab-payments' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTab('tab-payments')}
          >
            <span className="nav-icon">💳</span>
            <span className="nav-text">Quản lý thanh toán</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'tab-menus' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTab('tab-menus')}
          >
            <span className="nav-icon">🍽️</span>
            <span className="nav-text">Quản lý thực đơn</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'tab-services' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTab('tab-services')}
          >
            <span className="nav-icon">🛠️</span>
            <span className="nav-text">Quản lý dịch vụ</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'tab-calendar' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTab('tab-calendar')}
          >
            <span className="nav-icon">📅</span>
            <span className="nav-text">Lịch trình sự kiện</span>
          </button>

          <div className="nav-section-label">HỆ THỐNG</div>
          <button
            className={`nav-item ${activeTab === 'tab-users' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTab('tab-users')}
          >
            <span className="nav-icon">🧑‍💻</span>
            <span className="nav-text">Quản lý người dùng</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'tab-reports' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTab('tab-reports')}
          >
            <span className="nav-icon">📈</span>
            <span className="nav-text">Báo cáo doanh thu</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'tab-settings' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTab('tab-settings')}
          >
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">Cấu hình hệ thống</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <Link to="/user" className="admin-user-card" title="Xem & Thay đổi thông tin cá nhân" style={{ textDecoration: 'none', cursor: 'pointer' }}>
            <div className="user-avatar">
              {currentUser?.fullName ? currentUser.fullName.substring(0, 2).toUpperCase() : 'AD'}
            </div>
            <div className="user-meta">
              <strong id="adminSidebarGreeting">{currentUser?.fullName || 'Admin System'}</strong>
              <span>{currentUser?.role ? currentUser.role.replace('ROLE_', '') : 'Quản trị viên'} ✏️</span>
            </div>
          </Link>
          <button id="logoutButton" className="btn-sidebar-logout" type="button" title="Đăng xuất" onClick={logout}>
            🚪 Đăng xuất
          </button>
        </div>
      </aside>

      {/* MAIN ADMIN CONTENT AREA */}
      <main className="admin-main">
        {/* TOP NAVBAR FOR ADMIN */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <button
              className="sidebar-toggle-btn"
              id="sidebarToggle"
              type="button"
              aria-label="Toggle Sidebar"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              ☰
            </button>
            <div>
              <h1 className="topbar-title" id="pageTitle">{title}</h1>
              <p className="topbar-subtitle" id="pageSubtitle">{subtitle}</p>
            </div>
          </div>

          <div className="topbar-right">
            <div className="topbar-search">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                id="globalSearchInput"
                placeholder="Tìm kiếm nhanh sự kiện, khách hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="topbar-actions">
              <Link to="/" className="topbar-action-link" target="_blank" title="Xem Trang chủ Web" style={{ textDecoration: 'none', color: '#172333', fontSize: '0.9rem', marginRight: '16px', fontWeight: 600 }}>
                🌐 Xem Website
              </Link>
              <div className="status-indicator">
                <span className="indicator-dot"></span>
                <span>Hệ thống online</span>
              </div>
            </div>
          </div>
        </header>

        <div className="admin-content">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'tab-dashboard' && (
            <section id="tab-dashboard" className="admin-tab-pane active">
              <div className="overview-grid">
                <article className="metric-card metric-card--revenue">
                  <div className="metric-header">
                    <div className="metric-icon">₫</div>
                    <span className="metric-trend positive">+14.5%</span>
                  </div>
                  <div className="metric-body">
                    <h2>Tổng doanh thu</h2>
                    <p id="doanhThu" className="metric-value">
                      {formatVND(events.reduce((sum, ev) => sum + (Number(ev.budget) || 0), 0))}
                    </p>
                    <p className="metric-note">Doanh thu sự kiện tích lũy</p>
                  </div>
                </article>
                <article className="metric-card metric-card--events">
                  <div className="metric-header">
                    <div className="metric-icon">🎉</div>
                    <span className="metric-trend positive" id="trendEventsText">+{events.length} sự kiện</span>
                  </div>
                  <div className="metric-body">
                    <h2>Số sự kiện</h2>
                    <p id="soSuKien" className="metric-value">{events.length}</p>
                    <p className="metric-note">Sự kiện đang quản lý</p>
                  </div>
                </article>
                <article className="metric-card metric-card--customers">
                  <div className="metric-header">
                    <div className="metric-icon">👥</div>
                    <span className="metric-trend positive" id="trendCustomersText">
                      {customers.filter((c) => c.tier === 'VIP').length} VIP
                    </span>
                  </div>
                  <div className="metric-body">
                    <h2>Khách hàng</h2>
                    <p id="soKhachHang" className="metric-value">{customers.length}</p>
                    <p className="metric-note">Đối tác & Khách cá nhân</p>
                  </div>
                </article>
                <article className="metric-card metric-card--contracts">
                  <div className="metric-header">
                    <div className="metric-icon">⌛</div>
                    <span className="metric-trend warning">Cần xử lý</span>
                  </div>
                  <div className="metric-body">
                    <h2>Hợp đồng chờ</h2>
                    <p id="hopDongCho" className="metric-value">
                      {contracts.filter((c) => c.status === 'Chờ duyệt').length || 1}
                    </p>
                    <p className="metric-note">Đang chờ phê duyệt</p>
                  </div>
                </article>
              </div>

              <div className="content-grid">
                <article className="panel chart-panel">
                  <div className="panel-heading">
                    <div>
                      <p className="panel-kicker">HIỆU SUẤT TÀI CHÍNH</p>
                      <h2>Biểu đồ doanh thu 6 tháng gần nhất</h2>
                    </div>
                    <span className="panel-period">Đơn vị: Triệu VNĐ</span>
                  </div>
                  <div className="chart-container" style={{ position: 'relative', height: '280px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '20px 10px 30px' }}>
                    {[
                      { month: 'T5', val: 120, height: '35%' },
                      { month: 'T6', val: 180, height: '48%' },
                      { month: 'T7', val: 150, height: '42%' },
                      { month: 'T8', val: 290, height: '70%' },
                      { month: 'T9', val: 310, height: '78%' },
                      { month: 'T10', val: 420, height: '100%' },
                    ].map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', width: '48px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#087f82', marginBottom: '6px' }}>{item.val}M</span>
                        <div
                          style={{
                            width: '36px',
                            height: item.height,
                            background: 'linear-gradient(180deg, #087f82 0%, #034b4c 100%)',
                            borderRadius: '6px 6px 0 0',
                            transition: 'height 0.4s ease',
                          }}
                        ></div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', marginTop: '8px' }}>{item.month}</span>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="panel quick-events-panel">
                  <div className="panel-heading">
                    <div>
                      <p className="panel-kicker">SỰ KIỆN GẦN ĐÂY</p>
                      <h2>Danh sách mới nhất</h2>
                    </div>
                    <button className="btn-action" id="btnGoToEvents" type="button" onClick={() => setActiveTab('tab-events')}>
                      Xem tất cả →
                    </button>
                  </div>
                  <div className="table-responsive">
                    <table className="admin-table mini-table">
                      <thead>
                        <tr>
                          <th>Sự kiện</th>
                          <th>Khách hàng</th>
                          <th>Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody id="quickEventsTableBody">
                        {events.slice(0, 4).map((e) => (
                          <tr key={e.id}>
                            <td>
                              <strong>{e.title}</strong>
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>📅 {e.date}</div>
                            </td>
                            <td>{e.client}</td>
                            <td>
                              <span className={`status-badge ${e.status === 'Đã xác nhận' ? 'status-confirmed' : e.status === 'Hoàn thành' ? 'status-completed' : 'status-pending'}`}>
                                {e.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </article>
              </div>
            </section>
          )}

          {/* TAB 2: QUẢN LÝ SỰ KIỆN */}
          {activeTab === 'tab-events' && (
            <section id="tab-events" className="admin-tab-pane active">
              <div className="tab-header-row">
                <div className="tab-summary-pills">
                  <button className={`summary-pill ${eventFilter === 'ALL' ? 'active' : ''}`} type="button" onClick={() => setEventFilter('ALL')}>
                    Tất cả (<span id="countEvAll">{events.length}</span>)
                  </button>
                  <button className={`summary-pill confirmed ${eventFilter === 'Đã xác nhận' ? 'active' : ''}`} type="button" onClick={() => setEventFilter('Đã xác nhận')}>
                    Đã xác nhận (<span id="countEvConfirmed">{events.filter((e) => e.status === 'Đã xác nhận').length}</span>)
                  </button>
                  <button className={`summary-pill pending ${eventFilter === 'Đang chuẩn bị' ? 'active' : ''}`} type="button" onClick={() => setEventFilter('Đang chuẩn bị')}>
                    Đang chuẩn bị (<span id="countEvPending">{events.filter((e) => e.status === 'Đang chuẩn bị').length}</span>)
                  </button>
                  <button className={`summary-pill completed ${eventFilter === 'Hoàn thành' ? 'active' : ''}`} type="button" onClick={() => setEventFilter('Hoàn thành')}>
                    Hoàn thành (<span id="countEvCompleted">{events.filter((e) => e.status === 'Hoàn thành').length}</span>)
                  </button>
                </div>
                <button
                  className="btn btn-primary"
                  id="btnOpenAddEventModal"
                  type="button"
                  onClick={handleOpenAddEvent}
                >
                  ➕ Thêm sự kiện mới
                </button>
              </div>

              <div className="table-filter-bar">
                <div className="filter-group">
                  <span className="filter-icon">🔍</span>
                  <input
                    type="text"
                    id="eventSearchInput"
                    placeholder="Tìm theo tên sự kiện, khách hàng, địa điểm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="filter-group select-group">
                  <label htmlFor="eventStatusFilter">Trạng thái:</label>
                  <select id="eventStatusFilter" value={eventFilter} onChange={(e) => setEventFilter(e.target.value)}>
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="Đã xác nhận">Đã xác nhận</option>
                    <option value="Đang chuẩn bị">Đang chuẩn bị</option>
                    <option value="Hoàn thành">Hoàn thành</option>
                    <option value="Đã hủy">Đã hủy</option>
                  </select>
                </div>
                <div className="filter-group select-group">
                  <label htmlFor="eventTypeFilter">Loại sự kiện:</label>
                  <select id="eventTypeFilter" value={eventTypeFilter} onChange={(e) => setEventTypeFilter(e.target.value)}>
                    <option value="ALL">Tất cả loại hình</option>
                    <option value="Tiệc cưới">Tiệc cưới</option>
                    <option value="Hội nghị">Hội nghị / Gala</option>
                    <option value="Concert">Concert / Liveshow</option>
                    <option value="Sinh nhật">Sinh nhật / Kỷ niệm</option>
                  </select>
                </div>
              </div>

              <div className="panel table-panel">
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Mã SK</th>
                        <th>Tên sự kiện</th>
                        <th>Khách hàng</th>
                        <th>Loại hình</th>
                        <th>Thời gian</th>
                        <th>Địa điểm</th>
                        <th>Ngân sách</th>
                        <th>Trạng thái</th>
                        <th className="text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody id="eventsTableBody">
                      {events
                        .filter(
                          (e) =>
                            (eventFilter === 'ALL' || e.status === eventFilter) &&
                            (eventTypeFilter === 'ALL' || e.type === eventTypeFilter) &&
                            (e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              e.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              e.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              e.id.toLowerCase().includes(searchTerm.toLowerCase()))
                        )
                        .map((e) => (
                          <tr key={e.id}>
                            <td><strong>{e.id}</strong></td>
                            <td><strong>{e.title}</strong></td>
                            <td>{e.client}</td>
                            <td><span className="summary-pill" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>{e.type}</span></td>
                            <td>{e.date}</td>
                            <td>{e.location}</td>
                            <td><strong>{formatVND(e.budget)}</strong></td>
                            <td>
                              <span
                                className={`status-badge ${
                                  e.status === 'Đã xác nhận'
                                    ? 'status-confirmed'
                                    : e.status === 'Hoàn thành'
                                    ? 'status-completed'
                                    : 'status-pending'
                                }`}
                              >
                                {e.status}
                              </span>
                            </td>
                            <td className="text-right">
                              <div className="btn-action-group">
                                <button
                                  className="btn-action"
                                  type="button"
                                  onClick={() => handleEditEvent(e)}
                                  title="Chỉnh sửa sự kiện"
                                >
                                  ✏️ Sửa
                                </button>
                                <button
                                  className="btn-action btn-action--danger"
                                  type="button"
                                  onClick={() => handleDeleteEvent(e.id)}
                                  title="Xóa sự kiện"
                                >
                                  🗑️ Xóa
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* TAB 3: QUẢN LÝ CÔNG VIỆC */}
          {activeTab === 'tab-tasks' && (
            <section id="tab-tasks" className="admin-tab-pane active">
              <div className="tab-header-row">
                <div className="tab-summary-pills">
                  <button className={`summary-pill ${taskFilter === 'ALL' ? 'active' : ''}`} type="button" onClick={() => setTaskFilter('ALL')}>
                    Tất cả (<span id="countTaskAll">{tasks.length}</span>)
                  </button>
                  <button className={`summary-pill pending ${taskFilter === 'Đang thực hiện' ? 'active' : ''}`} type="button" onClick={() => setTaskFilter('Đang thực hiện')}>
                    Đang thực hiện ({tasks.filter((t) => t.status === 'Đang thực hiện').length})
                  </button>
                  <button className={`summary-pill ${taskFilter === 'Đang tiến hành' ? 'active' : ''}`} type="button" onClick={() => setTaskFilter('Đang tiến hành')}>
                    Đang tiến hành ({tasks.filter((t) => t.status === 'Đang tiến hành').length})
                  </button>
                  <button className={`summary-pill completed ${taskFilter === 'Đã hoàn thành' ? 'active' : ''}`} type="button" onClick={() => setTaskFilter('Đã hoàn thành')}>
                    Đã hoàn thành ({tasks.filter((t) => t.status === 'Đã hoàn thành').length})
                  </button>
                </div>
                <button
                  className="btn btn-primary"
                  id="btnOpenAddTaskModal"
                  type="button"
                  onClick={handleOpenAddTask}
                >
                  ➕ Thêm công việc mới
                </button>
              </div>

              <div className="table-filter-bar">
                <div className="filter-group">
                  <span className="filter-icon">🔍</span>
                  <input
                    type="text"
                    id="taskSearchInput"
                    placeholder="Tìm theo tên công việc, người phụ trách, sự kiện..."
                    value={taskSearchTerm}
                    onChange={(e) => setTaskSearchTerm(e.target.value)}
                  />
                </div>
                <div className="filter-group select-group">
                  <label htmlFor="taskStatusFilter">Trạng thái:</label>
                  <select id="taskStatusFilter" value={taskFilter} onChange={(e) => setTaskFilter(e.target.value)}>
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="Đang thực hiện">Đang thực hiện</option>
                    <option value="Đang tiến hành">Đang tiến hành</option>
                    <option value="Đã hoàn thành">Đã hoàn thành</option>
                    <option value="Chờ xử lý">Chờ xử lý</option>
                  </select>
                </div>
              </div>

              <div className="panel table-panel">
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Mã Task</th>
                        <th>Tên công việc</th>
                        <th>Sự kiện liên quan</th>
                        <th>Người phụ trách</th>
                        <th>Hạn hoàn thành</th>
                        <th>Tiến độ</th>
                        <th>Trạng thái</th>
                        <th className="text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks
                        .filter(
                          (t) =>
                            (taskFilter === 'ALL' || t.status === taskFilter) &&
                            (t.name.toLowerCase().includes(taskSearchTerm.toLowerCase()) ||
                              t.assignee.toLowerCase().includes(taskSearchTerm.toLowerCase()) ||
                              t.event.toLowerCase().includes(taskSearchTerm.toLowerCase()) ||
                              t.id.toLowerCase().includes(taskSearchTerm.toLowerCase()))
                        )
                        .map((t) => (
                          <tr key={t.id}>
                            <td><strong>{t.id}</strong></td>
                            <td>
                              <strong>{t.name}</strong>
                              {t.notes && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>📝 {t.notes}</div>}
                            </td>
                            <td><span style={{ color: '#087f82', fontWeight: 600 }}>{t.event}</span></td>
                            <td>{t.assignee}</td>
                            <td>{t.deadline}</td>
                            <td style={{ minWidth: '120px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ flex: 1, height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                                  <div
                                    style={{
                                      width: `${t.progress}%`,
                                      height: '100%',
                                      background: t.progress === 100 ? '#10b981' : '#087f82',
                                      borderRadius: '4px',
                                      transition: 'width 0.3s ease',
                                    }}
                                  ></div>
                                </div>
                                <span style={{ fontSize: '0.78rem', fontWeight: 700, minWidth: '32px' }}>{t.progress}%</span>
                              </div>
                            </td>
                            <td>
                              <span
                                className={`status-badge ${
                                  t.status === 'Đã hoàn thành'
                                    ? 'status-completed'
                                    : t.status === 'Đang thực hiện'
                                    ? 'status-pending'
                                    : 'status-confirmed'
                                }`}
                              >
                                {t.status}
                              </span>
                            </td>
                            <td className="text-right">
                              <div className="btn-action-group">
                                <button
                                  className="btn-action"
                                  type="button"
                                  onClick={() => handleEditTask(t)}
                                  title="Chỉnh sửa công việc"
                                >
                                  ✏️ Sửa
                                </button>
                                <button
                                  className="btn-action btn-action--danger"
                                  type="button"
                                  onClick={() => handleDeleteTask(t.id)}
                                  title="Xóa công việc"
                                >
                                  🗑️ Xóa
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* TAB 4: QUẢN LÝ ĐỊA ĐIỂM */}
          {activeTab === 'tab-venues' && (
            <section id="tab-venues" className="admin-tab-pane active">
              <div className="tab-header-row">
                <div className="tab-summary-pills">
                  <button className={`summary-pill ${venueStatusFilter === 'ALL' ? 'active' : ''}`} type="button" onClick={() => setVenueStatusFilter('ALL')}>
                    Tất cả (<span id="countVenueAll">{venues.length}</span>)
                  </button>
                  <button className={`summary-pill confirmed ${venueStatusFilter === 'Sẵn sàng' ? 'active' : ''}`} type="button" onClick={() => setVenueStatusFilter('Sẵn sàng')}>
                    Sẵn sàng ({venues.filter((v) => (v.status || 'Sẵn sàng') === 'Sẵn sàng').length})
                  </button>
                  <button className={`summary-pill pending ${venueStatusFilter === 'Đang bảo trì' ? 'active' : ''}`} type="button" onClick={() => setVenueStatusFilter('Đang bảo trì')}>
                    Đang bảo trì ({venues.filter((v) => v.status === 'Đang bảo trì').length})
                  </button>
                </div>
                <button
                  className="btn btn-primary"
                  id="btnOpenAddVenueModal"
                  type="button"
                  onClick={handleOpenAddVenue}
                >
                  ➕ Thêm sảnh mới
                </button>
              </div>

              <div className="table-filter-bar">
                <div className="filter-group">
                  <span className="filter-icon">🔍</span>
                  <input
                    type="text"
                    id="venueSearchInput"
                    placeholder="Tìm theo tên sảnh tiệc, địa chỉ, sức chứa..."
                    value={venueSearchTerm}
                    onChange={(e) => setVenueSearchTerm(e.target.value)}
                  />
                </div>
                <div className="filter-group select-group">
                  <label htmlFor="venueStatusFilter">Trạng thái sảnh:</label>
                  <select id="venueStatusFilter" value={venueStatusFilter} onChange={(e) => setVenueStatusFilter(e.target.value)}>
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="Sẵn sàng">Sẵn sàng</option>
                    <option value="Đang bảo trì">Đang bảo trì</option>
                    <option value="Đã kín lịch">Đã kín lịch</option>
                  </select>
                </div>
              </div>

              <div className="panel table-panel">
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Mã sảnh</th>
                        <th>Tên sảnh tiệc</th>
                        <th>Sức chứa</th>
                        <th>Đơn giá tối thiểu / bàn</th>
                        <th>Trạng thái</th>
                        <th>Mô tả chi tiết</th>
                        <th className="text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {venues
                        .filter(
                          (v) =>
                            (venueStatusFilter === 'ALL' || (v.status || 'Sẵn sàng') === venueStatusFilter) &&
                            (v.name.toLowerCase().includes(venueSearchTerm.toLowerCase()) ||
                              (v.address && v.address.toLowerCase().includes(venueSearchTerm.toLowerCase())) ||
                              v.capacity.toLowerCase().includes(venueSearchTerm.toLowerCase()) ||
                              v.id.toLowerCase().includes(venueSearchTerm.toLowerCase()))
                        )
                        .map((v) => (
                          <tr key={v.id}>
                            <td><strong>{v.id}</strong></td>
                            <td>
                              <strong style={{ color: '#087f82' }}>{v.name}</strong>
                              {v.address && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>📍 {v.address}</div>}
                            </td>
                            <td><span className="status-badge status-confirmed">{v.capacity}</span></td>
                            <td><strong>{formatVND(v.price)}</strong></td>
                            <td>
                              <span
                                className={`status-badge ${
                                  (v.status || 'Sẵn sàng') === 'Sẵn sàng'
                                    ? 'status-completed'
                                    : (v.status === 'Đang bảo trì')
                                    ? 'status-pending'
                                    : 'status-confirmed'
                                }`}
                              >
                                {v.status || 'Sẵn sàng'}
                              </span>
                            </td>
                            <td style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '300px' }}>{v.desc}</td>
                            <td className="text-right">
                              <div className="btn-action-group">
                                <button
                                  className="btn-action"
                                  type="button"
                                  onClick={() => handleEditVenue(v)}
                                  title="Chỉnh sửa sảnh tiệc"
                                >
                                  ✏️ Sửa
                                </button>
                                <button
                                  className="btn-action btn-action--danger"
                                  type="button"
                                  onClick={() => handleDeleteVenue(v.id)}
                                  title="Xóa sảnh tiệc"
                                >
                                  🗑️ Xóa
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* TAB 5: QUẢN LÝ HỢP ĐỒNG */}
          {activeTab === 'tab-contracts' && (
            <section id="tab-contracts" className="admin-tab-pane active">
              <div className="tab-header-row">
                <div className="tab-summary-pills">
                  <button className={`summary-pill ${contractFilter === 'ALL' ? 'active' : ''}`} type="button" onClick={() => setContractFilter('ALL')}>
                    Tất cả (<span id="countContractAll">{contracts.length}</span>)
                  </button>
                  <button className={`summary-pill confirmed ${contractFilter === 'Đã ký kết' ? 'active' : ''}`} type="button" onClick={() => setContractFilter('Đã ký kết')}>
                    Đã ký kết ({contracts.filter((c) => c.status === 'Đã ký kết').length})
                  </button>
                  <button className={`summary-pill pending ${contractFilter === 'Chờ duyệt' ? 'active' : ''}`} type="button" onClick={() => setContractFilter('Chờ duyệt')}>
                    Chờ duyệt ({contracts.filter((c) => c.status === 'Chờ duyệt').length})
                  </button>
                </div>
                <button
                  className="btn btn-primary"
                  id="btnOpenAddContractModal"
                  type="button"
                  onClick={handleOpenAddContract}
                >
                  ➕ Thêm hợp đồng mới
                </button>
              </div>

              <div className="table-filter-bar">
                <div className="filter-group">
                  <span className="filter-icon">🔍</span>
                  <input
                    type="text"
                    id="contractSearchInput"
                    placeholder="Tìm theo mã HĐ, tên khách hàng, sự kiện..."
                    value={contractSearchTerm}
                    onChange={(e) => setContractSearchTerm(e.target.value)}
                  />
                </div>
                <div className="filter-group select-group">
                  <label htmlFor="contractStatusFilter">Trạng thái:</label>
                  <select id="contractStatusFilter" value={contractFilter} onChange={(e) => setContractFilter(e.target.value)}>
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="Đã ký kết">Đã ký kết</option>
                    <option value="Chờ duyệt">Chờ duyệt</option>
                    <option value="Đã hủy">Đã hủy</option>
                  </select>
                </div>
              </div>

              <div className="panel table-panel">
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Mã Hợp Đồng</th>
                        <th>Khách hàng</th>
                        <th>Sự kiện</th>
                        <th>Tổng tiền</th>
                        <th>Ngày ký</th>
                        <th>Trạng thái</th>
                        <th className="text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody id="contractsTableBody">
                      {contracts
                        .filter(
                          (c) =>
                            (contractFilter === 'ALL' || c.status === contractFilter) &&
                            (c.id.toLowerCase().includes(contractSearchTerm.toLowerCase()) ||
                              c.customer.toLowerCase().includes(contractSearchTerm.toLowerCase()) ||
                              c.event.toLowerCase().includes(contractSearchTerm.toLowerCase()))
                        )
                        .map((c) => (
                          <tr key={c.id}>
                            <td><strong>{c.id}</strong></td>
                            <td>{c.customer}</td>
                            <td><strong style={{ color: '#087f82' }}>{c.event}</strong></td>
                            <td><strong>{formatVND(c.total)}</strong></td>
                            <td>{c.date}</td>
                            <td>
                              <span className={`status-badge ${c.status === 'Đã ký kết' ? 'status-confirmed' : 'status-pending'}`}>
                                {c.status}
                              </span>
                            </td>
                            <td className="text-right">
                              <div className="btn-action-group">
                                <button
                                  className="btn-action"
                                  type="button"
                                  onClick={() => handleViewContractDetail(c)}
                                  title="Xem chi tiết & in hợp đồng"
                                >
                                  👁️ Chi tiết
                                </button>
                                <button
                                  className="btn-action"
                                  type="button"
                                  onClick={() => handleEditContract(c)}
                                  title="Chỉnh sửa hợp đồng"
                                >
                                  ✏️ Sửa
                                </button>
                                <button
                                  className="btn-action btn-action--danger"
                                  type="button"
                                  onClick={() => handleDeleteContract(c.id)}
                                  title="Xóa hợp đồng"
                                >
                                  🗑️ Xóa
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* TAB 6: QUẢN LÝ KHÁCH HÀNG */}
          {activeTab === 'tab-customers' && (
            <section id="tab-customers" className="admin-tab-pane active">
              <div className="tab-header-row">
                <div className="tab-summary-pills">
                  <button className={`summary-pill ${customerFilter === 'ALL' ? 'active' : ''}`} type="button" onClick={() => setCustomerFilter('ALL')}>
                    Tất cả (<span id="countCustAll">{customers.length}</span>)
                  </button>
                  <button className={`summary-pill vip ${customerFilter === 'VIP' ? 'active' : ''}`} type="button" onClick={() => setCustomerFilter('VIP')}>
                    VIP (<span id="countCustVip">{customers.filter((c) => c.tier === 'VIP').length}</span>)
                  </button>
                  <button className={`summary-pill normal ${customerFilter === 'Thường' ? 'active' : ''}`} type="button" onClick={() => setCustomerFilter('Thường')}>
                    Thường (<span id="countCustNormal">{customers.filter((c) => c.tier === 'Thường').length}</span>)
                  </button>
                  <button className={`summary-pill lead ${customerFilter === 'Tiềm năng' ? 'active' : ''}`} type="button" onClick={() => setCustomerFilter('Tiềm năng')}>
                    Tiềm năng (<span id="countCustLead">{customers.filter((c) => c.tier === 'Tiềm năng').length}</span>)
                  </button>
                </div>
                <button
                  className="btn btn-primary"
                  id="btnOpenAddCustomerModal"
                  type="button"
                  onClick={handleOpenAddCustomer}
                >
                  ➕ Thêm khách hàng mới
                </button>
              </div>

              <div className="table-filter-bar">
                <div className="filter-group">
                  <span className="filter-icon">🔍</span>
                  <input
                    type="text"
                    id="customerSearchInput"
                    placeholder="Tìm theo tên khách hàng, số điện thoại, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="filter-group select-group">
                  <label htmlFor="customerTierFilter">Phân loại khách hàng:</label>
                  <select id="customerTierFilter" value={customerFilter} onChange={(e) => setCustomerFilter(e.target.value)}>
                    <option value="ALL">Tất cả nhóm</option>
                    <option value="VIP">Khách VIP</option>
                    <option value="Thường">Khách Thường</option>
                    <option value="Tiềm năng">Khách Tiềm Năng</option>
                  </select>
                </div>
              </div>

              <div className="panel table-panel">
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Mã KH</th>
                        <th>Họ và tên</th>
                        <th>Số điện thoại</th>
                        <th>Email</th>
                        <th>Phân loại</th>
                        <th>Sự kiện</th>
                        <th>Tổng chi tiêu</th>
                        <th>Ngày tham gia</th>
                        <th className="text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody id="customersTableBody">
                      {customers
                        .filter(
                          (c) =>
                            (customerFilter === 'ALL' || c.tier === customerFilter) &&
                            (c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              c.phone.includes(searchTerm) ||
                              c.id.toLowerCase().includes(searchTerm.toLowerCase()))
                        )
                        .map((c) => (
                          <tr key={c.id}>
                            <td><strong>{c.id}</strong></td>
                            <td>
                              <strong>{c.name}</strong>
                              {c.notes && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>📝 {c.notes}</div>}
                            </td>
                            <td>{c.phone}</td>
                            <td>{c.email}</td>
                            <td>
                              <span
                                className={`status-badge ${
                                  c.tier === 'VIP'
                                    ? 'status-confirmed'
                                    : c.tier === 'Tiềm năng'
                                    ? 'status-pending'
                                    : 'status-completed'
                                }`}
                              >
                                {c.tier}
                              </span>
                            </td>
                            <td>{c.eventsCount} sự kiện</td>
                            <td><strong>{formatVND(c.totalSpent)}</strong></td>
                            <td>{c.dateAdded}</td>
                            <td className="text-right">
                              <div className="btn-action-group">
                                <button
                                  className="btn-action"
                                  type="button"
                                  onClick={() => handleEditCustomer(c)}
                                  title="Chỉnh sửa khách hàng"
                                >
                                  ✏️ Sửa
                                </button>
                                <button
                                  className="btn-action btn-action--danger"
                                  type="button"
                                  onClick={() => handleDeleteCustomer(c.id)}
                                  title="Xóa khách hàng"
                                >
                                  🗑️ Xóa
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* TAB 7: QUẢN LÝ THANH TOÁN */}
          {activeTab === 'tab-payments' && (
            <section id="tab-payments" className="admin-tab-pane active">
              <div className="tab-header-row">
                <div className="tab-summary-pills">
                  <button className={`summary-pill ${paymentFilter === 'ALL' ? 'active' : ''}`} type="button" onClick={() => setPaymentFilter('ALL')}>
                    Tất cả (<span id="countPaymentAll">{payments.length}</span>)
                  </button>
                  <button className={`summary-pill confirmed ${paymentFilter === 'Đã thanh toán' ? 'active' : ''}`} type="button" onClick={() => setPaymentFilter('Đã thanh toán')}>
                    Đã thanh toán ({payments.filter((p) => p.status === 'Đã thanh toán').length})
                  </button>
                  <button className={`summary-pill pending ${paymentFilter === 'Chờ xác nhận' ? 'active' : ''}`} type="button" onClick={() => setPaymentFilter('Chờ xác nhận')}>
                    Chờ xác nhận ({payments.filter((p) => p.status === 'Chờ xác nhận').length})
                  </button>
                </div>
                <button
                  className="btn btn-primary"
                  id="btnOpenAddPaymentModal"
                  type="button"
                  onClick={handleOpenAddPayment}
                >
                  ➕ Tạo phiếu thu mới
                </button>
              </div>

              <div className="table-filter-bar">
                <div className="filter-group">
                  <span className="filter-icon">🔍</span>
                  <input
                    type="text"
                    id="paymentSearchInput"
                    placeholder="Tìm theo mã GD, mã HĐ, tên khách hàng..."
                    value={paymentSearchTerm}
                    onChange={(e) => setPaymentSearchTerm(e.target.value)}
                  />
                </div>
                <div className="filter-group select-group">
                  <label htmlFor="paymentStatusFilter">Trạng thái:</label>
                  <select id="paymentStatusFilter" value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="Đã thanh toán">Đã thanh toán</option>
                    <option value="Chờ xác nhận">Chờ xác nhận</option>
                  </select>
                </div>
              </div>

              <div className="panel table-panel">
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Mã GD</th>
                        <th>Mã Hợp Đồng</th>
                        <th>Khách hàng</th>
                        <th>Số tiền (VNĐ)</th>
                        <th>Hình thức</th>
                        <th>Đợt thanh toán</th>
                        <th>Ngày giao dịch</th>
                        <th>Trạng thái</th>
                        <th className="text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody id="paymentsTableBody">
                      {payments
                        .filter(
                          (p) =>
                            (paymentFilter === 'ALL' || p.status === paymentFilter) &&
                            (p.id.toLowerCase().includes(paymentSearchTerm.toLowerCase()) ||
                              p.contractId.toLowerCase().includes(paymentSearchTerm.toLowerCase()) ||
                              p.customer.toLowerCase().includes(paymentSearchTerm.toLowerCase()))
                        )
                        .map((p) => (
                          <tr key={p.id}>
                            <td><strong>{p.id}</strong></td>
                            <td><strong>{p.contractId}</strong></td>
                            <td>{p.customer}</td>
                            <td><strong style={{ color: '#087f82' }}>{formatVND(p.amount)}</strong></td>
                            <td>{p.method}</td>
                            <td><span className="summary-pill" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>{p.phase || 'Thanh toán'}</span></td>
                            <td>{p.date}</td>
                            <td>
                              <span className={`status-badge ${p.status === 'Đã thanh toán' ? 'status-confirmed' : 'status-pending'}`}>
                                {p.status}
                              </span>
                            </td>
                            <td className="text-right">
                              <div className="btn-action-group">
                                <button
                                  className="btn-action"
                                  type="button"
                                  onClick={() => handleViewReceipt(p)}
                                  title="Xem & in biên nhận phiếu thu"
                                >
                                  🧾 Biên nhận
                                </button>
                                <button
                                  className="btn-action"
                                  type="button"
                                  onClick={() => handleEditPayment(p)}
                                  title="Chỉnh sửa phiếu thu"
                                >
                                  ✏️ Sửa
                                </button>
                                <button
                                  className="btn-action btn-action--danger"
                                  type="button"
                                  onClick={() => handleDeletePayment(p.id)}
                                  title="Xóa phiếu thu"
                                >
                                  🗑️ Xóa
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* TAB 8: QUẢN LÝ THỰC ĐƠN & MÓN ĂN */}
          {activeTab === 'tab-menus' && (
            <section id="tab-menus" className="admin-tab-pane active">
              <div className="tab-header-row">
                <h2>Danh sách Set Menu Tiệc</h2>
                <button className="btn btn-primary" id="btnOpenAddMenuModal" type="button" onClick={handleOpenAddMenu}>
                  ➕ Thêm thực đơn mới
                </button>
              </div>

              <div className="panel table-panel">
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Mã Menu</th>
                        <th>Tên Thực Đơn</th>
                        <th>Mô tả / Danh sách món</th>
                        <th>Đơn giá (VNĐ)</th>
                        <th>Trạng thái</th>
                        <th className="text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody id="menusTableBody">
                      {menus.map((m) => (
                        <tr key={m.id}>
                          <td><strong>{m.id}</strong></td>
                          <td><strong style={{ color: '#087f82' }}>{m.name}</strong></td>
                          <td style={{ maxWidth: '400px', fontSize: '0.9rem', color: '#64748b' }}>{m.description}</td>
                          <td><strong>{formatVND(m.price)}</strong></td>
                          <td>
                            <span className={`status-badge ${m.status === 'ACTIVE' ? 'status-confirmed' : 'status-pending'}`}>
                              {m.status === 'ACTIVE' ? 'Đang phục vụ' : 'Ngừng phục vụ'}
                            </span>
                          </td>
                          <td className="text-right">
                            <div className="btn-action-group">
                              <button
                                className="btn-action"
                                type="button"
                                onClick={() => handleEditMenu(m)}
                                title="Chỉnh sửa thực đơn"
                              >
                                ✏️ Sửa
                              </button>
                              <button
                                className="btn-action btn-action--danger"
                                type="button"
                                onClick={() => handleDeleteMenu(m.id)}
                                title="Xóa thực đơn"
                              >
                                🗑️ Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="tab-header-row" style={{ marginTop: '40px' }}>
                <h2>Danh sách Món ăn (Dishes)</h2>
                <button
                  className="btn btn-outline"
                  id="btnOpenAddDishModal"
                  type="button"
                  style={{ color: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
                  onClick={handleOpenAddDish}
                >
                  ➕ Thêm món ăn mới
                </button>
              </div>

              <div className="panel table-panel">
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Mã Món</th>
                        <th>Tên Món Ăn</th>
                        <th>Phân loại</th>
                        <th>Đơn giá (VNĐ)</th>
                        <th>Trạng thái</th>
                        <th className="text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody id="dishesTableBody">
                      {dishes.map((d) => (
                        <tr key={d.id}>
                          <td><strong>{d.id}</strong></td>
                          <td><strong>{d.name}</strong></td>
                          <td><span className="status-badge status-pending">{d.category}</span></td>
                          <td><strong>{formatVND(d.price)}</strong></td>
                          <td>
                            <span className={`status-badge ${d.status === 'ACTIVE' ? 'status-confirmed' : 'status-pending'}`}>
                              {d.status === 'ACTIVE' ? 'Đang phục vụ' : 'Ngừng phục vụ'}
                            </span>
                          </td>
                          <td className="text-right">
                            <div className="btn-action-group">
                              <button
                                className="btn-action"
                                type="button"
                                onClick={() => handleEditDish(d)}
                                title="Chỉnh sửa món ăn"
                              >
                                ✏️ Sửa
                              </button>
                              <button
                                className="btn-action btn-action--danger"
                                type="button"
                                onClick={() => handleDeleteDish(d.id)}
                                title="Xóa món ăn"
                              >
                                🗑️ Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* TAB 9: QUẢN LÝ DỊCH VỤ */}
          {activeTab === 'tab-services' && (
            <section id="tab-services" className="admin-tab-pane active">
              <div className="tab-header-row">
                <h2>Danh sách Dịch vụ (Services)</h2>
                <button className="btn btn-primary" id="btnOpenAddServiceModal" type="button" onClick={handleOpenAddService}>
                  ➕ Thêm dịch vụ mới
                </button>
              </div>
              <div className="card" style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div className="table-responsive">
                  <table className="admin-table mini-table">
                    <thead>
                      <tr>
                        <th>Mã DV</th>
                        <th>Tên dịch vụ</th>
                        <th>Mô tả</th>
                        <th>Đơn giá</th>
                        <th>Trạng thái</th>
                        <th className="text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody id="servicesTableBody">
                      {services.map((s) => (
                        <tr key={s.id}>
                          <td><strong>{s.id}</strong></td>
                          <td><strong style={{ color: '#087f82' }}>{s.name}</strong></td>
                          <td style={{ color: '#64748b' }}>{s.description}</td>
                          <td><strong>{formatVND(s.price)}</strong></td>
                          <td>
                            <span className={`status-badge ${s.status === 'ACTIVE' ? 'status-confirmed' : 'status-pending'}`}>
                              {s.status === 'ACTIVE' ? 'Đang phục vụ' : 'Ngừng phục vụ'}
                            </span>
                          </td>
                          <td className="text-right">
                            <div className="btn-action-group">
                              <button
                                className="btn-action"
                                type="button"
                                onClick={() => handleEditService(s)}
                                title="Chỉnh sửa dịch vụ"
                              >
                                ✏️ Sửa
                              </button>
                              <button
                                className="btn-action btn-action--danger"
                                type="button"
                                onClick={() => handleDeleteService(s.id)}
                                title="Xóa dịch vụ"
                              >
                                🗑️ Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* TAB 10: LỊCH TRÌNH SỰ KIỆN */}
          {activeTab === 'tab-calendar' && (
            <section id="tab-calendar" className="admin-tab-pane active">
              <div className="panel calendar-panel">
                <div className="panel-heading">
                  <div>
                    <p className="panel-kicker">LỊCH VẬN HÀNH TRỰC QUAN</p>
                    <h2>Lịch trình các sự kiện đã đặt (Tháng 10/2026)</h2>
                  </div>
                </div>
                <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', fontWeight: 700, color: '#475569', marginBottom: '12px' }}>
                    <div>T2</div><div>T3</div><div>T4</div><div>T5</div><div>T6</div><div>T7</div><div>CN</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                      const hasEvent15 = day === 15;
                      const hasEvent20 = day === 20;
                      return (
                        <div
                          key={day}
                          style={{
                            minHeight: '80px',
                            border: '1px solid #f1f5f9',
                            borderRadius: '8px',
                            padding: '6px',
                            background: hasEvent15 || hasEvent20 ? '#f0fdfa' : '#fff',
                            borderColor: hasEvent15 || hasEvent20 ? '#087f82' : '#e2e8f0',
                          }}
                        >
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: hasEvent15 || hasEvent20 ? '#087f82' : '#64748b' }}>
                            {day}
                          </div>
                          {hasEvent15 && (
                            <div style={{ marginTop: '4px', fontSize: '0.75rem', background: '#087f82', color: '#fff', borderRadius: '4px', padding: '2px 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              Tiệc Cưới Hoàng Gia
                            </div>
                          )}
                          {hasEvent20 && (
                            <div style={{ marginTop: '4px', fontSize: '0.75rem', background: '#f59e0b', color: '#fff', borderRadius: '4px', padding: '2px 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              Gala TechCorp 10Y
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* TAB 11: QUẢN LÝ NGƯỜI DÙNG */}
          {activeTab === 'tab-users' && (
            <section id="tab-users" className="admin-tab-pane active">
              <div className="tab-header-row">
                <h2>Danh sách người dùng hệ thống</h2>
                <button className="btn btn-primary" id="btnOpenAddUserModal" type="button" onClick={handleOpenAddUser}>
                  ➕ Thêm người dùng mới
                </button>
              </div>

              <div className="panel table-panel">
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Mã ND</th>
                        <th>Họ và tên</th>
                        <th>Email / Username</th>
                        <th>Vai trò</th>
                        <th>Trạng thái</th>
                        <th className="text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody id="usersTableBody">
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td><strong>{u.id}</strong></td>
                          <td><strong>{u.name}</strong></td>
                          <td>{u.email}</td>
                          <td>
                            <span className="summary-pill" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                              {u.role}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge ${u.status === 'ACTIVE' ? 'status-completed' : 'status-pending'}`}>
                              {u.status === 'ACTIVE' ? 'Hoạt động' : 'Bị khóa'}
                            </span>
                          </td>
                          <td className="text-right">
                            <div className="btn-action-group">
                              <button
                                className="btn-action"
                                type="button"
                                onClick={() => handleEditUser(u)}
                                title="Chỉnh sửa thông tin"
                              >
                                ✏️ Sửa
                              </button>
                              <button
                                className="btn-action"
                                type="button"
                                onClick={() => handleToggleUserStatus(u)}
                                title={u.status === 'ACTIVE' ? 'Khóa tài khoản này' : 'Mở khóa tài khoản'}
                              >
                                {u.status === 'ACTIVE' ? '🔒 Khóa' : '🔓 Mở'}
                              </button>
                              <button
                                className="btn-action btn-action--danger"
                                type="button"
                                onClick={() => handleDeleteUser(u.id)}
                                title="Xóa tài khoản"
                              >
                                🗑️ Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* TAB 12: BÁO CÁO DOANH THU & DÒNG TIỀN */}
          {activeTab === 'tab-reports' && (() => {
            // Tính toán tổng hợp từ contracts và payments
            const totalRevenueContract = contracts.reduce((sum, c) => sum + (Number(c.total) || 0), 0);
            const totalReceivedPayment = payments
              .filter((p) => p.status === 'Đã thanh toán' || p.status === 'SUCCESS')
              .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
            const totalPendingPayment = payments
              .filter((p) => p.status === 'Chờ xác nhận' || p.status === 'PENDING')
              .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
            const totalOutstanding = Math.max(0, totalRevenueContract - totalReceivedPayment);
            const collectionRate = totalRevenueContract > 0 ? Math.round((totalReceivedPayment / totalRevenueContract) * 100) : 0;

            // Xử lý dữ liệu từng dòng hợp đồng
            const revenueReportItems = contracts.map((c) => {
              const relatedPayments = payments.filter((p) => p.contractId === c.id);
              const paid = relatedPayments
                .filter((p) => p.status === 'Đã thanh toán' || p.status === 'SUCCESS')
                .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
              const total = Number(c.total) || 0;
              const remaining = Math.max(0, total - paid);
              const percent = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0;

              const matchedEvent = events.find(
                (e) => e.title.toLowerCase().includes(c.event.toLowerCase()) || c.event.toLowerCase().includes(e.title.toLowerCase())
              );
              const matchedCustomer = customers.find((cust) => cust.name.toLowerCase() === c.customer.toLowerCase());

              let statusText = 'Chưa thanh toán';
              let statusClass = 'status-cancelled';
              if (percent === 100) {
                statusText = 'Đã tất toán';
                statusClass = 'status-confirmed';
              } else if (paid > 0) {
                statusText = `Đã cọc (${percent}%)`;
                statusClass = 'status-pending';
              }

              return {
                id: c.id,
                customer: c.customer,
                customerPhone: matchedCustomer?.phone || '0901 234 567',
                customerEmail: matchedCustomer?.email || 'customer@evmanager.vn',
                event: c.event,
                venue: matchedEvent?.location || 'Trung tâm EVManager',
                date: c.date || '2026-10-15',
                total,
                paid,
                remaining,
                percent,
                contractStatus: c.status,
                paymentStatus: statusText,
                paymentStatusClass: statusClass,
                receipts: relatedPayments,
              };
            });

            const filteredRevenue = revenueReportItems.filter((item) => {
              const matchSearch =
                item.id.toLowerCase().includes(reportSearchTerm.toLowerCase()) ||
                item.customer.toLowerCase().includes(reportSearchTerm.toLowerCase()) ||
                item.event.toLowerCase().includes(reportSearchTerm.toLowerCase());
              const matchStatus =
                reportStatusFilter === 'ALL' ||
                (reportStatusFilter === 'COMPLETED' && item.percent === 100) ||
                (reportStatusFilter === 'PARTIAL' && item.percent > 0 && item.percent < 100) ||
                (reportStatusFilter === 'UNPAID' && item.percent === 0);
              return matchSearch && matchStatus;
            });

            const sumFilteredTotal = filteredRevenue.reduce((s, i) => s + i.total, 0);
            const sumFilteredPaid = filteredRevenue.reduce((s, i) => s + i.paid, 0);
            const sumFilteredRemaining = filteredRevenue.reduce((s, i) => s + i.remaining, 0);

            const handleExportRevenueCSV = () => {
              const headers = [
                'Mã Hợp Đồng',
                'Khách hàng',
                'Số điện thoại',
                'Tên sự kiện',
                'Địa điểm/Sảnh',
                'Ngày ký kết',
                'Tổng giá trị (VNĐ)',
                'Đã thanh toán (VNĐ)',
                'Công nợ còn lại (VNĐ)',
                'Tỷ lệ (%)',
                'Trạng thái công nợ',
              ];
              const rows = filteredRevenue.map((r) => [
                r.id,
                `"${r.customer}"`,
                `"${r.customerPhone}"`,
                `"${r.event}"`,
                `"${r.venue}"`,
                r.date,
                r.total,
                r.paid,
                r.remaining,
                `${r.percent}%`,
                `"${r.paymentStatus}"`,
              ]);
              const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.setAttribute('href', url);
              link.setAttribute('download', `Bao_Cao_Doanh_Thu_EVManager_${new Date().toISOString().split('T')[0]}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              showToast('Xuất báo cáo doanh thu CSV thành công!', 'success');
            };

            return (
              <section id="tab-reports" className="admin-tab-pane active">
                {/* 1. HEADER ROW WITH TITLE & ACTION BUTTONS */}
                <div className="tab-header-row" style={{ alignItems: 'flex-start', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                      Báo cáo Tổng hợp Doanh thu & Dòng tiền
                    </h2>
                    <p className="section-subtitle" style={{ margin: 0, color: '#64748b' }}>
                      Thống kê doanh thu theo hợp đồng, tỷ lệ thu hồi công nợ và lưu chuyển dòng tiền thực tế
                    </p>
                  </div>
                  <ExportReportButtons
                    contracts={filteredRevenue}
                    totalRevenue={sumFilteredTotal}
                    totalPaid={sumFilteredPaid}
                    totalRemaining={sumFilteredRemaining}
                    onPrintReport={() => window.print()}
                  />
                </div>

                {/* 2. 4 METRIC KPI CARDS */}
                <div className="overview-grid" style={{ marginBottom: '24px' }}>
                  <article className="metric-card metric-card--revenue">
                    <div className="metric-header">
                      <div className="metric-icon">₫</div>
                      <span className="metric-trend positive">+18.5% YoY</span>
                    </div>
                    <div className="metric-body">
                      <h2>Tổng doanh thu Hợp đồng</h2>
                      <p className="metric-value">{formatVND(totalRevenueContract)}</p>
                      <p className="metric-note">Tổng giá trị {contracts.length} hợp đồng đã ký kết</p>
                    </div>
                  </article>

                  <article className="metric-card metric-card--events">
                    <div className="metric-header">
                      <div className="metric-icon">💳</div>
                      <span className="metric-trend positive">{collectionRate}% thu hồi</span>
                    </div>
                    <div className="metric-body">
                      <h2>Thực thu dòng tiền</h2>
                      <p className="metric-value" style={{ color: '#087f82' }}>{formatVND(totalReceivedPayment)}</p>
                      <p className="metric-note">Đã nhận đủ vào tài khoản ngân hàng</p>
                    </div>
                  </article>

                  <article className="metric-card metric-card--contracts">
                    <div className="metric-header">
                      <div className="metric-icon">⌛</div>
                      <span className="metric-trend warning">Cần thu tiếp</span>
                    </div>
                    <div className="metric-body">
                      <h2>Công nợ còn phải thu</h2>
                      <p className="metric-value" style={{ color: '#d97706' }}>{formatVND(totalOutstanding)}</p>
                      <p className="metric-note">Khoản thanh toán đợt 2 & tất toán sau tiệc</p>
                    </div>
                  </article>

                  <article className="metric-card metric-card--customers">
                    <div className="metric-header">
                      <div className="metric-icon">🔍</div>
                      <span className="metric-trend warning">Đối soát</span>
                    </div>
                    <div className="metric-body">
                      <h2>Chờ xác nhận phiếu thu</h2>
                      <p className="metric-value" style={{ color: '#6366f1' }}>{formatVND(totalPendingPayment)}</p>
                      <p className="metric-note">Ủy nhiệm chi đang chờ kế toán duyệt</p>
                    </div>
                  </article>
                </div>

                {/* 3. VISUAL ANALYTICS ROW (Chart.js 6 tháng & Phân bổ theo sảnh) */}
                <RevenueCharts />

                {/* 4. TABLE FILTER & SEARCH BAR */}
                <div className="table-filter-bar" style={{ marginBottom: '16px' }}>
                  <div className="filter-group">
                    <span className="filter-icon">🔍</span>
                    <input
                      type="text"
                      placeholder="Tìm theo mã HĐ, tên khách hàng, tên sự kiện..."
                      value={reportSearchTerm}
                      onChange={(e) => setReportSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="filter-group select-group">
                    <label htmlFor="reportStatusFilterSelect">Trạng thái thanh toán:</label>
                    <select
                      id="reportStatusFilterSelect"
                      value={reportStatusFilter}
                      onChange={(e) => setReportStatusFilter(e.target.value)}
                    >
                      <option value="ALL">Tất cả hợp đồng</option>
                      <option value="COMPLETED">Đã tất toán (100%)</option>
                      <option value="PARTIAL">Đang trả góp / Đã cọc</option>
                      <option value="UNPAID">Chưa thanh toán</option>
                    </select>
                  </div>
                  <div className="filter-group select-group">
                    <label htmlFor="reportPeriodSelect">Kỳ báo cáo:</label>
                    <select
                      id="reportPeriodSelect"
                      value={reportPeriod}
                      onChange={(e) => setReportPeriod(e.target.value)}
                    >
                      <option value="ALL">Tất cả các kỳ</option>
                      <option value="M10">Tháng 10/2026</option>
                      <option value="Q4">Quý 4/2026</option>
                      <option value="Y2026">Năm 2026</option>
                    </select>
                  </div>
                </div>

                {/* 5. MAIN REVENUE REPORT TABLE */}
                <div className="panel table-panel" style={{ marginBottom: '32px' }}>
                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Mã HĐ</th>
                          <th>Tên Sự Kiện & Sảnh</th>
                          <th>Khách hàng</th>
                          <th>Ngày ký</th>
                          <th className="text-right">Tổng giá trị (VNĐ)</th>
                          <th className="text-right">Thực thu (VNĐ)</th>
                          <th className="text-right">Công nợ (VNĐ)</th>
                          <th style={{ minWidth: '120px' }}>Tiến độ</th>
                          <th>Trạng thái</th>
                          <th className="text-right">Chi tiết</th>
                        </tr>
                      </thead>
                      <tbody id="revenueTableBody">
                        {filteredRevenue.length === 0 ? (
                          <tr>
                            <td colSpan="10" style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                              Không tìm thấy hợp đồng nào khớp với bộ lọc báo cáo doanh thu.
                            </td>
                          </tr>
                        ) : (
                          filteredRevenue.map((row) => (
                            <tr key={row.id}>
                              <td><strong>{row.id}</strong></td>
                              <td>
                                <strong style={{ color: '#0f172a' }}>{row.event}</strong>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>🏛️ {row.venue}</div>
                              </td>
                              <td>
                                <div><strong>{row.customer}</strong></div>
                                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>📞 {row.customerPhone}</div>
                              </td>
                              <td>{row.date}</td>
                              <td className="text-right">
                                <strong>{formatVND(row.total)}</strong>
                              </td>
                              <td className="text-right" style={{ color: '#087f82', fontWeight: 700 }}>
                                {formatVND(row.paid)}
                              </td>
                              <td className="text-right" style={{ color: row.remaining > 0 ? '#d97706' : '#64748b', fontWeight: 700 }}>
                                {formatVND(row.remaining)}
                              </td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <div style={{ flex: 1, height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div
                                      style={{
                                        width: `${row.percent}%`,
                                        height: '100%',
                                        background: row.percent === 100 ? '#10b981' : '#087f82',
                                        borderRadius: '4px',
                                      }}
                                    ></div>
                                  </div>
                                  <span style={{ fontSize: '0.75rem', fontWeight: 700, minWidth: '32px' }}>{row.percent}%</span>
                                </div>
                              </td>
                              <td>
                                <span className={`status-badge ${row.paymentStatusClass}`}>
                                  {row.paymentStatus}
                                </span>
                              </td>
                              <td className="text-right">
                                <button
                                  className="btn-action"
                                  type="button"
                                  onClick={() => {
                                    const c = contracts.find((ct) => ct.id === row.id);
                                    if (c) handleViewContractDetail(c);
                                  }}
                                  title="Xem chi tiết hợp đồng và phiếu thu liên quan"
                                >
                                  👁️ Xem
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                      {filteredRevenue.length > 0 && (
                        <tfoot style={{ background: '#f8fafc', fontWeight: 800, borderTop: '2px solid #cbd5e1' }}>
                          <tr>
                            <td colSpan="4">
                              <span style={{ fontSize: '0.95rem', color: '#0f172a' }}>
                                TỔNG CỘNG ({filteredRevenue.length} HỢP ĐỒNG):
                              </span>
                            </td>
                            <td className="text-right" style={{ fontSize: '1rem', color: '#0f172a' }}>
                              {formatVND(sumFilteredTotal)}
                            </td>
                            <td className="text-right" style={{ fontSize: '1rem', color: '#087f82' }}>
                              {formatVND(sumFilteredPaid)}
                            </td>
                            <td className="text-right" style={{ fontSize: '1rem', color: '#d97706' }}>
                              {formatVND(sumFilteredRemaining)}
                            </td>
                            <td colSpan="3">
                              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                Tỷ lệ thu hồi chung: {sumFilteredTotal > 0 ? Math.round((sumFilteredPaid / sumFilteredTotal) * 100) : 0}%
                              </span>
                            </td>
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>
                </div>

                {/* 6. LOGS GIAO DỊCH THANH TOÁN GẦN NHẤT */}
                <div className="tab-header-row" style={{ marginTop: '32px', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
                      🧾 Nhật ký Phiếu thu & Dòng tiền Thực nhận
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                      Chi tiết từng đợt thanh toán và số tiền đã giải ngân vào tài khoản ngân hàng
                    </p>
                  </div>
                  <button
                    className="btn btn-outline"
                    type="button"
                    onClick={() => setActiveTab('tab-payments')}
                    style={{ fontSize: '0.85rem' }}
                  >
                    Quản lý phiếu thu →
                  </button>
                </div>

                <div className="panel table-panel">
                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Mã GD</th>
                          <th>Mã HĐ</th>
                          <th>Khách hàng</th>
                          <th>Đợt thanh toán</th>
                          <th>Phương thức</th>
                          <th>Ngày thu</th>
                          <th className="text-right">Số tiền (VNĐ)</th>
                          <th>Trạng thái</th>
                          <th className="text-right">Biên lai</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((p) => (
                          <tr key={p.id}>
                            <td><strong>{p.id}</strong></td>
                            <td><strong>{p.contractId}</strong></td>
                            <td>{p.customer}</td>
                            <td><span className="summary-pill" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>{p.phase || 'Thanh toán'}</span></td>
                            <td>{p.method}</td>
                            <td>{p.date}</td>
                            <td className="text-right">
                              <strong style={{ color: '#087f82' }}>{formatVND(p.amount)}</strong>
                            </td>
                            <td>
                              <span className={`status-badge ${p.status === 'Đã thanh toán' ? 'status-confirmed' : 'status-pending'}`}>
                                {p.status}
                              </span>
                            </td>
                            <td className="text-right">
                              <button
                                className="btn-action"
                                type="button"
                                onClick={() => handleViewReceipt(p)}
                                title="Xem biên nhận"
                              >
                                🧾 Xem
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            );
          })()}

          {/* TAB 13: CẤU HÌNH HỆ THỐNG */}
          {activeTab === 'tab-settings' && (
            <section id="tab-settings" className="admin-tab-pane active">
              <div className="panel empty-state-panel">
                <div className="empty-icon">⚙️</div>
                <h2>Cấu hình Hệ thống</h2>
                <p>Quản lý phân quyền tài khoản admin, cấu hình thông báo và kết nối email.</p>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* ========================================================
          ĐẦY ĐỦ 7 MODAL NGUYÊN BẢN KÈM CLASS OPEN HOẠT ĐỘNG 100%
          ======================================================== */}

      {/* 1. MODAL: THÊM / SỬA SỰ KIỆN */}
      {showEventModal && (
        <div className="admin-modal open" id="eventModal">
          <div className="modal-backdrop" id="eventModalBackdrop" onClick={() => setShowEventModal(false)}></div>
          <div className="modal-card">
            <div className="modal-header">
              <h3 id="eventModalTitle">
                {editingEventId ? `Chỉnh sửa sự kiện #${editingEventId}` : 'Thêm sự kiện mới'}
              </h3>
              <button className="modal-close" id="btnCloseEventModal" type="button" onClick={() => setShowEventModal(false)}>✕</button>
            </div>
            <form id="eventForm" className="modal-body" onSubmit={handleSaveEvent}>
              <div className="form-group">
                <label htmlFor="eventTitle">Tên sự kiện *</label>
                <input
                  type="text"
                  id="eventTitle"
                  name="title"
                  placeholder="Ví dụ: Tiệc cưới Anh Nam & Chị Hoa"
                  value={eventFormData.title}
                  onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="eventClient">Tên khách hàng / Đơn vị *</label>
                  <input
                    type="text"
                    id="eventClient"
                    name="client"
                    placeholder="Ví dụ: Nguyễn Văn Minh"
                    value={eventFormData.client}
                    onChange={(e) => setEventFormData({ ...eventFormData, client: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="eventType">Loại hình sự kiện *</label>
                  <select
                    id="eventType"
                    name="type"
                    value={eventFormData.type}
                    onChange={(e) => setEventFormData({ ...eventFormData, type: e.target.value })}
                    required
                  >
                    <option value="Tiệc cưới">Tiệc cưới</option>
                    <option value="Hội nghị">Hội nghị / Gala</option>
                    <option value="Concert">Concert / Liveshow</option>
                    <option value="Sinh nhật">Sinh nhật / Kỷ niệm</option>
                  </select>
                </div>
              </div>
              <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="eventDate">Ngày & Giờ tổ chức *</label>
                  <input
                    type="datetime-local"
                    id="eventDate"
                    name="date"
                    value={eventFormData.date}
                    onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="eventBudget">Dự trù ngân sách (VNĐ) *</label>
                  <input
                    type="number"
                    id="eventBudget"
                    name="budget"
                    placeholder="150000000"
                    step="1000000"
                    value={eventFormData.budget}
                    onChange={(e) => setEventFormData({ ...eventFormData, budget: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="eventLocation">Địa điểm tổ chức *</label>
                <input
                  type="text"
                  id="eventLocation"
                  name="location"
                  placeholder="Ví dụ: Trung tâm hội nghị GEM Center, Q.1"
                  value={eventFormData.location}
                  onChange={(e) => setEventFormData({ ...eventFormData, location: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="eventStatus">Trạng thái *</label>
                <select
                  id="eventStatus"
                  name="status"
                  value={eventFormData.status}
                  onChange={(e) => setEventFormData({ ...eventFormData, status: e.target.value })}
                  required
                >
                  <option value="Đã xác nhận">Đã xác nhận</option>
                  <option value="Đang chuẩn bị">Đang chuẩn bị</option>
                  <option value="Hoàn thành">Hoàn thành</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" id="btnCancelEventForm" onClick={() => setShowEventModal(false)}>Hủy bỏ</button>
                <button type="submit" className="btn btn-primary" id="btnSaveEvent">
                  {editingEventId ? 'Lưu cập nhật' : 'Lưu sự kiện'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. MODAL: THÊM / SỬA KHÁCH HÀNG */}
      {showCustomerModal && (
        <div className="admin-modal open" id="customerModal">
          <div className="modal-backdrop" id="customerModalBackdrop" onClick={() => setShowCustomerModal(false)}></div>
          <div className="modal-card">
            <div className="modal-header">
              <h3 id="customerModalTitle">
                {editingCustomerId ? `Chỉnh sửa khách hàng #${editingCustomerId}` : 'Thêm khách hàng mới'}
              </h3>
              <button className="modal-close" id="btnCloseCustomerModal" type="button" onClick={() => setShowCustomerModal(false)}>✕</button>
            </div>
            <form id="customerForm" className="modal-body" onSubmit={handleSaveCustomer}>
              <div className="form-group">
                <label htmlFor="customerName">Họ và tên khách hàng *</label>
                <input
                  type="text"
                  id="customerName"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={customerFormData.name}
                  onChange={(e) => setCustomerFormData({ ...customerFormData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="customerPhone">Số điện thoại *</label>
                  <input
                    type="tel"
                    id="customerPhone"
                    placeholder="0901234567"
                    value={customerFormData.phone}
                    onChange={(e) => setCustomerFormData({ ...customerFormData, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="customerEmail">Email</label>
                  <input
                    type="email"
                    id="customerEmail"
                    placeholder="nguyenvana@gmail.com"
                    value={customerFormData.email}
                    onChange={(e) => setCustomerFormData({ ...customerFormData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="customerTier">Phân loại khách hàng *</label>
                  <select
                    id="customerTier"
                    value={customerFormData.tier}
                    onChange={(e) => setCustomerFormData({ ...customerFormData, tier: e.target.value })}
                    required
                  >
                    <option value="VIP">Khách VIP</option>
                    <option value="Thường">Khách Thường</option>
                    <option value="Tiềm năng">Khách Tiềm Năng</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="customerTotalSpent">Tổng chi tiêu ước tính (VNĐ)</label>
                  <input
                    type="number"
                    id="customerTotalSpent"
                    placeholder="0"
                    step="1000000"
                    value={customerFormData.totalSpent}
                    onChange={(e) => setCustomerFormData({ ...customerFormData, totalSpent: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="customerNotes">Ghi chú / Yêu cầu đặc biệt</label>
                <textarea
                  id="customerNotes"
                  rows="3"
                  placeholder="Ghi chú về sở thích, ngân sách hay dịch vụ quan tâm..."
                  value={customerFormData.notes}
                  onChange={(e) => setCustomerFormData({ ...customerFormData, notes: e.target.value })}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" id="btnCancelCustomerForm" onClick={() => setShowCustomerModal(false)}>Hủy bỏ</button>
                <button type="submit" className="btn btn-primary" id="btnSaveCustomer">
                  {editingCustomerId ? 'Lưu cập nhật' : 'Lưu thông tin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. MODAL: THÊM / SỬA NGƯỜI DÙNG */}
      {showUserModal && (
        <div className="admin-modal open" id="userModal">
          <div className="modal-backdrop" id="userModalBackdrop" onClick={() => setShowUserModal(false)}></div>
          <div className="modal-card">
            <div className="modal-header">
              <h3 id="userModalTitle">
                {editingUserId ? `Chỉnh sửa người dùng #${editingUserId}` : 'Thêm người dùng mới'}
              </h3>
              <button className="modal-close" id="btnCloseUserModal" type="button" onClick={() => setShowUserModal(false)}>✕</button>
            </div>
            <form id="userForm" className="modal-body" onSubmit={handleSaveUser}>
              <div className="form-group">
                <label htmlFor="userName">Họ và tên *</label>
                <input
                  type="text"
                  id="userName"
                  placeholder="Ví dụ: Trần Văn B"
                  value={userFormData.name}
                  onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="userEmail">Email / Username *</label>
                  <input
                    type="text"
                    id="userEmail"
                    placeholder="tranvanb@evmanager.com"
                    value={userFormData.email}
                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="userPassword">Mật khẩu {editingUserId ? '(để trống nếu không đổi)' : '*'}</label>
                  <input
                    type="password"
                    id="userPassword"
                    placeholder="******"
                    value={userFormData.password}
                    onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                    required={!editingUserId}
                  />
                </div>
              </div>
              <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="userRole">Cấp quyền hệ thống (Vai trò) *</label>
                  <select
                    id="userRole"
                    value={userFormData.role}
                    onChange={(e) => {
                      setUserFormData({ ...userFormData, role: e.target.value });
                      setSelectedUserRole(e.target.value);
                    }}
                    required
                  >
                    <option value="ADMIN">Quản trị viên (Admin)</option>
                    <option value="SALES">Nhân viên Kinh doanh (Sales)</option>
                    <option value="COORDINATOR">Điều phối viên (Coordinator)</option>
                    <option value="CUSTOMER">Khách hàng (Customer)</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="userStatus">Trạng thái tài khoản</label>
                  <select
                    id="userStatus"
                    value={userFormData.status}
                    onChange={(e) => setUserFormData({ ...userFormData, status: e.target.value })}
                  >
                    <option value="ACTIVE">Hoạt động (ACTIVE)</option>
                    <option value="LOCKED">Tạm khóa (LOCKED)</option>
                  </select>
                </div>
              </div>

              {/* VÙNG HIỂN THỊ CHI TIẾT QUYỀN HẠN */}
              <div
                id="roleDescriptionBox"
                style={{
                  padding: '12px',
                  background: '#f0f7ff',
                  borderLeft: '4px solid #0052cc',
                  borderRadius: '4px',
                  marginBottom: '16px',
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                  color: '#172b4d',
                }}
              >
                {userFormData.role === 'ADMIN' && '⭐ Quản trị viên: Toàn quyền truy cập mọi tính năng, phê duyệt hợp đồng, quản lý người dùng và cấu hình.'}
                {userFormData.role === 'SALES' && '💼 Nhân viên Sales: Quản lý khách hàng, tạo hợp đồng, báo giá sự kiện và theo dõi tiến độ thanh toán.'}
                {userFormData.role === 'COORDINATOR' && '📋 Điều phối viên: Quản lý checklist, phân công nhân sự, lịch trình sân khấu và giám sát vận hành sự kiện.'}
                {userFormData.role === 'CUSTOMER' && '👤 Khách hàng: Xem chi tiết hợp đồng đã ký kết, tiến độ chuẩn bị sự kiện và hóa đơn thanh toán cá nhân.'}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" id="btnCancelUserForm" onClick={() => setShowUserModal(false)}>Hủy bỏ</button>
                <button type="submit" className="btn btn-primary" id="btnSaveUser">
                  {editingUserId ? 'Lưu cập nhật' : 'Lưu thông tin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MODAL: THÊM / SỬA THỰC ĐƠN KÈM CHECKLIST MÓN ĂN */}
      {showMenuModal && (
        <div className="admin-modal open" id="menuModal">
          <div className="modal-backdrop" id="menuModalBackdrop" onClick={() => setShowMenuModal(false)}></div>
          <div className="modal-card" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 id="menuModalTitle">
                {editingMenuId ? `Chỉnh sửa thực đơn #${editingMenuId}` : 'Thêm thực đơn mới'}
              </h3>
              <button className="modal-close" id="btnCloseMenuModal" type="button" onClick={() => setShowMenuModal(false)}>×</button>
            </div>
            <form id="menuForm" className="modal-body" onSubmit={handleSaveMenu}>
              <div className="form-group">
                <label htmlFor="menuName">Tên thực đơn *</label>
                <input
                  type="text"
                  id="menuName"
                  placeholder="Ví dụ: Thực đơn Cưới Bạc"
                  value={menuFormData.name}
                  onChange={(e) => setMenuFormData({ ...menuFormData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="menuDescription">Mô tả thực đơn</label>
                <textarea
                  id="menuDescription"
                  rows="2"
                  placeholder="Ghi chú thêm về thực đơn..."
                  value={menuFormData.description}
                  onChange={(e) => setMenuFormData({ ...menuFormData, description: e.target.value })}
                ></textarea>
              </div>
              <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="menuPrice">Giá niêm yết / bàn (VNĐ) *</label>
                  <input
                    type="number"
                    id="menuPrice"
                    placeholder="Ví dụ: 3500000"
                    min="0"
                    step="100000"
                    value={menuFormData.price}
                    onChange={(e) => setMenuFormData({ ...menuFormData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="menuStatus">Trạng thái</label>
                  <select
                    id="menuStatus"
                    value={menuFormData.status}
                    onChange={(e) => setMenuFormData({ ...menuFormData, status: e.target.value })}
                  >
                    <option value="ACTIVE">Đang phục vụ (ACTIVE)</option>
                    <option value="INACTIVE">Ngừng phục vụ (INACTIVE)</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Danh sách món ăn gợi ý đính kèm</label>
                <div id="dishChecklist" style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px', borderRadius: '4px', background: '#fafafa' }}>
                  {dishes.map((dish) => (
                    <label key={dish.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={selectedMenuDishes.includes(dish.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMenuDishes([...selectedMenuDishes, dish.id]);
                          } else {
                            setSelectedMenuDishes(selectedMenuDishes.filter((id) => id !== dish.id));
                          }
                        }}
                      />
                      <span><strong>[{dish.category}]</strong> {dish.name} - {formatVND(dish.price)}</span>
                    </label>
                  ))}
                </div>
                <small className="text-muted" style={{ display: 'block', marginTop: '5px', color: '#64748b' }}>
                  Chọn các món ăn trên để tự động bổ sung vào danh mục món trong thực đơn.
                </small>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" id="btnCancelMenuForm" onClick={() => setShowMenuModal(false)}>Hủy bỏ</button>
                <button type="submit" className="btn btn-primary" id="btnSaveMenu">
                  {editingMenuId ? 'Lưu cập nhật' : 'Lưu thực đơn'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: TẠO HỢP ĐỒNG (WIZARD) / CHỈNH SỬA HỢP ĐỒNG */}
      {showContractModal && (
        <div className="admin-modal open" id="contractModal">
          <div className="modal-backdrop" id="contractModalBackdrop" onClick={() => setShowContractModal(false)}></div>
          <div className="modal-card" style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h3 id="contractModalTitle">
                {editingContractId ? `Chỉnh sửa Hợp đồng #${editingContractId}` : 'Trình tạo Hợp đồng Dịch vụ LV34'}
              </h3>
              <button className="modal-close" id="btnCloseContractModal" type="button" onClick={() => setShowContractModal(false)}>✕</button>
            </div>

            {editingContractId ? (
              // FORM CHỈNH SỬA HỢP ĐỒNG HIỆN CÓ
              <form id="editContractForm" className="modal-body" onSubmit={handleSaveContract}>
                <div className="form-row" style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label htmlFor="editContractCustomer">Khách hàng *</label>
                    <input
                      type="text"
                      id="editContractCustomer"
                      value={contractFormData.customer}
                      onChange={(e) => setContractFormData({ ...contractFormData, customer: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label htmlFor="editContractEvent">Tên sự kiện *</label>
                    <input
                      type="text"
                      id="editContractEvent"
                      value={contractFormData.event}
                      onChange={(e) => setContractFormData({ ...contractFormData, event: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row" style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label htmlFor="editContractTotal">Tổng giá trị hợp đồng (VNĐ) *</label>
                    <input
                      type="number"
                      id="editContractTotal"
                      step="1000000"
                      value={contractFormData.total}
                      onChange={(e) => setContractFormData({ ...contractFormData, total: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label htmlFor="editContractStatus">Trạng thái hợp đồng *</label>
                    <select
                      id="editContractStatus"
                      value={contractFormData.status}
                      onChange={(e) => setContractFormData({ ...contractFormData, status: e.target.value })}
                      required
                    >
                      <option value="Đã ký kết">Đã ký kết</option>
                      <option value="Chờ duyệt">Chờ duyệt</option>
                      <option value="Hoàn thành">Hoàn thành</option>
                      <option value="Đã hủy">Đã hủy</option>
                    </select>
                  </div>
                </div>

                <div className="form-row" style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label htmlFor="editContractDate">Ngày ký kết *</label>
                    <input
                      type="date"
                      id="editContractDate"
                      value={contractFormData.date}
                      onChange={(e) => setContractFormData({ ...contractFormData, date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="editContractNotes">Ghi chú điều khoản bổ sung</label>
                  <textarea
                    id="editContractNotes"
                    rows="3"
                    placeholder="Ghi chú về tiến độ thanh toán, ưu đãi hoặc điều khoản hủy dịch vụ..."
                    value={contractFormData.notes}
                    onChange={(e) => setContractFormData({ ...contractFormData, notes: e.target.value })}
                  ></textarea>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setShowContractModal(false)}>Hủy bỏ</button>
                  <button type="submit" className="btn btn-primary" id="btnSaveEditContract">Lưu cập nhật</button>
                </div>
              </form>
            ) : (
              // WIZARD TẠO HỢP ĐỒNG MỚI 3 BƯỚC
              <form id="contractForm" className="modal-body" style={{ paddingTop: '10px' }} onSubmit={handleSaveContract}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: 'bold', color: contractStep >= 1 ? 'var(--primary-color)' : '#94a3b8' }}>
                    1. Khách hàng & Sự kiện
                  </div>
                  <div style={{ fontWeight: 'bold', color: contractStep >= 2 ? 'var(--primary-color)' : '#94a3b8' }}>
                    2. Thực đơn & Dịch vụ
                  </div>
                  <div style={{ fontWeight: 'bold', color: contractStep >= 3 ? 'var(--primary-color)' : '#94a3b8' }}>
                    3. Xác nhận & Báo giá
                  </div>
                </div>

                {/* BƯỚC 1: Thông tin cơ bản */}
                {contractStep === 1 && (
                  <div id="contract-step-1">
                    <div className="form-row" style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label htmlFor="contractCustomer">Khách hàng *</label>
                        <select
                          id="contractCustomer"
                          value={contractCustomer}
                          onChange={(e) => setContractCustomer(e.target.value)}
                          required
                        >
                          <option value="">-- Chọn khách hàng --</option>
                          {customers.map((c) => (
                            <option key={c.id} value={c.name}>{c.name} ({c.phone})</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label htmlFor="contractEvent">Sự kiện (Chưa có HĐ) *</label>
                        <select
                          id="contractEvent"
                          value={contractEvent}
                          onChange={(e) => setContractEvent(e.target.value)}
                          required
                        >
                          <option value="">-- Chọn sự kiện --</option>
                          {events.map((ev) => (
                            <option key={ev.id} value={ev.title}>{ev.title}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="form-row" style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label htmlFor="contractDate">Ngày ký kết *</label>
                        <input
                          type="date"
                          id="contractDate"
                          value={contractDate}
                          onChange={(e) => setContractDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="modal-footer" style={{ justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        className="btn btn-primary"
                        id="btnNextToStep2"
                        onClick={() => {
                          if (!contractCustomer) {
                            setContractCustomer(customers[0]?.name || 'Nguyễn Văn Minh');
                          }
                          if (!contractEvent) {
                            setContractEvent(events[0]?.title || 'Tiệc Cưới Hoàng Gia');
                          }
                          setContractStep(2);
                        }}
                      >
                        Tiếp tục ➔
                      </button>
                    </div>
                  </div>
                )}

                {/* BƯỚC 2: Menu & Dịch vụ */}
                {contractStep === 2 && (
                  <div id="contract-step-2">
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                      <label htmlFor="contractMenu">Thực đơn tiệc</label>
                      <select
                        id="contractMenu"
                        value={contractSelectedMenu}
                        onChange={(e) => setContractSelectedMenu(e.target.value)}
                      >
                        <option value="">-- Không kèm thực đơn --</option>
                        {menus.map((m) => (
                          <option key={m.id} value={m.id}>{m.name} ({formatVND(m.price)} / bàn)</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Dịch vụ đi kèm</label>
                      <div id="contractServicesChecklist" style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '6px' }}>
                        {services.map((s) => (
                          <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={contractSelectedServices.includes(s.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setContractSelectedServices([...contractSelectedServices, s.id]);
                                } else {
                                  setContractSelectedServices(contractSelectedServices.filter((id) => id !== s.id));
                                }
                              }}
                            />
                            <span><strong>{s.name}</strong> - {formatVND(s.price)}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
                      <button type="button" className="btn btn-outline" id="btnBackToStep1" onClick={() => setContractStep(1)}>
                        ⬅ Quay lại
                      </button>
                      <button type="button" className="btn btn-primary" id="btnNextToStep3" onClick={() => setContractStep(3)}>
                        Xem Báo giá ➔
                      </button>
                    </div>
                  </div>
                )}

                {/* BƯỚC 3: Xác nhận Báo giá & Chốt hợp đồng */}
                {contractStep === 3 && (
                  <div id="contract-step-3">
                    <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>
                      <h4 style={{ marginTop: 0, color: '#172333', fontWeight: 700 }}>Bảng Tạm tính Giá trị Hợp đồng</h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>Tiền thực đơn (Dự tính 20 bàn):</span>
                        <strong id="previewMenuPrice">{formatVND(menuVal)}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>Tiền dịch vụ kèm theo:</span>
                        <strong id="previewServicesPrice">{formatVND(serviceVal)}</strong>
                      </div>
                      <hr style={{ border: 'none', borderTop: '1px dashed #cbd5e1', margin: '10px 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '1.1rem' }}>
                        <span>Tổng thanh toán:</span>
                        <strong style={{ color: '#d9534f' }} id="previewTotalAmount">{formatVND(totalVal > 0 ? totalVal : 150000000)}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                        <span>Cọc tối thiểu (30%):</span>
                        <strong id="previewDepositAmount" style={{ color: '#087f82' }}>{formatVND(depositVal > 0 ? depositVal : 45000000)}</strong>
                      </div>
                    </div>
                    <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
                      <button type="button" className="btn btn-outline" id="btnBackToStep2" onClick={() => setContractStep(2)}>
                        ⬅ Quay lại
                      </button>
                      <button type="submit" className="btn btn-primary" id="btnSaveContract">
                        ✔ Chốt Hợp đồng
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: XEM CHI TIẾT HỢP ĐỒNG (CONTRACT DETAIL) */}
      {showContractDetailModal && selectedContractDetail && (
        <div className="admin-modal open" id="contractDetailModal">
          <div className="modal-backdrop" onClick={() => setShowContractDetailModal(false)}></div>
          <div className="modal-card" style={{ maxWidth: '720px' }}>
            <div className="modal-header">
              <h3>Chi tiết Hợp đồng #{selectedContractDetail.id}</h3>
              <button className="modal-close" type="button" onClick={() => setShowContractDetailModal(false)}>✕</button>
            </div>
            <div className="modal-body printable-document">
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #087f82', paddingBottom: '12px', marginBottom: '20px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: '#087f82' }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h4>
                  <small style={{ color: '#64748b' }}>Độc lập - Tự do - Hạnh phúc</small>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong>MÃ HĐ: {selectedContractDetail.id}</strong>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Ngày lập: {selectedContractDetail.date}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h5 style={{ margin: '0 0 8px 0', color: '#0f172a' }}>👤 BÊN A (KHÁCH HÀNG)</h5>
                  <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Đại diện:</strong> {selectedContractDetail.customer}</p>
                  <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Sự kiện:</strong> {selectedContractDetail.event}</p>
                </div>
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h5 style={{ margin: '0 0 8px 0', color: '#0f172a' }}>🏢 BÊN B (ĐƠN VỊ TỔ CHỨC)</h5>
                  <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Công ty:</strong> LV34 Event & Catering Services</p>
                  <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Hotline:</strong> 1900 8888 (24/7)</p>
                </div>
              </div>

              <div style={{ background: '#f0fdfa', padding: '16px', borderRadius: '8px', border: '1px solid #99f6e4', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Tổng giá trị hợp đồng:</span>
                  <strong style={{ fontSize: '1.2rem', color: '#087f82' }}>{formatVND(selectedContractDetail.total)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                  <span>Tiền đặt cọc tối thiểu (30%):</span>
                  <strong>{formatVND(selectedContractDetail.total * 0.3)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>Tình trạng pháp lý:</span>
                  <span className={`status-badge ${selectedContractDetail.status === 'Đã ký kết' ? 'status-confirmed' : 'status-pending'}`}>
                    {selectedContractDetail.status}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>
                <strong>Điều khoản cam kết:</strong> Bên B cam kết tổ chức sự kiện theo đúng thỏa thuận về cơ sở vật chất, sảnh tiệc và thực đơn. Bên A cam kết thanh toán đợt cọc 30% trong vòng 03 ngày làm việc kể từ thời điểm ký hợp đồng.
              </div>
            </div>
            <div className="modal-footer no-print">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => window.print()}
              >
                🖨️ In hợp đồng (A4)
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setShowContractDetailModal(false)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL: THÊM / SỬA MÓN ĂN (DISH) */}
      {showDishModal && (
        <div className="admin-modal open" id="dishModal">
          <div className="modal-backdrop" id="dishModalBackdrop" onClick={() => setShowDishModal(false)}></div>
          <div className="modal-card" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 id="dishModalTitle">
                {editingDishId ? `Chỉnh sửa món ăn #${editingDishId}` : 'Thêm món ăn mới'}
              </h3>
              <button className="modal-close" id="btnCloseDishModal" type="button" onClick={() => setShowDishModal(false)}>×</button>
            </div>
            <form id="dishForm" className="modal-body" onSubmit={handleSaveDish}>
              <div className="form-group">
                <label htmlFor="dishName">Tên món ăn *</label>
                <input
                  type="text"
                  id="dishName"
                  placeholder="Ví dụ: Gà nướng mật ong"
                  value={dishFormData.name}
                  onChange={(e) => setDishFormData({ ...dishFormData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="dishCategory">Phân loại *</label>
                <select
                  id="dishCategory"
                  value={dishFormData.category}
                  onChange={(e) => setDishFormData({ ...dishFormData, category: e.target.value })}
                  required
                >
                  <option value="STARTER">Khai vị (STARTER)</option>
                  <option value="SOUP">Súp (SOUP)</option>
                  <option value="MAIN">Món chính (MAIN)</option>
                  <option value="DESSERT">Tráng miệng (DESSERT)</option>
                  <option value="DRINK">Đồ uống (DRINK)</option>
                </select>
              </div>
              <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="dishPrice">Đơn giá (VNĐ) *</label>
                  <input
                    type="number"
                    id="dishPrice"
                    placeholder="Ví dụ: 250000"
                    min="0"
                    step="10000"
                    value={dishFormData.price}
                    onChange={(e) => setDishFormData({ ...dishFormData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="dishStatus">Trạng thái</label>
                  <select
                    id="dishStatus"
                    value={dishFormData.status}
                    onChange={(e) => setDishFormData({ ...dishFormData, status: e.target.value })}
                  >
                    <option value="ACTIVE">Đang phục vụ (ACTIVE)</option>
                    <option value="INACTIVE">Ngừng phục vụ (INACTIVE)</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="dishDescription">Mô tả</label>
                <textarea
                  id="dishDescription"
                  rows="2"
                  placeholder="Ghi chú về nguyên liệu, hương vị..."
                  value={dishFormData.desc}
                  onChange={(e) => setDishFormData({ ...dishFormData, desc: e.target.value })}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" id="btnCancelDishForm" onClick={() => setShowDishModal(false)}>Hủy bỏ</button>
                <button type="submit" className="btn btn-primary" id="btnSaveDish">
                  {editingDishId ? 'Lưu cập nhật' : 'Lưu món ăn'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL: THÊM / SỬA DỊCH VỤ (SERVICE) */}
      {showServiceModal && (
        <div className="admin-modal open" id="serviceModal">
          <div className="modal-backdrop" id="serviceModalBackdrop" onClick={() => setShowServiceModal(false)}></div>
          <div className="modal-card" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 id="serviceModalTitle">
                {editingServiceId ? `Chỉnh sửa dịch vụ #${editingServiceId}` : 'Thêm dịch vụ mới'}
              </h3>
              <button className="modal-close" id="btnCloseServiceModal" type="button" onClick={() => setShowServiceModal(false)}>×</button>
            </div>
            <form id="serviceForm" className="modal-body" onSubmit={handleSaveService}>
              <div className="form-group">
                <label htmlFor="serviceName">Tên dịch vụ *</label>
                <input
                  type="text"
                  id="serviceName"
                  placeholder="Nhập tên dịch vụ (Vd: Ban nhạc acoustic)..."
                  value={serviceFormData.name}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="servicePrice">Đơn giá (VNĐ) *</label>
                  <input
                    type="number"
                    id="servicePrice"
                    placeholder="Ví dụ: 3000000"
                    min="0"
                    step="500000"
                    value={serviceFormData.price}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="serviceStatus">Trạng thái</label>
                  <select
                    id="serviceStatus"
                    value={serviceFormData.status}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, status: e.target.value })}
                  >
                    <option value="ACTIVE">Đang phục vụ (ACTIVE)</option>
                    <option value="INACTIVE">Ngừng phục vụ (INACTIVE)</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="serviceDescription">Mô tả chi tiết</label>
                <textarea
                  id="serviceDescription"
                  rows="3"
                  placeholder="Ghi chú thêm về nhân sự, trang thiết bị đi kèm..."
                  value={serviceFormData.description}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" id="btnCancelServiceForm" onClick={() => setShowServiceModal(false)}>Hủy bỏ</button>
                <button type="submit" className="btn btn-primary" id="btnSaveService">
                  {editingServiceId ? 'Lưu cập nhật' : 'Lưu dịch vụ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TẠO / SỬA PHIẾU THU TIỀN (PAYMENT MODAL) */}
      {showPaymentModal && (
        <div className="admin-modal open" id="paymentModal">
          <div className="modal-backdrop" id="paymentModalBackdrop" onClick={() => setShowPaymentModal(false)}></div>
          <div className="modal-card" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 id="paymentModalTitle">
                {editingPaymentId ? `Chỉnh sửa phiếu thu #${editingPaymentId}` : 'Tạo phiếu thu mới'}
              </h3>
              <button className="modal-close" type="button" onClick={() => setShowPaymentModal(false)}>✕</button>
            </div>
            <form id="paymentForm" className="modal-body" onSubmit={handleSavePayment}>
              <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="paymentContractId">Mã Hợp Đồng *</label>
                  <select
                    id="paymentContractId"
                    value={paymentFormData.contractId}
                    onChange={(e) => {
                      const selCt = contracts.find((c) => c.id === e.target.value);
                      setPaymentFormData({
                        ...paymentFormData,
                        contractId: e.target.value,
                        customer: selCt ? selCt.customer : paymentFormData.customer,
                      });
                    }}
                    required
                  >
                    {contracts.map((c) => (
                      <option key={c.id} value={c.id}>{c.id} - {c.customer}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="paymentCustomer">Người nộp tiền *</label>
                  <input
                    type="text"
                    id="paymentCustomer"
                    value={paymentFormData.customer}
                    onChange={(e) => setPaymentFormData({ ...paymentFormData, customer: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="paymentAmount">Số tiền thu (VNĐ) *</label>
                  <input
                    type="number"
                    id="paymentAmount"
                    placeholder="Ví dụ: 50000000"
                    step="1000000"
                    value={paymentFormData.amount}
                    onChange={(e) => setPaymentFormData({ ...paymentFormData, amount: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="paymentPhase">Đợt thanh toán *</label>
                  <select
                    id="paymentPhase"
                    value={paymentFormData.phase}
                    onChange={(e) => setPaymentFormData({ ...paymentFormData, phase: e.target.value })}
                    required
                  >
                    <option value="Đặt cọc 30%">Đặt cọc 30%</option>
                    <option value="Thanh toán đợt 2 (50%)">Thanh toán đợt 2 (50%)</option>
                    <option value="Quyết toán (20%)">Quyết toán (20%)</option>
                    <option value="Thanh toán toàn bộ 100%">Thanh toán toàn bộ 100%</option>
                    <option value="Phát sinh dịch vụ">Phát sinh dịch vụ</option>
                  </select>
                </div>
              </div>

              <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="paymentMethod">Hình thức thanh toán *</label>
                  <select
                    id="paymentMethod"
                    value={paymentFormData.method}
                    onChange={(e) => setPaymentFormData({ ...paymentFormData, method: e.target.value })}
                    required
                  >
                    <option value="Chuyển khoản (Vietcombank)">Chuyển khoản (Vietcombank)</option>
                    <option value="Chuyển khoản (BIDV)">Chuyển khoản (BIDV)</option>
                    <option value="Chuyển khoản doanh nghiệp">Chuyển khoản doanh nghiệp</option>
                    <option value="Tiền mặt tại quầy">Tiền mặt tại quầy</option>
                    <option value="Thẻ tín dụng (POS)">Thẻ tín dụng (POS)</option>
                    <option value="Cổng Momo / VNPAY">Cổng Momo / VNPAY</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="paymentStatus">Trạng thái phiếu thu *</label>
                  <select
                    id="paymentStatus"
                    value={paymentFormData.status}
                    onChange={(e) => setPaymentFormData({ ...paymentFormData, status: e.target.value })}
                    required
                  >
                    <option value="Đã thanh toán">Đã thanh toán</option>
                    <option value="Chờ xác nhận">Chờ xác nhận</option>
                  </select>
                </div>
              </div>

              <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="paymentDate">Ngày thu tiền *</label>
                  <input
                    type="date"
                    id="paymentDate"
                    value={paymentFormData.date}
                    onChange={(e) => setPaymentFormData({ ...paymentFormData, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="paymentNotes">Ghi chú giao dịch</label>
                <textarea
                  id="paymentNotes"
                  rows="2"
                  placeholder="Ghi chú số ủy nhiệm chi, mã chuẩn chi ngân hàng..."
                  value={paymentFormData.notes}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, notes: e.target.value })}
                ></textarea>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowPaymentModal(false)}>Hủy bỏ</button>
                <button type="submit" className="btn btn-primary" id="btnSavePayment">
                  {editingPaymentId ? 'Lưu cập nhật' : 'Tạo phiếu thu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: XEM BIÊN LAI / IN PHIẾU THU (RECEIPT MODAL) */}
      {showReceiptModal && selectedPaymentReceipt && (
        <div className="admin-modal open" id="receiptModal">
          <div className="modal-backdrop" onClick={() => setShowReceiptModal(false)}></div>
          <div className="modal-card" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h3>Biên lai thu tiền điện tử #{selectedPaymentReceipt.id}</h3>
              <button className="modal-close" type="button" onClick={() => setShowReceiptModal(false)}>✕</button>
            </div>
            <div className="modal-body printable-document" style={{ background: '#ffffff', padding: '24px' }}>
              <div style={{ textAlign: 'center', borderBottom: '2px solid #087f82', paddingBottom: '16px', marginBottom: '20px' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#087f82', letterSpacing: '0.5px' }}>
                  LV34 EVENT OPERATIONS & CATERING
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                  Hotline: 1900 8888 | info@lv34events.com | Chi nhánh TP. Hồ Chí Minh
                </div>
                <h3 style={{ margin: '14px 0 0 0', color: '#0f172a', fontSize: '1.2rem', textTransform: 'uppercase' }}>
                  PHIẾU THU TIỀN
                </h3>
                <small style={{ color: '#64748b' }}>Mã giao dịch: <strong>{selectedPaymentReceipt.id}</strong></small>
              </div>

              <div style={{ lineHeight: 1.8, fontSize: '0.95rem', color: '#334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', padding: '6px 0' }}>
                  <span>Khách hàng nộp tiền:</span>
                  <strong>{selectedPaymentReceipt.customer}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', padding: '6px 0' }}>
                  <span>Theo hợp đồng số:</span>
                  <strong>{selectedPaymentReceipt.contractId}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', padding: '6px 0' }}>
                  <span>Nội dung thu:</span>
                  <span>{selectedPaymentReceipt.phase || 'Thanh toán chi phí sự kiện'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', padding: '6px 0' }}>
                  <span>Hình thức thanh toán:</span>
                  <span>{selectedPaymentReceipt.method}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', padding: '6px 0' }}>
                  <span>Ngày thu:</span>
                  <span>{selectedPaymentReceipt.date}</span>
                </div>
                {selectedPaymentReceipt.notes && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', padding: '6px 0' }}>
                    <span>Ghi chú đối soát:</span>
                    <span>{selectedPaymentReceipt.notes}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: '1.15rem' }}>
                  <span>Số tiền thực thu:</span>
                  <strong style={{ color: '#087f82', fontSize: '1.3rem' }}>
                    {formatVND(selectedPaymentReceipt.amount)}
                  </strong>
                </div>
              </div>

              {/* Dấu mộc xác nhận */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', width: '180px' }}>
                  <small style={{ color: '#64748b' }}>Người nộp tiền</small>
                  <div style={{ height: '40px' }}></div>
                  <strong>{selectedPaymentReceipt.customer}</strong>
                </div>
                <div
                  style={{
                    border: '2px solid #087f82',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    color: '#087f82',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    transform: 'rotate(-5deg)',
                  }}
                >
                  ✓ ĐÃ THU ĐỦ TIỀN
                </div>
                <div style={{ textAlign: 'center', width: '180px' }}>
                  <small style={{ color: '#64748b' }}>Thủ quỹ / Kế toán</small>
                  <div style={{ height: '40px' }}></div>
                  <strong>Nguyễn Thảo (Kế toán)</strong>
                </div>
              </div>
            </div>
            <div className="modal-footer no-print">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => window.print()}
              >
                🖨️ In biên nhận / Phiếu thu
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setShowReceiptModal(false)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 8. MODAL: THÊM / SỬA CÔNG VIỆC (TASK) */}
      {showTaskModal && (
        <div className="admin-modal open" id="taskModal">
          <div className="modal-backdrop" id="taskModalBackdrop" onClick={() => setShowTaskModal(false)}></div>
          <div className="modal-card" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 id="taskModalTitle">
                {editingTaskId ? `Chỉnh sửa công việc #${editingTaskId}` : 'Thêm công việc mới'}
              </h3>
              <button className="modal-close" id="btnCloseTaskModal" type="button" onClick={() => setShowTaskModal(false)}>✕</button>
            </div>
            <form id="taskForm" className="modal-body" onSubmit={handleSaveTask}>
              <div className="form-group">
                <label htmlFor="taskName">Tên công việc *</label>
                <input
                  type="text"
                  id="taskName"
                  placeholder="Ví dụ: Kiểm tra hệ thống âm thanh sân khấu"
                  value={taskFormData.name}
                  onChange={(e) => setTaskFormData({ ...taskFormData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="taskEvent">Sự kiện liên quan *</label>
                  <select
                    id="taskEvent"
                    value={taskFormData.event}
                    onChange={(e) => setTaskFormData({ ...taskFormData, event: e.target.value })}
                    required
                  >
                    <option value="">-- Chọn sự kiện --</option>
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.title}>{ev.title}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="taskAssignee">Người phụ trách *</label>
                  <input
                    type="text"
                    id="taskAssignee"
                    placeholder="Ví dụ: Trần Quốc Huy (Kỹ thuật)"
                    value={taskFormData.assignee}
                    onChange={(e) => setTaskFormData({ ...taskFormData, assignee: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="taskDeadline">Hạn hoàn thành *</label>
                  <input
                    type="datetime-local"
                    id="taskDeadline"
                    value={taskFormData.deadline}
                    onChange={(e) => setTaskFormData({ ...taskFormData, deadline: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="taskProgress">Tiến độ (%) *</label>
                  <input
                    type="number"
                    id="taskProgress"
                    min="0"
                    max="100"
                    placeholder="50"
                    value={taskFormData.progress}
                    onChange={(e) => setTaskFormData({ ...taskFormData, progress: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="taskStatus">Trạng thái *</label>
                <select
                  id="taskStatus"
                  value={taskFormData.status}
                  onChange={(e) => setTaskFormData({ ...taskFormData, status: e.target.value })}
                  required
                >
                  <option value="Đang thực hiện">Đang thực hiện</option>
                  <option value="Đang tiến hành">Đang tiến hành</option>
                  <option value="Đã hoàn thành">Đã hoàn thành</option>
                  <option value="Chờ xử lý">Chờ xử lý</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="taskNotes">Ghi chú / Chi tiết yêu cầu</label>
                <textarea
                  id="taskNotes"
                  rows="3"
                  placeholder="Ghi chú chi tiết về checklist, vật tư, nhân sự liên quan..."
                  value={taskFormData.notes}
                  onChange={(e) => setTaskFormData({ ...taskFormData, notes: e.target.value })}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" id="btnCancelTaskForm" onClick={() => setShowTaskModal(false)}>Hủy bỏ</button>
                <button type="submit" className="btn btn-primary" id="btnSaveTask">
                  {editingTaskId ? 'Lưu cập nhật' : 'Lưu công việc'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* 9. MODAL: THÊM / SỬA SẢNH TIỆC (VENUE) */}
      {showVenueModal && (
        <div className="admin-modal open" id="venueModal">
          <div className="modal-backdrop" id="venueModalBackdrop" onClick={() => setShowVenueModal(false)}></div>
          <div className="modal-card" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 id="venueModalTitle">
                {editingVenueId ? `Chỉnh sửa sảnh tiệc #${editingVenueId}` : 'Thêm sảnh tiệc mới'}
              </h3>
              <button className="modal-close" id="btnCloseVenueModal" type="button" onClick={() => setShowVenueModal(false)}>✕</button>
            </div>
            <form id="venueForm" className="modal-body" onSubmit={handleSaveVenue}>
              <div className="form-group">
                <label htmlFor="venueName">Tên sảnh tiệc *</label>
                <input
                  type="text"
                  id="venueName"
                  placeholder="Ví dụ: Sảnh Kim Cương (Grand Diamond)"
                  value={venueFormData.name}
                  onChange={(e) => setVenueFormData({ ...venueFormData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="venueCapacity">Sức chứa khách *</label>
                  <input
                    type="text"
                    id="venueCapacity"
                    placeholder="Ví dụ: 300 khách hoặc 30 bàn"
                    value={venueFormData.capacity}
                    onChange={(e) => setVenueFormData({ ...venueFormData, capacity: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="venuePrice">Đơn giá tối thiểu / bàn (VNĐ) *</label>
                  <input
                    type="number"
                    id="venuePrice"
                    placeholder="4500000"
                    step="100000"
                    value={venueFormData.price}
                    onChange={(e) => setVenueFormData({ ...venueFormData, price: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="venueAddress">Địa chỉ / Tầng vị trí *</label>
                  <input
                    type="text"
                    id="venueAddress"
                    placeholder="Ví dụ: Tầng 3, GEM Center, Q.1"
                    value={venueFormData.address}
                    onChange={(e) => setVenueFormData({ ...venueFormData, address: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="venueStatus">Trạng thái sảnh *</label>
                  <select
                    id="venueStatus"
                    value={venueFormData.status}
                    onChange={(e) => setVenueFormData({ ...venueFormData, status: e.target.value })}
                    required
                  >
                    <option value="Sẵn sàng">Sẵn sàng</option>
                    <option value="Đang bảo trì">Đang bảo trì</option>
                    <option value="Đã kín lịch">Đã kín lịch</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="venueDesc">Mô tả chi tiết không gian</label>
                <textarea
                  id="venueDesc"
                  rows="3"
                  placeholder="Ghi chú về phong cách kiến trúc, hệ thống âm thanh, ánh sáng, view sân khấu..."
                  value={venueFormData.desc}
                  onChange={(e) => setVenueFormData({ ...venueFormData, desc: e.target.value })}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" id="btnCancelVenueForm" onClick={() => setShowVenueModal(false)}>Hủy bỏ</button>
                <button type="submit" className="btn btn-primary" id="btnSaveVenue">
                  {editingVenueId ? 'Lưu cập nhật' : 'Lưu sảnh tiệc'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;


