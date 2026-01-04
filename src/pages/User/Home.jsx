import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../../services/api';
import EventCard from '../../components/Shared/EventCard';
import { ArrowRight, Music, Ticket, Video, Star } from 'lucide-react';

const Home = () => {
    const [featuredEvents, setFeaturedEvents] = useState([]);

    useEffect(() => {
        // Fetch a few events to display as featured
        eventService.getAllEvents().then(res => {
            // Just take the first 3 for simplicity
            setFeaturedEvents(res.data.slice(0, 3));
        });
    }, []);

    const categories = [
        { name: 'Musique', icon: <Music size={32} />, color: '#6366f1' },
        { name: 'Spectacle', icon: <Star size={32} />, color: '#ec4899' },
        { name: 'Art', icon: <Video size={32} />, color: '#8b5cf6' },
        { name: 'Football', icon: <Ticket size={32} />, color: '#22c55e' },
    ];

    return (
        <div>
            {/* Hero Section */}
            <section style={{
                textAlign: 'center',
                padding: '6rem 1rem',
                background: 'linear-gradient(to bottom, var(--surface), var(--background))',
                marginBottom: '4rem'
            }}>
                <div className="container animate-fade-in">
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem', background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Découvrez. Vivez. Ressentez.
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                        EventSphere est votre porte d'entrée vers les meilleures expériences. Concerts, expositions, sports et plus encore.
                    </p>
                    <Link to="/events" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                        Explorer les événements <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
                    </Link>
                </div>
            </section>

            {/* Categories Section */}
            <section className="container" style={{ marginBottom: '6rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Explorez par Catégorie</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                    {categories.map((cat) => (
                        <Link to={`/events?category=${cat.name}`} key={cat.name} className="card" style={{
                            padding: '2rem',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1rem',
                            textDecoration: 'none'
                        }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                backgroundColor: `${cat.color}20`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: cat.color
                            }}>
                                {cat.icon}
                            </div>
                            <h3 style={{ fontSize: '1.5rem', color: 'var(--text)' }}>{cat.name}</h3>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Events Section */}
            <section className="container" style={{ marginBottom: '4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2rem' }}>Événements à la une</h2>
                    <Link to="/events" style={{ color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        Voir tout <ArrowRight size={16} />
                    </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {featuredEvents.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
