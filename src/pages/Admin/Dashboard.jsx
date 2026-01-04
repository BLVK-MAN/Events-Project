import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { eventService, orderService } from '../../services/api';
import { Plus, Edit, Trash2, X, Upload } from 'lucide-react';

const CLOUD_NAME = 'dynqliq6x';
const UPLOAD_PRESET = 'Events';

const Dashboard = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState('events');
    const [events, setEvents] = useState([]);
    const [orders, setOrders] = useState([]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'En cours': return '#fcd34d'; // Amber 300 (Orange-ish)
            case 'Terminé': return '#4ade80'; // Green 400
            case 'Annulé': return '#f87171'; // Red 400
            default: return 'var(--text)';
        }
    };

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        image: '',
        description: ''
    });

    const fetchData = () => {
        eventService.getAllEvents().then(res => setEvents(res.data));
        orderService.getAllOrders().then(res => setOrders(res.data));
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" />;
    }

    // Event Handlers
    const handleDeleteEvent = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
            await eventService.deleteEvent(id);
            fetchData();
        }
    };

    const handleEditEvent = (event) => {
        setEditingEvent(event);
        setFormData({
            name: event.name,
            category: event.category,
            price: event.price,
            image: event.image,
            description: event.description
        });
        setShowModal(true);
    };

    const handleCreateEvent = () => {
        setEditingEvent(null);
        setFormData({
            name: '',
            category: '',
            price: '',
            image: '',
            description: ''
        });
        setShowModal(true);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', UPLOAD_PRESET);
        // data.append('cloud_name', CLOUD_NAME); // Often not needed in body if in URL

        try {
            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                data
            );
            setFormData(prev => ({ ...prev, image: res.data.secure_url }));
        } catch (error) {
            console.error('Error uploading image', error);
            const errorMsg = error.response?.data?.error?.message || error.message || 'Unknown error';
            alert(`Erreur upload Cloudinary: ${errorMsg}\nVérifiez que le 'Cloud Name' est bien '${CLOUD_NAME}' et le 'Preset' '${UPLOAD_PRESET}'`);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingEvent) {
                await eventService.updateEvent(editingEvent.id, formData);
            } else {
                await eventService.createEvent(formData);
            }
            setShowModal(false);
            fetchData();
        } catch (error) {
            console.error("Error saving event", error);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await orderService.updateOrder(orderId, { status: newStatus });
            // Optimistic update or refresh
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            console.error("Error updating order status", error);
            alert("Erreur lors de la mise à jour du statut");
        }
    };

    return (
        <div className="container animate-fade-in">
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Dashboard Administrateur</h1>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--surface)' }}>
                <button
                    onClick={() => setActiveTab('events')}
                    style={{
                        padding: '1rem 2rem',
                        borderBottom: activeTab === 'events' ? '2px solid var(--primary)' : 'none',
                        color: activeTab === 'events' ? 'var(--primary)' : 'var(--text-muted)',
                        fontWeight: 'bold',
                        backgroundColor: 'transparent'
                    }}
                >
                    Gérer les Événements
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    style={{
                        padding: '1rem 2rem',
                        borderBottom: activeTab === 'orders' ? '2px solid var(--primary)' : 'none',
                        color: activeTab === 'orders' ? 'var(--primary)' : 'var(--text-muted)',
                        fontWeight: 'bold',
                        backgroundColor: 'transparent'
                    }}
                >
                    Voir les Commandes
                </button>
            </div>

            {/* Content */}
            {activeTab === 'events' && (
                <div>
                    <button className="btn btn-primary" onClick={handleCreateEvent} style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={18} /> Ajouter un événement
                    </button>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {events.map(event => (
                            <div key={event.id} style={{
                                backgroundColor: 'var(--surface)',
                                padding: '1rem',
                                borderRadius: '0.5rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <img src={event.image} alt={event.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem' }}>{event.name}</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{event.category} - {event.price} €</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => handleEditEvent(event)} style={{ padding: '0.5rem', backgroundColor: 'var(--background)', color: 'var(--text)', borderRadius: '4px' }}>
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => handleDeleteEvent(event.id)} style={{ padding: '0.5rem', backgroundColor: 'var(--background)', color: 'var(--error)', borderRadius: '4px' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'orders' && (
                <div style={{ backgroundColor: 'var(--surface)', borderRadius: '1rem', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>ID</th>
                                <th style={{ padding: '1rem' }}>Client</th>
                                <th style={{ padding: '1rem' }}>Email</th>
                                <th style={{ padding: '1rem' }}>Total</th>
                                <th style={{ padding: '1rem' }}>Statut</th>
                                <th style={{ padding: '1rem' }}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Aucune commande.</td></tr>
                            ) : (
                                orders.map(order => (
                                    <tr key={order.id} style={{ borderTop: '1px solid var(--background)' }}>
                                        <td style={{ padding: '1rem' }}>#{order.id}</td>
                                        <td style={{ padding: '1rem' }}>{order.customerName}</td>
                                        <td style={{ padding: '1rem' }}>{order.email}</td>
                                        <td style={{ padding: '1rem' }}>{order.total} €</td>
                                        <td style={{ padding: '1rem' }}>
                                            <select
                                                value={order.status || 'En cours'}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                disabled={order.status === 'Terminé' || order.status === 'Annulé'}
                                                style={{
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '4px',
                                                    border: '1px solid var(--surface)',
                                                    backgroundColor: 'var(--surface)',
                                                    color: getStatusColor(order.status || 'En cours'),
                                                    fontWeight: 'bold',
                                                    cursor: (order.status === 'Terminé' || order.status === 'Annulé') ? 'not-allowed' : 'pointer'
                                                }}
                                            >
                                                <option value="En cours" style={{ color: '#fcd34d' }}>En cours</option>
                                                <option value="Terminé" style={{ color: '#4ade80' }}>Terminé</option>
                                                <option value="Annulé" style={{ color: '#f87171' }}>Annulé</option>
                                            </select>
                                        </td>
                                        <td style={{ padding: '1rem' }}>{new Date(order.date).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: '1rem', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <h2>{editingEvent ? 'Modifier' : 'Ajouter'} un événement</h2>
                            <button onClick={() => setShowModal(false)}><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nom</label>
                                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', backgroundColor: 'var(--background)', border: 'none', color: 'white', borderRadius: '4px' }} />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Catégorie</label>
                                <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', backgroundColor: 'var(--background)', border: 'none', color: 'white', borderRadius: '4px' }}>
                                    <option value="">Sélectionner...</option>
                                    <option value="Musique">Musique</option>
                                    <option value="Art">Art</option>
                                    <option value="Spectacle">Spectacle</option>
                                    <option value="Football">Football</option>
                                    <option value="Conférence">Conférence</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Prix</label>
                                <input type="number" required value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                    style={{ width: '100%', padding: '0.5rem', backgroundColor: 'var(--background)', border: 'none', color: 'white', borderRadius: '4px' }} />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Image</label>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                        style={{ width: '100%', padding: '0.5rem', backgroundColor: 'var(--background)', border: 'none', color: 'white', borderRadius: '4px' }}
                                    />
                                    {uploading && <span style={{ color: 'var(--text-muted)' }}>Upload...</span>}
                                </div>
                                <input
                                    type="url"
                                    placeholder="Ou URL directe..."
                                    value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', backgroundColor: 'var(--background)', border: 'none', color: 'white', borderRadius: '4px' }}
                                />
                                {formData.image && <img src={formData.image} alt="Preview" style={{ marginTop: '0.5rem', height: '50px', borderRadius: '4px' }} />}
                            </div>
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                                <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', backgroundColor: 'var(--background)', border: 'none', color: 'white', borderRadius: '4px', resize: 'vertical' }} rows="4"></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Enregistrer</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
