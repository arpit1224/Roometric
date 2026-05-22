import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router'
import { fetchProjectById } from '../../components/lib/puter.action';

const visualizerId = () => {
  const location = useLocation();
  const { id } = useParams();
  const state = location.state as VisualizerLocationState | null;
  const [project, setProject] = useState<DesignItem | null>(null);
  const [isLoading, setIsLoading] = useState(!state?.initialImage);
  const [error, setError] = useState<string | null>(null);
  const initialImage = state?.initialImage || project?.sourceImage;
  const name = state?.name || project?.name;

  useEffect(() => {
    let isCurrent = true;

    if (state?.initialImage) {
      setProject(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    if (!id) {
      setIsLoading(false);
      setError('Project ID is missing.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProject(null);

    fetchProjectById(id)
      .then((fetchedProject) => {
        if (!isCurrent) return;

        if (fetchedProject) {
          setProject(fetchedProject);
        } else {
          setProject(null);
          setError('Project not found.');
        }
      })
      .catch(() => {
        if (!isCurrent) return;

        setProject(null);
        setError('Unable to load project.');
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [id, state?.initialImage]);

  if (isLoading) {
    return <section className="visualizer-route loading">Loading project...</section>;
  }

  if (error && !initialImage) {
    return <section className="visualizer-route">{error}</section>;
  }

  return (
    <section>
      <h1> {name || 'Untitled Project'}</h1>

      <div className="visualizer">
        {initialImage && (
          <div className="image-container">
            <h2>Source Image</h2>
            <img src={initialImage} alt="source" />
          </div>
        )}
      </div>
    </section>
  )
}

export default visualizerId
