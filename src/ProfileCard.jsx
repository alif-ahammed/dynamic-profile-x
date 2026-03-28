const ProfileCard = ({ name, role, image, locat }) => {
  return (
    <div style={cardStyle}>
      <img
        src={image || "https://via.placeholder.com/150"}
        alt={name}
        style={imgStyle}
      />
      <h2 style={{ margin: "10px 0 5px" }}>{name}</h2>
      <p style={{ color: "#7f8c8d", fontWeight: "bold", margin: "5px 0" }}>
        {role}
      </p>
      <p style={{ color: "#95a5a6", fontSize: "14px" }}>📍 {locat}</p>
    </div>
  );
};

const cardStyle = {
  width: "250px",
  padding: "20px",
  backgroundColor: "#fff",
  borderRadius: "15px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  textAlign: "center",
  transition: "transform 0.3s ease",
};

const imgStyle = {
  width: "120px",
  height: "120px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "3px solid #3498db",
};

export default ProfileCard;
