import { useState } from "react";
import { supabase } from "../supabaseClient";

const EditProfileForm = ({ artist, onUpdate, onClose }) => {
  const [name, setName] = useState(artist.name);
  const [role, setRole] = useState(artist.role);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = artist.img; // ডিফল্ট হিসেবে আগের ইমেজ

    if (file) {
      const fileName = `${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("profile-images") // নিশ্চিত হোন আপনার স্টোরেজ নাম এটিই
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
      .update({ name, role, img: imageUrl })
      .eq("id", artist.id)
      .select();

    if (!error && data) {
      onUpdate(data[0]);
      onClose();
    }
    setLoading(false);
  };

  return (
    <div
      className="modal"
      style={{
        position: "fixed",
        top: "20%",
        left: "30%",
        background: "#fff",
        padding: "20px",
        border: "1px solid #ccc",
      }}
    >
      <form onSubmit={handleUpdate}>
        <h2>Edit Profile</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Name"
        />
        <br />
        <br />
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          placeholder="Role"
        />
        <br />
        <br />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <br />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Update"}
        </button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditProfileForm;
