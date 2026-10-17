/* CloudMail application state. */
window.CloudMailState = (function() {
  'use strict';

  const data = window.CloudMailData;
  const clone = value => JSON.parse(JSON.stringify(value));
  const params = new URLSearchParams(window.location.search);
  let savedSettings = {};
  try {
    savedSettings = JSON.parse(window.localStorage.getItem('cloudmail-settings') || '{}');
  } catch (error) {
    savedSettings = {};
  }
  const dateKey = date => [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');

  return {
    emails: clone(data.sampleEmails),
    labels: clone(data.defaultLabels),
    contacts: clone(data.sampleContacts),
    settings: Object.assign(clone(data.defaultSettings), savedSettings),
    currentUser: data.currentUser,
    page: params.get('page') || document.documentElement.dataset.appPage || 'mail',
    folder: params.get('folder') || 'inbox',
    category: params.get('category') || 'primary',
    settingsTab: 'general',
    contactQuery: '',
    selectedContactId: null,
    searchFilters: {
      starred: params.get('starred') === '1',
      hasAttachment: params.get('attachment') === '1',
      from: params.get('from') || ''
    },
    calendarDate: new Date(),
    selectedCalendarDate: dateKey(new Date()),
    events: [],
    notes: [
      { id: 'n1', title: 'Ideas for the week', body: 'Review the product roadmap\nShare design feedback with Sarah\nPlan Friday’s team lunch', tone: 'yellow', pinned: true },
      { id: 'n2', title: 'Guest lecture', body: 'Prepare examples for the Advanced Web Technologies session.', tone: 'blue', pinned: false }
    ],
    tasks: [
      { id: 't1', title: 'Review Q4 product roadmap', meta: 'Work · Before 5:00 PM', done: false },
      { id: 't2', title: 'Send feedback on website mockups', meta: 'Work · Tomorrow', done: false },
      { id: 't3', title: 'Book a table for team lunch', meta: 'Personal · Friday', done: true }
    ],
    query: params.get('q') || '',
    openedEmailId: null,
    selectedIds: new Set(),
    getVisibleEmails: function() {
      const query = this.query.trim().toLowerCase();
      return this.emails.filter(email => {
        let matchesFolder = this.page === 'search';
        if (this.page !== 'search') {
          if (this.folder === 'inbox') matchesFolder = email.folder === 'inbox' && !email.archived && !email.trashed && !email.snoozed;
          else if (this.folder === 'starred') matchesFolder = email.starred && !email.trashed;
          else if (this.folder === 'snoozed') matchesFolder = email.snoozed && !email.trashed;
          else if (this.folder === 'sent') matchesFolder = email.folder === 'sent';
          else if (this.folder === 'drafts') matchesFolder = email.folder === 'drafts';
          else if (this.folder === 'important') matchesFolder = email.important && !email.trashed;
          else if (this.folder === 'spam') matchesFolder = email.folder === 'spam' && !email.trashed;
          else if (this.folder === 'trash') matchesFolder = !!email.trashed || email.folder === 'trash';
          else if (this.folder === 'all') matchesFolder = !email.trashed && !['spam', 'trash'].includes(email.folder);
          else if (this.folder.startsWith('label:')) matchesFolder = (email.labels || []).includes(this.folder.slice(6));
        }

        const matchesCategory = this.page !== 'mail' || this.folder !== 'inbox' || this.category === 'all' || email.category === this.category;
        const searchable = [email.from && email.from.name, email.from && email.from.email, email.subject, email.snippet]
          .filter(Boolean).join(' ').toLowerCase();
        const filters = this.page !== 'search' || (
          (!this.searchFilters.starred || email.starred) &&
          (!this.searchFilters.hasAttachment || (email.attachments || []).length > 0) &&
          (!this.searchFilters.from || searchable.includes(this.searchFilters.from.toLowerCase()))
        );
        return matchesFolder && matchesCategory && filters && (!query || searchable.includes(query));
      });
    }
  };
})();
