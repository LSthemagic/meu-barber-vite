import { Link, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import imagemLogo from "../../images/logo.png";
import { useAuth } from "../../../User/context/AuthContext";
import { useAuth as useAuthBarber } from "../../../Barber/context/BarberContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useState } from "react";

const Navbar = () => {
	const { logout, offDataAuth } = useAuth();
	const { offAuthToken, signOut } = useAuthBarber();
	const { pathname } = useLocation();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const isBarberRoutes = pathname.startsWith("/barber");
	const handleMenuItemClick = () => setIsMenuOpen(false)
	const handleMenuOpen = () => setIsMenuOpen(!isMenuOpen);


	if (isBarberRoutes) {
		return (
			<div className={styles.navbar}>
				<nav
					className={`navbar navbar-expand-lg bg-body-tertiary ${styles.customNavbar}`}
				>
					<div className="container-fluid">
						<Link className="navbar-brand" to="/barber/barber-home">
							<div className={styles.titleContainer}>
								<h1 className={styles.title}>Meu Barber</h1>
								<img src={imagemLogo} alt="Logo" className={styles.logo} />
							</div>
						</Link>
						<button
							className={`navbar-toggler ${isMenuOpen ? "" : "collapsed"}`}
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#navbarSupportedContent"
							aria-controls="navbarSupportedContent"
							aria-expanded={isMenuOpen ? "true" : "false"}
							aria-label="Toggle navigation"
							onClick={() => handleMenuOpen()}
						>
							<span className="navbar-toggler-icon"></span>
						</button>
						<div
							className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}
							id="navbarSupportedContent"
						>
							<ul className="navbar-nav me-auto mb-2 mb-lg-0" onClick={() => handleMenuItemClick()}>
								<li className="nav-item">
									<Link
										to="/barber/barber-home"
										style={{ color: "white" }}
										className="nav-link active"
										aria-current="page"
									>
										Home Barber
									</Link>
								</li>
								<li className="nav-item">
									<Link
										to="/barber/calendar"
										style={{ color: "white" }}
										className="nav-link"
									>
										Agenda Barber
									</Link>
								</li>
								<li className="nav-item dropdown">
									<Link
										to="#"
										style={{ color: "white" }}
										className="nav-link dropdown-toggle"
										role="button"
										data-bs-toggle="dropdown"
										aria-expanded="false"
									>
										Ver mais
									</Link>
									<ul className="dropdown-menu">
										<li>
											<Link
												to="/barber/registerBarber"
												style={{ color: "#333" }}
												className="dropdown-item"
											>
												Cadastrar-se
											</Link>
										</li>
										<li>
											<Link
												to="/barber/authenticateBarber"
												style={{ color: "#333" }}
												className="dropdown-item"
											>
												Entrar
											</Link>
										</li>
										<li>
											<hr className="dropdown-divider"></hr>
										</li>
										<li>
											<button
												onClick={() => {
													window.location.href = "/barber/barber-home";
													offAuthToken();
													signOut();
												}}
												style={{ color: "#333" }}
												className="dropdown-item"
											>
												Sair
											</button>
										</li>
									</ul>
								</li>
							</ul>
							<form className="d-flex" role="search">
								<input
									className={`form-control me-2 ${styles.customInput}`}
									type="search"
									placeholder="Search"
									aria-label="Search"
								/>
								<button
									className={`${styles.customBtn}`}
									type="submit"
								>
									Search
								</button>
							</form>
						</div>
					</div>
				</nav>
			</div>
		);
	}
	return (
		<div className={styles.navbar}>
			<nav
				className={`navbar navbar-expand-lg bg-body-tertiary ${styles.customNavbar}`}
			>
				<div className="container-fluid">
					<Link className="navbar-brand" to="/">
						<div className={styles.titleContainer}>
							<h1 className={styles.title}>Meu Barber</h1>
							<img src={imagemLogo} alt="Logo" className={styles.logo} />
						</div>
					</Link>
					<button
						className={`navbar-toggler ${isMenuOpen ? "" : "collapsed"}`}
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarSupportedContent"
						aria-controls="navbarSupportedContent"
						aria-expanded={isMenuOpen ? "true" : "false"}
						aria-label="Toggle navigation"
						onClick={() => handleMenuOpen()}
					>
						<span className="navbar-toggler-icon"></span>
					</button>
					<div
						className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}
						id="navbarSupportedContent"
					>
						<ul className="navbar-nav me-auto mb-2 mb-lg-0">
							<li className="nav-item">
								<Link
									onClick={() => handleMenuItemClick()}
									to="/"
									style={{ color: "white" }}
									className="nav-link active"
									aria-current="page"
								>
									Home
								</Link>
							</li>

							<li className="nav-item dropdown">
								<Link
									// onClick={() => handleMenuOpen()}
									to="#"
									style={{ color: "white" }}
									className="nav-link dropdown-toggle"
									role="button"
									data-bs-toggle="dropdown"
									aria-expanded="false"
								>
									Ver mais
								</Link>
								<ul className="dropdown-menu" onClick={() => handleMenuItemClick()}>
									<li>
										<Link
											to="/register"
											style={{ color: "#333" }}
											className="dropdown-item"
										>
											Cadastrar-se
										</Link>
									</li>
									<li>
										<Link
											to="/authenticate"
											style={{ color: "#333" }}
											className="dropdown-item"
										>
											Entrar
										</Link>
									</li>
									<li>
										<Link
											to="/UserList"
											style={{ color: "#333" }}
											className="dropdown-item"
										>
											Users
										</Link>
									</li>
									<li>
										<hr className="dropdown-divider"></hr>
									</li>
									<li>
										<button
											onClick={() => {
												window.location.href = "/";
												logout();
												offDataAuth();
											}}
											style={{ color: "#333" }}
											className="dropdown-item"
										>
											Sair
										</button>
									</li>
								</ul>
							</li>
						</ul>
						<form className="d-flex" role="search">
							<input
								className={`form-control me-2 ${styles.customInput}`}
								type="search"
								placeholder="Search"
								aria-label="Search"
							/>
							<button
								className={`btn btn-outline-success ${styles.customBtn}`}
								type="submit"
							>
								Search
							</button>
						</form>
					</div>
				</div>
			</nav>
		</div>
	);
};

export default Navbar;
