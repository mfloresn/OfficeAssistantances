import React from "react";
import { Box, Button } from "@mui/material";
import CardUser from "./CardUser";
import { useFetchDataTable } from "../hooks/useFetchDataTable";
import { Loader } from "./Loader";
import AddUserModal from "./AddUserModal";

export const GridUsers = ({ mode, type }) => {
    const username = sessionStorage.getItem("username");
    const { data, loading, handleDeleteUser, handleAddUser, handleEditUser } =
        useFetchDataTable(username, mode, type);
    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <AddUserModal handleAddUser={handleAddUser} />
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            alignItems: "center",
                            "& > *": {
                                margin: "0.1rem",
                            },
                        }}
                    >
                        {data.map((user) => (
                            <CardUser
                                key={user._id}
                                user={user}
                                handDeleteUser={handleDeleteUser}
                                handleEditUser={handleEditUser}
                            />
                        ))}
                    </Box>
                </>
            )}
        </>
    );
};
