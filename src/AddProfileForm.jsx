import { useState } from "react";
import { supabase } from "./supabaseClient";

const AddProfileForm = ({ onAdd, onClose }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = "";

    if (file) {
      const fileName = `${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(fileName, file);

      if (!uploadError) {
        const { data } = supabase.storage
          .from("profile-images")
          .getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }
    }

    const { data, error } = await supabase
      .from("artists")
      .insert([{ name, role, location, img: imageUrl, approved: false }])
      .select();

    if (!error && data) {
      onAdd(data[0]);
      onClose();
    } else {
      alert("Error adding profile! Check RLS policies.");
    }
    setLoading(false);
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3>Add Artist Profile</h3>
        <form onSubmit={handleSubmit}>
          <input
            style={inputStyle}
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            style={inputStyle}
            placeholder="Professional Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
          <input
            style={inputStyle}
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            type="file"
            style={inputStyle}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" disabled={loading} style={saveBtn}>
              {loading ? "Saving..." : "Submit Profile"}
            </button>
            <button type="button" onClick={onClose} style={cancelBtn}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};
const modalStyle = {
  background: "#fff",
  padding: "30px",
  borderRadius: "10px",
  width: "350px",
};
const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "5px",
  border: "1px solid #ddd",
  boxSizing: "border-box",
};
const saveBtn = {
  flex: 1,
  padding: "10px",
  backgroundColor: "#27ae60",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};
const cancelBtn = {
  flex: 1,
  padding: "10px",
  backgroundColor: "#e74c3c",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default AddProfileForm;
