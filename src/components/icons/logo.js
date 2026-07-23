// import React from 'react';
// import logo from './logo2.png'; // No need for the full absolute path, just use './' to reference the current directory

// const IconLogo = () => (
//   <img
//     id="logo"
//     src={logo}
//     alt="Logo"
//     style={{ width: '84px', height: '96px' }} // Adjust size if necessary
//   />
// );

// export default IconLogo;

import React from 'react';
import PropTypes from 'prop-types';
import logo from './logo3.png';

const IconLogo = ({ themeMode = 'dark' }) => {
  const isDark = themeMode === 'dark';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: '100px',
        marginTop: '-1px',
      }}>
      <img
        src={logo}
        alt="Muhammad Salman logo"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          filter: isDark ? 'invert(1) brightness(1.85) saturate(1.2)' : 'brightness(0) saturate(0)',
          transition: 'filter 0.25s ease',
        }}
      />
    </div>
  );
};

IconLogo.propTypes = {
  themeMode: PropTypes.oneOf(['light', 'dark']),
};

export default IconLogo;
