// import React, { useState, useEffect } from 'react';
// import { CSSTransition, TransitionGroup } from 'react-transition-group';
// import { Link } from 'gatsby';
// import styled from 'styled-components';
// import { navDelay, loaderDelay } from '@utils';
// import { Icon } from '@components/icons';
// import { usePrefersReducedMotion } from '@hooks';

// const StyledHeroSection = styled.section`
//   ${({ theme }) => theme.mixins.flexCenter};
//   flex-direction: column;
//   align-items: flex-start;
//   /* min-height: 100vh;
//   height: 100vh; */
//   padding: 0;
//   position: relative;

//   @media (max-height: 700px) and (min-width: 700px), (max-width: 360px) {
//     height: auto;
//     padding-top: var(--nav-height);
//   }

//   @media (max-width: 768px) {
//     /* height: auto; */
//     /* min-height: auto; */
//     padding: auto;
//     /* padding-top: 10rem; */
//   }

//   h1 {
//     margin: 0 0 30px 4px;
//     color: var(--medium-gray);
//     font-family: var(--font-mono);
//     font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
//     font-weight: 400;

//     @media (max-width: 480px) {
//       margin: 0 0 20px 2px;
//     }
//   }

//   h3 {
//     margin-top: 5px;
//     color: var(--black);
//     line-height: 0.9;
//   }

//   p {
//     margin: 20px 0 0;
//     /* max-width: 540px; */
//   }

//   .down_arrow {
//     display: none;
//     position: absolute;
//     bottom: 30px;
//     right: 20px;
//     width: 30px;
//     height: 30px;
//     color: var(--light-gray) !important;

//     @media (max-width: 768px) {
//       display: block;
//     }
//   }

//   .email-link {
//     ${({ theme }) => theme.mixins.bigButton};
//     margin-top: 50px;
//   }
// `;

// // const styledDown = styled

// const Hero = () => {
//   const [isMounted, setIsMounted] = useState(false);
//   const prefersReducedMotion = usePrefersReducedMotion();
//   const [height, setHeight] = useState(window.innerHeight);

//   useEffect(() => {
//     const handleResize = () => setHeight(window.innerHeight);
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   useEffect(() => {
//     if (prefersReducedMotion) {
//       return;
//     }

//     const timeout = setTimeout(() => setIsMounted(true), navDelay);
//     return () => clearTimeout(timeout);
//   }, []);

//   const one = <h1>Hi, my name is</h1>;
//   const three = <h3 className="big-heading">Muhammad Salman</h3>;
//   const four = (
//     <>
//       <p>
//         As a flexible professional, I excel in adapting to challenges, fostering creativity, and embracing feedback. Thriving in dynamic environments, I'm committed to staying current with industry trends and emerging technologies. Fueled by a passion for problem-solving and dedication to delivering quality results, I'm enthusiastic about contributing my skills to exciting projects.{' '}
//         <a href="https://github.com/SalmanDeveloperz" target="_blank" rel="noreferrer">

//         </a>
//         .
//       </p>

//     </>
//   );

//   const items = [one, three, four];

//   return (
//     <StyledHeroSection style={{ height: height }}>
//       {prefersReducedMotion ? (
//         <>
//           {items.map((item, i) => (
//             <div key={i}>{item}</div>
//           ))}
//         </>
//       ) : (
//         <TransitionGroup component={null}>
//           {isMounted &&
//             items.map((item, i) => (
//               <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
//                 <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
//               </CSSTransition>
//             ))}
//           <Link className="down_arrow" to="#featured-posts">
//             <Icon className="detail__item__icon" name="DownArrow" />
//           </Link>
//         </TransitionGroup>
//       )}
//     </StyledHeroSection>
//   );
// };

// export default Hero;

import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  position: relative;

  @media (max-height: 700px) and (min-width: 700px), (max-width: 360px) {
    height: auto;
    padding-top: var(--nav-height);
  }

  @media (max-width: 768px) {
    padding: auto;
  }

  .eyebrow {
    margin: 0 0 20px 4px;
    color: var(--medium-gray);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-xs), 3vw, var(--fz-sm));
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  h1 {
    margin: 0 0 20px 4px;
    color: var(--medium-gray);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }

  h3 {
    margin: 0 0 18px;
    color: var(--black);
    line-height: 0.96;
  }

  .hero-copy {
    max-width: 840px;
    margin-top: 12px;
  }

  .hero-copy p {
    margin: 0 0 18px;
    line-height: 1.8;
    color: var(--dark-gray);
    font-size: clamp(1rem, 2.1vw, 1.15rem);
  }

  .story-line {
    margin-top: 8px;
    color: var(--black);
    font-size: clamp(1rem, 2.05vw, 1.2rem);
  }

  .hero-points {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 22px 0 0;
    padding: 0;
    list-style: none;

    li {
      padding: 8px 12px;
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.6);
      color: var(--dark-gray);
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
    }
  }

  .cta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 28px;
  }

  .cta-link {
    ${({ theme }) => theme.mixins.bigButton};
    font-size: var(--fz-sm);
    text-decoration: none;
  }

  .cta-link.secondary {
    background: transparent;
    border: 1px solid rgba(0, 0, 0, 0.12);
    color: var(--black);
  }

  .down_arrow {
    display: none;
    position: absolute;
    bottom: 30px;
    right: 20px;
    width: 30px;
    height: 30px;
    color: var(--light-gray) !important;

    @media (max-width: 768px) {
      display: block;
    }
  }
