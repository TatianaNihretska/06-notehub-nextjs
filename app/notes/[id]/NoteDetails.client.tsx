'use client';

import { fetchNoteById} from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import css from './NoteDetails.module.css';

const NoteDetailsClient = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: noteItem,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["note", id],
      queryFn: () => fetchNoteById(id), 
    enabled: !!id,
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading, please wait...</p>;

  if (error || !noteItem) return <p>Something went wrong.</p>;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{noteItem.title}</h2>
        </div>
        <p className={css.tag}>{noteItem.tag}</p>
        <p className={css.content}>{noteItem.content}</p>
        <p className={css.date}>{noteItem.createdAt}</p>
      </div>
    </div>
  );
};
export default NoteDetailsClient;