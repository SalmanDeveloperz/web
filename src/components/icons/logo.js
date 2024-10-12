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
import logo from './logo3.png'; // Adjust the path if necessary

const IconLogo = () => (
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
      alt="MonoSlate Logo"
      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
    />
  </div>
);

export default IconLogo;
