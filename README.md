# CoreDesk - Ticket Management System

## 📋 Daftar Isi

- [Tentang Project](#tentang-project)
- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Struktur Folder](#struktur-folder)
- [Instalasi](#instalasi)
- [Konfigurasi API](#konfigurasi-api)
- [Panduan Penggunaan](#panduan-penggunaan)
- [Komponen](#komponen)
- [Service Layer](#service-layer)
- [Dokumentasi API](#dokumentasi-api)

---

## Tentang Project

**CoreDesk** adalah sistem manajemen tiket berbasis web yang dirancang untuk membantu tim support mengelola dan melacak permintaan pelanggan secara efisien. Aplikasi ini memungkinkan pelanggan membuat tiket, tim support menugaskan tiket kepada agen, dan melacak SLA (Service Level Agreement).

---

## Fitur Utama

### 1. **Manajemen Tiket**
- Membuat tiket baru dengan kategori, prioritas, dan SLA
- Menampilkan daftar tiket dengan filter (kategori, prioritas, status)
- Mencari tiket berdasarkan judul/subject
- Melihat detail tiket lengkap
- Melacak waktu respons dan resolusi SLA

### 2. **Sistem Pengguna**
- Registrasi akun baru dengan validasi password kuat
- Login dengan email dan password
- Manajemen role (Customer, Member/Agent, Admin)
- Autentikasi berbasis token
- Profil pengguna

### 3. **Pengaturan Mandatory**
- **Priority**: Kelola tingkat prioritas tiket dengan warna custom
- **Status**: Menentukan status tiket (Open, In Progress, Resolved, dll)
- **Category**: Kategori tiket dengan SLA yang berbeda untuk setiap prioritas

### 4. **Manajemen Tim**
- **Member**: Kelola agen/staff support
- **Customer**: Kelola daftar pelanggan
- Penugasan tiket kepada agen

### 5. **Tracking SLA**
- Response time tracking
- Resolution time tracking
- Visual indicator untuk status SLA (hijau, oranye, merah)

---

## Tech Stack

### Frontend
- **React** - UI Library
- **Ant Design (antd)** - Component UI
- **React Router** - Navigation
- **Axios** - HTTP Client
- **Dayjs** - Date/Time Management
- **React Icons** - Icon library

### Backend (API)
- Endpoint berbasis REST API
- Authentication dengan Bearer Token
- Axios interceptor untuk global config

---

## Struktur Folder

```
project/
├── src/
│   ├── services/
│   │   ├── categoryService.js       # Category & SLA management
│   │   ├── commentServices.js       # Comment functionality
│   │   ├── priorityServices.js      # Priority management
│   │   ├── roleService.js           # Role management
│   │   ├── statusServices.js        # Status management
│   │   ├── ticketService.js         # Ticket operations
│   │   ├── ticketClass.js           # Ticket class (legacy)
│   │   └── userService.js           # User & authentication
│   ├── pages/
│   │   ├── Login.jsx                # Login page
│   │   ├── Register.jsx             # Registration page
│   │   ├── Home.jsx                 # Main layout & navigation
│   │   ├── Dashboard.jsx            # Dashboard page
│   │   ├── Ticket.jsx               # Ticket list & management
│   │   ├── Settings.jsx             # Settings layout
│   │   ├── Mandatory.jsx            # Mandatory settings
│   │   ├── Customer.jsx             # Customer management
│   │   └── Member.jsx               # Member/Agent management
│   ├── component/
│   │   ├── CategoryModal.jsx        # Category form modal
│   │   ├── UserModal.jsx            # User form modal
│   │   ├── StatusPriorityModal.jsx  # Status/Priority form modal
│   │   ├── FilterComponent.jsx      # Filter component
│   │   ├── DrawerTicket.jsx         # Ticket creation drawer
│   │   └── BreatcrumNav.jsx         # Breadcrumb navigation
│   ├── feature/
│   │   └── auth/
│   │       └── AuthContext.jsx      # Authentication context
│   └── utils/
│       └── axiosInstance.js         # Axios configuration
```

---

## Instalasi

### Prerequisites
- Node.js (v14 atau lebih tinggi)
- npm atau yarn

### Steps

1. **Clone Repository**
```bash
git clone <repository-url>
cd coredesk
```

2. **Install Dependencies**
```bash
npm install
```

3. **Konfigurasi Environment**
Buat file `.env` di root directory:
```env
REACT_APP_API_BASE_URL=http://localhost:3000/api
```

4. **Jalankan Development Server**
```bash
npm start
```

Aplikasi akan terbuka di `http://localhost:3000`

---

## Konfigurasi API

### Axios Instance (`utils/axiosInstance.js`)

Konfigurasi dasar:
- Base URL: Diatur melalui environment variable `REACT_APP_API_BASE_URL`
- Request timeout: 30 detik
- Content-Type: application/json

### Authentication

Token disimpan di `localStorage` dengan struktur:
```json
{
  "id": "user_id",
  "first_name": "John",
  "last_name": "Doe",
  "role": "role_id",
  "token": "Bearer_token_here"
}
```

Setiap request memerlukan header:
```
Authorization: Bearer {token}
```

---

## Panduan Penggunaan

### 1. Login dan Register

**Registrasi:**
- Buka halaman Register
- Isi form dengan data yang valid
- Password harus memenuhi kriteria:
  - Minimal 8 karakter
  - Minimal 1 huruf besar
  - Minimal 1 huruf kecil
  - Minimal 1 angka
  - Minimal 1 simbol

**Login:**
- Masukkan email dan password
- Sistem akan memvalidasi dan menyimpan token

### 2. Membuat Tiket

1. Klik tombol "New Ticket" di halaman Ticket
2. Isi form dengan:
   - Category
   - Priority
   - Subject
   - Description
3. Klik Submit

### 3. Mengelola Tiket

**Filter & Search:**
- Gunakan search box untuk mencari berdasarkan judul
- Filter berdasarkan Category, Priority, dan Status
- Sistem mendukung pagination

**Assign Tiket:**
- Klik Select Agent pada kolom Assignee
- Pilih agent dari dropdown
- Konfirmasi assignment

**Detail Tiket:**
- Klik pada subject tiket untuk melihat detail
- Lihat tracking SLA dan komentar

### 4. Manajemen Setting

**Priority:**
- Go to Settings → Mandatory → Priority
- Tambah/edit/hapus priority dengan custom warna

**Status:**
- Go to Settings → Mandatory → Status
- Kelola status tiket yang tersedia

**Category:**
- Go to Settings → Mandatory → Category
- Set SLA (response time & resolution time) untuk setiap kategori dan prioritas

**Member:**
- Go to Settings → Member
- Tambah agent/staff baru
- Edit atau hapus member

**Customer:**
- Go to Settings → Customer
- Tambah atau kelola daftar customer

---

## Komponen

### Pages

#### Login.jsx
Halaman login dengan validasi form dan error handling.

**Props:** Tidak ada

**State:**
- `isLoad`: Loading state
- `visible`: Alert visibility
- `messageError`: Error message

**Key Functions:**
- `onFinish(values)`: Handle login submission

---

#### Register.jsx
Halaman registrasi dengan validasi password kompleks.

**Props:** Tidak ada

**State:**
- `isLoad`: Loading state
- `visible`: Alert visibility
- `messageError`: Error message

**Password Requirements:**
- Minimal 8 karakter
- Minimal 1 huruf kecil
- Minimal 1 huruf besar
- Minimal 1 angka
- Minimal 1 simbol

**Key Functions:**
- `onFinish(values)`: Handle registration
- `delay(ms)`: Promise-based delay function

---

#### Ticket.jsx
Manajemen dan tampilan daftar tiket dengan filter dan search.

**Props:** Tidak ada

**State:**
- `dataTicket`: Array of tickets
- `tableParams`: Pagination dan filter params
- `search`: Search query
- `debouncedQuery`: Debounced search query
- `dataAgent`: Available agents
- `dataCategory/Priority/Status`: Filter options

**Key Functions:**
- `fetchTicket()`: Ambil data tiket dengan params
- `uploadAssign(ticketId, agentId)`: Assign tiket ke agent
- `handleTableChange(pagination, filters, sorter)`: Handle table changes
- `showConfirm(ticketId, agentId)`: Konfirmasi assignment modal

**Features:**
- Search dengan debounce (500ms)
- Filter by category, priority, status
- Pagination
- Assign agent to ticket
- SLA color indicator (red/orange/green)
- Role-based column visibility

---

#### DetailTicket.jsx
Halaman detail tiket dengan fitur update, assign, dan comment.

**Props:** Tidak ada

**State:**
- `dataTicketDetail`: Detail ticket object
- `isModal`: Update ticket modal state
- `isModalAssign`: Assign modal state
- `responsePercentage`: Response SLA percentage
- `resolutionPercentage`: Resolution SLA percentage

**Key Functions:**
- `fetchDetailTicket()`: Fetch detail ticket
- `updateDetailTicket(payload)`: Update category/priority/status
- `assignAgentTicket(agentId)`: Assign agent to ticket
- `calcPercentageTime(time, duedate, timeDur)`: Calculate SLA percentage
- `refreshTicket()`: Refresh data after comment

**Layout:**
- **Content Area**: Comment section dengan scroll
- **Sidebar (25%)**: 
  - Requester info
  - Assignee info
  - Ticket details (category, priority, status)
  - Response time tracking
  - Resolution time tracking

**Conditional Rendering:**
- Assign button: Hidden jika sudah ada agent atau user role = 3
- Change button: Hidden jika status = 17 (closed) atau user role = 3
- SLA cards: Hidden untuk customer (role = 3)

---

#### Customer.jsx & Member.jsx
Manajemen customer dan member dengan fitur add/edit/delete dan search.

**Props:** Tidak ada

**State:**
- `dataUser`: Array of users
- `dataRole`: Array of roles
- `query`: Search query
- `debouncedQuery`: Debounced search query (500ms)
- `isWarning`: Warning message state

**Key Functions:**
- `getUsers(search)`: Fetch users dengan optional search parameter
- `uploadAgent(value)`: Create atau update user
- `deleteUser(id)`: Delete user (with error handling)
- `modalTriger(isModal, data)`: Open/close modal

**Features:**
- Real-time search dengan debounce
- Add/Edit/Delete operations
- Role selection (untuk Member page)
- Default password: "Password123"
- Warning alerts untuk delete errors

---

#### Category.jsx / Priority.jsx / StatusPage.jsx
Manajemen kategori, prioritas, dan status dengan CRUD operations.

**State:**
- `dataPriority/Status`: List data
- `isModalOpen`: Modal visibility
- `isEdit`: Edit mode flag
- `isError/isBodyError`: Error states
- `dataModal`: Selected item for edit

**Key Functions:**
- `getDataCategoryApi()`: Fetch categories
- `showModal(isEdited, dataMap)`: Open modal (create/edit mode)
- `handleOk(value)`: Submit form (create/update)
- `deleteData(id)`: Delete item with error handling
- `mergeAll(dataCategory)`: Merge category with SLA data (Category only)

**Error Handling:**
- 400: Validation error
- 409: Conflict (duplicate or in use)
- 404: Not found
- 500: Internal server error

---

#### Home.jsx
Main layout dengan sidebar navigation, header, dan auth checking.

**Props:**
- `showNotif`: Function to show session expired notification

**State:**
- `user`: User name from localStorage
- `open`: Drawer state
- `isLoading`: Loading state
- `dataCategory/Customer/Agent`: Data untuk drawer ticket

**Key Functions:**
- `authCheck()`: Verify token validity
- `getProfile()`: Get user profile dari localStorage
- `showDrawer()`: Open drawer & fetch data
- `onClose()`: Close drawer & reset state

**Layout Structure:**
```
┌─────────────────────────────────────┐
│          Sider (Sidebar)            │
│  - User Avatar & Name               │
│  - Navigation Menu                  │
│  - Logout Button                    │
├─────────────────────────────────────┤
│          Header (Sticky)            │
│  - Page Title                       │
│  - New Ticket Button                │
├─────────────────────────────────────┤
│          Content                    │
│  - <Outlet /> (nested routes)       │
└─────────────────────────────────────┘
```

**Navigation Items:**
- Ticket
- Settings
  - Mandatory (Status, Priority, Category)
  - Member
  - Customer

---

#### SettingsPage.jsx
Layout untuk settings dengan nested routes.

**Features:**
- Dynamic page title based on route
- Outlet untuk nested routes
- Conditional rendering judul

---

#### MandatoryPage.jsx
Settings page dengan segmented control untuk Status, Priority, dan Category.

**State:**
- `selected`: Current selected tab (1=Status, 2=Priority, 3=Category)

**Key Functions:**
- `onChange(val)`: Handle tab change
- `ContentItem()`: Render content based on selected tab

---

### Components (Reusable)

#### DrawerTicket.jsx
Drawer component untuk membuat tiket baru.

**Props:**
- `isOpen`: Drawer visibility
- `isLoading`: Loading state
- `onClose`: Close handler
- `dataCategory`: Array of categories
- `dataCustomer`: Array of customers (for requester)
- `dataAgent`: Array of agents (for assignment)

**Key Functions:**
- `onFinish(value)`: Submit ticket creation
- `handleChangeCategory(value)`: Load priorities by category
- `closeDrawer()`: Close & reset form

**Form Fields:**
- Subject (required)
- Category (required) - triggers priority loading
- Priority (required) - disabled until category selected
- Requester (required - hidden for customer role)
- Assignee (optional - hidden for customer role)
- Comment (optional)

---

#### CategoryModal.jsx
Modal untuk create/update category dengan SLA configuration.

**Props:**
- `titleModal`: Modal title
- `isModalOpen`: Visibility state
- `onCancel`: Cancel handler
- `onDone`: Success callback
- `warningFunc`: Warning message handler
- `categoryData`: Data for edit mode (null for create)

**Custom Component:**
- `TimeInput`: Custom input untuk Days, Hours, Minutes, Seconds

**Key Functions:**
- `getData()`: Fetch priorities
- `initForm()`: Initialize form for edit mode
- `convertSecondToObj(seconds)`: Convert seconds to D:H:M:S object
- `uploadPriority(payload)`: Submit to API
- `handleCheckboxChange(checkedValues)`: Update selected priorities

**Form Flow:**
1. Input category name
2. Select priorities (checkbox)
3. For each selected priority:
   - Set Response Time (D:H:M:S)
   - Set Resolution Time (D:H:M:S)

**Data Transformation:**
```javascript
// Input: {day: 1, hour: 2, minute: 30, second: 0}
// Output: 95400 seconds
```

---

#### TicketDetailModal.jsx
Modal untuk mengubah category, priority, atau status tiket.

**Props:**
- `statusId`: Current status ID
- `categoryId`: Current category ID
- `priorityId`: Current priority ID
- `isModal`: Visibility state
- `onCancel`: Cancel handler
- `onFinish`: Submit handler

**Key Features:**
- Status progression (hanya bisa ke status yang lebih tinggi)
- Category change (hanya di status = 1/Open)
- Auto-load priority saat category berubah
- Dynamic form fields based on status

**Conditional Fields:**
- Status = 1 (Open): Show Category + Priority + Status
- Status > 1: Show Status only

---

#### AssigneeModal.jsx
Modal untuk assign agent ke tiket.

**Props:**
- `isModal`: Visibility state
- `onCancel`: Cancel handler
- `onFinish`: Submit handler

**Key Functions:**
- `fetchAgent()`: Load available agents

---

#### StatusPriorityModal.jsx
Reusable modal untuk Status dan Priority create/update.

**Props:**
- `isEdit`: Edit mode flag
- `modalTitle`: Modal title
- `formLabel`: Label untuk form ("status"/"priority")
- `isModalOpen`: Visibility state
- `isModalLoading`: Loading state
- `onCancel`: Cancel handler
- `form`: Ant Design form instance
- `formName`: Form name
- `onFinish`: Submit handler
- `isError`: Error message
- `formVal`: Form values for edit

**Form Fields:**
- Name (required)
- Color (ColorPicker with hex format)

---

#### UserModal.jsx
Modal untuk create/update Member dan Customer.

**Props:**
- `modalTitle`: Modal title
- `formLabel`: Label untuk form
- `isModalOpen`: Visibility state
- `isModalLoading`: Loading state
- `isMember`: Boolean - show role field if true
- `onCancel`: Cancel handler
- `formName`: Form name
- `onFinish`: Submit handler
- `isError`: Error message
- `roleData`: Array of roles (for member)
- `formVal`: Form values for edit

**Form Fields:**
- Email (required, disabled in edit mode)
- Role (required, only for members)

---

#### ContentDetailTicket.jsx
Content area untuk halaman detail ticket dengan comment section.

**Props:**
- `subject`: Ticket subject
- `comments`: Array of comments
- `ticketId`: ID tiket
- `refreshTicket`: Callback to refresh data

**Layout:**
```
┌─────────────────────────────────────┐
│  Header: Subject + Back Button      │
├─────────────────────────────────────┤
│  Content: Chat Bubbles (scrollable) │
│  - Auto scroll to bottom            │
│  - Loading spinner saat posting     │
├─────────────────────────────────────┤
│  Footer: TextArea + Send Button     │
└─────────────────────────────────────┘
```

**Key Functions:**
- `postComment()`: Post new comment
- `onFinish(value)`: Handle textarea change

**Features:**
- Auto-scroll ke bottom setelah comment
- Disable send button saat loading
- Textarea auto-resize (1-100 rows)

---

#### ChatBuble.jsx
Component untuk menampilkan single comment.

**Props:**
- `name`: User name
- `message`: Comment message
- `createdAt`: Timestamp

**Display:**
- Avatar icon
- User name & timestamp
- Message text

---

#### FilterComponent.jsx
Reusable filter component untuk Ticket page.

**Props:**
- `title`: Filter title
- `child`: Array of options
- `isValue`: Currently selected value
- `onSend`: Change handler

**Layout:**
- Title dengan secondary text
- Checkboxes dalam 3 kolom (Col span={8})
- Single selection (checkbox)

---

#### BreadcrumbNav.jsx
Breadcrumb navigation component (currently unused in active pages).

**Features:**
- Auto-generate breadcrumb dari URL path
- Capitalize first letter
- Replace hyphens dengan spaces

---

## Service Layer

### userService.js

```javascript
login(credential)                  // Login user
register(payload)                  // Register new user
getCustomer(search)               // Get customers list
getAgent()                        // Get agents list
getMember(search)                 // Get members/agents
updateUser(id, payload)           // Update user info
deleteUser(id)                    // Delete user
getAuthCheck(token)               // Verify token validity
```

### ticketService.js

```javascript
createTicket(payload, token)          // Create new ticket
getTickets(params, token)             // Get tickets with pagination
getDetailTicket(id, token)            // Get ticket detail
updateDetailTicket(id, payload, token) // Update ticket
assignTicket(payload, token)          // Assign ticket to agent
```

### categoryService.js

```javascript
createCategory(payload)           // Create category with SLA
updateCategory(id, payload)       // Update category
getCategory()                     // Get all categories
getCategoryById(id)               // Get category detail
```

### priorityService.js

```javascript
getPriority()                     // Get all priorities
createPriority(payload)           // Create priority
updatePriority(payload, id)       // Update priority
deletePriority(id)                // Delete priority
```

### statusServices.js

```javascript
getStatus()                       // Get all statuses
createStatus(payload)             // Create status
updateStatus(payload, id)         // Update status
deleteStatus(id)                  // Delete status
```

### commentServices.js

```javascript
createComment(payload, token)     // Create comment on ticket
```

### roleService.js

```javascript
getRole()                         // Get all available roles
```

---

## Dokumentasi API

### Base URL
```
http://localhost:3000/api
```

### Authentication
Gunakan Bearer Token di header:
```
Authorization: Bearer {token}
```

### Endpoints Utama

#### Authentication
- `POST /login` - Login user
- `POST /register` - Register new user
- `GET /auth-check` - Verify token

#### Tickets
- `POST /ticket` - Create ticket
- `GET /ticket?limit=10&page=1` - Get tickets with pagination
- `GET /ticket/{id}` - Get ticket detail
- `PUT /ticket/{id}` - Update ticket
- `PUT /assign/{id}` - Assign ticket to agent

#### Categories
- `POST /category-sla` - Create category with SLA
- `PUT /category-sla/{id}` - Update category
- `GET /category-by-sla` - Get all categories
- `GET /category/{id}` - Get category detail

#### Priority
- `GET /priority` - Get all priorities
- `POST /priority` - Create priority
- `PUT /priority/{id}` - Update priority
- `DELETE /priority/{id}` - Delete priority

#### Status
- `GET /status` - Get all statuses
- `POST /status` - Create status
- `PUT /status/{id}` - Update status
- `DELETE /status/{id}` - Delete status

#### Users
- `GET /customer?search={query}` - Get customers
- `GET /agent` - Get agents
- `GET /member?search={query}` - Get members
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

#### Comments
- `POST /comment` - Create comment

---

## Error Handling

Sistem menggunakan error response standardisasi:

```json
{
  "error": "Error message here",
  "status": 400
}
```

Common HTTP Status Codes:
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict (Resource already exists)
- `500` - Internal Server Error

---

## Tips Pengembangan

1. **Debouncing Search**: Gunakan `setTimeout` untuk menghindari API calls terlalu sering
2. **Token Management**: Selalu simpan token di localStorage dan pass sebagai header
3. **Error Messages**: Gunakan JSON file `messageError.json` dan `messageSuccess.json` untuk consistency
4. **Form Validation**: Ant Design Form component sudah support validasi built-in
5. **Loading States**: Gunakan Spin component dari Ant Design untuk feedback visual

---

## Troubleshooting

### Token Expired
- User akan di-redirect ke login page
- Notification akan ditampilkan

### Failed to Load Data
- Check browser console untuk error detail
- Verify API base URL di `.env`
- Pastikan token masih valid

### Search/Filter Tidak Work
- Pastikan debounce delay tidak terlalu panjang
- Check network tab untuk API request

---

## Kontribusi

Untuk berkontribusi pada project ini:

1. Create branch baru (`git checkout -b feature/nama-fitur`)
2. Commit changes (`git commit -m 'Add feature'`)
3. Push ke branch (`git push origin feature/nama-fitur`)
4. Buat Pull Request

---

## License

Project ini adalah proprietary software. Semua rights reserved.

---

## Contact

Untuk pertanyaan atau support, silakan hubungi tim development.

---

**Last Updated**: Oktober 2025