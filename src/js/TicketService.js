/**
 *  Класс для связи с сервером.
 *  Содержит методы для отправки запросов на сервер и получения ответов
 * */

import createRequest from './api/createRequest';

export default class TicketService {
  constructor() {
    this.baseUrl = 'http://localhost:7070';
  }

  list(callback) {
    createRequest({
      method: 'GET',
      url: this.baseUrl,
      data: { method: 'allTickets' },
      callback,
    });
  }

  get(id, callback) {
    createRequest({
      method: 'GET',
      url: this.baseUrl,
      data: { method: 'ticketById', id },
      callback,
    });
  }

  create(data, callback) {
    // console.log('Creating ticket with data:', data);

    createRequest({
      method: 'POST',
      url: this.baseUrl,
      data: {
        method: 'createTicket',
        ...data,
      },
      callback,
    });
  }

  update(id, data, callback) {
    // передаем только name, description, status
    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) {
      updateData.status = data.status.toString();
    }

    createRequest({
      method: 'POST',
      url: this.baseUrl,
      data: {
        method: 'updateById',
        id,
        ...updateData,
      },
      callback,
    });
  }

  delete(id, callback) {
    createRequest({
      method: 'POST',
      url: this.baseUrl,
      data: { method: 'deleteById', id },
      callback: (err) => {
        if (err && err.message.includes('204')) {
          callback(null, { success: true });
        } else {
          callback(err);
        }
      },
    });
  }
}
