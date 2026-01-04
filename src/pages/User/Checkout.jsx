import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../redux/cartSlice';
import { orderService, n8nService } from '../../services/api';
import { CheckCircle } from 'lucide-react';

const Checkout = () => {
    const { items, totalAmount } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    if (items.length === 0 && !orderSuccess) {
        navigate('/cart');
        return null;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const orderData = {
            customerName: formData.name,
            email: formData.email,
            phone: formData.phone,
            items: items,
            total: totalAmount,
            status: 'En cours',
            date: new Date().toISOString()
        };

        try {
            // 1. Save to JSON Server (MockAPI now)
            // Wait for response to get the generated ID
            const response = await orderService.createOrder(orderData);
            const createdOrder = response.data;

            // 2. Trigger N8N webhook with the REAL generated ID
            await n8nService.sendOrderConfirmation(createdOrder);

            // 3. Success state
            setOrderSuccess(true);
            dispatch(clearCart());
        } catch (error) {
            console.error("Order failed", error);
            alert("Une erreur est survenue lors de la commande.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="container animate-fade-in" style={{ textAlign: 'center', padding: '6rem 0' }}>
                <div style={{ display: 'inline-flex', marginBottom: '2rem' }}>
                    <CheckCircle size={80} color="var(--success)" />
                </div>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Merci pour votre commande !</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '2rem' }}>
                    Un email de confirmation a été envoyé à <strong>{formData.email}</strong>.
                </p>
                <button onClick={() => navigate('/')} className="btn btn-primary">
                    Retour à l'accueil
                </button>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in" style={{ maxWidth: '800px' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>Finaliser la commande</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                {/* Order Summary Summary (Compact) */}
                <div style={{ backgroundColor: 'var(--surface)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Récapitulatif ({items.length} articles)</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {items.map(item => (
                            <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                                <span>{item.quantity}x {item.name}</span>
                                <span>{item.totalPrice} €</span>
                            </li>
                        ))}
                    </ul>
                    <div style={{ borderTop: '1px solid var(--background)', paddingTop: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        <span>Total à payer</span>
                        <span style={{ color: 'var(--primary)' }}>{totalAmount} €</span>
                    </div>
                </div>

                {/* Checkout Form */}
                <form onSubmit={handleSubmit} style={{ backgroundColor: 'var(--surface)', borderRadius: '1rem', padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Vos Coordonnées</h3>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Nom Complet</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                border: '1px solid var(--background)',
                                backgroundColor: 'var(--background)',
                                color: 'var(--text)',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid var(--background)',
                                    backgroundColor: 'var(--background)',
                                    color: 'var(--text)',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Téléphone</label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid var(--background)',
                                    backgroundColor: 'var(--background)',
                                    color: 'var(--text)',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1rem' }}
                    >
                        {isSubmitting ? 'Traitement en cours...' : 'Confirmer la commande'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
