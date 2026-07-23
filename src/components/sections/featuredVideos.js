import React, { useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig, youtube } from '@config';
import { usePrefersReducedMotion } from '@hooks';

const FeaturedVideoSection = styled.section`
  @media (min-width: 768px) {
    padding-top: 3rem;
  }

  @media (max-width: 768px) and (min-width: 500px) {
    padding-top: 0;
  }
`;

const StyledVideo = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border: none;
  max-width: 400px;

  .title {
    font-weight: 600;
    font-size: var(--fz-xxxl);
    padding-left: 0.2rem;
    margin-bottom: 1rem;
  }

  .description {
    font-size: var(--fz-lg);
    font-weight: 400;
    color: var(--medium-gray);
    padding-left: 0.3rem;
  }
`;

const StyledPic = styled.div`
  position: relative;

  margin-bottom: 2rem;

  .wrapper {
    ${({ theme }) => theme.mixins.boxShadow};
    display: block;
    position: relative;
    width: 100%;
    border-radius: var(--border-radius);
    background-color: var(--white);

    &:hover,
    &:focus {
      outline: 0;
      transform: translate(-4px, -4px);

      .img {
        filter: none;
        mix-blend-mode: normal;
      }
    }

    .img {
      position: relative;
      border-radius: var(--border-radius);
      mix-blend-mode: multiply;
      filter: grayscale(100%) contrast(1);
      transition: var(--transition);

      & > div {
        display: none !important;
      }
    }

    &:before {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: var(--border-radius);
      transition: var(--transition);
    }

    &:before {
      top: 0;
      left: 0;
      background-color: var(--bright-gray);
      mix-blend-mode: screen;
    }
  }
`;

const FeaturedVideoGrid = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  text-align: center;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const MoreButton = styled.button`
  display: block;
  ${({ theme }) => theme.mixins.smallButton};
  margin: 80px auto;
  margin-bottom: 0;

  @media (max-width: 600px) {
    margin-top: 40px;
    margin-bottom: 40px;
  }
`;

const FeaturedVideo = () => {
  const data = useStaticQuery(graphql`
    {
      featured: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/videos/" } }
        sort: { fields: [frontmatter___date], order: ASC }
      ) {
        edges {
          node {
            fileAbsolutePath
            frontmatter {
              title
              description
              date
              cover
              link
              tags
            }
          }
        }
      }
      images: allFile(filter: { sourceInstanceName: { eq: "content" } }) {
        edges {
          node {
            publicURL
            relativePath
          }
        }
      }
    }
  `);

  const getVideoImage = (coverPath, fileAbsolutePath) => {
    if (!coverPath || !fileAbsolutePath) {
      return '';
    }

    const contentRelativePath = fileAbsolutePath.split('/content/')[1] || '';
    const markdownDirectory = contentRelativePath.replace(/\/[^/]+$/, '');
    const normalizedCoverPath = coverPath.replace(/^\.\//, '');
    const relativeImagePath = `${markdownDirectory}/${normalizedCoverPath}`.replace(/\/+/g, '/');

    return (
      data.images.edges.find(({ node }) => node.relativePath === relativeImagePath)?.node
        .publicURL || ''
    );
  };

  const featuredVideos = data.featured.edges.filter(({ node }) => node);
  const revealTitle = useRef(null);
  const revealVideo = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    revealVideo.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  return (
    <FeaturedVideoSection id="featured-video">
      <h2 className="numbered-heading" ref={revealTitle}>
        Featured Videos
      </h2>
      <FeaturedVideoGrid>
        {featuredVideos &&
          featuredVideos.map(({ node }, i) => {
            const { frontmatter, fileAbsolutePath } = node;
            const { title, description, cover, link } = frontmatter;
            const imageSrc = getVideoImage(cover, fileAbsolutePath);

            return (
              <StyledVideo key={i} href={link} ref={el => (revealVideo.current[i] = el)}>
                <StyledPic>
                  <div className="wrapper">
                    {imageSrc && <img src={imageSrc} alt={title} className="img" />}
                  </div>
                </StyledPic>
                <div className="title">{title}</div>
                <div className="description">{description}</div>
              </StyledVideo>
            );
          })}
      </FeaturedVideoGrid>
      <MoreButton className="more-button" onClick={() => {}}>
        <a href={youtube} target="_blank" rel="noopener noreferrer">
          See all &rarr;
        </a>
      </MoreButton>
    </FeaturedVideoSection>
  );
};

export default FeaturedVideo;
