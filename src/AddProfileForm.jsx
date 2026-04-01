import { useState } from "react";
import { supabase } from "./supabaseClient";

const AddProfileForm = ({ onAdd, onClose }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // টেলিগ্রাম নোটিফিকেশন ফাংশন
  const sendTelegramNotification = async (name) => {
    const token = "8666161155:AAEc_YZxxRS4vf3O7Tjyanv5LWV9MSf7Dgg";
    const chatId = "1242636193";
    const text = `🔔 New artist added: ${name}`;

    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(text)}`;

    try {
      await fetch(url);
      console.log("Telegram notification sent!");
    } catch (err) {
      console.error("Telegram error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = "";

    try {
      // ১. ইমেজ থাকলে আপলোড করা
      if (file) {
        const fileName = `${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("profile-images")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("profile-images")
          .getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }

      // ২. সুপাবেস ডাটাবেসে প্রোফাইল ইনসার্ট করা
      const { data, error } = await supabase
        .from("artists")
        .insert([{ name, role, location, img: imageUrl, approved: false }])
        .select();

      if (error) throw error;

      // ৩. সফল হলে টেলিগ্রামে নোটিফিকেশন পাঠানো
      if (data && data.length > 0) {
        await sendTelegramNotification(name);
        onAdd(data[0]);
        onClose();
        alert("Profile added and notification sent!");
      }
    } catch (err) {
      console.error("Error:", err.message);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3 style={{ marginTop: 0 }}>Add Artist Profile</h3>
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
            required
          />
          <label
            style={{ fontSize: "12px", marginBottom: "5px", display: "block" }}
          >
            Profile Image:
          </label>
          <input
            type="file"
            style={inputStyle}
            onChange={(e) => setFile(e.target.files[0])}
            accept="image/*"
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

// স্টাইল অবজেক্টগুলো (আপনার আগের মতোই রাখা হয়েছে)
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
