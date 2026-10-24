import React from 'react';
import { TAX_MECHANICS } from '../data/tokenData';
import { Gift, Lock, Flame } from 'lucide-react';

export const RewardsUtility: React.FC = () => {
  return (
    <div className="hidden">
      {TAX_MECHANICS.map((tax) => (
        <div key={tax.component}>
          {tax.component}: {tax.rate}
        </div>
      ))}
    </div>
  );
};
