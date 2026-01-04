import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { eventService } from '../../services/api';
import EventCard from '../../components/Shared/EventCard';
import { Filter } from 'lucide-react';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const currentCategory = searchParams.get('category') || 'All';
    const [categories, setCategories] = useState(['All']);

    useEffect(() => {
        // Fetch all events
        eventService.getAllEvents().then(res => {
            setEvents(res.data);
            // Extract unique categories
            const uniqueCats = ['All', ...new Set(res.data.map(e => e.category))];
            setCategories(uniqueCats);
        });
    }, []);

    useEffect(() => {
        if (currentCategory === 'All') {
            setFilteredEvents(events);
        } else {
            setFilteredEvents(events.filter(e => e.category === currentCategory));
        }
    }, [currentCategory, events]);

    const handleCategoryChange = (category) => {
        if (category === 'All') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', category);
        }
        setSearchParams(searchParams);
    };

    return (
        <div className="container animate-fade-in">
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>Tous les événements</h1>
                <p style={{ color: 'var(--text-muted)' }}>Trouvez l'événement parfait pour vous.</p>
            </div>

            {/* Filters */}
            <div style={{
                marginBottom: '3rem',
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
                backgroundColor: 'var(--surface)',
                padding: '1rem',
                borderRadius: '1rem',
                width: 'fit-content',
                marginLeft: 'auto',
                marginRight: 'auto'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '1rem', color: 'var(--text-muted)' }}>
                    <Filter size={20} />
                    <span style={{ fontWeight: '600' }}>Filtres:</span>
                </div>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        style={{
                            padding: '0.5rem 1.25rem',
                            borderRadius: '2rem',
                            backgroundColor: currentCategory === cat ? 'var(--primary)' : 'transparent',
                            color: currentCategory === cat ? 'white' : 'var(--text-muted)',
                            border: '1px solid',
                            borderColor: currentCategory === cat ? 'var(--primary)' : 'var(--text-muted)',
                            transition: 'all 0.3s'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {filteredEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>

            {filteredEvents.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    <h3>Aucun événement trouvé dans cette catégorie.</h3>
                </div>
            )}
        </div>
    );
};

export default Events;
