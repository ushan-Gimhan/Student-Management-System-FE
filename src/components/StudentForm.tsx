import React, { useState, useRef } from "react";
import type { Student } from "../services/studentService";

interface StudentFormProps {
  onAdd: (student: Omit<Student, "id">, profileImage?: File) => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ onAdd }) => {
  const [student, setStudent] = useState<Omit<Student, "id">>({
    name: "",
    email: "",
    course: "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setStudent({ ...student, [e.target.name]: e.target.value });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileImage(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!student.name.trim() || !student.email.trim() || !student.course.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (!emailRegex.test(student.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    onAdd(student, profileImage ?? undefined);
    setStudent({ name: "", email: "", course: "" });
    setProfileImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const initials = (name: string) => {
    const parts = name.trim().split(" ");
    return parts.length > 1
      ? parts[0][0] + parts[parts.length - 1][0]
      : parts[0].slice(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5 shadow-sm">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
        Add New Student
      </p>

      <div className="flex gap-5 items-start">
        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-20 h-20 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center cursor-pointer overflow-hidden hover:border-blue-400 transition-colors"
            title="Click to upload profile picture"
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                {student.name ? (
                  <span className="text-xl font-semibold text-gray-400">
                    {initials(student.name)}
                  </span>
                ) : (
                  <svg
                    className="w-7 h-7 text-gray-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                )}
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />

          {preview ? (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="text-xs text-red-400 hover:text-red-600 transition-colors"
            >
              Remove
            </button>
          ) : (
            <span
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-gray-400 cursor-pointer hover:text-blue-500 transition-colors"
            >
              Add photo
            </span>
          )}
        </div>

        {/* Form Fields */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: "name", label: "Full name", placeholder: "e.g. Aisha Fernando", type: "text" },
              { id: "email", label: "Email address", placeholder: "student@uni.edu", type: "email" },
              { id: "course", label: "Course", placeholder: "e.g. Computer Science", type: "text" },
            ].map(({ id, label, placeholder, type }) => (
              <div key={id} className="flex flex-col gap-1">
                <label htmlFor={id} className="text-xs font-medium text-gray-500">
                  {label}
                </label>
                <input
                  id={id}
                  name={id}
                  type={type}
                  placeholder={placeholder}
                  value={(student as Record<string, string>)[id]}
                  onChange={handleChange}
                  className="text-sm px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all placeholder-gray-300"
                />
              </div>
            ))}
          </div>

          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              className="text-sm px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700 active:scale-95 transition-all"
            >
              + Add Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;