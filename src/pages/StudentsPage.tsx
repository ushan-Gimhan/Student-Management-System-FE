import React, { useEffect, useState } from "react";
import {
  getAllStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  uploadProfileImage,
  deleteProfileImage,
} from "../services/studentService";
import type { Student } from "../services/studentService";
import StudentTable from "../components/StudentTable";
import StudentForm from "../components/StudentForm";
import SearchStudentById from "../components/SearchStudentById";

const StudentsPage: React.FC = () => {
const [students, setStudents] = useState<Student[]>([]);
const [loading, setLoading] = useState<boolean>(true);
const [error, setError] = useState<string | null>(null);
const [success, setSuccess] = useState<string | null>(null);
const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
const [isSearching, setIsSearching] = useState(false);

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setError(null);
    setTimeout(() => setSuccess(null), 3000);
  };

  const showError = (msg: string) => {
    setError(msg);
    setSuccess(null);
    setTimeout(() => setError(null), 4000);
  };

  const loadStudents = async () => {
    try {
        setLoading(true);
        const res = await getAllStudents();
        // Access 'content' from the paginated response
        setStudents(Array.isArray(res.data.content) ? res.data.content : []);
    } catch (err) {
        console.error(err);
        setStudents([]);
    } finally {
        setLoading(false);
    }
};

  const handleAdd = async (
    student: Omit<Student, "id">,
    profileImage?: File
  ) => {
    try {
      const res = await addStudent(student);
      if (profileImage && res.data?.id) {
        await uploadProfileImage(res.data.id, profileImage);
      }
      await loadStudents();
      showSuccess("Student added successfully!");
    } catch (err) {
      console.error("Failed to add student", err);
      showError("Failed to add student. Please try again.");
    }
  };

  const handleUpdate = async (
    id: number,
    student: Omit<Student, "id">
  ) => {
    try {
      await updateStudent(id, student);
      await loadStudents();
      showSuccess("Student updated successfully!");
    } catch (err) {
      console.error("Failed to update student", err);
      showError("Failed to update student. Please try again.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteStudent(id);
      await loadStudents();
      showSuccess("Student deleted successfully!");
    } catch (err) {
      console.error("Failed to delete student", err);
      showError("Failed to delete student. Please try again.");
    }
  };

  const handleUpload = async (id: number, file: File) => {
    try {
      await uploadProfileImage(id, file);
      await loadStudents();
      showSuccess("Profile image uploaded successfully!");
    } catch (err) {
      console.error("Failed to upload image", err);
      showError("Failed to upload image. Please try again.");
    }
  };

  const handleDeleteImage = async (id: number) => {
    try {
      await deleteProfileImage(id);
      await loadStudents();
      showSuccess("Profile image removed successfully!");
    } catch (err) {
      console.error("Failed to delete image", err);
      showError("Failed to remove image. Please try again.");
    }
  };
    useEffect(() => {
    loadStudents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Student Management
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {loading
                ? "Loading..."
                : `${students.length} student${students.length !== 1 ? "s" : ""} enrolled`}
            </p>
          </div>
        </div>

        {/* Toast Notifications */}
        <div className="space-y-2 mb-4">
          {success && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2.5 rounded-lg text-sm">
              <span className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center text-xs flex-shrink-0">
                ✓
              </span>
              {success}
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-lg text-sm">
              <span className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-xs flex-shrink-0">
                !
              </span>
              {error}
            </div>
          )}
        </div>
        
        {/* Add Student Form */}
        <StudentForm onAdd={handleAdd} />

        <SearchStudentById 
            setFilteredStudents={setFilteredStudents}
            setIsSearching={setIsSearching}
        />

        {/* Loading Skeleton or Table */}
        {loading ? (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="animate-pulse space-y-3">
            <div className="h-3 bg-gray-100 rounded w-24 mb-5" />
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 py-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                    <div className="h-2.5 bg-gray-100 rounded w-1/4" />
                </div>
                <div className="h-3 bg-gray-100 rounded w-24" />
                </div>
            ))}
            </div>
        </div>
        ) : (
        <StudentTable
            students={isSearching ? filteredStudents : students}
            onDelete={handleDelete}
            onUpload={handleUpload}
            onUpdate={handleUpdate}
            onDeleteImage={handleDeleteImage}
        />
        )}
      </div>
    </div>
  );
};

export default StudentsPage;