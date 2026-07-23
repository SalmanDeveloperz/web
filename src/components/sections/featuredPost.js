import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { usePrefersReducedMotion } from '@hooks';

const FeaturedPostSection = styled.section`
  padding-top: 5rem;

  .intro {
    max-width: 880px;
    margin: -8px 0 30px;
    color: var(--medium-gray);
    font-size: clamp(1rem, 2vw, 1.12rem);
    line-height: 1.8;
  }

  .link-container {
    margin-top: 3rem;
    text-align: end;

    a {
      font-size: var(--fz-md) !important;
    }

    @media (max-width: 768px) {
      margin-top: 1rem;
    }
  }

  .post_container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const StyledGrid = styled.ul`
  ${({ theme }) => theme.mixins.resetList};
  display: grid;
  width: 100%;
  gap: 1.2rem;
`;

const StyledPost = styled.li`
  transition: var(--transition);
  display: flex;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 18px;
  padding: 1.4rem 1.5rem;
  gap: 1.4rem;
  align-items: flex-start;

  .left-label {
    min-width: 110px;
    color: var(--medium-gray);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding-top: 0.35rem;
  }

  .main {
    flex: 1;
  }

  .title {
    font-size: clamp(1.1rem, 2.4vw, 1.6rem);
    color: var(--black);
    margin: 0 0 0.5rem;
  }

  .description {
    margin: 0;
    font-size: clamp(0.98rem, 1.8vw, 1.05rem);
    line-height: 1.75;
    color: var(--medium-gray);
  }

  .tag-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
  }

  .tag {
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(100, 255, 218, 0.12);
    color: var(--green);
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.02em;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.8rem;

    .left-label {
      min-width: auto;
    }
  }
`;

const contributions = [
  {
    label: 'Jenkins',
    title: 'Production-ready container env-var substitution in official Jenkins images',
    description:
      'Merged Jenkins Docker improvements that brought Linux and Windows container environment variable substitution into official releases, solving a long-standing gap that had blocked enterprise CI workflows.',
    tags: ['Docker', 'CI/CD', 'Official Release', 'Jenkins'],
  },
  {
    label: 'FOSSology',
    title: 'Built a 10+ service Kubernetes microservices platform from a fragile monolith',
    description:
      'Designed and deployed a Kubernetes-native platform for FOSSology with Kustomize overlays for dev, staging, and prod, replacing an unreliable deployment model and restoring CI confidence across the project.',
    tags: ['Kubernetes', 'Kustomize', 'Docker', 'Microservices'],
  },
  {
    label: 'Observability',
    title: 'A Jenkins telemetry pipeline that cut trace volume by 81%',
    description:
      'Created a 3-tier OpenTelemetry pipeline with tail-based sampling, Prometheus alerting, and Grafana/Jaeger visibility so Jenkins CI signals became actionable instead of noisy.',
    tags: ['OpenTelemetry', 'Prometheus', 'Grafana', 'Jaeger'],
  },
  {
    label: 'Accessibility',
    title: 'Improved real user experience across open-source interfaces',
    description:
      'Reported and resolved accessibility regressions in OWASP Nest and Jenkins UI flows, making keyboard navigation, focus visibility, and screen-reader support more reliable for everyday users.',
    tags: ['Accessibility', 'UX', 'Open Source', 'Collaboration'],
  },
];

const FeaturedPost = () => {
  const revealTitle = useRef(null);
  const revealArchiveLink = useRef(null);
  const revealPost = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealArchiveLink.current, srConfig());
    revealPost.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  return (
    <FeaturedPostSection id="featured-posts">
      <h2 className="numbered-heading" ref={revealTitle}>
        Open Source Contributions
      </h2>
      <p className="intro">
        I focus on the parts of engineering that make platforms usable in production: reliability,
        observability, automation, accessibility, and contributor-led maintenance.
      </p>
      <div className="post_container">
        <StyledGrid>
          {contributions.map((item, i) => (
            <StyledPost key={i} ref={el => (revealPost.current[i] = el)}>
              <div className="left-label">{item.label}</div>
              <div className="main">
                <h3 className="title">{item.title}</h3>
                <p className="description">{item.description}</p>
                <div className="tag-row">
                  {item.tags.map(tag => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </StyledPost>
          ))}
        </StyledGrid>
      </div>
      <div className="link-container">
        <a
          className="styled_link"
          href="https://github.com/SalmanDeveloperz"
          target="_blank"
          rel="noreferrer"
          ref={revealArchiveLink}>
          Explore all GitHub work &rarr;
        </a>
      </div>
    </FeaturedPostSection>
  );
};

export default FeaturedPost;
