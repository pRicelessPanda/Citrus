import { useParams, Link } from 'react-router-dom';
import PageHeader, { PageBody } from '../components/PageHeader.jsx';
import PaperCard from '../components/PaperCard.jsx';
import { paperById, relatedPapers } from '../data/papers.js';

export default function RelatedPapers() {
  const { id } = useParams();
  const paper = paperById(id);
  const related = relatedPapers(id, 10);

  return (
    <>
      <PageHeader
        title="Related papers"
        subtitle={paper ? `Related to “${paper.title}”` : ''}
        right={
          paper && (
            <Link to={`/paper/${id}/translated`} className="text-sm text-info hover:underline">
              ← Back to paper
            </Link>
          )
        }
      />
      <PageBody>
        <div className="space-y-4">
          {related.map((p) => (
            <PaperCard key={p.id} paper={p} showScore />
          ))}
        </div>
      </PageBody>
    </>
  );
}
