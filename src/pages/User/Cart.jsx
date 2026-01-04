import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromCart, updateQuantity, clearCart } from '../../redux/cartSlice';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

const Cart = () => {
    const { items, totalAmount } = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    if (items.length === 0) {
        return (
            <div className="container animate-fade-in" style={{ textAlign: 'center', padding: '4rem 0' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Votre panier est vide</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Découvrez nos événements et trouvez votre prochaine sortie.</p>
                <Link to="/events" className="btn btn-primary">
                    Parcourir les événements
                </Link>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in">
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Votre Panier</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem', alignItems: 'start' }}>
                <div style={{ backgroundColor: 'var(--surface)', borderRadius: '1rem', padding: '1.5rem' }}>
                    {items.map((item) => (
                        <div key={item.id} style={{
                            display: 'flex',
                            gap: '1.5rem',
                            paddingBottom: '1.5rem',
                            marginBottom: '1.5rem',
                            borderBottom: '1px solid var(--background)',
                            alignItems: 'center'
                        }}>
                            <img
                                src={item.image}
                                alt={item.name}
                                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '0.5rem' }}
                            />

                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{item.name}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Prix unitaire: {item.price} €</p>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <button
                                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                                    disabled={item.quantity <= 1}
                                    style={{ padding: '0.25rem', borderRadius: '0.25rem', backgroundColor: 'var(--background)', color: 'var(--text)' }}
                                >
                                    <Minus size={16} />
                                </button>
                                <span style={{ minWidth: '1.5rem', textAlign: 'center', fontWeight: 'bold' }}>{item.quantity}</span>
                                <button
                                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                                    style={{ padding: '0.25rem', borderRadius: '0.25rem', backgroundColor: 'var(--background)', color: 'var(--text)' }}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            <div style={{ textAlign: 'right', minWidth: '80px' }}>
                                <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{item.totalPrice} €</p>
                                <button
                                    onClick={() => dispatch(removeFromCart(item.id))}
                                    style={{ color: 'var(--error)', background: 'none', marginTop: '0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: 'auto' }}
                                >
                                    <Trash2 size={14} /> Supprimer
                                </button>
                            </div>
                        </div>
                    ))}

                    <button onClick={() => dispatch(clearCart())} style={{ color: 'var(--text-muted)', background: 'none', fontSize: '0.9rem', textDecoration: 'underline' }}>
                        Vider le panier
                    </button>
                </div>

                <div style={{ backgroundColor: 'var(--surface)', borderRadius: '1rem', padding: '1.5rem', position: 'sticky', top: '100px' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Résumé</h2>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Sous-total</span>
                        <span style={{ fontWeight: 'bold' }}>{totalAmount} €</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold', borderTop: '1px solid var(--background)', paddingTop: '1rem' }}>
                        <span>Total</span>
                        <span style={{ color: 'var(--primary)' }}>{totalAmount} €</span>
                    </div>

                    <Link to="/checkout" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                        Passer la commande <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;
