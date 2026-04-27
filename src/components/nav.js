import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled, { css } from 'styled-components';
import { navLinks } from '@config';
import { loaderDelay } from '@utils';
import { useScrollDirection, usePrefersReducedMotion } from '@hooks';
import { Menu } from '@components';
import { IconLogo, IconHex } from '@components/icons';

const StyledHeader = styled.header`
  ${({ theme }) => theme.mixins.flexBetween};
  position: fixed;
  top: 0;
  z-index: 11;
  padding: 0px 50px;
  width: 100%;
  height: var(--nav-height);
  background-color: var(--nav-bg) !important;
  filter: none !important;
  pointer-events: auto !important;
  user-select: auto !important;
  backdrop-filter: blur(10px);
  transition: var(--transition);

  @media (max-width: 1080px) {
    padding: 0 40px;
  }
  @media (max-width: 768px) {
    padding: 0 25px;
  }

  @media (prefers-reduced-motion: no-preference) {
    ${props =>
    props.scrollDirection === 'up' &&
      !props.scrolledToTop &&
      css`
        height: var(--nav-scroll-height);
        transform: translateY(0px);
        background-color: var(--nav-scrolled-bg);
        box-shadow: 0 10px 30px -10px var(--navy-shadow);
      `};

    ${props =>
    props.scrollDirection === 'down' &&
      !props.scrolledToTop &&
      css`
        height: var(--nav-scroll-height);
        transform: translateY(calc(var(--nav-scroll-height) * -1));
        box-shadow: 0 10px 30px -10px var(--navy-shadow);
      `};
  }
`;

const StyledNav = styled.nav`
  ${({ theme }) => theme.mixins.flexBetween};
  position: relative;
  width: 100%;
  font-family: var(--font-mono);
  counter-reset: item 0;
  z-index: 12;

  .logo {
    ${({ theme }) => theme.mixins.flexCenter};

    a {
      // color: var(--white);
      // color: #ffffff
      color: rgba(255, 255, 255, 0);
      width: 60px; //Change from 42px :)
      height: 42px;
      position: relative;
      z-index: 1;

      .hex-container {
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        @media (prefers-reduced-motion: no-preference) {
          transition: var(--transition);
        }
      }

      .logo-container {
        position: relative;
        z-index: 1;
        svg {
          fill: none;
          user-select: none;
          @media (prefers-reduced-motion: no-preference) {
            transition: var(--transition);
          }
          polygon {
            fill: var(--pure-white);
          }
        }
      }

      &:hover,
      &:focus {
        outline: 0;
        transform: translate(-4px, -4px);
        .hex-container {
          transform: translate(4px, 3px);
        }
      }
    }
  }
`;