`;

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [height, setHeight] = useState(() =>
    typeof window !== 'undefined' ? window.innerHeight : 800,
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const handleResize = () => setHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, [prefersReducedMotion]);

  const one = <h1>Hi, I’m</h1>;
  const two = <div className="eyebrow">Platform / DevOps Engineer • Open Source Contributor</div>;
  const three = <h3 className="big-heading">Muhammad Salman</h3>;
  const four = (
    <div className="hero-copy">
      <p className="story-line">
        I build resilient cloud-native platforms, Kubernetes microservices, and observability
        pipelines that help engineering teams deploy faster, debug faster, and trust their systems
        more.
      </p>
      <p>
        Over the last year, I’ve designed and operated a 10+ service Kubernetes infrastructure for
        FOSSology, built telemetry pipelines for Jenkins CI that cut trace volume by 81%, and
        migrated a brittle build path from Make to CMake to restore a stalled CI workflow. My work
        sits at the intersection of infrastructure, automation, open source, and reliability.
      </p>
      <p>
        I enjoy turning operational pain into elegant systems: whether it’s fixing crash loops,
        stabilizing container networking, improving developer workflows, or making observability
        visible enough to prevent incidents before they become outages.
      </p>
      <ul className="hero-points">
        <li>10+ service Kubernetes platform</li>
        <li>40% faster build migration</li>
        <li>81% trace-volume reduction</li>
        <li>22 FOSSology PRs</li>
        <li>5 merged Jenkins PRs</li>
      </ul>
      <div className="cta-row">
        <a
          className="cta-link"
          href="https://github.com/SalmanDeveloperz"
          target="_blank"
          rel="noreferrer">
          Explore GitHub
        </a>
        <a
          className="cta-link secondary"
          href="https://www.linkedin.com/in/msalman199/"
          target="_blank"
          rel="noreferrer">
          Connect on LinkedIn
        </a>
        <Link className="cta-link secondary" to="/resume">
          View Resume
        </Link>
      </div>
    </div>
  );

  const items = [one, two, three, four];

  return (
    <StyledHeroSection style={{ height: height }}>
      {prefersReducedMotion ? (
        <>
          {items.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </>
      ) : (
        <TransitionGroup component={null}>
          {isMounted &&
            items.map((item, i) => (
              <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
                <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
              </CSSTransition>
            ))}
          <Link className="down_arrow" to="#featured-posts">
            <Icon className="detail__item__icon" name="DownArrow" />
          </Link>
        </TransitionGroup>
      )}
    </StyledHeroSection>
  );
};

export default Hero;
