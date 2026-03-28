const Footer = () => {
  return (
    <footer style={footerStyle}>
      <p>
        © {new Date().getFullYear()} Artist Portfolio Gallery. All rights
        reserved.
      </p>
    </footer>
  );
};

const footerStyle = {
  marginTop: "50px",
  padding: "20px",
  textAlign: "center",
  borderTop: "1px solid #ddd",
  color: "#7f8c8d",
};

export default Footer;
