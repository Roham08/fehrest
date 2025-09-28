document.addEventListener('DOMContentLoaded', () => {
    // المنت‌های اصلی DOM
    const form = document.getElementById('addItemForm');
    const tableBody = document.getElementById('itemsTableBody');
    const totalAmountEl = document.getElementById('totalAmount');
    const emptyState = document.getElementById('emptyState');
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page-content');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const mobileSidebarToggle = document.getElementById('mobile-sidebar-toggle');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const priceListTableBody = document.getElementById('priceListTableBody');
    const priceListLoading = document.getElementById('priceListLoading');
    const userIdEl = document.getElementById('userId');
    const usernameEl = document.getElementById('username');
    
    // ...rest of the frontend code...
    
    // اولین رندر در زمان بارگذاری صفحه
    initializeTheme();
    populateYearDropdown();
    renderTable();
    renderDashboard();
    renderProjects();
    userIdEl.textContent = userInfo.id;
    usernameEl.textContent = userInfo.username;
});
