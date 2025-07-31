import { useState } from 'react';

export default function NewCardForm({ onSave, onCancel }) {
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="h-[196px] bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-[24px] rounded-xl p-6 shadow-2xl border-2 border-blue-400/30">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <input 
                        type="text" 
                        placeholder="Project title..."
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full placeholder-white/60 bg-transparent border-none ring-0 outline-none mb-2"
                        autoFocus
                    />
                    <input 
                        type="text"
                        placeholder="Project description..."
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full placeholder-white/60 outline-none ring-0 bg-transparent border-none"
                    />
                </div>

                <div className="flex items-center justify-between mb-4">
                    <input 
                        type="date" 
                        value={formData.startDate}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                        className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-400/50"
                    />
                    <input 
                        type="date" 
                        value={formData.endDate}
                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                        className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-400/50"
                    />
                </div>

                <div className="flex gap-2">
                    <button 
                        type="submit"
                        className="flex-1 bg-main-blue hover:bg-[#007bffb6] text-white text-sm py-1 px-4 rounded-lg transition-colors"
                    >
                        Save
                    </button>
                    <button 
                        type="button"
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm py-1 px-4 rounded-lg transition-colors"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}