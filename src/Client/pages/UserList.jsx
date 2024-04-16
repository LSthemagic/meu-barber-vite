// UserList.js
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const UserList = () => {
	const { token } = useAuth();
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				if (token) {
					const response = await axios.get(
						"http://localhost:3001/admin/users",
						{
							headers: {
								Authorization: `Bearer ${token}`
							}
						}
					);
					setUsers(response.data.users);
				}
			} catch (error) {
				console.error("Erro ao obter usuários:", error.response);
			}
		};

		fetchUsers();
	}, [token]);

	return (
		<div>
			<h1>Lista de Usuários teste - Total: {users.length}</h1>
			{users.length > 0 ? (
				<ul>
					{users.map((user) => (
						<li key={user._id}>{user.name}</li>
					))}
				</ul>
			) : (
				<p>Nenhum usuário encontrado.</p>
			)}
		</div>
	);
};

export default UserList;
