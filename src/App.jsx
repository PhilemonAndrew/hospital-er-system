import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const API_URL = "http://localhost:5000/api/patients";

  const [patients, setPatients] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    patient_name: "",
    gender: "",
    date_of_birth: "",
    blood_group: "",
    medical_history: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(API_URL);
      setPatients(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

  };

  const validateForm = () => {

    let newErrors = {};

    if (!/^[A-Za-z ]+$/.test(formData.patient_name.trim())) {
      newErrors.patient_name =
        "Patient name must contain only letters.";
    }

    if (new Date(formData.date_of_birth) >= new Date()) {
      newErrors.date_of_birth =
        "Date of Birth must be in the past.";
    }

    if (formData.medical_history.trim().length < 15) {
      newErrors.medical_history =
        "Medical History must be at least 15 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validateForm()) return;

    try {

      if (editingId) {

        await axios.put(
          `${API_URL}/${editingId}`,
          formData
        );

        setEditingId(null);

      } else {

        await axios.post(API_URL, formData);

      }

      setFormData({
        patient_name: "",
        gender: "",
        date_of_birth: "",
        blood_group: "",
        medical_history: ""
      });

      fetchPatients();

    } catch (error) {
      console.error(error);
    }

  };

  const handleEdit = (patient) => {

    setEditingId(patient.id);

    setFormData({
      patient_name: patient.patient_name,
      gender: patient.gender,
      date_of_birth: patient.date_of_birth.split("T")[0],
      blood_group: patient.blood_group,
      medical_history: patient.medical_history
    });

  };

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this patient?"
    );

    if (!confirmDelete) return;

    try {

      await axios.delete(`${API_URL}/${id}`);

      fetchPatients();

    } catch (error) {
      console.error(error);
    }

  };

  return (
        <div className="container">

      <h1>Hospital Electronic Health Records</h1>

      <form onSubmit={handleSubmit} className="patient-form">

        <h2>
          {editingId ? "Edit Patient" : "Register New Patient"}
        </h2>

        <label>Patient Name</label>

        <input
          type="text"
          name="patient_name"
          value={formData.patient_name}
          onChange={handleChange}
          placeholder="Enter patient's full name"
        />

        {errors.patient_name && (
          <p className="error">{errors.patient_name}</p>
        )}

        <label>Gender</label>

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <label>Date of Birth</label>

        <input
          type="date"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleChange}
        />

        {errors.date_of_birth && (
          <p className="error">{errors.date_of_birth}</p>
        )}

        <label>Blood Group</label>

        <select
          name="blood_group"
          value={formData.blood_group}
          onChange={handleChange}
        >
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>

        <label>Medical History</label>

        <textarea
          rows="5"
          name="medical_history"
          value={formData.medical_history}
          onChange={handleChange}
          placeholder="Enter patient's medical history"
        ></textarea>

        {errors.medical_history && (
          <p className="error">{errors.medical_history}</p>
        )}

        <button type="submit">
          {editingId ? "Update Patient" : "Register Patient"}
        </button>

      </form>

      <h2>Patient Records</h2>

      <table>

        <thead>

          <tr>

            <th>Name</th>
            <th>Gender</th>
            <th>DOB</th>
            <th>Blood Group</th>
            <th>Medical History</th>
            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {patients.length === 0 ? (

            <tr>

              <td colSpan="6">
                No patient records found.
              </td>

            </tr>

          ) : (

            patients.map((patient) => (

              <tr key={patient.id}>

                <td>{patient.patient_name}</td>

                <td>{patient.gender}</td>

                <td>{patient.date_of_birth.split("T")[0]}</td>

                <td>{patient.blood_group}</td>

                <td>{patient.medical_history}</td>

                <td>

                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(patient)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(patient.id)}
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  );

}

export default App;