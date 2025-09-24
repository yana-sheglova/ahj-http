const createRequest = async (options = {}) => {
  const { method, url, data, callback } = options;

  try {
    let requestUrl = url;
    if (data) {
      const params = new URLSearchParams(data);
      requestUrl += `?${params.toString()}`;
    }

    const fetchOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(requestUrl, fetchOptions);

    if (!response.ok) {
      throw new Error(`Запрос не выполнен. Статус: ${response.status}`);
    }

    let responseData = null;
    if (response.status === 204) {
      if (callback) {
        callback(null, { success: true });
      }
      return;
    }
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else if (response.status !== 204) {
      responseData = await response.text();
    }

    if (callback) {
      callback(null, responseData);
    }
  } catch (error) {
    if (callback) {
      callback(error);
    }
  }
};

export default createRequest;
