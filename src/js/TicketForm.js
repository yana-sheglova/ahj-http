/**
 *  Класс для создания формы создания нового тикета
 * */
export default class TicketForm {
  constructor() {
    this.modal = null;
    this.form = null;
    this.onSubmit = null;
    this.isEdit = false;
    this.currentTicket = null;
  }

  createModal() {
    this.modal = document.createElement('div');
    this.modal.classList.add('modal');

    const modalContent = document.createElement('div');
    this.modalContent.classList.add('modal-content');

    const title = document.createElement('h3');
    title.textContent = this.isEdit ? 'Редактировать тикет' : 'Добавить тикет';

    this.form = document.createElement('form');
    this.form.id = 'ticket-form';

    const nameGroup = document.createElement('div');
    nameGroup.classList.add('form-group');

    const nameLabel = document.createElement('label');
    nameLabel.htmlFor = 'ticket-name';
    nameLabel.textContent = 'Краткое описание:';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'ticket-name';
    nameInput.name = 'name';
    nameInput.required = true;

    nameGroup.append(nameLabel, nameInput);

    const descGroup = document.createElement('form');
    descGroup.classList.add('form-group');

    const descLabel = document.createElement('div');
    descLabel.htmlFor = 'ticket-description';
    descLabel.textContent = 'Подробное описание:';

    const descTextarea = document.createElement('textarea');
    descTextarea.id = 'ticket-description';
    descTextarea.name = 'description';
    descTextarea.rows = 3;

    descGroup.append(descLabel, descTextarea);

    const actionsGroup = document.createElement('div');
    actionsGroup.classList.add('form-actions');

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.classList.add('btn-cancel');
    cancelBtn.textContent = 'Отмена';

    const submitBtn = document.createElement('button');
    submitBtn.type = 'button';
    submitBtn.classList.add('btn-submit');
    submitBtn.textContent = 'OK';

    actionsGroup.append(cancelBtn, submitBtn);

    this.form.append(nameGroup, descGroup, actionsGroup);

    modalContent.append(title, this.form);
    this.modal.append(modalContent);

    this.setupEventListeners();
    document.body.append(this.modal);
  }

  setupEventListeners() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    const cancelBtn = this.modal.querySelector('.btn-cancel');
    cancelBtn.addEventListener('click', () => {
      this.hide();
    });

    this.modal.addEventListener('click', (e) => {
      if (e.currentTarget === e.target) {
        this.hide();
      }
    });

    document.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  handleKeydown(e) {
    if (e.key === 'Escape' && this.modal.style.display === 'block') {
      this.hide();
    };
  }

  handleSubmit() {
    const formData = new FormData(this.form);

    let data;

    if (this.isEdit && this.currentTicket) { // Редактирование существующего тикета
      data = {
        id: this.currentTicket.id,
        name: formData.get('name'),
        description: formData.get('description'),
        status: this.currentTicket.status
      };
    } else {
      data = {
        name: formData.get('name'),
        description: formData.get('description'),
        status: false
      };
    }

    if (this.onSubmit) {
      this.onSubmit(data);
    }

    this.hide();
  }

  show(ticket = null) {
    this.isEdit = !!ticket;
    this.currentTicket = ticket;

    if (!this.modal) {
      this.createModal();
    } else {
      this.updateModalTitle();
    }

    this.fillForm(ticket);
    this.style.display = 'block';
  }

  hide() {
    if (this.modal) {
      this.modal.style.display = 'none';
      this.form.reset();
      this.currentTicket = null;
    }
  }

  updateModalTitle() {
    const title = this.modal.querySelector('h3');
    title.textContent = this.isEdit ? 'Редактировать тикет' : 'Добавить тикет';
  }

  fillForm(ticket) {
    if (!ticket) {
      this.form.reset();
      return;
    }

    this.form.querySelector('#ticket-name').value = ticket.name || '';
    this.form.querySelector('#ticket-description').value = ticket.description || '';
  }

  destroy() {
    if (this.modal) {
      document.removeEventListener('keydown', this.handleKeydown.bind(this));
      this.modal.remove();
      this.modal = null;
    }
  }
}