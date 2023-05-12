import { useContext } from 'react';
import { AuthContext } from "@contexts/AuthContext";

export function useAuth() {
    // Adquirndo/acessando o contexto compartilhado
    const context = useContext(AuthContext);
    return context;
}