import { useState } from "react";
import { getStudentById } from "../services/studentService";

export default function SearchStudentById({ setFilteredStudents, setIsSearching }) {
  const [id, setId] = useState("");
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");

    if (!id) {
      setError("Please enter a student ID");
      return;
    }

    try {
      const res = await getStudentById(Number(id));

      setFilteredStudents([res.data]);
      setIsSearching(true); // ✅ important

    } catch (err) {
      if (err.response?.status === 404) {
        setError(`Student not found with ID: ${id}`);
      } else {
        setError("Something went wrong");
      }

      setFilteredStudents([]);
      setIsSearching(true); // ✅ still searching but empty
    }
  };

  const handleClear = () => {
    setFilteredStudents([]);
    setIsSearching(false); // ✅ go back to full list
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