import { useState } from "react";
import { supabase } from "./supabaseClient";

const EditProfileForm = ({ artist, onUpdate, onClose }) => {
  const [name, setName] = useState(artist.name);
  const [role, setRole] = useState(artist.role);
  const [location, setLocation] = useState(artist.location);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = artist.img;

    if (file) {
      const fileName = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
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
      .update({ name, role, location, img: imageUrl })
      .eq("id", artist.id)
      .select();

    if (!error && data && data.length > 0) {
      onUpdate(data[0]);
      onClose();
    }
    setLoading(false);
  };

  return (
    <div style={formOverlay}>
      <div style={formBox}>
        <h3>Edit Profile</h3>
        <form onSubmit={handleUpdate}>
          <input
            style={inputStyle}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            style={inputStyle}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
          <input
            style={inputStyle}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            type="file"
            style={inputStyle}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" style={saveBtn} disabled={loading}>
              {loading ? "Updating..." : "Update"}
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

// (Styles are same as AddProfileForm)
const formOverlay = {
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
const formBox = {
  background: "white",
  padding: "25px",
  borderRadius: "10px",
  width: "320px",
};
const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
};
const saveBtn = {
  padding: "10px",
  flex: 1,
  backgroundColor: "#3498db",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};
const cancelBtn = {
  padding: "10px",
  flex: 1,
  backgroundColor: "#e74c3c",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default EditProfileForm;
