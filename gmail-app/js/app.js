/* CloudMail startup and lightweight demo interactions. */
(function() {
  'use strict';

  const state = window.CloudMailState;
  const ui = window.CloudMailUI;
  const emailActions = window.CloudMailEmail;
  const app = document.getElementById('app-container');
  const auth = document.getElementById('auth-container');
  const composeContainer = document.getElementById('compose-container');
  const toastContainer = document.getElementById('toast-container');
  const dateKey = date => [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  const pageFiles = {
    mail: 'index.html', search: 'index.html', contacts: 'contacts.html',
    calendar: 'calendar.html', keep: 'notes.html', tasks: 'tasks.html',
    settings: 'settings.html'
  };

  function updatePageUrl(page, params, replace) {
    const url = pageFiles[page] + '?' + params.toString();
    const target = new URL(url, window.location.href);
    if (target.pathname !== window.location.pathname) {
      window.location.assign(url);
      return false;
    }
    if (replace) window.history.replaceState({}, '', url);
    else window.history.pushState({}, '', url);
    return true;
  }

  function render() {
    ui.renderApp(state);
  }

  function applyTheme() {
    const preference = state.settings.theme || 'light';
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolvedTheme = preference === 'auto' ? (prefersDark ? 'dark' : 'light') : preference;
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.dataset.themePreference = preference;
    document.documentElement.style.colorScheme = resolvedTheme;
  }

  function saveSettings() {
    try {
      window.localStorage.setItem('cloudmail-settings', JSON.stringify(state.settings));
    } catch (error) {
      toast('Settings could not be saved in this browser');
    }
  }

  function navigate(page, folder) {
    closePopups();
    document.getElementById('sidebar').classList.remove('sidebar-mobile-open');
    document.getElementById('sidebar-overlay').style.display = 'none';
    state.page = page;
    if (folder) state.folder = folder;
    if (page !== 'search') {
      state.query = '';
      const searchInput = document.getElementById('search-input');
      if (searchInput) searchInput.value = '';
    }
    state.openedEmailId = null;
    state.selectedIds.clear();
    const params = new URLSearchParams();
    params.set('page', page);
    if (page === 'mail') params.set('folder', state.folder);
    if (page === 'search' && state.query) params.set('q', state.query);
    if (!updatePageUrl(page, params, false)) return;
    render();
  }

  function toast(message) {
    if (!toastContainer) return;
    toastContainer.textContent = message;
    toastContainer.classList.add('toast-visible');
    window.clearTimeout(toast.timeoutId);
    toast.timeoutId = window.setTimeout(function() {
      toastContainer.classList.remove('toast-visible');
      toastContainer.textContent = '';
    }, 2400);
  }

  function closePopups() {
    ['account-menu', 'apps-menu', 'help-menu', 'quick-settings-panel', 'search-dropdown'].forEach(id => {
      const panel = document.getElementById(id);
      if (panel) panel.style.display = 'none';
    });
  }

  function toggleMenu(id, content) {
    const panel = document.getElementById(id);
    const shouldOpen = panel.style.display === 'none' || !panel.style.display;
    closePopups();
    if (shouldOpen) {
      panel.innerHTML = content;
      panel.style.display = 'block';
    }
  }

  function openAccountMenu() {
    const user = state.currentUser;
    const accounts = window.CloudMailData.otherAccounts || [];
    toggleMenu('account-menu', '<div class="account-menu-header"><div class="avatar">' + ui.escapeHtml(user.initials || user.name.slice(0, 1)) + '</div><div class="account-menu-name">' + ui.escapeHtml(user.name) + '</div><div class="account-menu-email">' + ui.escapeHtml(user.email) + '</div><button class="account-manage-btn" data-action="manage-account">Manage your account</button></div><div class="account-list"><div class="popup-title">Switch account</div>' + accounts.map((account, index) => '<button class="popup-row" data-account-index="' + index + '"><span class="avatar" style="background:' + ui.escapeHtml(account.avatarColor) + '">' + ui.escapeHtml(account.initials) + '</span><span>' + ui.escapeHtml(account.name) + '<br><small class="popup-muted">' + ui.escapeHtml(account.email) + '</small></span></button>').join('') + '<button class="popup-row" data-action="sign-out"><span class="material-icons-outlined">logout</span>Sign out</button></div>');
  }

  function openAppsMenu() {
    const apps = [
      ['mail', 'mail', 'Mail'], ['contacts', 'contacts', 'Contacts'], ['calendar', 'calendar_month', 'Calendar'],
      ['keep', 'lightbulb', 'Notes'], ['tasks', 'task_alt', 'Tasks'], ['settings', 'settings', 'Settings']
    ];
    toggleMenu('apps-menu', '<div class="popup-title">CloudMail apps</div><div class="apps-shortcuts">' + apps.map(([page, glyph, label]) => '<button class="app-shortcut" data-page="' + page + '"' + (page === 'mail' ? ' data-folder="inbox"' : '') + '><span class="material-icons-outlined">' + glyph + '</span>' + label + '</button>').join('') + '</div>');
  }

  function openNotifications() {
    const unread = state.emails.filter(email => !email.read && !email.trashed).slice(0, 5);
    toggleMenu('help-menu', '<div class="popup-title">Notifications<button class="btn btn-text btn-sm" data-action="mark-notifications-read">Mark all read</button></div>' + (unread.length ? unread.map(email => '<button class="notification-item" data-open-email="' + ui.escapeHtml(email.id) + '"><span class="notification-dot"></span><span class="notification-copy"><strong>' + ui.escapeHtml(email.subject) + '</strong><span>' + ui.escapeHtml(email.from.name) + ' · ' + ui.escapeHtml(email.snippet || '') + '</span></span></button>').join('') : '<div class="popup-empty">You’re all caught up.</div>'));
  }

  function openSearchOptions() {
    const filters = state.searchFilters;
    const panel = document.getElementById('search-dropdown');
    const shouldOpen = panel.style.display === 'none' || !panel.style.display;
    closePopups();
    if (!shouldOpen) return;
    panel.innerHTML = '<form id="search-options-form"><div class="popup-title">Advanced search</div><label class="search-option-row">From<input type="text" name="from" placeholder="Name or email" value="' + ui.escapeHtml(filters.from) + '"></label><label class="search-option-row">Starred only<input type="checkbox" name="starred" ' + (filters.starred ? 'checked' : '') + '></label><label class="search-option-row">Has attachment<input type="checkbox" name="hasAttachment" ' + (filters.hasAttachment ? 'checked' : '') + '></label><div class="search-option-actions"><button class="btn btn-text btn-sm" type="button" data-action="clear-search-options">Clear</button><button class="btn btn-primary btn-sm" type="submit">Search</button></div></form>';
    panel.style.display = 'block';
    panel.querySelector('[name="from"]').focus();
  }

  function toggleQuickSettings() {
    const panel = document.getElementById('quick-settings-panel');
    const shouldOpen = panel.style.display === 'none' || !panel.style.display;
    closePopups();
    if (!shouldOpen) return;
    panel.innerHTML = '<div class="qs-header"><h2>Quick settings</h2><button class="icon-btn" data-action="close-popups" aria-label="Close settings"><span class="material-icons-outlined">close</span></button></div><section class="qs-section"><h3>Theme</h3><div class="quick-settings-theme">' + [['light', 'light_mode', 'Light'], ['dark', 'dark_mode', 'Dark'], ['auto', 'brightness_auto', 'Auto']].map(([theme, glyph, label]) => '<button class="' + (state.settings.theme === theme ? 'active' : '') + '" data-theme-choice="' + theme + '"><span class="material-icons-outlined">' + glyph + '</span>' + label + '</button>').join('') + '</div></section><section class="qs-section"><h3>Display density</h3><div class="quick-settings-density">' + [['comfortable', 'Comfort'], ['default', 'Default'], ['compact', 'Compact']].map(([density, label]) => '<button class="' + (state.settings.density === density ? 'active' : '') + '" data-density="' + density + '">' + label + '</button>').join('') + '</div></section><button class="btn btn-secondary quick-settings-all" data-action="all-settings">Open all settings</button>';
    panel.style.display = 'block';
  }

  function openShortcuts() {
    const overlay = document.getElementById('shortcuts-overlay');
    document.getElementById('shortcuts-body').innerHTML = '<div class="shortcut-section"><h3>Navigation</h3><div class="shortcut-row"><span>Compose a message</span><span class="shortcut-key">C</span></div><div class="shortcut-row"><span>Search mail</span><span class="shortcut-key">/</span></div><div class="shortcut-row"><span>Close dialog or popup</span><span class="shortcut-key">Esc</span></div></div>';
    overlay.style.display = 'flex';
  }

  function openCompose(toAddress) {
    composeContainer.innerHTML = '<section class="compose-window" aria-label="Compose email">' +
      '<header class="compose-header"><span class="compose-header-title">New Message</span><div class="compose-header-actions">' +
      '<button class="icon-btn" type="button" data-action="close-compose" title="Close" aria-label="Close">' +
      '<span class="material-icons-outlined">close</span></button></div></header>' +
      '<form id="compose-form"><div class="compose-fields"><label class="compose-field"><span class="compose-field-label">To</span><input class="compose-field-input" name="to" type="email" required value="' + ui.escapeHtml(toAddress || '') + '"></label>' +
      '<label class="compose-subject"><input name="subject" type="text" placeholder="Subject" required aria-label="Subject"></label></div>' +
      '<textarea name="body" aria-label="Message body" style="flex:1;resize:none;padding:16px;min-height:170px" placeholder="Write your message..."></textarea>' +
      '<footer style="padding:12px 16px"><button class="btn btn-primary compose-send-btn" type="submit">Send</button></footer></form></section>';
    const recipient = composeContainer.querySelector('[name="to"]');
    if (!toAddress) recipient.focus();
  }

  function selectedEmails() {
    return state.emails.filter(email => state.selectedIds.has(email.id));
  }

  function handleAction(action, id) {
    if (action === 'star') emailActions.toggleStar(state, id);
    else if (action === 'important') emailActions.toggleImportant(state, id);
    else if (action === 'back') state.openedEmailId = null;
    else if (action === 'archive-one') { emailActions.archive(state, id); state.openedEmailId = null; toast('Conversation archived'); }
    else if (action === 'delete-one') { emailActions.trash(state, id); state.openedEmailId = null; toast('Moved to Trash'); }
    else if (action === 'toggle-read') {
      const email = state.emails.find(item => item.id === id);
      if (email) emailActions.setRead(state, id, !email.read);
      toast(email && email.read ? 'Marked as read' : 'Marked as unread');
    } else if (action === 'select-all') {
      const visible = state.getVisibleEmails();
      const shouldSelect = visible.some(email => !state.selectedIds.has(email.id));
      visible.forEach(email => shouldSelect ? state.selectedIds.add(email.id) : state.selectedIds.delete(email.id));
    } else if (action === 'mark-read') {
      selectedEmails().forEach(email => emailActions.setRead(state, email.id, true));
      toast('Selected conversations marked as read');
    } else if (action === 'archive') {
      selectedEmails().forEach(email => emailActions.archive(state, email.id));
      state.selectedIds.clear(); toast('Selected conversations archived');
    } else if (action === 'delete') {
      selectedEmails().forEach(email => emailActions.trash(state, email.id));
      state.selectedIds.clear(); toast('Selected conversations moved to Trash');
    } else if (action === 'refresh') toast('Inbox is up to date');
    else if (action === 'reply') openCompose(state.emails.find(email => email.id === state.openedEmailId)?.from?.email || '');
    else if (action === 'close-compose') composeContainer.innerHTML = '';
    else if (action === 'compose') openCompose('');
    else if (action === 'account') toast(state.currentUser.email);
    else if (action === 'contacts-back') state.selectedContactId = null;
    else if (action === 'contact-email') openCompose(id || '');
    else if (action === 'new-contact') openContactForm();
    else if (action === 'calendar-event') openPageForm('event');
    else if (action === 'new-note') openPageForm('note');
    else if (action === 'new-task') openPageForm('task');
    else if (action === 'calendar-prev' || action === 'calendar-next') {
      state.calendarDate.setMonth(state.calendarDate.getMonth() + (action === 'calendar-next' ? 1 : -1), 1);
      state.selectedCalendarDate = dateKey(new Date(state.calendarDate.getFullYear(), state.calendarDate.getMonth(), 1));
    }
    else if (action === 'manage-account' || action === 'all-settings') navigate('settings');
    else if (action === 'sign-out') { closePopups(); toast('Demo sign-out is not connected'); }
    else if (action === 'mark-notifications-read') {
      state.emails.forEach(email => { if (!email.trashed) email.read = true; });
      closePopups();
      toast('Notifications marked as read');
    } else if (action === 'close-popups') closePopups();
    else if (action === 'clear-search-options') {
      state.searchFilters = { starred: false, hasAttachment: false, from: '' };
      state.query = '';
      document.getElementById('search-input').value = '';
      state.page = 'mail';
      closePopups();
      const params = new URLSearchParams({ page: 'mail', folder: state.folder });
      if (!updatePageUrl('mail', params, true)) return;
    }
    else if (action === 'help' || action === 'search-options') openSearchOptions();
    render();
  }

  function onContentClick(event) {
    const actionButton = event.target.closest('[data-action]');
    if (actionButton) {
      event.preventDefault();
      event.stopPropagation();
      if (actionButton.dataset.action === 'close-modal') {
        document.getElementById('modal-overlay').style.display = 'none';
        return;
      }
      handleAction(actionButton.dataset.action, actionButton.dataset.id || actionButton.dataset.email);
      return;
    }
    const categoryButton = event.target.closest('[data-category]');
    if (categoryButton) {
      state.category = categoryButton.dataset.category;
      state.openedEmailId = null;
      render();
      return;
    }
    const folderLink = event.target.closest('[data-folder]');
    if (folderLink) {
      event.preventDefault();
      state.folder = folderLink.dataset.folder;
      state.page = 'mail';
      state.category = 'primary';
      navigate('mail', state.folder);
      return;
    }
    const pageLink = event.target.closest('[data-page]');
    if (pageLink) {
      event.preventDefault();
      navigate(pageLink.dataset.page);
      return;
    }
    const accountChoice = event.target.closest('[data-account-index]');
    if (accountChoice) {
      const account = window.CloudMailData.otherAccounts[Number(accountChoice.dataset.accountIndex)];
      if (account) {
        state.currentUser = Object.assign({}, account, { avatar: null, phone: '', initials: account.initials || account.name.split(/\s+/).map(part => part[0]).join('') });
        const avatar = document.getElementById('header-avatar');
        if (avatar) avatar.textContent = state.currentUser.initials;
        document.getElementById('workspace-switcher').querySelector('strong').textContent = account.name;
        closePopups();
        toast('Switched to ' + account.name);
      }
      return;
    }
    const openEmail = event.target.closest('[data-open-email]');
    if (openEmail) {
      const email = state.emails.find(item => item.id === openEmail.dataset.openEmail);
      if (email) {
        state.page = 'mail';
        state.folder = email.folder || 'inbox';
        state.openedEmailId = email.id;
        emailActions.setRead(state, email.id, true);
        closePopups();
        navigate('mail', state.folder);
        state.openedEmailId = email.id;
        render();
      }
      return;
    }
    const contactCard = event.target.closest('[data-contact-id]');
    if (contactCard) {
      state.selectedContactId = contactCard.dataset.contactId;
      render();
      return;
    }
    const settingsTab = event.target.closest('[data-settings-tab]');
    if (settingsTab) {
      state.settingsTab = settingsTab.dataset.settingsTab;
      render();
      return;
    }
    const themeChoice = event.target.closest('[data-theme-choice]');
    if (themeChoice) {
      state.settings.theme = themeChoice.dataset.themeChoice;
      applyTheme();
      saveSettings();
      render();
      document.querySelectorAll('#quick-settings-panel [data-theme-choice]').forEach(button => button.classList.toggle('active', button.dataset.themeChoice === state.settings.theme));
      return;
    }
    const densityChoice = event.target.closest('[data-density]');
    if (densityChoice) {
      state.settings.density = densityChoice.dataset.density;
      document.documentElement.dataset.density = state.settings.density;
      saveSettings();
      render();
      document.querySelectorAll('#quick-settings-panel [data-density]').forEach(button => button.classList.toggle('active', button.dataset.density === state.settings.density));
      return;
    }
    const calendarDay = event.target.closest('[data-calendar-day]');
    if (calendarDay) {
      state.selectedCalendarDate = dateKey(new Date(state.calendarDate.getFullYear(), state.calendarDate.getMonth(), Number(calendarDay.dataset.calendarDay)));
      render();
      return;
    }
    if (event.target.matches('.email-select-checkbox')) return;
    const row = event.target.closest('.email-row');
    if (row) {
      state.openedEmailId = row.dataset.emailId;
      emailActions.setRead(state, state.openedEmailId, true);
      render();
    }
  }

  function onComposeSubmit(event) {
    if (event.target.id !== 'compose-form') return;
    event.preventDefault();
    const form = new FormData(event.target);
    const recipient = String(form.get('to') || '').trim();
    const subject = String(form.get('subject') || '').trim();
    const body = String(form.get('body') || '').trim();
    const user = state.currentUser;
    state.emails.unshift({
      id: 'sent-' + Date.now(), threadId: 'sent-' + Date.now(),
      from: { name: user.name, email: user.email },
      to: [{ name: recipient, email: recipient }], cc: [], bcc: [],
      subject, body: '<p>' + ui.escapeHtml(body).replace(/\n/g, '<br>') + '</p>',
      snippet: body.slice(0, 120), date: new Date().toISOString(),
      read: true, starred: false, important: false, snoozed: false, archived: false,
      labels: [], folder: 'sent', category: 'primary', attachments: [], replies: []
    });
    composeContainer.innerHTML = '';
    state.folder = 'sent';
    state.openedEmailId = null;
    render();
    toast('Message sent');
  }

  function openContactForm() {
    const overlay = document.getElementById('modal-overlay');
    const dialog = document.getElementById('modal-dialog');
    overlay.style.display = 'flex';
    dialog.innerHTML = '<form id="contact-form" class="contact-form"><h2>Create contact</h2><label class="form-group"><span class="form-label">Name</span><input class="form-input" name="name" required></label><label class="form-group"><span class="form-label">Email</span><input class="form-input" name="email" type="email" required></label><label class="form-group"><span class="form-label">Company</span><input class="form-input" name="company"></label><div class="modal-actions"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit">Save contact</button></div></form>';
    dialog.querySelector('[name="name"]').focus();
  }

  function openInfoModal(type) {
    const copy = {
      terms: ['Terms of service', 'CloudMail is a front-end demonstration. Messages, contacts, and preferences shown here are sample data; no email is delivered to a real mail service.'],
      privacy: ['Privacy', 'This demo runs locally in your browser and does not connect to a mail server. Avoid entering real personal or confidential information.'],
      'program-policies': ['Program policies', 'Use this demo responsibly. Account switching, mail delivery, and connected services are simulated.']
    }[type];
    if (!copy) return;
    const overlay = document.getElementById('modal-overlay');
    const dialog = document.getElementById('modal-dialog');
    dialog.innerHTML = '<div class="modal-header"><h2>' + copy[0] + '</h2><button class="icon-btn" data-action="close-modal" aria-label="Close"><span class="material-icons-outlined">close</span></button></div><div class="modal-body"><p>' + copy[1] + '</p></div><div class="modal-footer"><button class="btn btn-primary" data-action="close-modal">Done</button></div>';
    overlay.style.display = 'flex';
  }

  function onContactSubmit(event) {
    if (event.target.id !== 'contact-form') return;
    event.preventDefault();
    const form = new FormData(event.target);
    const name = String(form.get('name') || '').trim();
    state.contacts.unshift({ id: 'c-' + Date.now(), name, email: String(form.get('email') || '').trim(), company: String(form.get('company') || '').trim(), title: '', phone: '', notes: '', groups: [], avatarColor: '#1a73e8' });
    document.getElementById('modal-overlay').style.display = 'none';
    state.selectedContactId = null;
    render();
    toast('Contact saved');
  }

  function openPageForm(kind) {
    const overlay = document.getElementById('modal-overlay');
    const dialog = document.getElementById('modal-dialog');
    const config = {
      event: { title: 'Create calendar event', label: 'Event name', submit: 'Save event', extra: '<label class="form-group"><span class="form-label">Date</span><input class="form-input" name="date" type="date" required value="' + state.selectedCalendarDate + '"></label><label class="form-group"><span class="form-label">Time</span><input class="form-input" name="time" type="time"></label>' },
      note: { title: 'Create a note', label: 'Title', submit: 'Save note', extra: '<label class="form-group"><span class="form-label">Note</span><textarea class="form-input" name="body" rows="4" placeholder="Write a note..."></textarea></label>' },
      task: { title: 'Add a task', label: 'Task', submit: 'Add task', extra: '<label class="form-group"><span class="form-label">Details</span><input class="form-input" name="meta" placeholder="Due date or list"></label>' }
    }[kind];
    overlay.style.display = 'flex';
    dialog.innerHTML = '<form id="page-form" class="contact-form"><input type="hidden" name="kind" value="' + kind + '"><h2>' + config.title + '</h2><label class="form-group"><span class="form-label">' + config.label + '</span><input class="form-input" name="title" required></label>' + config.extra + '<div class="modal-actions"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit">' + config.submit + '</button></div></form>';
    dialog.querySelector('[name="title"]').focus();
  }

  function onPageFormSubmit(event) {
    if (event.target.id !== 'page-form') return;
    event.preventDefault();
    const form = new FormData(event.target);
    const kind = String(form.get('kind'));
    const title = String(form.get('title') || '').trim();
    if (kind === 'event') {
      const date = String(form.get('date') || state.selectedCalendarDate);
      state.events.push({ id: 'event-' + Date.now(), title, date, time: String(form.get('time') || '') });
      state.selectedCalendarDate = date;
      state.calendarDate = new Date(date + 'T12:00:00');
    } else if (kind === 'note') {
      state.notes.unshift({ id: 'note-' + Date.now(), title, body: String(form.get('body') || ''), tone: ['yellow', 'blue', 'green'][state.notes.length % 3], pinned: false });
    } else if (kind === 'task') {
      state.tasks.unshift({ id: 'task-' + Date.now(), title, meta: String(form.get('meta') || 'No due date'), done: false });
    }
    document.getElementById('modal-overlay').style.display = 'none';
    render();
    toast(kind === 'event' ? 'Event saved' : kind === 'note' ? 'Note saved' : 'Task added');
  }

  function onSearchOptionsSubmit(event) {
    if (event.target.id !== 'search-options-form') return;
    event.preventDefault();
    const form = new FormData(event.target);
    state.searchFilters = {
      from: String(form.get('from') || '').trim(),
      starred: form.has('starred'),
      hasAttachment: form.has('hasAttachment')
    };
    state.page = 'search';
    state.openedEmailId = null;
    const params = new URLSearchParams({ page: 'search' });
    if (state.query) params.set('q', state.query);
    if (state.searchFilters.from) params.set('from', state.searchFilters.from);
    if (state.searchFilters.starred) params.set('starred', '1');
    if (state.searchFilters.hasAttachment) params.set('attachment', '1');
    if (!updatePageUrl('search', params, false)) return;
    closePopups();
    render();
  }

  if (!state || !ui || !emailActions || !app) return;
  if (auth) auth.style.display = 'none';
  app.style.display = 'grid';
  applyTheme();
  document.documentElement.dataset.density = state.settings.density || 'default';
  if (state.page === 'search') state.query = new URLSearchParams(window.location.search).get('q') || '';
  document.getElementById('search-input').value = state.query;
  const avatar = document.getElementById('header-avatar');
  if (avatar) avatar.textContent = state.currentUser.initials || 'U';

  document.getElementById('content-area').addEventListener('click', onContentClick);
  document.getElementById('sidebar-nav').addEventListener('click', onContentClick);
  document.getElementById('sidebar-labels').addEventListener('click', onContentClick);
  document.getElementById('top-navigation').addEventListener('click', onContentClick);
  document.getElementById('app-rail').addEventListener('click', onContentClick);
  document.getElementById('account-menu').addEventListener('click', onContentClick);
  document.getElementById('apps-menu').addEventListener('click', onContentClick);
  document.getElementById('help-menu').addEventListener('click', onContentClick);
  document.getElementById('quick-settings-panel').addEventListener('click', onContentClick);
  document.getElementById('search-dropdown').addEventListener('click', onContentClick);
  document.getElementById('shortcuts-overlay').addEventListener('click', function(event) {
    if (event.target.id === 'shortcuts-overlay' || event.target.closest('[data-action="close-shortcuts"]')) event.currentTarget.style.display = 'none';
  });
  document.getElementById('compose-btn').addEventListener('click', function() { handleAction('compose'); });
  document.getElementById('menu-toggle').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    if (window.matchMedia('(max-width: 768px)').matches) {
      sidebar.classList.toggle('sidebar-mobile-open');
      document.getElementById('sidebar-overlay').style.display = sidebar.classList.contains('sidebar-mobile-open') ? 'block' : 'none';
    } else sidebar.classList.toggle('sidebar-collapsed');
  });
  document.getElementById('header-settings-btn').addEventListener('click', toggleQuickSettings);
  document.getElementById('apps-btn').addEventListener('click', openAppsMenu);
  document.getElementById('help-btn').addEventListener('click', openNotifications);
  document.getElementById('user-avatar-btn').addEventListener('click', openAccountMenu);
  document.getElementById('rail-profile').addEventListener('click', openAccountMenu);
  document.getElementById('workspace-switcher').addEventListener('click', openAccountMenu);
  document.getElementById('logo-link').addEventListener('click', function(event) {
    event.preventDefault();
    navigate('mail', 'inbox');
  });
  document.querySelectorAll('.rp-btn').forEach(button => button.addEventListener('click', function() {
    const panel = button.dataset.panel;
    navigate(panel === 'contacts' ? 'contacts' : panel === 'calendar' ? 'calendar' : panel === 'tasks' ? 'tasks' : 'keep');
  }));
  document.getElementById('search-input').addEventListener('input', function(event) {
    state.query = event.target.value;
    const hasFilters = state.searchFilters.starred || state.searchFilters.hasAttachment || state.searchFilters.from;
    state.page = state.query || hasFilters ? 'search' : 'mail';
    state.openedEmailId = null;
    const params = new URLSearchParams();
    params.set('page', state.page);
    if (state.page === 'search') params.set('q', state.query);
    else params.set('folder', state.folder);
    if (state.page === 'search') {
      if (state.searchFilters.from) params.set('from', state.searchFilters.from);
      if (state.searchFilters.starred) params.set('starred', '1');
      if (state.searchFilters.hasAttachment) params.set('attachment', '1');
    }
    if (!updatePageUrl(state.page, params, true)) return;
    render();
    const input = document.getElementById('search-input');
    input.focus();
    input.setSelectionRange(state.query.length, state.query.length);
  });
  document.getElementById('search-options-btn').addEventListener('click', openSearchOptions);
  document.addEventListener('change', function(event) {
    if (event.target.matches('.task-toggle')) {
      const task = state.tasks.find(item => item.id === event.target.dataset.taskId);
      if (task) task.done = event.target.checked;
      render();
      return;
    }
    const setting = event.target.dataset.setting;
    if (setting) {
      if (setting === 'categories') state.settings.categories.social = event.target.checked;
      else if (event.target.type === 'checkbox') state.settings[setting] = event.target.checked;
      else state.settings[setting] = event.target.type === 'number' ? Number(event.target.value) : event.target.value;
      saveSettings();
      toast('Settings updated');
      return;
    }
    if (!event.target.matches('.email-select-checkbox')) return;
    if (event.target.checked) state.selectedIds.add(event.target.dataset.id);
    else state.selectedIds.delete(event.target.dataset.id);
    render();
  });
  document.addEventListener('submit', onComposeSubmit);
  document.addEventListener('submit', onContactSubmit);
  document.addEventListener('submit', onPageFormSubmit);
  document.addEventListener('submit', onSearchOptionsSubmit);
  document.addEventListener('click', function(event) {
    if (event.target.closest('[data-action="close-compose"]')) {
      composeContainer.innerHTML = '';
    }
    if (event.target.closest('[data-action="close-modal"]')) {
      document.getElementById('modal-overlay').style.display = 'none';
    }
    if (!event.target.closest('.dropdown-panel, #quick-settings-panel, #search-container, #header-settings-btn, #apps-btn, #help-btn, #user-avatar-btn, #workspace-switcher, #rail-profile')) closePopups();
  });
  document.getElementById('modal-overlay').addEventListener('click', function(event) {
    if (event.target.id === 'modal-overlay') event.currentTarget.style.display = 'none';
  });
  document.getElementById('sidebar-overlay').addEventListener('click', function() {
    document.getElementById('sidebar').classList.remove('sidebar-mobile-open');
    document.getElementById('sidebar-overlay').style.display = 'none';
  });
  document.getElementById('content-area').addEventListener('input', function(event) {
    if (event.target.id !== 'contacts-search-input') return;
    const cursor = event.target.selectionStart;
    state.contactQuery = event.target.value;
    ui.renderApp(state);
    const input = document.getElementById('contacts-search-input');
    input.focus();
    input.setSelectionRange(cursor, cursor);
  });
  window.addEventListener('popstate', function() {
    const params = new URLSearchParams(window.location.search);
    state.page = params.get('page') || document.documentElement.dataset.appPage || 'mail';
    state.folder = params.get('folder') || 'inbox';
    state.query = params.get('q') || '';
    state.searchFilters = { from: params.get('from') || '', starred: params.get('starred') === '1', hasAttachment: params.get('attachment') === '1' };
    document.getElementById('search-input').value = state.query;
    state.openedEmailId = null;
    render();
  });
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
      if (state.settings.theme === 'auto') applyTheme();
    });
  }
  document.addEventListener('keydown', function(event) {
    const row = event.target.closest && event.target.closest('.email-row');
    if (row && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      state.openedEmailId = row.dataset.emailId;
      emailActions.setRead(state, state.openedEmailId, true);
      render();
    }
    if (event.key === 'Escape' && composeContainer.firstElementChild) composeContainer.innerHTML = '';
    if (event.key === 'Escape') {
      closePopups();
      document.getElementById('shortcuts-overlay').style.display = 'none';
      document.getElementById('modal-overlay').style.display = 'none';
    }
    if (event.key === '?' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) openShortcuts();
    if (event.key.toLowerCase() === 'c' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) openCompose('');
    if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      event.preventDefault();
      document.getElementById('search-input').focus();
    }
  });
  document.querySelectorAll('.sidebar-footer-links a').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    openInfoModal(link.dataset.action);
  }));

  render();
})();
