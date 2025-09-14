/**
 *  Класс для отображения тикетов на странице.
 *  Он содержит методы для генерации разметки тикета.
 * */
export default class TicketView {
  constructor() {
    this.ticketsContainer = null;
  }

  createTicketElement(ticket) {
    const ticketEl = document.createElement('div');
    ticketEl.classList.add('ticket');
    ticketEl.dataset.id = ticket.id;

    const header = document.createElement('div');
    header.classList.add('ticket-header');

    const status = document.createElement('span');
    status.classList.add('ticket-status');
    if (ticket.status) {
      status.classList.add('completed');
    }
    status.textContent = ticket.status ? '✓' : '';

    const name = document.createElement('span');
    name.classList.add('ticket-name');
    name.textContent = ticket.name;

    const date = document.createElement('span');
    date.classList.add('ticket-date');
    date.textContent = this.formatDate(ticket.created);

    const editBtn = document.createElement('button');
    editBtn.classList.add('ticket-edit');
    editBtn.textContent = '✎';

    const deleteBtn = document.createElement('button');
    editBtn.classList.add('ticket-delete');
    editBtn.textContent = '×';

    header.append(status, name, date, editBtn, deleteBtn);

    const description = document.createElement('div');
    description.classList.add('ticket-description', 'hidden');
    description.textContent = ticket.description || '';

    ticketEl.append(header, description);

    return ticketEl;
  }

  replaceChildren(ticketEl) {
    ticketEl.remove();
  }

  renderTickets(container, tickets) {
    container.replaceChildren();

    tickets.forEach(ticket => {
      const ticketEl = this.createTicketElement(ticket);
      container.append(ticketEl);
    });
  }

  formatDate(time) {
    return new Date(time).toLocaleString();
  }

  showDescription(ticketEl) {
    const descriptionEl = ticketEl.querySelector('.ticket-description');
    descriptionEl.classList.remove('hidden');
  }

  hideDescription(ticketEl) {
    const descriptionEl = ticketEl.querySelector('.ticket-description');
    descriptionEl.classList.add('hidden');
  }

  updateStatus(ticketEl, status) {
    const statusEl = ticketEl.querySelector('.ticket-status');
    statusEl.textContent = status ? '✓' : '';
    statusEl.classList.toggle('completed', status);
  }

  updateTicket(ticketEl, ticketData) {
    const nameEl = ticketEl.querySelector('.ticket-name');
    nameEl.textContent = ticketData.name;

    const dateEl = ticketEl.querySelector('.ticket-date');
    dateEl.textContent = this.formatDate(ticketData.created);

    const descriptionEl = ticketEl.querySelector('.ticket-description');
    descriptionEl.textContent = ticketData.description || '';
  }

  getTicketElement(container, ticketId) {
    return container.querySelector(`[data-id="${ticketId}"]`);
  }
}