/* ==========================================================================
   SAMPLE LAW FIRM WEBSITE — CORE JAVASCRIPT ENGINE
   Scroll animations, interactive calendar, booking engine, modals, theme
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Progress Bar
  const progressBar = document.getElementById('scrollProgressBar');
  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }

    // Header background change on scroll
    const header = document.getElementById('siteHeader');
    if (header) {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });

  // 2. Scroll Animation Observer (IntersectionObserver)
  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-in, .reveal-scale');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        // If element has counters inside, trigger counter animation
        const counters = entry.target.querySelectorAll('.counter-value');
        counters.forEach(counter => animateCounter(counter));
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 3. Number Counter Animation Function
  function animateCounter(counterEl) {
    if (counterEl.dataset.animated) return;
    counterEl.dataset.animated = "true";

    const target = parseInt(counterEl.dataset.target, 10) || 0;
    const suffix = counterEl.dataset.suffix || '';
    const prefix = counterEl.dataset.prefix || '';
    const duration = 1800; // ms
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.floor(ease * target);

      counterEl.textContent = `${prefix}${currentVal}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counterEl.textContent = `${prefix}${target}${suffix}`;
      }
    }

    requestAnimationFrame(updateCounter);
  }

  // 4. Dark / Light Theme Toggle
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('sampleLawTheme') || 'light';
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcon(true);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const isDark = currentTheme === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('sampleLawTheme', 'light');
        updateThemeIcon(false);
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('sampleLawTheme', 'dark');
        updateThemeIcon(true);
      }
    });
  }

  function updateThemeIcon(isDark) {
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector('i');
    if (icon) {
      icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  // 5. Mobile Navigation Drawer Toggle
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const navMenu = document.getElementById('navMenu');
  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggleBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking on a link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // 6. Interactive Calendar & Time Slot Engine
  const calGrid = document.getElementById('calendarDaysGrid');
  const calMonthLabel = document.getElementById('calendarMonthLabel');
  const prevMonthBtn = document.getElementById('prevMonthBtn');
  const nextMonthBtn = document.getElementById('nextMonthBtn');
  const selectedDateInput = document.getElementById('selectedDateInput');
  const selectedTimeInput = document.getElementById('selectedTimeInput');
  const consultationModeInput = document.getElementById('consultationModeInput');

  let currentDate = new Date();
  let selectedDay = null;
  let selectedMonth = currentDate.getMonth();
  let selectedYear = currentDate.getFullYear();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  function renderCalendar(year, month) {
    if (!calGrid || !calMonthLabel) return;
    calGrid.innerHTML = '';
    calMonthLabel.textContent = `${monthNames[month]} ${year}`;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    // Empty lead cells
    for (let i = 0; i < firstDayIndex; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'cal-day-cell disabled';
      calGrid.appendChild(emptyCell);
    }

    // Days cells
    for (let day = 1; day <= totalDays; day++) {
      const dayCell = document.createElement('button');
      dayCell.type = 'button';
      dayCell.className = 'cal-day-cell';
      dayCell.textContent = day;

      const thisDate = new Date(year, month, day);
      const isPast = thisDate.setHours(0,0,0,0) < today.setHours(0,0,0,0);
      const isSunday = new Date(year, month, day).getDay() === 0;

      if (isPast || isSunday) {
        dayCell.classList.add('disabled');
        dayCell.disabled = true;
      } else {
        // Today check
        if (
          day === today.getDate() &&
          month === today.getMonth() &&
          year === today.getFullYear()
        ) {
          dayCell.classList.add('today');
        }

        // Selected check
        if (
          selectedDay &&
          day === selectedDay.getDate() &&
          month === selectedDay.getMonth() &&
          year === selectedDay.getFullYear()
        ) {
          dayCell.classList.add('selected');
        }

        dayCell.addEventListener('click', () => {
          document.querySelectorAll('.cal-day-cell').forEach(c => c.classList.remove('selected'));
          dayCell.classList.add('selected');
          selectedDay = new Date(year, month, day);
          const formatted = `${monthNames[month]} ${day}, ${year}`;
          if (selectedDateInput) selectedDateInput.value = formatted;
          const displayDateEl = document.getElementById('currentSelectedDateDisplay');
          if (displayDateEl) displayDateEl.textContent = formatted;
          updateAvailableSlots(selectedDay);
        });
      }

      calGrid.appendChild(dayCell);
    }
  }

  if (prevMonthBtn && nextMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
      selectedMonth--;
      if (selectedMonth < 0) {
        selectedMonth = 11;
        selectedYear--;
      }
      renderCalendar(selectedYear, selectedMonth);
    });

    nextMonthBtn.addEventListener('click', () => {
      selectedMonth++;
      if (selectedMonth > 11) {
        selectedMonth = 0;
        selectedYear++;
      }
      renderCalendar(selectedYear, selectedMonth);
    });
  }

  // Auto initialize with next available business day
  function initDefaultDate() {
    const today = new Date();
    let defaultDay = new Date(today);
    defaultDay.setDate(today.getDate() + 1);
    if (defaultDay.getDay() === 0) { // Sunday -> Monday
      defaultDay.setDate(defaultDay.getDate() + 1);
    }
    selectedDay = defaultDay;
    const formatted = `${monthNames[defaultDay.getMonth()]} ${defaultDay.getDate()}, ${defaultDay.getFullYear()}`;
    if (selectedDateInput) selectedDateInput.value = formatted;
    const displayDateEl = document.getElementById('currentSelectedDateDisplay');
    if (displayDateEl) displayDateEl.textContent = formatted;
  }

  initDefaultDate();
  renderCalendar(selectedYear, selectedMonth);

  // Time Slot Selection Handling
  const slotButtons = document.querySelectorAll('.time-slot-btn');
  slotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      slotButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const timeVal = btn.dataset.slot;
      if (selectedTimeInput) selectedTimeInput.value = timeVal;
      const displayTimeEl = document.getElementById('currentSelectedTimeDisplay');
      if (displayTimeEl) displayTimeEl.textContent = timeVal;
    });
  });

  function updateAvailableSlots(dateObj) {
    const slotsList = document.querySelector('.slots-list');
    if (slotsList) {
      slotsList.style.opacity = '0.4';
      setTimeout(() => {
        slotsList.style.opacity = '1';
      }, 150);
    }
  }

  // Mode Selection (Chambers vs Video vs Phone)
  const modeButtons = document.querySelectorAll('.mode-btn');
  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.dataset.mode;
      if (consultationModeInput) consultationModeInput.value = mode;
      const displayModeEl = document.getElementById('currentSelectedModeDisplay');
      if (displayModeEl) displayModeEl.textContent = mode;
    });
  });

  // 7. Booking Form Submission & Confirmation Modal
  const bookingForm = document.getElementById('consultationBookingForm');
  const confirmationModal = document.getElementById('confirmationModal');
  const modalCloseBtns = document.querySelectorAll('.modal-close-btn, .modal-dismiss-btn');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Retrieve form values
      const fullName = document.getElementById('bookingFullName').value.trim();
      const phone = document.getElementById('bookingPhone').value.trim();
      const email = document.getElementById('bookingEmail').value.trim();
      const matterType = document.getElementById('bookingMatterType').value;
      const summary = document.getElementById('bookingSummary').value.trim();
      const dateVal = selectedDateInput ? selectedDateInput.value : 'Upcoming Available Slot';
      const timeVal = selectedTimeInput ? selectedTimeInput.value : '09:30 AM';
      const modeVal = consultationModeInput ? consultationModeInput.value : 'Chambers Meeting';

      if (!fullName || !phone || !email || !matterType) {
        alert('Please fill out all required fields to secure your consultation appointment.');
        return;
      }

      // Generate Reference Code
      const refCode = `LAW-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // Update Confirmation Modal details
      document.getElementById('confirmClientName').textContent = fullName;
      document.getElementById('confirmMatterType').textContent = matterType;
      document.getElementById('confirmDateTime').textContent = `${dateVal} at ${timeVal}`;
      document.getElementById('confirmMode').textContent = modeVal;
      document.getElementById('confirmRefCode').textContent = refCode;
      document.getElementById('confirmContactEmail').textContent = email;

      // Show Confirmation Modal
      if (confirmationModal) {
        confirmationModal.classList.add('active');
      }

      // Setup Download .ICS Calendar Event Handler
      const dlBtn = document.getElementById('downloadCalendarInviteBtn');
      if (dlBtn) {
        dlBtn.onclick = () => {
          generateIcsFile({
            title: `Legal Consultation (${refCode})`,
            description: `Confidential Consultation regarding: ${matterType}\\nSummary: ${summary}\\nMode: ${modeVal}\\nChambers: [Chambers / Office Location, City] / Direct Email: attorney@lawpractice.com`,
            dateString: dateVal,
            timeString: timeVal
          });
        };
      }
    });
  }

  // ICS Calendar Generator
  function generateIcsFile(eventData) {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Sample Law Firm//Confidential Consultation//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${eventData.title}`,
      `DESCRIPTION:${eventData.description}`,
      'LOCATION:[Chambers / Office Location, City]',
      `DTSTART:${new Date().toISOString().replace(/-|:|\.\d+/g, '')}`,
      `DTEND:${new Date(Date.now() + 3600000).toISOString().replace(/-|:|\.\d+/g, '')}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Legal_Consultation_Appointment.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // 8. Practice Area Detail Modal Data & Triggers
  const practiceData = {
    commercial: {
      title: "Commercial & Business Advisory",
      badge: "Commercial & Business Law",
      tagline: "Founder agreements, contract drafting, business structuring, and risk audits for growing enterprises.",
      points: [
        "Founder agreements, vesting schedules, and shareholder protections",
        "Bespoke contract drafting and commercial agreements",
        "Corporate structuring and risk audits for growing enterprises",
        "Pre-transaction due diligence and regulatory compliance audits"
      ],
      precedent: "Advised an enterprise logistics firm on corporate structuring and vendor agreements to protect commercial interests.",
      timeline: "Initial assessment delivered promptly upon conflict check."
    },
    dispute: {
      title: "Dispute Resolution & Civil Litigation",
      badge: "Dispute Resolution & Litigation",
      tagline: "Aggressive courtroom advocacy, mediation, breach-of-contract recovery, and formal arbitration.",
      points: [
        "Aggressive courtroom advocacy and commercial dispute litigation",
        "Mediation and alternative dispute resolution strategies",
        "Breach-of-contract recovery and formal arbitration proceedings",
        "Urgent interim relief and protective legal remedies"
      ],
      precedent: "Successfully resolved complex breach-of-contract recovery action securing favorable outcome for client.",
      timeline: "Immediate priority review for active litigation matters."
    },
    property: {
      title: "Property & Real Estate Law",
      badge: "Property & Real Estate Law",
      tagline: "Title diligence, lease structuring, developer disputes, and property acquisition governance.",
      points: [
        "Title diligence and land ownership verification",
        "Commercial and residential lease structuring",
        "Developer disputes and property acquisition governance",
        "Regulatory compliance and real estate advisory"
      ],
      precedent: "Structured comprehensive acquisition governance and title diligence for key commercial real estate assets.",
      timeline: "Detailed title diligence report provided on agreed schedule."
    },
    personal: {
      title: "Personal Counsel & Strategic Advisory",
      badge: "Personal Counsel & Strategy",
      tagline: "Confidential counsel on regulatory inquiries, private agreements, and legal notices.",
      points: [
        "Confidential counsel on regulatory inquiries and formal investigations",
        "Private agreements, executive contracts, and risk management",
        "Strategic responses to legal notices and dispute prevention",
        "Absolute discretion and senior-level focus"
      ],
      precedent: "Provided strategic counsel on sensitive regulatory inquiries with complete confidentiality and favorable resolution.",
      timeline: "Direct consultation with strict confidentiality guaranteed."
    }
  };

  const practiceModal = document.getElementById('practiceDetailModal');
  const practiceCards = document.querySelectorAll('.practice-card');

  practiceCards.forEach(card => {
    const practiceKey = card.dataset.practice;
    const trigger = card.querySelector('.practice-action-link') || card;
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      openPracticeModal(practiceKey);
    });
  });

  function openPracticeModal(key) {
    const data = practiceData[key];
    if (!data || !practiceModal) return;

    document.getElementById('modalPracticeBadge').textContent = data.badge;
    document.getElementById('modalPracticeTitle').textContent = data.title;
    document.getElementById('modalPracticeTagline').textContent = data.tagline;

    const listEl = document.getElementById('modalPracticeList');
    listEl.innerHTML = '';
    data.points.forEach(pt => {
      const li = document.createElement('li');
      li.innerHTML = `<i class="fas fa-check-circle" style="color: var(--accent-gold); margin-right: 8px;"></i> ${pt}`;
      li.style.marginBottom = '10px';
      listEl.appendChild(li);
    });

    document.getElementById('modalPracticePrecedent').textContent = data.precedent;
    document.getElementById('modalPracticeTimeline').textContent = data.timeline;

    practiceModal.classList.add('active');
  }

  // 9. Attorney Dossier Modal
  const dossierModal = document.getElementById('dossierModal');
  const viewDossierBtn = document.getElementById('viewDossierBtn');
  if (viewDossierBtn && dossierModal) {
    viewDossierBtn.addEventListener('click', () => {
      dossierModal.classList.add('active');
    });
  }

  // 10. Close all modals handlers
  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach(modal => modal.classList.remove('active'));
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });

  // ESC key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay').forEach(modal => modal.classList.remove('active'));
    }
  });

  // 11. Smooth scrolling for internal anchor links with sticky header offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
