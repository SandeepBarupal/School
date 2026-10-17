/* CloudMail rendering helpers. */
window.CloudMailUI = (function() {
  'use strict';

  const escapeHtml = value => String(value == null ? '' : value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const icon = name => '<span class="material-icons-outlined" aria-hidden="true">' + name + '</span>';
  const navIcon = name => '<span class="material-icons-outlined nav-icon" aria-hidden="true">' + name + '</span>';
  const folderNames = {
    inbox: 'Inbox', starred: 'Starred', snoozed: 'Snoozed', sent: 'Sent',
    drafts: 'Drafts', important: 'Important', all: 'All Mail', spam: 'Spam', trash: 'Trash'
  };
  const pageFiles = {
    mail: 'index.html', contacts: 'contacts.html', calendar: 'calendar.html',
    keep: 'notes.html', tasks: 'tasks.html', settings: 'settings.html'
  };
  const formatDate = value => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const now = new Date();
    if (date.toDateString() === now.toDateString()) return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    if (date.getFullYear() === now.getFullYear()) return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  };
  const calendarDateKey = date => [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  const escapeAttr = escapeHtml;

  function renderSidebar(state) {
    const nav = document.getElementById('sidebar-nav');
    const labels = document.getElementById('sidebar-labels');
    if (!nav || !labels) return;

    const items = [
      ['inbox', 'inbox', 'Inbox'], ['starred', 'star', 'Starred'],
      ['snoozed', 'schedule', 'Snoozed'], ['sent', 'send', 'Sent'],
      ['drafts', 'insert_drive_file', 'Drafts'], ['important', 'label_important', 'Important'],
      ['all', 'mail', 'All Mail'], ['spam', 'report', 'Spam'], ['trash', 'delete', 'Trash']
    ];
    nav.innerHTML = items.map(([folder, glyph, label], index) => {
      const count = folder === 'inbox'
        ? state.emails.filter(email => email.folder === 'inbox' && !email.read && !email.archived && !email.trashed).length
        : folder === 'drafts' ? state.emails.filter(email => email.folder === 'drafts').length : 0;
      const separator = index === 0 ? '<div class="sidebar-section-header"><span>MAIL</span></div>'
        : index === 3 ? '<div class="nav-separator"></div><div class="sidebar-section-header"><span>OUTBOX</span></div>'
          : index === 5 ? '<div class="nav-separator"></div><div class="sidebar-section-header"><span>ORGANIZE</span></div>' : '';
      return separator + '<a href="index.html?page=mail&amp;folder=' + folder + '" class="nav-item' + (state.page === 'mail' && state.folder === folder ? ' active' : '') + '" data-folder="' + folder + '">' +
        navIcon(glyph) + '<span class="nav-label">' + label + '</span>' +
        (count ? '<span class="nav-count">' + count + '</span>' : '') + '</a>';
    }).join('');

    nav.innerHTML += '<div class="nav-separator"></div><div class="sidebar-section-header"><span>WORKSPACE</span></div>' +
      '<a href="' + pageFiles.contacts + '?page=contacts" class="nav-item' + (state.page === 'contacts' ? ' active' : '') + '" data-page="contacts">' + navIcon('contacts') + '<span class="nav-label">Contacts</span></a>' +
      '<a href="' + pageFiles.calendar + '?page=calendar" class="nav-item' + (state.page === 'calendar' ? ' active' : '') + '" data-page="calendar">' + navIcon('calendar_today') + '<span class="nav-label">Calendar</span></a>' +
      '<a href="' + pageFiles.tasks + '?page=tasks" class="nav-item' + (state.page === 'tasks' ? ' active' : '') + '" data-page="tasks">' + navIcon('check_circle') + '<span class="nav-label">Tasks</span></a>' +
      '<a href="' + pageFiles.settings + '?page=settings" class="nav-item' + (state.page === 'settings' ? ' active' : '') + '" data-page="settings">' + navIcon('settings') + '<span class="nav-label">Settings</span></a>';

    labels.innerHTML = '<div class="sidebar-section-header"><span>Labels</span></div>' + state.labels.map(label =>
      '<a href="index.html?page=mail&amp;folder=label:' + escapeAttr(label.name) + '" class="nav-item label-item' + (state.page === 'mail' && state.folder === 'label:' + label.name ? ' active' : '') + '" data-folder="label:' + escapeAttr(label.name) + '">' +
      '<span class="label-dot" style="background:' + escapeAttr(label.color) + '"></span><span class="nav-label">' + escapeHtml(label.name) + '</span></a>'
    ).join('');

    document.querySelectorAll('#top-navigation [data-page]').forEach(link => {
      const active = link.dataset.page === state.page && (link.dataset.page !== 'mail' || state.folder === 'inbox');
      link.classList.toggle('active', active);
    });
    document.querySelectorAll('#app-rail [data-page]').forEach(link => {
      link.classList.toggle('active', link.dataset.page === state.page);
    });
  }

  function renderEmailRow(email, state) {
    const sender = email.from ? email.from.name : 'Unknown sender';
    const selected = state.selectedIds.has(email.id);
    const labels = (email.labels || []).map(label => '<span class="email-label-tag">' + escapeHtml(label) + '</span>').join('');
    return '<article class="email-row ' + (email.read ? 'read' : 'unread') + (selected ? ' selected' : '') + '" data-email-id="' + escapeAttr(email.id) + '" tabindex="0" role="button" aria-label="Open email: ' + escapeAttr(email.subject) + '">' +
      '<div class="email-checkbox"><input type="checkbox" class="email-select-checkbox" data-id="' + escapeAttr(email.id) + '" aria-label="Select email" ' + (selected ? 'checked' : '') + '></div>' +
      '<button class="email-star' + (email.starred ? ' starred' : '') + '" data-action="star" data-id="' + escapeAttr(email.id) + '" title="' + (email.starred ? 'Unstar' : 'Star') + '" aria-label="' + (email.starred ? 'Unstar' : 'Star') + ' email">' + icon(email.starred ? 'star' : 'star_border') + '</button>' +
      '<button class="email-important' + (email.important ? ' active' : '') + '" data-action="important" data-id="' + escapeAttr(email.id) + '" title="Toggle important" aria-label="Toggle important">' + icon('label_important') + '</button>' +
      '<div class="email-content"><span class="email-sender">' + escapeHtml(sender) + '</span>' +
      '<div class="email-subject-snippet"><span class="email-subject">' + escapeHtml(email.subject) + '</span><span class="email-snippet-sep">—</span><span class="email-snippet">' + escapeHtml(email.snippet || '') + '</span></div>' +
      '<span class="email-labels">' + labels + '</span>' + (email.attachments && email.attachments.length ? '<span class="email-attachment">' + icon('attach_file') + '</span>' : '') +
      '<span class="email-date">' + formatDate(email.date) + '</span></div></article>';
  }

  function renderInbox(state) {
    const content = document.getElementById('content-area');
    if (!content) return;
    const emails = state.getVisibleEmails();
    const folderTitle = state.page === 'search'
      ? 'Search results' + (state.query ? ' for “' + state.query + '”' : '')
      : state.folder.startsWith('label:') ? state.folder.slice(6) : (folderNames[state.folder] || 'Inbox');
    const categories = [
      ['primary', 'inbox', 'Primary'], ['social', 'people', 'Social'],
      ['promotions', 'local_offer', 'Promotions'], ['updates', 'info', 'Updates']
    ];
    const categoryMarkup = state.page === 'mail' && state.folder === 'inbox' ? '<div class="category-tabs">' + categories.map(([key, glyph, label]) => {
      const categoryCount = state.emails.filter(email => email.folder === 'inbox' && email.category === key && !email.archived && !email.trashed).length;
      return '<button class="category-tab' + (state.category === key ? ' active' : '') + '" data-category="' + key + '">' + icon(glyph) + '<span>' + label + '</span>' +
        (categoryCount ? '<span class="cat-badge">' + categoryCount + '</span>' : '') + '</button>';
    }).join('') + '</div>' : '';

    content.innerHTML = '<div class="email-toolbar"><div class="toolbar-left">' +
      '<button class="icon-btn" data-action="select-all" title="Select all visible emails" aria-label="Select all">' + icon('check_box_outline_blank') + '</button>' +
      '<button class="icon-btn" data-action="refresh" title="Refresh" aria-label="Refresh">' + icon('refresh') + '</button>' +
      '<button class="icon-btn" data-action="mark-read" title="Mark read" aria-label="Mark read">' + icon('mark_email_read') + '</button>' +
      '<button class="icon-btn" data-action="archive" title="Archive selected" aria-label="Archive selected">' + icon('archive') + '</button>' +
      '<button class="icon-btn" data-action="delete" title="Move selected to Trash" aria-label="Delete selected">' + icon('delete') + '</button>' +
      '</div><div class="toolbar-right"><span class="email-count">' + (emails.length ? '1–' + emails.length : '0') + ' of ' + emails.length + '</span></div></div>' +
      '<div class="folder-heading" style="padding:18px 20px 4px;font-size:20px">' + escapeHtml(folderTitle) + '</div>' + categoryMarkup +
      (emails.length ? '<div class="email-list">' + emails.map(email => renderEmailRow(email, state)).join('') + '</div>' : '<div class="empty-state">' + icon('inbox') + '<h2>No emails here</h2><p>Try another folder or change your search.</p></div>');
  }

  function renderDetail(state) {
    const content = document.getElementById('content-area');
    const email = state.emails.find(item => item.id === state.openedEmailId);
    if (!content || !email) { state.openedEmailId = null; renderInbox(state); return; }
    const sender = email.from || { name: 'Unknown sender', email: '' };
    const messages = [{ from: sender, body: email.body, date: email.date, attachments: email.attachments || [] }].concat(email.replies || []);
    content.innerHTML = '<div class="email-toolbar"><div class="toolbar-left">' +
      '<button class="icon-btn" data-action="back" title="Back to inbox" aria-label="Back">' + icon('arrow_back') + '</button>' +
      '<button class="icon-btn" data-action="archive-one" data-id="' + escapeAttr(email.id) + '" title="Archive" aria-label="Archive">' + icon('archive') + '</button>' +
      '<button class="icon-btn" data-action="delete-one" data-id="' + escapeAttr(email.id) + '" title="Move to Trash" aria-label="Delete">' + icon('delete') + '</button>' +
      '<button class="icon-btn" data-action="toggle-read" data-id="' + escapeAttr(email.id) + '" title="Mark unread" aria-label="Mark unread">' + icon('mark_email_unread') + '</button>' +
      '</div></div><div class="thread-view"><div class="thread-header"><h1 class="thread-subject">' + escapeHtml(email.subject) +
      '<span class="thread-labels">' + (email.labels || []).map(label => '<span class="email-label-tag">' + escapeHtml(label) + '</span>').join('') + '</span></h1>' +
      '<div class="thread-actions"><button class="icon-btn" data-action="star" data-id="' + escapeAttr(email.id) + '" title="Toggle star" aria-label="Toggle star">' + icon(email.starred ? 'star' : 'star_border') + '</button></div></div>' +
      messages.map(message => '<article class="thread-message"><div class="thread-msg-header"><div class="thread-msg-avatar" style="background:' + escapeAttr(message.from.avatarColor || '#1a73e8') + '">' + escapeHtml((message.from.name || '?').slice(0, 1).toUpperCase()) + '</div>' +
        '<div class="thread-msg-info"><div class="thread-msg-sender">' + escapeHtml(message.from.name || message.from.email) + '</div><div class="thread-msg-recipients">' + escapeHtml(message.from.email || '') + '</div></div>' +
        '<time class="thread-msg-date">' + formatDate(message.date) + '</time></div><div class="thread-msg-body">' + (message.body || '') + '</div>' +
        (message.attachments && message.attachments.length ? '<div class="thread-attachments">' + message.attachments.map(file => '<div class="thread-attachment-chip">' + icon('description') + '<span class="attachment-info"><span class="attachment-name">' + escapeHtml(file.name) + '</span><span class="attachment-size">' + escapeHtml(file.size) + '</span></span></div>').join('') + '</div>' : '') +
        '</article>').join('') + '<button class="thread-reply-area" data-action="reply">Reply</button></div>';
  }

  function renderContacts(state) {
    const content = document.getElementById('content-area');
    const query = state.contactQuery.trim().toLowerCase();
    const contacts = state.contacts.filter(contact => [contact.name, contact.email, contact.company, contact.title].join(' ').toLowerCase().includes(query));
    const selected = state.contacts.find(contact => contact.id === state.selectedContactId);
    if (selected) {
      content.innerHTML = '<section class="contact-detail"><button class="btn btn-secondary" data-action="contacts-back">' + icon('arrow_back') + ' All contacts</button>' +
        '<div class="contact-detail-header"><div class="avatar contact-avatar-large" style="background:' + escapeAttr(selected.avatarColor || '#1a73e8') + '">' + escapeHtml(selected.name.slice(0, 1)) + '</div><div><h1 class="contact-detail-name">' + escapeHtml(selected.name) + '</h1><p class="contact-detail-title">' + escapeHtml([selected.title, selected.company].filter(Boolean).join(' · ')) + '</p><div class="contact-detail-actions"><button class="btn btn-primary" data-action="contact-email" data-email="' + escapeAttr(selected.email) + '">' + icon('mail') + ' Email</button></div></div></div>' +
        '<section class="contact-detail-section"><h3>Contact information</h3><div class="contact-detail-row">' + icon('mail') + '<a href="mailto:' + escapeAttr(selected.email) + '">' + escapeHtml(selected.email) + '</a></div>' +
        (selected.phone ? '<div class="contact-detail-row">' + icon('call') + '<span>' + escapeHtml(selected.phone) + '</span></div>' : '') +
        (selected.notes ? '<p class="contact-note">' + escapeHtml(selected.notes) + '</p>' : '') + '</section></section>';
      return;
    }
    content.innerHTML = '<section class="page-shell contacts-screen"><header class="page-heading"><div><span class="eyebrow">PEOPLE</span><h1>Contacts</h1><p>Your people, all in one place.</p></div><button class="btn btn-primary" data-action="new-contact">' + icon('person_add') + ' Create contact</button></header>' +
      '<div class="contacts-toolbar"><label class="contacts-search">' + icon('search') + '<input id="contacts-search-input" type="search" placeholder="Search contacts" value="' + escapeAttr(state.contactQuery) + '"></label><span class="contacts-total">' + contacts.length + ' contacts</span></div>' +
      (contacts.length ? '<div class="contacts-grid">' + contacts.map(contact => '<button class="contact-card" data-contact-id="' + escapeAttr(contact.id) + '"><span class="avatar contact-card-avatar" style="background:' + escapeAttr(contact.avatarColor || '#1a73e8') + '">' + escapeHtml(contact.name.slice(0, 1)) + '</span><span class="contact-card-info"><strong>' + escapeHtml(contact.name) + '</strong><span>' + escapeHtml(contact.email) + '</span><small>' + escapeHtml([contact.title, contact.company].filter(Boolean).join(' · ')) + '</small></span><span class="material-icons-outlined contact-card-arrow">chevron_right</span></button>').join('') + '</div>' : '<div class="empty-state">' + icon('person_search') + '<h2>No contacts found</h2><p>Try another name or email address.</p></div>') + '</section>';
  }

  function renderSettings(state) {
    const content = document.getElementById('content-area');
    const tabs = [['general', 'General'], ['appearance', 'Appearance'], ['inbox', 'Inbox']];
    let panel = '';
    if (state.settingsTab === 'appearance') {
      panel = '<section class="settings-section"><h2>Look and feel</h2><p>Make CloudMail comfortable for your workflow.</p><div class="settings-choice-grid">' +
        [['light', 'light_mode', 'Light', 'Bright and clean'], ['dark', 'dark_mode', 'Dark', 'Easy on the eyes'], ['auto', 'brightness_auto', 'Automatic', 'Follow your device']].map(([value, glyph, title, desc]) => '<button class="theme-choice' + (state.settings.theme === value ? ' active' : '') + '" data-theme-choice="' + value + '">' + icon(glyph) + '<strong>' + title + '</strong><span>' + desc + '</span></button>').join('') +
        '</div></section><section class="settings-section"><h2>Display density</h2><p>Choose how much of your mail fits on screen.</p><div class="density-options">' +
        [['comfortable', 'Comfortable'], ['default', 'Default'], ['compact', 'Compact']].map(([value, label]) => '<button class="density-option' + (state.settings.density === value ? ' active' : '') + '" data-density="' + value + '">' + label + '</button>').join('') + '</div></section>';
    } else if (state.settingsTab === 'inbox') {
      panel = '<section class="settings-section"><h2>Inbox preferences</h2><p>Choose how incoming messages are organized.</p><label class="settings-control-row"><span><strong>Inbox type</strong><small>Choose the order of your messages</small></span><select class="form-input" data-setting="inboxType"><option value="default">Default</option><option value="important-first">Important first</option><option value="unread-first">Unread first</option><option value="starred-first">Starred first</option></select></label>' +
        '<label class="settings-control-row"><span><strong>Conversation view</strong><small>Group replies into conversations</small></span><input type="checkbox" data-setting="conversationView" ' + (state.settings.conversationView ? 'checked' : '') + '></label>' +
        '<label class="settings-control-row"><span><strong>Show social and promotions categories</strong><small>Separate updates from your primary inbox</small></span><input type="checkbox" data-setting="categories" ' + (state.settings.categories.social ? 'checked' : '') + '></label></section>';
    } else {
      panel = '<section class="settings-section"><h2>Your account</h2><p>Manage the details attached to your CloudMail account.</p><div class="account-summary"><div class="avatar" style="background:' + escapeAttr(state.currentUser.avatarColor) + '">' + escapeHtml(state.currentUser.initials) + '</div><div><strong>' + escapeHtml(state.currentUser.name) + '</strong><span>' + escapeHtml(state.currentUser.email) + '</span></div><button class="btn btn-secondary" data-action="account">Manage account</button></div></section>' +
        '<section class="settings-section"><h2>Language and region</h2><label class="settings-control-row"><span><strong>Language</strong><small>Choose the language used in CloudMail</small></span><select class="form-input" data-setting="language"><option>English</option><option>Hindi</option><option>Español</option><option>Français</option></select></label>' +
        '<label class="settings-control-row"><span><strong>Undo send</strong><small>How long you have to recall a sent message</small></span><select class="form-input" data-setting="undoSendDelay"><option value="5">5 seconds</option><option value="10">10 seconds</option><option value="20">20 seconds</option><option value="30">30 seconds</option></select></label></section>';
    }
    content.innerHTML = '<section class="page-shell settings-screen"><header class="page-heading"><div><span class="eyebrow">PREFERENCES</span><h1>Settings</h1><p>Shape CloudMail around the way you work.</p></div></header><nav class="settings-tabs">' + tabs.map(([key, label]) => '<button class="settings-tab' + (state.settingsTab === key ? ' active' : '') + '" data-settings-tab="' + key + '">' + label + '</button>').join('') + '</nav><div class="settings-content settings-card">' + panel + '</div></section>';
    const inboxType = content.querySelector('[data-setting="inboxType"]');
    const language = content.querySelector('[data-setting="language"]');
    const undoDelay = content.querySelector('[data-setting="undoSendDelay"]');
    if (inboxType) inboxType.value = state.settings.inboxType;
    if (language) language.value = state.settings.language;
    if (undoDelay) undoDelay.value = String(state.settings.undoSendDelay);
  }

  function renderProductPage(state) {
    const content = document.getElementById('content-area');
    if (state.page === 'calendar') {
      const month = state.calendarDate;
      const today = new Date();
      const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
      const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
      const offset = (monthStart.getDay() + 6) % 7;
      const days = Array(offset).fill('<span></span>').concat(Array.from({ length: daysInMonth }, (_, index) => {
        const day = index + 1;
        const dateKey = calendarDateKey(new Date(month.getFullYear(), month.getMonth(), day));
        const isToday = day === today.getDate() && month.getMonth() === today.getMonth() && month.getFullYear() === today.getFullYear();
        return '<button class="calendar-day' + (isToday ? ' today' : '') + (state.selectedCalendarDate === dateKey ? ' selected' : '') + '" data-calendar-day="' + day + '">' + day + (state.events.some(event => event.date === dateKey) ? '<i></i>' : '') + '</button>';
      }));
      const agenda = state.events.filter(event => event.date === state.selectedCalendarDate);
      content.innerHTML = '<section class="page-shell"><header class="page-heading"><div><span class="eyebrow">PLAN YOUR TIME</span><h1>Calendar</h1><p>Keep your schedule and plans in view.</p></div><button class="btn btn-primary" data-action="calendar-event">' + icon('add') + ' Create event</button></header><div class="calendar-layout"><section class="calendar-card"><div class="calendar-month"><button class="icon-btn" data-action="calendar-prev" aria-label="Previous month">' + icon('chevron_left') + '</button><h2>' + escapeHtml(month.toLocaleDateString([], { month: 'long', year: 'numeric' })) + '</h2><button class="icon-btn" data-action="calendar-next" aria-label="Next month">' + icon('chevron_right') + '</button></div><div class="calendar-grid">' + ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => '<span class="calendar-weekday">' + day + '</span>').join('') + days.join('') + '</div></section><aside class="calendar-agenda"><span class="eyebrow">AGENDA</span><h2>' + escapeHtml(new Date(state.selectedCalendarDate + 'T12:00:00').toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })) + '</h2>' + (agenda.length ? agenda.map(event => '<div class="agenda-event"><strong>' + escapeHtml(event.title) + '</strong><span>' + escapeHtml(event.time || 'All day') + '</span></div>').join('') : '<div class="agenda-empty">' + icon('event_available') + '<strong>Your day is clear</strong><span>Add an event when something comes up.</span></div>') + '</aside></div></section>';
    } else if (state.page === 'keep') {
      content.innerHTML = '<section class="page-shell"><header class="page-heading"><div><span class="eyebrow">QUICK NOTES</span><h1>Keep</h1><p>Capture ideas before they slip away.</p></div><button class="btn btn-primary" data-action="new-note">' + icon('add') + ' New note</button></header><div class="notes-grid">' + state.notes.map(note => '<article class="note-card note-' + escapeAttr(note.tone) + '"><span class="eyebrow">' + (note.pinned ? 'PINNED' : 'NOTE') + '</span><h2>' + escapeHtml(note.title) + '</h2><p>' + escapeHtml(note.body).replace(/\n/g, '<br>') + '</p><small>Saved in this session</small></article>').join('') + '<article class="note-card note-green"><button class="note-add" data-action="new-note">' + icon('add') + '<span>Create a note</span></button></article></div></section>';
    } else {
      content.innerHTML = '<section class="page-shell"><header class="page-heading"><div><span class="eyebrow">STAY ON TRACK</span><h1>Tasks</h1><p>Small steps add up to meaningful progress.</p></div><button class="btn btn-primary" data-action="new-task">' + icon('add') + ' Add a task</button></header><section class="tasks-card"><div class="tasks-card-heading"><div><h2>My tasks</h2><p>Today · ' + new Date().toLocaleDateString([], { month: 'long', day: 'numeric' }) + '</p></div><span class="task-count">' + state.tasks.filter(task => !task.done).length + ' remaining</span></div>' +
        state.tasks.map(task => '<label class="task-row' + (task.done ? ' done' : '') + '"><input class="task-toggle" type="checkbox" data-task-id="' + escapeAttr(task.id) + '" ' + (task.done ? 'checked' : '') + '><span><strong>' + escapeHtml(task.title) + '</strong><small>' + escapeHtml(task.meta || 'No due date') + '</small></span><button type="button" class="icon-btn" aria-label="More task actions">' + icon('more_vert') + '</button></label>').join('') + '</section></section>';
    }
  }

  function renderApp(state) {
    renderSidebar(state);
    if (state.page === 'contacts') renderContacts(state);
    else if (state.page === 'settings') renderSettings(state);
    else if (['calendar', 'keep', 'tasks'].includes(state.page)) renderProductPage(state);
    else if (state.openedEmailId) renderDetail(state);
    else renderInbox(state);
  }

  return { renderApp, renderSidebar, renderInbox, renderDetail, escapeHtml };
})();