const StyledLinks = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }

  ol {
    ${({ theme }) => theme.mixins.flexBetween};
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      margin: 0 5px;
      position: relative;
      font-size: var(--fz-xs);
      color: var(--black);

      a {
        padding: 10px;

        &:hover,
        &:focus-visible {
          font-weight: 600;
          transition: all 0.5s ease !important;
        }
      }
    }
  }

  .resume-button {
    ${({ theme }) => theme.mixins.smallButton};
    margin-left: 15px;
    font-size: var(--fz-xs);
  }

  .theme-toggle {
    margin-left: 15px;
    width: 40px;
    height: 40px;
    border: 1px solid var(--light-gray);
    border-radius: 999px;
    background-color: var(--pure-white);
    color: var(--dark-gray);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    box-shadow: 0 8px 20px -14px var(--navy-shadow);
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease,
      background-color 0.25s ease;

    &:hover,
    &:focus-visible {
      transform: translateY(-2px);
      box-shadow: 0 12px 24px -14px var(--navy-shadow);
      border-color: var(--medium-gray);
    }

    svg {
      width: 20px;
      height: 20px;
    }

    .sun-icon {
      stroke: currentColor;
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .moon-icon {
      fill: currentColor;
    }
  }
`;

const Nav = ({ isHome, themeMode, toggleTheme }) => {
  const [isMounted, setIsMounted] = useState(!isHome);
  const scrollDirection = useScrollDirection('down');
  const [scrolledToTop, setScrolledToTop] = useState(true);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleScroll = () => {
    setScrolledToTop(window.pageYOffset < 50);
  };

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => {
      setIsMounted(true);
    }, 100);

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const timeout = isHome ? loaderDelay : 0;
  const fadeClass = isHome ? 'fade' : '';
  const fadeDownClass = isHome ? 'fadedown' : '';
  const isLight = themeMode === 'light';

  const Logo = (
    <div className="logo" tabIndex="-1">
      {isHome ? (
        <a href="/" aria-label="home">
          <div className="hex-container">
            <IconHex />
          </div>
          <div className="logo-container">
            <IconLogo />
          </div>
        </a>
      ) : (
        <Link to="/" aria-label="home">
          <div className="hex-container">
            <IconHex />
          </div>
          <div className="logo-container">
            <IconLogo />
          </div>
        </Link>
      )}
    </div>
  );

  return (
    <StyledHeader scrollDirection={scrollDirection} scrolledToTop={scrolledToTop}>
      <StyledNav>
        {prefersReducedMotion ? (
          <>
            {Logo}

            <StyledLinks>
              <ol>
                {navLinks &&
                  navLinks.map(({ url, name }, i) => (
                    <li key={i}>
                      <Link to={url}>{name}</Link>
                    </li>
                  ))}
              </ol>
              <button
                type="button"
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}>
                {isLight ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <g className="moon-icon">
                      <path d="M21 12.8A9 9 0 1 1 11.2 3 7.5 7.5 0 1 0 21 12.8z" />
                    </g>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <g className="sun-icon">
                      <circle cx="12" cy="12" r="4.5" />
                      <line x1="12" y1="2" x2="12" y2="5" />
                      <line x1="12" y1="19" x2="12" y2="22" />
                      <line x1="2" y1="12" x2="5" y2="12" />
                      <line x1="19" y1="12" x2="22" y2="12" />
                      <line x1="4.93" y1="4.93" x2="7.05" y2="7.05" />
                      <line x1="16.95" y1="16.95" x2="19.07" y2="19.07" />
                      <line x1="16.95" y1="7.05" x2="19.07" y2="4.93" />
                      <line x1="4.93" y1="19.07" x2="7.05" y2="16.95" />
                    </g>
                  </svg>
                )}
              </button>
            </StyledLinks>

            <Menu themeMode={themeMode} toggleTheme={toggleTheme} />
          </>
        ) : (
          <>
            <TransitionGroup component={null}>
              {isMounted && (
                <CSSTransition classNames={fadeClass} timeout={timeout}>
                  <>{Logo}</>
                </CSSTransition>
              )}
            </TransitionGroup>

            <StyledLinks>
              <ol>
                <TransitionGroup component={null}>
                  {isMounted &&
                    navLinks &&
                    navLinks.map(({ url, name }, i) => (
                      <CSSTransition key={i} classNames={fadeDownClass} timeout={timeout}>
                        <li key={i} style={{ transitionDelay: `${isHome ? i * 100 : 0}ms` }}>
                          <Link to={url}>{name}</Link>
                        </li>
                      </CSSTransition>
                    ))}
                </TransitionGroup>
              </ol>
              <button
                type="button"
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}>
                {isLight ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <g className="moon-icon">
                      <path d="M21 12.8A9 9 0 1 1 11.2 3 7.5 7.5 0 1 0 21 12.8z" />
                    </g>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <g className="sun-icon">
                      <circle cx="12" cy="12" r="4.5" />
                      <line x1="12" y1="2" x2="12" y2="5" />
                      <line x1="12" y1="19" x2="12" y2="22" />
                      <line x1="2" y1="12" x2="5" y2="12" />
                      <line x1="19" y1="12" x2="22" y2="12" />
                      <line x1="4.93" y1="4.93" x2="7.05" y2="7.05" />
                      <line x1="16.95" y1="16.95" x2="19.07" y2="19.07" />
                      <line x1="16.95" y1="7.05" x2="19.07" y2="4.93" />
                      <line x1="4.93" y1="19.07" x2="7.05" y2="16.95" />
                    </g>
                  </svg>
                )}
              </button>
            </StyledLinks>

            <TransitionGroup component={null}>
              {isMounted && (
                <CSSTransition classNames={fadeClass} timeout={timeout}>
                  <Menu themeMode={themeMode} toggleTheme={toggleTheme} />
                </CSSTransition>
              )}
            </TransitionGroup>
          </>
        )}
      </StyledNav>
    </StyledHeader>
  );
};

Nav.propTypes = {
  isHome: PropTypes.bool,
  themeMode: PropTypes.oneOf(['light', 'dark']).isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default Nav;
