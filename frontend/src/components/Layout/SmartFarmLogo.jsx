import React from 'react';

const SmartFarmLogo = ({ 
  size = 'md', 
  variant = 'full', 
  showTagline = false,
  className = '' 
}) => {
  
  // Size mappings
  const sizes = {
    sm: {
      container: 'w-32',
      icon: 'w-7 h-7',
      text: 'text-base',
      techText: 'text-[10px]',
      tagline: 'text-[7px]'
    },
    md: {
      container: 'w-40',
      icon: 'w-9 h-9',
      text: 'text-lg',
      techText: 'text-xs',
      tagline: 'text-[9px]'
    },
    lg: {
      container: 'w-48',
      icon: 'w-11 h-11',
      text: 'text-xl',
      techText: 'text-sm',
      tagline: 'text-xs'
    },
    xl: {
      container: 'w-56',
      icon: 'w-12 h-12',
      text: 'text-2xl',
      techText: 'text-base',
      tagline: 'text-sm'
    }
  };

  const selectedSize = sizes[size] || sizes.md;

  // Professional color palette
  const colors = {
    primary: '#1B5E20',    // Dark green
    secondary: '#2E7D32',   // Medium green
    accent: '#4CAF50',      // Light green
    tech: '#558B2F'         // Olive green
  };

  const LogoContent = () => (
    <>
      {/* Icon - Clean and professional */}
      <div className={`${selectedSize.icon} relative flex-shrink-0`}>
        <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
          {/* Background Circle - Optional, remove if you want transparent */}
          <circle cx="20" cy="20" r="18" fill="#F1F8E9" stroke={colors.primary} strokeWidth="1.5" strokeOpacity="0.3"/>
          
          {/* Stylized Plant/Leaf Design */}
          <g transform="translate(8, 8)">
            {/* Main Stem */}
            <path 
              d="M12 24 L12 8" 
              stroke={colors.primary} 
              strokeWidth="2.5" 
              strokeLinecap="round"
            />
            
            {/* Left Leaves - Simplified */}
            <path 
              d="M12 20 Q9 17 7 20" 
              stroke={colors.secondary} 
              strokeWidth="2" 
              fill="none" 
              strokeLinecap="round"
            />
            <path 
              d="M12 15 Q9 12 7 15" 
              stroke={colors.secondary} 
              strokeWidth="2" 
              fill="none" 
              strokeLinecap="round"
            />
            
            {/* Right Leaves - Simplified */}
            <path 
              d="M12 20 Q15 17 17 20" 
              stroke={colors.secondary} 
              strokeWidth="2" 
              fill="none" 
              strokeLinecap="round"
            />
            <path 
              d="M12 15 Q15 12 17 15" 
              stroke={colors.secondary} 
              strokeWidth="2" 
              fill="none" 
              strokeLinecap="round"
            />
            
            {/* Top Bud/Grain */}
            <circle cx="12" cy="6" r="3" fill={colors.accent} fillOpacity="0.9"/>
            <path d="M12 4 L13 6 L12 8 L11 6 Z" fill={colors.primary} fillOpacity="0.8"/>
          </g>
          
          {/* Small Tech Dot - Represents innovation */}
          <circle cx="28" cy="12" r="1.5" fill={colors.tech} fillOpacity="0.6"/>
        </svg>
      </div>

      {/* Text - Clean typography */}
      <div className="flex flex-col">
        <div className="flex items-end">
          <span 
            className={`font-bold ${selectedSize.text} tracking-tight`}
            style={{ color: colors.primary }}
          >
            SMART
          </span>
          <span 
            className={`font-bold ${selectedSize.text} tracking-tight ml-0.5`}
            style={{ color: colors.secondary }}
          >
            FARM
          </span>
        </div>
        
        {/* Tagline - Optional */}
        {showTagline && (
          <span 
            className={`${selectedSize.tagline} tracking-wider mt-0.5`}
            style={{ color: '#757575' }}
          >
            Innovating Agriculture
          </span>
        )}
      </div>
    </>
  );

  const CompactLogo = () => (
    <div className={`flex items-center space-x-2 ${selectedSize.container} ${className}`}>
      <div className={selectedSize.icon}>
        <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
          <circle cx="20" cy="20" r="16" fill={colors.primary} fillOpacity="0.1" stroke={colors.primary} strokeWidth="1.5"/>
          <path d="M20 26 L20 14" stroke={colors.primary} strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="20" cy="11" r="2.5" fill={colors.accent}/>
        </svg>
      </div>
      <span className="font-bold text-sm" style={{ color: colors.primary }}>SF</span>
    </div>
  );

  const IconOnly = () => (
    <div className={`${selectedSize.icon} ${className}`}>
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
        <circle cx="20" cy="20" r="18" fill="white" stroke={colors.primary} strokeWidth="1.5"/>
        <path d="M20 26 L20 12" stroke={colors.primary} strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M20 21 Q17 18 15 21" stroke={colors.secondary} strokeWidth="2" fill="none"/>
        <path d="M20 16 Q17 13 15 16" stroke={colors.secondary} strokeWidth="2" fill="none"/>
        <path d="M20 21 Q23 18 25 21" stroke={colors.secondary} strokeWidth="2" fill="none"/>
        <circle cx="20" cy="9" r="2.5" fill={colors.accent}/>
      </svg>
    </div>
  );

  // Render appropriate variant
  if (variant === 'icon') {
    return <IconOnly />;
  }

  if (variant === 'compact') {
    return <CompactLogo />;
  }

  // Full logo
  return (
    <div className={`flex items-center space-x-3 ${selectedSize.container} ${className}`}>
      <LogoContent />
    </div>
  );
};

// Also export a simple SVG string version for use in meta tags, etc.
export const SmartFarmLogoSVG = `
<svg width="180" height="60" viewBox="0 0 180 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(10, 10)">
    <circle cx="20" cy="20" r="18" fill="#F1F8E9" stroke="#1B5E20" strokeWidth="1.5" strokeOpacity="0.3"/>
    <path d="M20 32 L20 16" stroke="#1B5E20" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M20 28 Q17 25 15 28" stroke="#2E7D32" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M20 23 Q17 20 15 23" stroke="#2E7D32" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M20 28 Q23 25 25 28" stroke="#2E7D32" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <circle cx="20" cy="13" r="3" fill="#4CAF50" fillOpacity="0.9"/>
  </g>
  <text x="50" y="28" font-family="Arial, sans-serif" font-weight="bold" font-size="20" fill="#1B5E20">SMART</text>
  <text x="120" y="28" font-family="Arial, sans-serif" font-weight="bold" font-size="20" fill="#2E7D32">FARM</text>
  <text x="50" y="45" font-family="Arial, sans-serif" font-size="10" fill="#757575">Innovating Agriculture</text>
</svg>
`;

export default SmartFarmLogo;
