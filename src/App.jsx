import ProfileCard from "./ProfileCard";
import Footer from "./Footer";
import AddProfileForm from "./AddProfileForm";
import EditProfileForm from "./EditProfileForm";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

function App() {
  const [editingArtist, setEditingArtist] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  // const sendTelegramNotification = async (name) => {
  //   const token = "8666161155:AAEc_YZxxRS4vf3O7Tjyanv5LWV9MSf7Dgg";
  //   const chatId = "1242636193";
  //   const text = `🔔 New artist added: ${name}`;

  //   const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(text)}`;

  //   try {
  //     const response = await fetch(url);
  //     if (response.ok) {
  //       console.log("Notification sent successfully!");
  //     }
  //   } catch (err) {
  //     console.error("Failed to send notification:", err);
  //   }
  // };

  // পাসওয়ার্ড ইনপুটের জন্য নতুন স্টেট
  const [showPassModal, setShowPassModal] = useState(false);
  const [passInput, setPassInput] = useState("");

  const handleAdminToggle = () => {
    if (!isAdmin) {
      setShowPassModal(true); // সরাসরি প্রম্পট না দেখিয়ে মোডাল দেখাবে
    } else {
      setIsAdmin(false);
    }
  };

  const checkPassword = () => {
    if (passInput === "A281125H") {
      setIsAdmin(true);
      setShowPassModal(false);
      setPassInput("");
    } else {
      alert("পাসওয়ার্ড সঠিক নয়!");
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const handleUpdateArtist = (updatedArtist) => {
    if (!updatedArtist) return;
    setArtists(
      artists.map((a) => (a.id === updatedArtist.id ? updatedArtist : a)),
    );
  };

  const fetchArtists = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("artists")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching data:", error);
    } else {
      setArtists(data);
    }
    setLoading(false);
  };

  const handleAddArtist = (newArtist) => {
    setArtists([newArtist, ...artists]);
  };

  const deleteArtist = async (id) => {
    if (window.confirm("আপনি কি নিশ্চিতভাবে এটি ডিলিট করতে চান?")) {
      const { error } = await supabase.from("artists").delete().eq("id", id);

      if (!error) {
        setArtists(artists.filter((a) => a.id !== id));
      } else {
        alert("Delete failed!");
      }
    }
  };

  const toggleApprove = async (id, currentStatus) => {
    const { error } = await supabase
      .from("artists")
      .update({ approved: !currentStatus })
      .eq("id", id);

    if (!error) {
      setArtists(
        artists.map((a) =>
          a.id === id ? { ...a, approved: !currentStatus } : a,
        ),
      );
    }
  };

  const filteredArtists = artists.filter((artist) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      artist.name.toLowerCase().includes(search) ||
      artist.role.toLowerCase().includes(search) ||
      artist.location.toLowerCase().includes(search);

    return isAdmin ? matchesSearch : matchesSearch && artist.approved;
  });

  if (loading)
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Loading Data...
      </h2>
    );

  return (
    <div
      style={{
        padding: "30px 20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      {/* ১. পাসওয়ার্ড মোডাল সেকশন (যাতে স্টার দেখা যায়) */}
      {showPassModal && (
        <div style={modalOverlayStyle}>
          <div style={passBoxStyle}>
            <h3 style={{ marginBottom: "15px" }}>অ্যাডমিন লগইন</h3>
            <input
              type="password"
              placeholder="পাসওয়ার্ড দিন..."
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && checkPassword()} // এন্টার চাপলে লগইন হবে
              style={passInputStyle}
            />
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <button onClick={checkPassword} style={loginBtnStyle}>
                Login
              </button>
              <button
                onClick={() => {
                  setShowPassModal(false);
                  setPassInput("");
                }}
                style={cancelBtnStyle}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <button onClick={handleAdminToggle} style={navBtnStyle}>
          {isAdmin ? "🏠 Go to User View" : "⚙️ Open Admin Dashboard"}
        </button>
      </div>

      <h1 style={{ textAlign: "center", color: "#2c3e50" }}>
        {isAdmin ? "🛠️ Admin Dashboard" : "Artist Portfolio Gallery"}
      </h1>

      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <input
          type="text"
          placeholder="Search by name, role, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchStyle}
        />
        <br />
        <button onClick={() => setShowForm(true)} style={addBtnStyle}>
          + Add New Profile
        </button>
      </div>

      {editingArtist && (
        <EditProfileForm
          artist={editingArtist}
          onUpdate={handleUpdateArtist}
          onClose={() => setEditingArtist(null)}
        />
      )}

      {showForm && (
        <AddProfileForm
          onAdd={handleAddArtist}
          onClose={() => setShowForm(false)}
        />
      )}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "25px",
          justifyContent: "center",
        }}
      >
        {filteredArtists.length > 0 ? (
          filteredArtists.map((artist) => (
            <div key={artist.id} style={{ textAlign: "center" }}>
              <ProfileCard
                name={artist.name}
                role={artist.role}
                image={artist.img}
                locat={artist.location}
              />

              {isAdmin && (
                <div style={adminPanelStyle}>
                  <p style={{ fontSize: "12px", margin: "5px 0" }}>
                    Status: {artist.approved ? "✅ Visible" : "⏳ Hidden"}
                  </p>

                  <button
                    onClick={() => setEditingArtist(artist)}
                    style={{ ...smallBtn, backgroundColor: "#3498db" }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => toggleApprove(artist.id, artist.approved)}
                    style={{
                      ...smallBtn,
                      backgroundColor: artist.approved ? "#f39c12" : "#27ae60",
                    }}
                  >
                    {artist.approved ? "Hide" : "Approve"}
                  </button>

                  <button
                    onClick={() => deleteArtist(artist.id)}
                    style={{ ...smallBtn, backgroundColor: "#e74c3c" }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p style={{ color: "red", fontSize: "18px" }}>
            কোনো তথ্য পাওয়া যায়নি!
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
}

// --- Styles ---
const navBtnStyle = {
  padding: "10px 20px",
  backgroundColor: "#2c3e50",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold",
};
const addBtnStyle = {
  padding: "12px 25px",
  backgroundColor: "#27ae60",
  color: "white",
  border: "none",
  borderRadius: "25px",
  cursor: "pointer",
  fontWeight: "bold",
  marginTop: "10px",
};
const searchStyle = {
  padding: "12px 20px",
  width: "100%",
  maxWidth: "450px",
  borderRadius: "30px",
  border: "2px solid #3498db",
  outline: "none",
  fontSize: "16px",
};
const adminPanelStyle = {
  marginTop: "10px",
  padding: "10px",
  backgroundColor: "#fff",
  borderRadius: "10px",
  border: "1px solid #ddd",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
};
const smallBtn = {
  color: "white",
  border: "none",
  padding: "6px 12px",
  margin: "3px",
  cursor: "pointer",
  borderRadius: "4px",
  fontSize: "12px",
  fontWeight: "bold",
};

// নতুন পাসওয়ার্ড মোডাল স্টাইল
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.8)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 2000,
};
const passBoxStyle = {
  background: "white",
  padding: "30px",
  borderRadius: "15px",
  textAlign: "center",
  boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
};
const passInputStyle = {
  padding: "10px",
  width: "220px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "16px",
  display: "block",
  marginBottom: "15px",
  outline: "none",
};
const loginBtnStyle = {
  padding: "8px 25px",
  backgroundColor: "#27ae60",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold",
};
const cancelBtnStyle = {
  padding: "8px 25px",
  backgroundColor: "#e74c3c",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default App;
