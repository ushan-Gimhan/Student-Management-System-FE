import axios from "axios";

export interface Student {
  id?: number;
  name: string;
  email: string;
  course: string;
  profileImageUrl?: string;
}

const API_URL = "http://localhost:8080/api/students";

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
export const getStudentById = (id: number) => axios.get<Student>(`${API_URL}/${id}`);