import { useState } from "react";
import { getStudentById } from "../services/studentService";
import axios from 'axios';
import type { Student } from "../services/studentService";

export default function SearchStudentById({ setFilteredStudents, setIsSearching }: { setFilteredStudents: React.Dispatch<React.SetStateAction<Student[]>>; setIsSearching: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [id, setId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
  setError("");

  if (!id) {
    setError("Please enter a student ID");
    setIsSearching(false);
    return;
  }

  try {
    const student = await getStudentById(Number(id));

    //SUCCESS: student was found
    setFilteredStudents([student]);
    setError(null); // Clear any old errors
    setIsSearching(true);

  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      // I know exactly what this is now!
      setError(err.response?.data?.message || "Server error");
    } else {
      // This is a normal JS error
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }
};

  const handleClear = () => {
    setFilteredStudents([]);
    setIsSearching(false); //go back to full list
    setId("");
    setError("");
  };

  return (
    <div className="p-4 shadow mb-4">
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Enter student ID..."
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Search
        </button>

        <button
          onClick={handleClear}
          className="bg-gray-400 text-white px-3 rounded"
        >
          Clear
        </button>
      </div>

      {error && (
        <p className="text-red-500 mt-2 text-sm">{error}</p>
      )}
    </div>
  );
}