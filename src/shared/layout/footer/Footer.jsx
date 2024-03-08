import styles from "./Footer.module.css"

const Footer = () => {
  return (
    <div className={styles.footer}>
      <footer className={`text-center ${styles.footer}`}>
        {/* Grid container */}
        <div className="p-4 pb-0">
          {/* Section: Social media */}
          <section className="mb-4">
            {/* Facebook */}
            <a
              className="btn text-white btn-floating m-1"
              style={{ backgroundColor: '#3b5998' }}
              href="#!"
              role="button"
            >
              <i className="fab fa-facebook-f"></i>
            </a>

            {/* Twitter */}
            <a
              className="btn text-white btn-floating m-1"
              style={{ backgroundColor: '#55acee' }}
              href="#!"
              role="button"
            >
              <i className="fab fa-twitter"></i>
            </a>

            {/* Google */}
            <a
              className="btn text-white btn-floating m-1"
              style={{ backgroundColor: '#dd4b39' }}
              href="#!"
              role="button"
            >
              <i className="fab fa-google"></i>
            </a>

            {/* Instagram */}
            <a
              className="btn text-white btn-floating m-1"
              style={{ backgroundColor: '#ac2bac' }}
              href="#!"
              role="button"
            >
              <i className="fab fa-instagram"></i>
            </a>

            {/* Linkedin */}
            <a
              className="btn text-white btn-floating m-1"
              style={{ backgroundColor: '#0082ca' }}
              href="#!"
              role="button"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>

            {/* Github */}
            <a
              className="btn text-white btn-floating m-1"
              style={{ backgroundColor: '#333333' }}
              href="#!"
              role="button"
            >
              <i className="fab fa-github"></i>
            </a>
          </section>
          {/* Section: Social media */}
        </div>
        {/* Grid container */}

        {/* Copyright */}
        <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
          © 2024 Copyright:
          <a style={{paddingLeft:"8px"}} className={`text-body ${styles.link}`} href="https://mdbootstrap.com/">
            MDBootstrap.com
          </a>
        </div>
        {/* Copyright */}
      </footer>
    </div>
  );
};

export default Footer;
