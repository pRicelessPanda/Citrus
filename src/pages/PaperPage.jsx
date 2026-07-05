import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import ArxivPaperPage from '../components/ArxivPaperPage.jsx';
import { useStore } from '../store.js';

export default function PaperPage() {
  const { id } = useParams();
  const addVisited = useStore((s) => s.addVisited);
  useEffect(() => {
    addVisited(id);
  }, [id]); // eslint-disable-line

  return (
    <>
      <PageHeader title="Paper" subtitle="Untranslated · arXiv view" />
      <ArxivPaperPage paperId={id} />
    </>
  );
}
