"use client"
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import css from "./NotesPage.module.css"
import Modal from "@/components/Modal/Modal";
import NoteList from "@/components/NoteList/NoteList";
import { useDebouncedCallback } from "use-debounce";
import NoteForm from "@/components/NoteForm/NoteForm";
import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../lib/api"
import Loader from "@/components/Loader/Loadet";
import toast, { Toaster } from "react-hot-toast";


export default function App() {
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);

    
	const debouncedSetSearchQuery = useDebouncedCallback(
		(value: string) => {setSearchQuery(value);
	setCurrentPage(1);
},
    500,
  );

  const { data, isError, isLoading } = useQuery({
    queryKey: ["notes", searchQuery, currentPage],
    queryFn: () => fetchNotes(searchQuery, currentPage),
    placeholderData: keepPreviousData,
  });
  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;
  useEffect(() => {
    if (searchQuery && data && data.notes.length === 0) {
      toast.error("No notes found for your request.");
    }
  }, [data, searchQuery]);
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox text={searchQuery} onSearch={debouncedSetSearchQuery} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        {
          <button className={css.button} onClick={() => setIsModalOpen(true)}>
            Create note +
          </button>
        }
        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <NoteForm onCancel={() => setIsModalOpen(false)} />
          </Modal>
        )}
      </header>
      {isLoading && <Loader />}
      {isError && <p>Something went wrong.</p>}
      {data && notes.length > 0 && <NoteList notes={data.notes} />}
      <Toaster />
    </div>
  );
}