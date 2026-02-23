'use client';

import { motion } from 'framer-motion';
import { UserRole } from '@/context/AuthContext';

interface RoleSelectorProps {
  value: UserRole;
  onChange: (value: UserRole) => void;
}

const options: { label: string; value: UserRole; description: string }[] = [
  { label: 'Student / Learner', value: 'student', description: 'Practice challenges and grow skills' },
  { label: 'Recruiter', value: 'recruiter', description: 'Evaluate talent with trusted signals' },
];

export default function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {options.map((option) => {
        const active = value === option.value;
        return (
          <motion.button
            type="button"
            key={option.value}
            onClick={() => onChange(option.value)}
            whileTap={{ scale: 0.99 }}
            className={`rounded-xl border p-4 text-left transition-colors ${
              active ? 'border-black bg-black text-white' : 'border-black/15 bg-white text-black hover:border-black/40'
            }`}
          >
            <p className="font-heading text-base font-medium">{option.label}</p>
            <p className={`mt-1 text-xs ${active ? 'text-neutral-300' : 'text-neutral-600'}`}>{option.description}</p>
          </motion.button>
        );
      })}
    </div>
  );
}
