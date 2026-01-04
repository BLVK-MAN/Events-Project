import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';
import { Calendar, Tag } from 'lucide-react';

const EventCard = ({ event }) => {
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        dispatch(addToCart(event));
    };

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                <img
                    src={event.image}
                    alt={event.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                />
                <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'var(--secondary)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {event.price} €
                </div>
            </div>

            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    <Tag size={16} />
                    <span>{event.category}</span>
                </div>

                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text)' }}>{event.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>{event.description}</p>

                <button className="btn btn-primary" onClick={handleAddToCart} style={{ width: '100%' }}>
                    Ajouter au panier
                </button>
            </div>
        </div>
    );
};

export default EventCard;
