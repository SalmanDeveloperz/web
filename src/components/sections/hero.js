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

  h1 {
    margin: 0 0 30px 4px;
    color: var(--medium-gray);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }

  h3 {
    margin-top: 5px;
    color: var(--black);
    line-height: 0.9;
  }

  p {
    margin: 20px 0 0;
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

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
  }
`;

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
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
  }, []);

  const one = <h1>Hi, my name is</h1>;
  const three = <h3 className="big-heading">Muhammad Salman</h3>;
  const four = (
    <>
      <p>
        Hello Everyone, As a flexible professional, I excel in adapting to challenges, fostering
        creativity, and embracing feedback. Thriving in dynamic environments, I'm committed to
        staying current with industry trends and emerging technologies. Fueled by a passion for
        problem-solving and dedication to delivering quality results, I'm enthusiastic about
        contributing my skills to exciting projects.{' '}
        <a href="https://github.com/SalmanDeveloperz" target="_blank" rel="noreferrer">
          Visit my GitHub
        </a>
        .
      </p>
    </>
  );

  const items = [one, three, four];

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
