import React, { useState } from "react";
import type { Student } from "../services/studentService";

interface StudentTableProps {
  students: Student[];
  onDelete: (id: number) => void;
  onUpload: (id: number, file: File) => void;
  onUpdate: (id: number, student: Omit<Student, "id">) => void;
  onDeleteImage: (id: number) => void;
}

const PALETTES: { bg: string; text: string }[] = [
  { bg: "bg-blue-100",   text: "text-blue-800"   },
  { bg: "bg-teal-100",   text: "text-teal-800"   },
  { bg: "bg-pink-100",   text: "text-pink-800"   },
  { bg: "bg-purple-100", text: "text-purple-800" },
  { bg: "bg-amber-100",  text: "text-amber-800"  },
  { bg: "bg-green-100",  text: "text-green-800"  },
];

const avatarPalette = (id: number) => PALETTES[(id - 1) % PALETTES.length];

const initials = (name: string): string => {
  const parts = name.trim().split(" ");
  return parts.length > 1
    ? parts[0][0] + parts[parts.length - 1][0]
    : parts[0].slice(0, 2).toUpperCase();
};

const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onDelete,
  onUpload,
  onUpdate,
  onDeleteImage,
}) => {
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", course: "" });
  const [editError, setEditError] = useState<string | null>(null);
  const [previewStudent, setPreviewStudent] = useState<Student | null>(null);

  const openEdit = (s: Student) => {
    setEditStudent(s);
    setEditForm({ name: s.name, email: s.email, course: s.course });
    setEditError(null);
  };

  const closeEdit = () => {
    setEditStudent(null);
    setEditError(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleEditSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editForm.name.trim() || !editForm.email.trim() || !editForm.course.trim()) {
      setEditError("Please fill in all fields.");
      return;
    }
    if (!emailRegex.test(editForm.email)) {
      setEditError("Please enter a valid email address.");
      return;
    }
    if (editStudent?.id) {
      onUpdate(editStudent.id, {
        name: editForm.name,
        email: editForm.email,
        course: editForm.course,
      });
    }
    closeEdit();
  };

  const openPreview = (s: Student) => {
    if (s.profileImageUrl) setPreviewStudent(s);
  };

  const closePreview = () => setPreviewStudent(null);

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Students
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 px-3 w-10 text-center">
                  #
                </th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 px-3">
                  Student
                </th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 px-3">
                  Course
                </th>
                <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 px-3 w-28">
                  Photo
                </th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 px-3 w-44">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(students) && students.length > 0 ? (
                students.map((s) => {
                  const palette = avatarPalette(s.id ?? 1);
                  return (
                    <tr
                      key={s.id}
                      className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors"
                    >
                      {/* ID */}
                      <td className="px-3 py-3 text-center text-xs text-gray-400">
                        {s.id}
                      </td>

                      {/* Student */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${palette.bg} ${palette.text}`}
                          >
                            {initials(s.name)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-sm leading-tight">
                              {s.name}
                            </p>
                            <p className="text-xs text-gray-400 leading-tight">
                              {s.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Course */}
                      <td className="px-3 py-3">
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200 whitespace-nowrap">
                          {s.course}
                        </span>
                      </td>

                      {/* Photo */}
                      <td className="px-3 py-3 text-center">
                        {s.profileImageUrl ? (
                          <div className="flex flex-col items-center gap-1.5">
                            <img
                              src={s.profileImageUrl}
                              alt={s.name || "Profile"}
                              className="w-9 h-9 rounded-lg object-cover mx-auto cursor-pointer ring-1 ring-gray-200 hover:ring-blue-300 transition-all"
                              loading="lazy"
                              onClick={() => openPreview(s)}
                              title="Click to preview"
                              onError={(e) =>
                                ((e.target as HTMLImageElement).src = "/placeholder.png")
                              }
                            />
                            <div className="flex gap-1">
                              <label
                                className="text-xs px-1.5 py-0.5 rounded border border-gray-200 text-gray-400 cursor-pointer hover:bg-blue-50 hover:text-blue-500 hover:border-blue-200 transition-colors"
                                title="Replace photo"
                              >
                                ↑
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files && s.id)
                                      onUpload(s.id, e.target.files[0]);
                                  }}
                                />
                              </label>
                              <button
                                onClick={() => s.id && onDeleteImage(s.id)}
                                className="text-xs px-1.5 py-0.5 rounded border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                                title="Remove photo"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label
                            className="inline-flex flex-col items-center gap-1 cursor-pointer group"
                            title="Upload photo"
                          >
                            <div className="w-9 h-9 rounded-lg border border-dashed border-gray-200 flex items-center justify-center group-hover:border-blue-300 group-hover:bg-blue-50 transition-colors">
                              <svg
                                className="w-4 h-4 text-gray-300 group-hover:text-blue-400"
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
                            </div>
                            <span className="text-xs text-gray-300 group-hover:text-blue-400 transition-colors">
                              Upload
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && s.id)
                                  onUpload(s.id, e.target.files[0]);
                              }}
                            />
                          </label>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(s)}
                            className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors whitespace-nowrap"
                          >
                            ✎ Edit
                          </button>
                          <button
                            onClick={() => s.id && onDelete(s.id)}
                            className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors whitespace-nowrap"
                            title="Delete student"
                          >
                            ✕ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-sm text-gray-400">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Student Modal */}
      {editStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={closeEdit}
        >
          <div
            className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-gray-800">Edit Student</h2>
              <button
                onClick={closeEdit}
                className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {[
                { id: "name",   label: "Full name",      type: "text",  placeholder: "e.g. Aisha Fernando" },
                { id: "email",  label: "Email address",  type: "email", placeholder: "student@uni.edu"     },
                { id: "course", label: "Course",         type: "text",  placeholder: "e.g. Computer Science" },
              ].map(({ id, label, type, placeholder }) => (
                <div key={id} className="flex flex-col gap-1">
                  <label htmlFor={`edit-${id}`} className="text-xs font-medium text-gray-500">
                    {label}
                  </label>
                  <input
                    id={`edit-${id}`}
                    name={id}
                    type={type}
                    placeholder={placeholder}
                    value={(editForm as Record<string, string>)[id]}
                    onChange={handleEditChange}
                    className="text-sm px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all placeholder-gray-300"
                  />
                </div>
              ))}
            </div>

            {editError && (
              <p className="text-xs text-red-500 mt-2">{editError}</p>
            )}

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={closeEdit}
                className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="text-sm px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700 active:scale-95 transition-all"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closePreview}
        >
          <div
            className="bg-white rounded-xl shadow-lg p-5 max-w-sm w-full mx-4 flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm font-medium text-gray-800">{previewStudent.name}</p>
                <p className="text-xs text-gray-400">{previewStudent.course}</p>
              </div>
              <button
                onClick={closePreview}
                className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <img
              src={previewStudent.profileImageUrl!}
              alt={previewStudent.name}
              className="w-48 h-48 rounded-xl object-cover ring-1 ring-gray-100"
              onError={(e) =>
                ((e.target as HTMLImageElement).src = "/placeholder.png")
              }
            />

            <div className="flex gap-2 w-full">
              <label className="flex-1 text-center text-xs py-2 rounded-lg border border-gray-200 text-gray-500 cursor-pointer hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors">
                ↑ Replace photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && previewStudent.id) {
                      onUpload(previewStudent.id, e.target.files[0]);
                      closePreview();
                    }
                  }}
                />
              </label>
              <button
                onClick={() => {
                  if (previewStudent.id) onDeleteImage(previewStudent.id);
                  closePreview();
                }}
                className="flex-1 text-xs py-2 rounded-lg border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
              >
                ✕ Remove photo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentTable;