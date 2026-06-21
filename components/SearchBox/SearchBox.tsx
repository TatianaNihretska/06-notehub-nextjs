import css from "./SearchBox.module.css";

interface SearchBoxProps {
  text: string;
  onSearch: (value: string) => void;
}
export default function SearchBox({ text, onSearch }: SearchBoxProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <input
      value={text}
      onChange={handleChange}
      className={css.input}
      type="text"
      placeholder="Search notes"
    />
  );
}