import React from "react"
import { useNavigate } from "react-router-dom";
import { Mnemonics } from "../../components/Mnemonics/Mnemonics";

export const InitializeWallet: React.FC = () => {
    const navigate = useNavigate();

    return (
        // TODO: create subroutes here
        <Mnemonics />
    );
}