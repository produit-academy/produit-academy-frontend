import { useState, useEffect } from 'react';
import { fetchAllCategories, createCategory, deleteCategory } from '../../utils/api';
import styles from '../../styles/Dashboard.module.css';

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [newCat, setNewCat] = useState({ name: '', description: '' });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = () => fetchAllCategories().then(res => setCategories(res.data));

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await createCategory(newCat);
            setNewCat({ name: '', description: '' });
            loadCategories();
        } catch (err) {
            alert('Error creating category');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure? This will remove the category from all linked questions.')) {
            await deleteCategory(id);
            loadCategories();
        }
    };

    return (
        <div className="container" style={{ maxWidth: '800px', margin: '40px auto' }}>
            <h1>Manage Categories</h1>

            {/* Add Form */}
            <div className="card" style={{ padding: '20px', marginBottom: '30px' }}>
                <h3>Add New Category</h3>
                <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input
                        placeholder="Category Name (e.g., Aptitude)"
                        value={newCat.name}
                        onChange={e => setNewCat({ ...newCat, name: e.target.value })}
                        required
                        style={{ padding: '10px', flex: 1 }}
                    />
                    <input
                        placeholder="Description (Optional)"
                        value={newCat.description}
                        onChange={e => setNewCat({ ...newCat, description: e.target.value })}
                        style={{ padding: '10px', flex: 2 }}
                    />
                    <button type="submit" style={{ padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none' }}>Add</button>
                </form>
            </div>

            {/* List */}
            <div>
                {categories.map(cat => (
                    <div key={cat.id} className="card" style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div>
                            <strong>{cat.name}</strong>
                            <p style={{ margin: '5px 0', color: '#666' }}>{cat.description}</p>
                        </div>
                        <button onClick={() => handleDelete(cat.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}