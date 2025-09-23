export default class ConfirmModal {
    constructor() {
        this.modal = null;
        this.onConfirm = null;
        this.onCancel = null;
        this.createModal();
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.classList.add('modal', 'confirm-modal');

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content', 'confirm-modal-content');

        const title = document.createElement('h3');
        title.textContent = 'Подтверждение удаления';

        const message = document.createElement('p');
        message.textContent = 'Вы уверены, что хотите удалить этот тикет?';

        const actionsGroup = document.createElement('div');
        actionsGroup.classList.add('form-actions');

        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.classList.add('btn-cancel');
        cancelBtn.textContent = 'Отмена';

        const confirmBtn = document.createElement('button');
        confirmBtn.type = 'button';
        confirmBtn.classList.add('btn-confirm');
        confirmBtn.textContent = 'Удалить';

        actionsGroup.append(cancelBtn, confirmBtn);
        modalContent.append(title, message, actionsGroup);
        this.modal.append(modalContent);

        this.setupEventListener(cancelBtn, confirmBtn);
        document.body.append(this.modal);
    }

    setupEventListener(cancelBtn, confirmBtn) {
        cancelBtn.addEventListener('click', () => {
            this.hide();
            if (this.onCancel) {
                this.onCancel();
            }
        });

        confirmBtn.addEventListener('click', () => {
            this.hide();
            if (this.onConfirm) {
                this.onConfirm();
            }
        });

        this.modal.addEventListener('click', (e) => {
            if (e.currentTarget === e.target) {
                this.hide();
                if (this.onCancel) {
                    this.onCancel();
                }
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.hide();
                if (this.onCancel) {
                    this.onCancel();
                }
            }
        });
    }

    show() {
        this.modal.classList.add('show');
    }
    hide() {
        this.modal.classList.remove('show');
    }

    setHandlers(onConfirm, onCancel) {
        this.onConfirm = onConfirm;
        this.onCancel = onCancel;
    }

    // destroy() {
    //     if (this.modal) {
    //         this.modal.remove();
    //         this.modal = null;
    //     }
    // }
}