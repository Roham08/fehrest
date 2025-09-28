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
    
    // المنت‌های پروژه
    const openProjectModalBtn = document.getElementById('openProjectModalBtn');
    const projectModal = document.getElementById('projectModal');
    const closeProjectModalBtn = document.getElementById('closeProjectModalBtn');
    const cancelProjectModalBtn = document.getElementById('cancelProjectModalBtn');
    const addProjectForm = document.getElementById('addProjectForm');
    const projectsListEl = document.getElementById('projectsList');
    const noProjectsEl = document.getElementById('noProjects');
    const projectYearEl = document.getElementById('projectYear');
    const projectTabs = document.querySelectorAll('#projectModal .project-tab');
    const tabContents = document.querySelectorAll('#projectModal .tab-content');
    const projectModalTitle = document.getElementById('projectModalTitle');
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const projectDetailsModal = document.getElementById('projectDetailsModal');
    const closeDetailsModalBtn = document.getElementById('closeDetailsModalBtn');

    let editingProjectId = null;
    let projectToDeleteId = null;

    // مخزن داده‌های بخش برآورد
    let items = [];
    // مخزن داده‌های بخش پروژه‌ها
    let projects = [];

    // اطلاعات کاربری نمونه
    const userInfo = {
        id: 'user-1a7b3c-9z',
        username: 'کاربر تستی'
    };
    
    // تابع برای فرمت کردن اعداد به صورت پولی
    const formatCurrency = (amount) => new Intl.NumberFormat('fa-IR').format(amount) + ' ریال';
    
    // ========== THEME TOGGLE LOGIC ==========
    const themeLightBtn = document.getElementById('theme-light-btn');
    const themeDarkBtn = document.getElementById('theme-dark-btn');
    const collapsedThemeToggle = document.getElementById('collapsed-theme-toggle');
    const collapsedLightIcon = document.getElementById('collapsed-light-icon');
    const collapsedDarkIcon = document.getElementById('collapsed-dark-icon');


    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            themeDarkBtn.classList.add('active');
            themeLightBtn.classList.remove('active');
            collapsedLightIcon.classList.add('hidden');
            collapsedDarkIcon.classList.remove('hidden');
        } else {
            document.documentElement.classList.remove('dark');
            themeLightBtn.classList.add('active');
            themeDarkBtn.classList.remove('active');
            collapsedDarkIcon.classList.add('hidden');
            collapsedLightIcon.classList.remove('hidden');
        }
    };

    const initializeTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        applyTheme(currentTheme);
    };

    themeLightBtn.addEventListener('click', () => {
        localStorage.setItem('theme', 'light');
        applyTheme('light');
    });

    themeDarkBtn.addEventListener('click', () => {
        localStorage.setItem('theme', 'dark');
        applyTheme('dark');
    });

    collapsedThemeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark');
        const newTheme = isDark ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });

    // ========== منطق سایدبار ==========
    sidebar.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 768) sidebar.classList.remove('collapsed');
    });
    mainContent.addEventListener('mouseenter', () => {
         if (window.innerWidth >= 768) sidebar.classList.add('collapsed');
    });

    const closeMobileSidebar = () => {
        sidebar.classList.remove('mobile-open');
        sidebarOverlay.classList.add('hidden');
    };
    mobileSidebarToggle.addEventListener('click', () => {
        sidebar.classList.add('mobile-open');
        sidebarOverlay.classList.remove('hidden');
    });
    sidebarOverlay.addEventListener('click', closeMobileSidebar);


    // ========== منطق داشبورد ==========
    const renderDashboard = () => {
        const totalCost = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const itemCount = items.length;
        const avgCost = itemCount > 0 ? totalCost / itemCount : 0;

        document.getElementById('dashboardTotalCost').textContent = formatCurrency(totalCost);
        document.getElementById('dashboardItemCount').textContent = itemCount;
        document.getElementById('dashboardAvgCost').textContent = formatCurrency(Math.round(avgCost));

        const costChartEl = document.getElementById('costChart');
        costChartEl.innerHTML = '';
        const sortedItems = [...items].sort((a, b) => (b.quantity * b.unitPrice) - (a.quantity * a.unitPrice));
        const top5Items = sortedItems.slice(0, 5);
        const maxCost = top5Items.length > 0 ? top5Items[0].quantity * top5Items[0].unitPrice : 0;

        if (top5Items.length > 0) {
            top5Items.forEach(item => {
                const itemCost = item.quantity * item.unitPrice;
                const barWidth = maxCost > 0 ? (itemCost / maxCost) * 100 : 0;
                costChartEl.innerHTML += `<div class="flex items-center"><span class="text-sm text-slate-600 dark:text-slate-300 w-1/3 truncate pr-2">${item.description}</span><div class="w-2/3 bg-slate-200 dark:bg-slate-700 rounded-full h-5"><div class="bg-blue-500 h-5 rounded-full text-white text-xs flex items-center justify-center" style="width: ${barWidth}%">${new Intl.NumberFormat('fa-IR').format(itemCost)}</div></div></div>`;
            });
        } else {
            costChartEl.innerHTML = '<p class="text-slate-500 dark:text-slate-400 text-sm">داده‌ای برای نمایش وجود ندارد.</p>';
        }

        const recentItemsListEl = document.getElementById('recentItemsList');
        recentItemsListEl.innerHTML = '';
        const recentItems = [...items].reverse().slice(0, 5);
        if(recentItems.length > 0) {
            recentItems.forEach(item => {
                recentItemsListEl.innerHTML += `<li class="flex justify-between items-center text-sm border-b border-slate-100 dark:border-slate-700 pb-2 last:border-0"><span class="text-slate-700 dark:text-slate-200 font-medium">${item.description}</span><span class="text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md text-xs">${formatCurrency(item.unitPrice)}</span></li>`;
            });
        } else {
            recentItemsListEl.innerHTML = '<p class="text-slate-500 dark:text-slate-400 text-sm">هنوز آیتمی اضافه نشده است.</p>';
        }
    };

    // ========== منطق پروژه‌ها (Modal & CRUD) ==========
    const openModalForNew = () => {
        editingProjectId = null;
        projectModalTitle.textContent = 'افزودن پروژه جدید';
        addProjectForm.reset();
        projectYearEl.value = "";
        projectModal.classList.remove('hidden');
        projectModal.classList.add('flex');
        document.querySelector('#projectModal .project-tab[data-tab="info"]').click();
    };

    const openModalForEdit = (projectId) => {
        const project = projects.find(p => p.id === projectId);
        if (!project) return;
        
        editingProjectId = projectId;
        projectModalTitle.textContent = 'ویرایش پروژه';
        
        // Populate form with correct order
        document.getElementById('projectName').value = project.name;
        document.getElementById('projectYear').value = project.year;
        document.getElementById('contractDate').value = project.contractDate;
        document.getElementById('startDate').value = project.startDate;
        document.getElementById('landDeliveryDate').value = project.landDeliveryDate;
        document.getElementById('projectDuration').value = project.duration;
        document.getElementById('clientName').value = project.client;
        document.getElementById('contractorName').value = project.contractor;
        document.getElementById('supervisorName').value = project.supervisor;
        document.getElementById('consultantName').value = project.consultant;

        projectModal.classList.remove('hidden');
        projectModal.classList.add('flex');
        document.querySelector('#projectModal .project-tab[data-tab="info"]').click();
    };

    const closeModal = () => {
        projectModal.classList.add('hidden');
        projectModal.classList.remove('flex');
    };

    openProjectModalBtn.addEventListener('click', openModalForNew);
    closeProjectModalBtn.addEventListener('click', closeModal);
    cancelProjectModalBtn.addEventListener('click', closeModal);
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            closeModal();
        }
    });
    
    // --- Delete Confirmation Modal Logic ---
    const openDeleteModal = () => deleteConfirmModal.classList.replace('hidden', 'flex');
    const closeDeleteModal = () => deleteConfirmModal.classList.replace('flex', 'hidden');

    window.handleDeleteClick = (projectId) => {
         projectToDeleteId = projectId;
         openDeleteModal();
    };

    confirmDeleteBtn.addEventListener('click', () => {
        if (projectToDeleteId !== null) {
            projects = projects.filter(p => p.id !== projectToDeleteId);
            renderProjects();
        }
        closeDeleteModal();
    });
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);

    // --- Details Modal Logic ---
    const closeDetailsModal = () => projectDetailsModal.classList.replace('flex', 'hidden');
    closeDetailsModalBtn.addEventListener('click', closeDetailsModal);
    projectDetailsModal.addEventListener('click', (e) => {
        if(e.target === projectDetailsModal) closeDetailsModal();
    });

    window.openDetailsModal = (projectId) => {
        const project = projects.find(p => p.id === projectId);
        if (!project) return;

        document.getElementById('details_projectName').textContent = project.name || '---';
        document.getElementById('details_projectYear').textContent = `سال: ${project.year}` || '---';
        document.getElementById('details_contractDate').textContent = project.contractDate || '---';
        document.getElementById('details_startDate').textContent = project.startDate || '---';
        document.getElementById('details_landDeliveryDate').textContent = project.landDeliveryDate || '---';
        document.getElementById('details_projectDuration').textContent = project.duration ? `${project.duration} روز` : '---';
        document.getElementById('details_clientName').textContent = project.client || '---';
        document.getElementById('details_contractorName').textContent = project.contractor || '---';
        document.getElementById('details_supervisorName').textContent = project.supervisor || '---';
        document.getElementById('details_consultantName').textContent = project.consultant || '---';

        projectDetailsModal.classList.replace('hidden', 'flex');
    };

    const populateYearDropdown = () => {
        const endYear = 1404;
        const startYear = 1390;
        for (let year = endYear; year >= startYear; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            projectYearEl.appendChild(option.cloneNode(true));
        }
    };

    addProjectForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const projectData = {
            name: document.getElementById('projectName').value,
            year: document.getElementById('projectYear').value,
            contractDate: document.getElementById('contractDate').value,
            startDate: document.getElementById('startDate').value,
            landDeliveryDate: document.getElementById('landDeliveryDate').value,
            duration: document.getElementById('projectDuration').value,
            client: document.getElementById('clientName').value,
            contractor: document.getElementById('contractorName').value,
            supervisor: document.getElementById('supervisorName').value,
            consultant: document.getElementById('consultantName').value,
        };

        if (editingProjectId !== null) {
            // Editing existing project
            const projectIndex = projects.findIndex(p => p.id === editingProjectId);
            if (projectIndex > -1) {
                projects[projectIndex] = { ...projects[projectIndex], ...projectData };
            }
        } else {
            // Adding new project
            projects.push({ ...projectData, id: Date.now() });
        }
        
        renderProjects();
        closeModal();
    });
    
    projectTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            projectTabs.forEach(t => t.classList.remove('active-tab'));
            tab.classList.add('active-tab');

            tabContents.forEach(content => {
                if(content.id === `${tab.dataset.tab}Tab`) {
                    content.classList.remove('hidden');
                    content.classList.add('grid');
                } else {
                    content.classList.add('hidden');
                    content.classList.remove('grid');
                }
            });
        });
    });
    
    // Set initial active tab
    document.querySelector('#projectModal .project-tab[data-tab="info"]').classList.add('active-tab');

    const renderProjects = () => {
        projectsListEl.innerHTML = '';
        noProjectsEl.classList.toggle('hidden', projects.length > 0);

        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md flex flex-col';
            projectCard.innerHTML = `
                <div class="flex justify-between items-start border-b border-slate-200 dark:border-slate-700 pb-3 mb-3">
                    <div>
                        <h4 class="font-semibold text-lg text-slate-800 dark:text-slate-100">${project.name}</h4>
                        <p class="text-sm text-slate-500 dark:text-slate-400">تاریخ قرارداد: ${project.contractDate || '---'}</p>
                    </div>
                    <span class="text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 px-2 py-1 rounded-full">${project.year}</span>
                </div>
                <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-600 dark:text-slate-300 flex-grow">
                    <div><strong>کارفرما:</strong> ${project.client || '---'}</div>
                    <div><strong>پیمانکار:</strong> ${project.contractor || '---'}</div>
                    <div><strong>ناظر:</strong> ${project.supervisor || '---'}</div>
                    <div><strong>مشاور:</strong> ${project.consultant || '---'}</div>
                    <div><strong>تاریخ شروع به کار:</strong> ${project.startDate || '---'}</div>
                    <div><strong>مدت پروژه:</strong> ${project.duration ? project.duration + ' روز' : '---'}</div>
                </div>
                <div class="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div class="flex gap-2">
                       <button onclick="openModalForEdit(${project.id})" class="text-slate-500 hover:text-blue-600 transition p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" /></svg>
                       </button>
                       <button onclick="handleDeleteClick(${project.id})" class="text-slate-500 hover:text-red-600 transition p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clip-rule="evenodd" /></svg>
                       </button>
                    </div>
                    <button onclick="openDetailsModal(${project.id})" class="text-sm text-center bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition">مشاهده جزئیات</button>
                </div>
            `;
            projectsListEl.appendChild(projectCard);
        });
    };


        // ========== منطق جدول برآورد ==========
        const renderTable = () => {
            tableBody.innerHTML = '';
            emptyState.classList.toggle('hidden', items.length > 0);
            
            items.forEach((item, index) => {
                const total = item.quantity * item.unitPrice;
                const row = document.createElement('tr');
                row.className = 'hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors';
                row.innerHTML = `<td class="p-4" data-label="ردیف">${index + 1}</td><td class="p-4" data-label="کد">${item.code}</td><td class="p-4 font-medium" data-label="شرح">${item.description}</td><td class="p-4" data-label="واحد">${item.unit}</td><td class="p-4" data-label="مقدار"><input type="number" value="${item.quantity}" min="0" class="w-20 text-center p-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" onchange="updateQuantity(${index}, this.value)"></td><td class="p-4" data-label="بهای واحد (ریال)">${new Intl.NumberFormat('fa-IR').format(item.unitPrice)}</td><td class="p-4 font-semibold" data-label="بهای کل (ریال)">${formatCurrency(total)}</td><td class="p-4" data-label="عملیات"><button onclick="deleteItem(${index})" class="text-red-500 hover:text-red-700 transition font-medium">حذف</button></td>`;
                tableBody.appendChild(row);
            });
            updateTotal();
        };

        const updateTotal = () => {
            const total = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
            totalAmountEl.textContent = formatCurrency(total);
        };
        
        window.updateQuantity = (index, newQuantity) => {
            items[index].quantity = Number(newQuantity) || 0;
            renderTable();
            renderDashboard();
        };

        window.deleteItem = (index) => {
            items.splice(index, 1);
            renderTable();
            renderDashboard();
        };
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            items.push({
                code: document.getElementById('itemCode').value,
                description: document.getElementById('itemDescription').value,
                unit: document.getElementById('itemUnit').value,
                unitPrice: Number(document.getElementById('itemUnitPrice').value),
                quantity: 0,
            });
            form.reset();
            document.getElementById('itemCode').focus();
            renderTable();
            renderDashboard();
        });
        
        // ========== منطق دریافت اطلاعات فهرست بها از سرور ==========
        const fetchPriceList = async () => {
            try {
                priceListLoading.classList.remove('hidden');
                // FIX: Use the full URL for the fetch request.
                const response = await fetch('http://localhost:3000/api/pricelist');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                
                priceListTableBody.innerHTML = '';
                if (data.length === 0) {
                    priceListTableBody.innerHTML = `<tr><td colspan="4" class="text-center p-8 text-slate-500 dark:text-slate-400">موردی در فهرست بها یافت نشد.</td></tr>`;
                    priceListLoading.classList.add('hidden');
                    return;
                }

                data.forEach(item => {
                    const row = document.createElement('tr');
                    row.className = 'hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors';
                    row.innerHTML = `
                        <td class="p-4" data-label="کد">${item.code}</td>
                        <td class="p-4 font-medium" data-label="شرح">${item.description}</td>
                        <td class="p-4" data-label="واحد">${item.unit}</td>
                        <td class="p-4 font-semibold" data-label="بهای واحد (ریال)">${formatCurrency(item.unit_price)}</td>
                    `;
                    priceListTableBody.appendChild(row);
                });
                
                priceListLoading.classList.add('hidden');

            } catch (error) {
                console.error("Failed to fetch price list:", error);
                priceListTableBody.innerHTML = `<tr><td colspan="4" class="text-center p-8 text-red-500">خطا در دریافت اطلاعات از سرور. لطفا از اجرای صحیح سرور بک‌اند مطمئن شوید.</td></tr>`;
                priceListLoading.classList.add('hidden');
            }
        };

        // ========== منطق ناوبری ==========
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.getAttribute('data-page');
                
                navLinks.forEach(l => l.classList.remove('active', 'bg-blue-600', 'text-white', 'dark:text-white'));
                link.classList.add('active', 'bg-blue-600', 'text-white', 'dark:text-white');
                
                pages.forEach(page => page.classList.toggle('hidden', page.id !== pageId));
                
                if (pageId === 'dashboardPage') renderDashboard();
                if (pageId === 'newEstimatePage') fetchPriceList();
                if (pageId === 'projectsPage') renderProjects();

                if (window.innerWidth < 768) closeMobileSidebar();
            });
        });

        // اولین رندر در زمان بارگذاری صفحه
        initializeTheme();
        populateYearDropdown();
        renderTable();
        renderDashboard();
        renderProjects();
        userIdEl.textContent = userInfo.id;
        usernameEl.textContent = userInfo.username;

        // Initialize Persian Datepicker
        $('.shamsi-datepicker').pDatepicker({
            format: 'YYYY/MM/DD',
            autoClose: true,
            onShow: function(el){
               if (document.documentElement.classList.contains('dark')) {
                   $(el.container).addClass('pwt-dark');
               } else {
                   $(el.container).removeClass('pwt-dark');
               }
            }
        });
    });
