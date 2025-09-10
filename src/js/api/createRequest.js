const createRequest = async (options = {}) => {
    const { method, url, data, callback} = options;

    try {
        let requestUrl = url;
        if (method === 'GET' && data) {
            const params = new URLSearchParams(data);
            requestUrl += '?' + params.toString();
        }

        const fetchOptions = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (method === 'POST' || method === 'PUT') {
            fetchOptions.body = JSON.stringify(data);
        }

        const response = await fetch(requestUrl, fetchOptions);

        if (!response.ok) {
            throw new Error(`Запрос не выполнен. Статус: ${response.status}`);
        }

        let responseData = null;
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
            callback(error)
        }
    }
};

export default createRequest;