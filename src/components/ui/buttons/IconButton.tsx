import React from 'react';

interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors ${className}`}
    >
      {icon}
    </button>
  );
};

export default IconButton;