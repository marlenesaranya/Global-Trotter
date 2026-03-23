
import React, { useState, useEffect } from 'react';
import { PackingItem } from '../types';

interface PackingListProps {
  items: PackingItem[];
  tripId: string;
}

const PackingList: React.FC<PackingListProps> = ({ items, tripId }) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem(`packing-${tripId}`);
    if (saved) {
      setCheckedItems(JSON.parse(saved));
    }
  }, [tripId]);

  const toggleItem = (itemKey: string) => {
    const next = { ...checkedItems, [itemKey]: !checkedItems[itemKey] };
    setCheckedItems(next);
    localStorage.setItem(`packing-${tripId}`, JSON.stringify(next));
  };

  const categories = Array.from(new Set(items.map(i => i.category)));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        Packing Checklist
      </h3>
      
      <div className="space-y-6">
        {categories.map(cat => (
          <div key={cat}>
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">{cat}</h4>
            <div className="space-y-2">
              {items.filter(i => i.category === cat).map((item, idx) => {
                const itemKey = `${cat}-${item.item}-${idx}`;
                const isChecked = checkedItems[itemKey];
                return (
                  <label 
                    key={idx} 
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 ${isChecked ? 'opacity-60' : ''}`}
                  >
                    <input 
                      type="checkbox" 
                      checked={!!isChecked}
                      onChange={() => toggleItem(itemKey)}
                      className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
                    />
                    <span className={`text-slate-700 dark:text-slate-300 text-sm ${isChecked ? 'line-through' : ''}`}>
                      {item.item}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackingList;
