import React, { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, Calendar as CalendarIcon } from 'lucide-react';
import { Devotional } from '../types';

interface AdminPanelProps {
  onSave: (devotional: Devotional) => void;
  existingDevotionals: Devotional[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onSave, existingDevotionals }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState<Partial<Devotional>>({
    title: '',
    category: '',
    content: '',
    imageUrl: ''
  });

  // When date changes, check if we have a devotional
  useEffect(() => {
    const existing = existingDevotionals.find(d => d.date === selectedDate);
    if (existing) {
      setFormData(existing);
    } else {
      setFormData({
        title: '',
        category: '',
        content: '',
        imageUrl: ''
      });
    }
  }, [selectedDate, existingDevotionals]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    onSave({
      id: formData.id || Math.random().toString(36).substr(2, 9),
      date: selectedDate,
      title: formData.title,
      category: formData.category || 'General',
      content: formData.content,
      imageUrl: formData.imageUrl
    } as Devotional);
    
    alert('Devotional saved successfully!');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
      <div className="bg-rose-50 text-rose-900 p-6 border-b border-rose-100">
        <h2 className="text-2xl font-serif font-medium">Admin Dashboard</h2>
        <p className="text-rose-700 text-sm mt-1">Manage Daily Devotionals</p>
      </div>
      
      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Date Picker */}
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Select Date</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-3 text-stone-400" size={20} />
              <input
                type="date"
                required
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-300 outline-none transition-all"
              />
            </div>
            <p className="text-xs text-stone-400 mt-2">
              Selecting a date will load any existing content for editing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-2">Title</label>
              <input
                type="text"
                required
                placeholder="e.g., Morning Grace"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-300 outline-none transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-2">Category</label>
              <input
                type="text"
                placeholder="e.g., Peace, Joy, Prayer"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-300 outline-none transition-all"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Image URL (Optional)</label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-3 text-stone-400" size={20} />
              <input
                type="url"
                placeholder="https://..."
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-300 outline-none transition-all"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Content</label>
            <textarea
              required
              rows={8}
              placeholder="Write the devotional content here..."
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-300 outline-none transition-all font-serif text-lg leading-relaxed"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-rose-500 text-white px-8 py-3 rounded-lg hover:bg-rose-600 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <Save size={20} />
            Save Devotional
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;