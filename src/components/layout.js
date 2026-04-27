import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import { Head, Loader, Nav, Social, Email, Footer } from '@components';
import { GlobalStyle, theme } from '@styles';

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Layout = ({ children, location }) => {
  const isHome = location.pathname === '/';
  const [isLoading, setIsLoading] = useState(isHome);
  const [themeMode, setThemeMode] = useState('light');

  const toggleTheme = () => {
    setThemeMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Sets target="_blank" rel="noopener noreferrer" on external links
  const handleExternalLinks = () => {
    const allLinks = Array.from(document.querySelectorAll('a'));
    if (allLinks.length > 0) {
      allLinks.forEach(link => {
        if (link.host !== window.location.host) {
          link.setAttribute('rel', 'noopener noreferrer');
          link.setAttribute('target', '_blank');
        }
      });
    }
  };

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (location.hash) {
      const id = location.hash.substring(1); // location.hash without the '#'
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView();
          el.focus();
        }
      }, 0);
    }

    handleExternalLinks();
  }, [isLoading]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const savedTheme = window.localStorage.getItem('theme-mode');
    const initialTheme = savedTheme || 'light';

    setThemeMode(initialTheme);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    document.documentElement.setAttribute('data-theme', themeMode);
    window.localStorage.setItem('theme-mode', themeMode);
  }, [themeMode]);

  return (
    <>
      <Head />

      <div id="root">
        <ThemeProvider theme={theme}>
          <GlobalStyle />

          {isLoading && isHome ? (
            <Loader finishLoading={() => setIsLoading(false)} />
          ) : (
            <StyledContent>
              <Nav isHome={isHome} themeMode={themeMode} toggleTheme={toggleTheme} />
              <Social isHome={isHome} />
              <Email isHome={isHome} />

              <div id="content">
                {children}
                <Footer />
              </div>
            </StyledContent>
          )}
        </ThemeProvider>
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};

export default Layout;
