import axios from "axios";

export interface Student {
  id?: number;
  name: string;
  email: string;
  course: string;
  profileImageUrl?: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export const getAllStudents = () => axios.get<Student[]>(API_URL);
export const addStudent = (student: Omit<Student, "id">) => axios.post(API_URL, student);
export const updateStudent = (id: number, student: Omit<Student, "id">) => axios.put(`${API_URL}/${id}`, student);
export const deleteStudent = (id: number) => axios.delete(`${API_URL}/${id}`);
export const uploadProfileImage = (id: number, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return axios.patch(`${API_URL}/${id}/profile-image`, formData);
};

export const deleteProfileImage = (id: number) => axios.delete(`${API_URL}/${id}/profile-image`);
export const getStudentById = async (id: number) => {
  const res = await fetch(`${API_URL}/${id}`);
  
  // Parse the JSON (works for both 200 OK and 404 Not Found)
  const data = await res.json(); 

  if (!res.ok) {
    // data is { "message": "Student not found with id: 100" }
    // We throw the specific message from the backend
    throw new Error(data.message || "An error occurred"); 
  }

  return data; // This is the student object
};