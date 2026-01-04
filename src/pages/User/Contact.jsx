import React, { useState } from 'react';
import { n8nService } from '../../services/api';
import { Send, CheckCircle } from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await n8nService.sendContactMessage(formData);
            setIsSent(true);
        } catch (error) {
            console.error("Failed to send message", error);
            alert("Une erreur s'est produite.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSent) {
        return (
            <div className="container animate-fade-in" style={{ textAlign: 'center', padding: '6rem 0' }}>
                <div style={{ display: 'inline-flex', marginBottom: '2rem' }}>
                    <CheckCircle size={80} color="var(--success)" />
                </div>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Message envoyé !</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                    Nous vous répondrons dans les plus brefs délais.
                </p>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in" style={{ maxWidth: '600px' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>Contactez-nous</h1>
                <p style={{ color: 'var(--text-muted)' }}>Une question ? Un projet ? N'hésitez pas à nous écrire.</p>
            </div>

            <form onSubmit={handleSubmit} style={{ backgroundColor: 'var(--surface)', borderRadius: '1rem', padding: '2rem' }}>
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

                <div style={{ marginBottom: '1.5rem' }}>
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

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Message</label>
                    <textarea
                        name="message"
                        required
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: '1px solid var(--background)',
                            backgroundColor: 'var(--background)',
                            color: 'var(--text)',
                            fontSize: '1rem',
                            fontFamily: 'inherit',
                            resize: 'vertical'
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                    {isSubmitting ? 'Envoi...' : <>Envoyer le message <Send size={18} /></>}
                </button>
            </form>
        </div>
    );
};

export default Contact;
