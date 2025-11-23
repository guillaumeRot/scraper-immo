'use client';

interface EnergyLabelProps {
  value: string | null;
  type: 'dpe' | 'ges';
}

export default function EnergyLabel({ value, type }: EnergyLabelProps) {
  if (!value) return null;

  const label = value.toUpperCase();
  const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const colors = [
    'bg-green-500',
    'bg-green-400',
    'bg-green-300',
    'bg-yellow-300',
    'bg-orange-400',
    'bg-red-400',
    'bg-red-600',
  ];

  const index = Math.min(Math.max(0, labels.indexOf(label)), 6);
  const color = colors[index];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 w-10">
        {type.toUpperCase()} :
      </span>
      <div className="flex">
        {labels.map((letter, i) => (
          <div 
            key={letter} 
            className={`
              w-8 h-8 flex items-center justify-center text-white font-bold text-sm
              ${i <= index ? color : 'bg-gray-200'}
              ${i === 0 ? 'rounded-l' : ''}
              ${i === labels.length - 1 ? 'rounded-r' : ''}
              ${i !== 0 ? 'border-l border-white' : ''}
            `}
          >
            {letter}
          </div>
        ))}
      </div>
    </div>
  );
}

export function EnergyLabels({ dpe, ges }: { dpe: string | null; ges: string | null }) {
  return (
    <div className="mt-6 space-y-3">
      <EnergyLabel value={dpe} type="dpe" />
      <EnergyLabel value={ges} type="ges" />
    </div>
  );
}
