import { useState } from 'react';
import { z } from 'zod'
import { cn } from "../../lib/cn";

const projectSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional().or(z.literal('')),
}).refine((data) => {
    if (data.endDate && data.endDate !== '') {
        return new Date(data.endDate) > new Date(data.startDate);
    }
    return true;
}, {
    message: "End date must be after start date",
    path: ["endDate"]
});

export default function NewCardForm({ onSave, onCancel, isCreating }) {
    
    const [errors, setErrors] = useState({})
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault()

        const result = projectSchema.safeParse(formData)

        if (!result.success) {
            setErrors(result.error.flatten().fieldErrors)
            return
        }

        setErrors({})

        // submit valid data
        onSave(formData);
    }

    return (
        <div className="h-[208px] bg-gradient-to-br from-gray-900/60 to-black/20 backdrop-blur-[24px] rounded-xl p-3 xs:p-4 lg:p-6 shadow-2xl">
            <form onSubmit={handleSubmit} className='flex flex-col justify-between h-full'>
                <div className="mb-4">
                    <input 
                        type="text" 
                        placeholder="Project title..."
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className={cn(
                            "w-full bg-transparent border-none ring-0 outline-none mb-2",
                            errors.title ? "placeholder-red" : "placeholder-white/60"
                        )}
                        autoFocus
                    />
                    <input 
                        type="text"
                        placeholder="Project description..."
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className={cn(
                            "w-full bg-transparent border-none ring-0 outline-none",
                            errors.description ? "placeholder-red" : "placeholder-white/60"
                        )}
                    />
                </div>

                <div>
                <div className="flex items-center justify-between mb-4">
                    <input 
                        type="date" 
                        value={formData.startDate}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                        className={cn(
                            "bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-xs",
                            "focus:outline-none focus:border-blue-400/50",
                            (errors.startDate || errors.endDate) ? "placeholder-red text-red" : "text-white"
                        )}
                    />
                    <input 
                        type="date" 
                        value={formData.endDate}
                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                        className={cn(
                            "bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-xs text-white",
                            "focus:outline-none focus:border-blue-400/50",
                            errors.endDate ? "placeholder-red text-red" : "text-white"
                        )}
                    />
                </div>

                <div className="flex gap-2">
                    <button 
                        type="submit"
                        disabled={isCreating}
                        className="flex-1 bg-main-blue hover:bg-[#007bffb6] text-white text-sm py-1 px-4 rounded-lg transition-colors ring-0 outline-none"
                    >
                        {isCreating ? 'Saving...' : 'Save'}
                    </button>
                    <button 
                        type="button"
                        disabled={isCreating}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm py-1 px-4 rounded-lg transition-colors ring-0 outline-none"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
                </div>
            </form>
        </div>
    );
}