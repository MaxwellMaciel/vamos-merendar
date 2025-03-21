
import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordRequirementsProps {
  password: string;
  show: boolean;
}

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password, show }) => {
  if (!show) return null;
  
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return (
    <div className="bg-primary/90 text-white p-3 rounded-lg mt-2 shadow-sm animate-in">
      <p className="font-medium text-sm mb-2">A Senha precisa conter:</p>
      <div className="space-y-1 text-sm">
        <div className="flex items-center gap-2">
          {hasMinLength ? (
            <Check size={16} className="text-accent" />
          ) : (
            <X size={16} className="text-secondary" />
          )}
          <span>No mínimo 8 caracteres</span>
        </div>
        <div className="flex items-center gap-2">
          {hasUpperCase ? (
            <Check size={16} className="text-accent" />
          ) : (
            <X size={16} className="text-secondary" />
          )}
          <span>Com pelo menos uma letra maiúscula</span>
        </div>
        <div className="flex items-center gap-2">
          {hasNumber && hasSpecialChar ? (
            <Check size={16} className="text-accent" />
          ) : (
            <X size={16} className="text-secondary" />
          )}
          <span>Com número e um símbolo especial ($, #, @, etc.)</span>
        </div>
      </div>
    </div>
  );
};

export default PasswordRequirements;
