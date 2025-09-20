import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PatientSignup = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    age: "",
    gender: "Male",
    prakriti: "Vata",
    vikriti: "",
    doctor_id: "",
    procedure_id: "",
    selectedDate: null,
  });

  const [doctors, setDoctors] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dyslexicStyles = {
    fontFamily: "'Open Sans', 'OpenDyslexic', sans-serif",
    letterSpacing: "0.05em",
    lineHeight: "1.6",
    color: "#2d3748",
  };

  // Fetch doctors and procedures
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await axios.get("http://localhost:5000/patient/doctors");
        setDoctors(res1.data.doctors || []);

        const res2 = await axios.get(
          "http://localhost:5000/patient/procedures"
        );
        setProcedures(res2.data.procedures || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      selectedDate: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!formData.selectedDate) {
        setError("Please select a date.");
        setLoading(false);
        return;
      }

      const payload = {
        ...formData,
        selectedDate: formData.selectedDate.toISOString(),
      };

      const response = await axios.post(
        "http://localhost:5000/patient/signup",
        payload
      );

      if (response.data.success) {
        alert("Patient registered successfully!");
        setFormData({
          full_name: "",
          email: "",
          password: "",
          phone: "",
          age: "",
          gender: "Male",
          prakriti: "Vata",
          vikriti: "",
          doctor_id: "",
          procedure_id: "",
          selectedDate: null,
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 p-6"
      style={dyslexicStyles}
    >
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-teal-700 p-8 text-center">
          <div className="flex justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white">
            Patient Registration
          </h2>
          <p className="text-green-100 mt-2">
            Sign up to begin your treatment journey
          </p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="focus:ring-green-500 focus:border-green-500 block w-full p-3 border-gray-300 rounded-md"
                placeholder="John Doe"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="focus:ring-green-500 focus:border-green-500 block w-full p-3 border-gray-300 rounded-md"
                placeholder="your@email.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="focus:ring-green-500 focus:border-green-500 block w-full p-3 border-gray-300 rounded-md"
                placeholder="Enter your password"
                required
                minLength="6"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="focus:ring-green-500 focus:border-green-500 block w-full p-3 border-gray-300 rounded-md"
                placeholder="+91-9876543210"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="focus:ring-green-500 focus:border-green-500 block w-full p-3 border-gray-300 rounded-md"
                placeholder="30"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="focus:ring-green-500 focus:border-green-500 block w-full p-3 border-gray-300 rounded-md"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            {/* Prakriti */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Prakriti
              </label>
              <select
                name="prakriti"
                value={formData.prakriti}
                onChange={handleChange}
                className="focus:ring-green-500 focus:border-green-500 block w-full p-3 border-gray-300 rounded-md"
              >
                <option>Vata</option>
                <option>Pitta</option>
                <option>Kapha</option>
                <option>Vata-Pitta</option>
                <option>Pitta-Kapha</option>
                <option>Vata-Kapha</option>
                <option>Tridosha</option>
              </select>
            </div>

            {/* Vikriti */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vikriti (Current Imbalance)
              </label>
              <textarea
                name="vikriti"
                value={formData.vikriti}
                onChange={handleChange}
                className="focus:ring-green-500 focus:border-green-500 block w-full p-3 border-gray-300 rounded-md"
                placeholder="Describe your current imbalance..."
              />
            </div>

            {/* Doctor */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Doctor
              </label>
              <select
                name="doctor_id"
                value={formData.doctor_id}
                onChange={handleChange}
                className="focus:ring-green-500 focus:border-green-500 block w-full p-3 border-gray-300 rounded-md"
                required
              >
                <option value="">Select Doctor</option>
                {doctors.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} ({d.specialization || "General"})
                  </option>
                ))}
              </select>
            </div>

            {/* Procedure */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Procedure
              </label>
              <select
                name="procedure_id"
                value={formData.procedure_id}
                onChange={handleChange}
                className="focus:ring-green-500 focus:border-green-500 block w-full p-3 border-gray-300 rounded-md"
                required
              >
                <option value="">Select Procedure</option>
                {procedures.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Date
              </label>
              <DatePicker
                selected={formData.selectedDate}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                minDate={new Date()}
                className="focus:ring-green-500 focus:border-green-500 block w-full p-3 border-gray-300 rounded-md"
                placeholderText="Select Date"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white font-semibold py-3 rounded-md hover:bg-green-700 transition"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientSignup;
