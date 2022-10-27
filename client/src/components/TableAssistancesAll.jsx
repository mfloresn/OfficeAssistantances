import React, { useMemo } from "react";
import MaterialReactTable from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { Box, Typography } from "@mui/material";
import { useFetchDataTable } from "../hooks/useFetchDataTable";
import { Loader } from "./Loader";

const TableAssistancesAll = ({ mode, type }) => {
    const username = sessionStorage.getItem("username");

    const { data, loading, error } = useFetchDataTable(username, mode, type);

    const columns = useMemo(() => [
        {
            accessorKey: "assistant",
            header: "Asistente",
            size: 200,
        },
        {
            accessorKey: "site",
            header: "Sitio",
            size: 50,
            filterFn: 'equals',
            filterSelectOptions: [
                { value: "Tajín", text: "Tajín" },
                { value: "Cuenca", text: "Cuenca" },
                { value: "Leyes de Reforma", text: "Leyes de Reforma" },
                { value: "Monterrey", text: "Monterrey" },
                { value: "Capital Humano", text: "Capital Humano" },
              ],
            filterVariant: 'select',
        },
        {
            accessorKey: "date",
            header: "Fecha",
            size: 50,
        },
        {
            accessorKey: "startTime",
            header: "Entrada",
            size: 50,
        },
        {
            accessorKey: "endTime",
            header: "Salida",
            size: 50,
        },
        {
            accessorKey: "type",
            header: "Tipo",
            size: 100,
        },
    ]);

    return (
        <>
            {error ? (
                <Typography variant='h5' color='error'>
                    {error}
                </Typography>
            ) : loading ? (
                <Loader />
            ) : (
                <MaterialReactTable
                    localization={MRT_Localization_ES}
                    muiTableHeadCellProps={{
                        sx: {
                            fontWeight: "bold",
                            backgroundColor: "#21A84C",
                            borderRight: "1px solid #167634",
                        }, 
                    }}
                    muiTopToolbarProps={{
                        sx: {
                            backgroundColor: "#10472E",
                            '& *': {
                                color: "#FFFFFF",
                            }
                        },
                    }}
                    muiTableBodyCellProps={{
                        sx: {
                            backgroundColor: "#FFFFFF",
                            borderRight: "1px solid #EAEAEA",
                        },
                    }}
                    color='success'
                    columns={columns}
                    data={data}
                    renderDetailPanel={({ row }) => (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Typography variant='body2' mr={3}>
                                Registró: <i>{row.original.logger || "X"}</i>
                            </Typography>
                            <Typography variant='body2' mr={3}>
                                Area: <i>{row.original.area}</i>
                            </Typography>
                            <Typography variant='body2' mr={3}>
                                Actualizado: <i>{row.original.updatedAt}</i>
                            </Typography>
                            <Typography variant='body2' mr={3}>
                                Estatús:
                                <i style={{ marginLeft: "0.5rem" }}>
                                    {type === "next"
                                        ? row.original.status
                                        : type === "past"
                                        ? "Finalizada"
                                        : type === "current"
                                        ? "En curso"
                                        : "X"}
                                </i>
                            </Typography>
                        </Box>
                    )}
                />
            )}
        </>
    );
};

export default TableAssistancesAll;
