/**
 *  Основной класс приложения
 * */

import TicketForm from './TicketForm.js';
import TicketView from './TicketView.js';

export default class HelpDesk {
  constructor(container, ticketService) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('This is not HTML element!');
    }
    this.container = container;
    this.ticketService = ticketService;
    this.ticketView = new TicketView();
    this.ticketForm = new TicketForm();
    this.tickets = [];
  }

  init() {
    this.renderLayout();
    this.bindEvents();
    this.loadTickets();
    console.info('init');
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="helpdesk">
        <header class="helpdesk-header">
          <h1>HelpDesk</h1>
          <button class="btn-add-ticket">Добавить тикет</button>
        </header>
        <div class="tickets-container"></div>
      </div>
    `;

    this.ticketsContainer = this.container.querySelector('.tickets-container');
    this.addTicketBtn = this.container.querySelector('.btn-add-ticket');
  }

  bindEvents() {
    this.addTicketBtn.addEventListener('click', () => {
      this.ticketForm.show();
    });

    this.ticketForm.onSubmit = (data) => {
      if (data.id) {
        this.updateTicket(data);
      } else {
        this.createTicket(data);
      }
    };

    this.ticketsContainer.addEventListener('click', (e) => {
      const ticketEl = e.target.closest('.ticket');
      if (!ticketEl) return;

      const ticketId = ticketEl.dataset.id;
      const ticket = this.tickets.find(t => t.id === ticketId);

      if (e.target.classList.contains('ticket-status')) {
        this.toggleTicketStatus(ticket);
      } else if (e.target.classList.contains('ticket-edit')) {
        this.ticketForm.show(ticket);
      } else if (e.target.classList.contains('ticket-delete')) {
        this.deleteTicket(ticket);
      } else if (e.target.classList.contains('ticket-name')) {
        this.toggleDescription(ticketEl);
      }
    });
  }

  loadTickets() {
    this.ticketService.list((err, tickets) => {
      if (err) {
        console.error('Ошибка при загрузке тикетов:', err);
        return;
      }

      this.tickets = tickets || [];
      this.ticketView.renderTickets(this.ticketsContainer, this.tickets);
    });
  }

  createTicket(data) {
    this.ticketService.create(data, (err, newTicket) => {
      if (err) {
        console.error('Ошибка при создании тикета:', err);
        return;
      }

      this.tickets.push(newTicket);
      this.ticketView.renderTickets(this.ticketsContainer, this.tickets);
    });
  }

  updateTicket(data) {
    this.ticketService.update(data.id, data, (err, updatedTicket) => {
      if (err) {
        console.error('Ошибка при обновлении тикета:', err);
        return;
      }

      const index = this.tickets.findIndex(t => t.id === data.id);
      if (index !== -1) {
        this.tickets[index] = { ...this.tickets[index], ...data };
        this.ticketView.renderTickets(this.ticketsContainer, this.tickets);
      }
    });
  }

  deleteTicket(ticket) {
    if (!confirm('Вы уверены, что хотите удалить этот тикет?')) {
      return;
    }

    this.ticketService.delete(ticket.id, (err, result) => {
      if (err) {
        console.error('Ошибка при удалении тикета:', err);
        return;
      }
      
      this.tickets = this.tickets.filter(t => t.id !== ticket.id);
      this.ticketView.renderTickets(this.ticketsContainer, this.tickets);
    });
  }

  toggleTicketStatus(ticket) {
    const newStatus = !ticket.status;
    this.ticketService.update(ticket.id, { status: newStatus }, (err) => {
      if (err) {
        console.error('Ошибка при обновлении статуса тикета:', err);
        return;
      }

      ticket.status = newStatus;
      const ticketEl = this.ticketsContainer.querySelector(`[data-id="${ticket.id}"]`);
      if (ticketEl) {
        this.ticketView.updateStatus(ticketEl, newStatus);
      }
    });
  }

  toggleDescription(ticketEl) {
    const descriptionEl = ticketEl.querySelector('.ticket-description');
    if (descriptionEl.classList.contains('hidden')) {
      const ticketId = ticketEl.dataset.id;
      const ticket = this.tickets.find(t => t.id === ticketId);

      if (ticket && !ticket.description) {
        this.ticketService.get(ticketId, (err, fullTicket) => {
          if (err) {
            console.error('Ошибка при загрузке сведений о тикете:', err);
            return;
          }
          if (fullTicket) {
            ticket.description = fullTicket.description;
            this.ticketView.showDescription(ticketEl);
          }
        });
      } else {
        this.ticketView.showDescription(ticketEl);
      }
    } else {
      this.ticketView.hideDescription(ticketEl);
    }
  }
}