import axios from 'axios';

const API_URL = 'https://694d2661ad0f8c8e6e1fdb77.mockapi.io/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const eventService = {
    getAllEvents: () => api.get('/events'),
    getEventById: (id) => api.get(`/events/${id}`),
    createEvent: (event) => api.post('/events', event),
    updateEvent: (id, event) => api.put(`/events/${id}`, event),
    deleteEvent: (id) => api.delete(`/events/${id}`),
};

export const orderService = {
    createOrder: (order) => api.post('/orders', order),
    getAllOrders: () => api.get('/orders'),
    updateOrder: (id, orderData) => api.put(`/orders/${id}`, orderData),
};

// Placeholder for n8n webhooks
// n8n Webhook Configuration
export const n8nService = {
    sendOrderConfirmation: async (orderData) => {
        try {
            console.log('Sending order confirmation via n8n...', orderData);
            const response = await axios.post('https://blvk.app.n8n.cloud/webhook/order-confirmation', orderData);
            return response.data;
        } catch (error) {
            console.error('Error sending order confirmation', error);
            // Don't block the UI flow if email fails
            return { success: false, error };
        }
    },
    sendContactMessage: async (contactData) => {
        try {
            console.log('Sending contact message via n8n...', contactData);
            const response = await axios.post('https://blvk.app.n8n.cloud/webhook/contact-form', contactData);
            return response.data;
        } catch (error) {
            console.error('Error sending contact message', error);
            return { success: false, error };
        }
    }
};

export default api;
