/* Email state mutations used by the app controls. */
window.CloudMailEmail = (function() {
  'use strict';

  function find(state, id) {
    return state.emails.find(email => email.id === id);
  }
  function toggleStar(state, id) {
    const email = find(state, id);
    if (email) email.starred = !email.starred;
  }
  function toggleImportant(state, id) {
    const email = find(state, id);
    if (email) email.important = !email.important;
  }
  function setRead(state, id, read) {
    const email = find(state, id);
    if (email) email.read = read;
  }
  function archive(state, id) {
    const email = find(state, id);
    if (email) email.archived = true;
  }
  function trash(state, id) {
    const email = find(state, id);
    if (email) email.trashed = true;
  }

  return { toggleStar, toggleImportant, setRead, archive, trash };
})();
