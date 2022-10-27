import React, { useMemo } from "react";
import MaterialReactTable from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import {
    Box,
    IconButton,
    Typography,
    Tooltip,
    MenuItem,
    TextField,
    FormControl,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useFetchDataTable } from "../hooks/useFetchDataTable";
import { Loader } from "./Loader";

const TableAssistancesEditableUser = ({ mode, type }) => {
    const username = sessionStorage.getItem("username");

    const { data, loading, error, handleSaveRowEdits, handleDeleteRow } =
        useFetchDataTable(username, mode, type);

    const columns = useMemo(() => [
        {
            accessorKey: "assistant",
            header: "Asistente",
            size: 200,
            Edit: ({ row }) => {
                return (
                    <TextField
                        label='Asistente'
                        defaultValue={row.original.assistant}
                        InputProps={{
                            readOnly: true,
                        }}
                        disabled
                    />
                );
            },
        },
        {
            accessorKey: "site",
            header: "Sitio",
            size: 50,
            Edit: ({ row }) => {
                return (
                    <FormControl>
                        <TextField
                            style={{ width: "100%" }}
                            variant='outlined'
                            select
                            label='Sitio'
                            defaultValue={row.original.siteId}
                            onChange={(event) => {
                                row.original.siteId = event.target.value;
                            }}
                        >
                            <MenuItem value='62f180168ecc6b7a88f0fc6f'>
                                Tajín
                            </MenuItem>
                            <MenuItem value='62f1802c8ecc6b7a88f0fc72'>
                                Cuenca
                            </MenuItem>
                            <MenuItem value='62f1803b8ecc6b7a88f0fc74'>
                                Leyes de Reforma
                            </MenuItem>
                            <MenuItem value='62f180578ecc6b7a88f0fc76'>
                                Monterrey
                            </MenuItem>
                            <MenuItem value='6333093695cc6762ffdada17'>
                                Capital Humano
                            </MenuItem>
                        </TextField>
                    </FormControl>
                );
            },
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
            muiTableBodyCellEditTextFieldProps: {
                required: true,
                type: "date",
                variant: "outlined",
            },
        },
        {
            accessorKey: "startTime",
            header: "Entrada",
            size: 50,
            muiTableBodyCellEditTextFieldProps: {
                required: true,
                type: "time",
                variant: "outlined",
            },
        },
        {
            accessorKey: "endTime",
            header: "Salida",
            size: 50,
            muiTableBodyCellEditTextFieldProps: {
                required: true,
                type: "time",
                variant: "outlined",
            },
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
                    muiTableHeadCellFilterTextFieldProps={{
                        sx: {
                            width: "100%",
                        },
                        size: 'small',
                      }}
                    columns={columns}
                    data={data}
                    editingMode='modal' //default
                    enableEditing={
                        type === "next" && mode !== "all" ? true : false
                    }
                    onEditingRowSave={handleSaveRowEdits}
                    renderRowActions={({ row, table }) => (
                        <Box sx={{ display: "flex", gap: "1rem" }}>
                            <Tooltip arrow placement='left' title='Editar'>
                                <IconButton
                                    sx={{
                                        color: "#006647",
                                    }}
                                    onClick={() => table.setEditingRow(row)}
                                    disabled={
                                        mode === "user" &&
                                        row.original.logger !== username
                                    }
                                >
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                            <Tooltip arrow placement='right' title='Borrar'>
                                <IconButton
                                    color='error'
                                    onClick={() => handleDeleteRow(row)}
                                    disabled={
                                        mode === "user" &&
                                        row.original.logger !== username
                                    }
                                >
                                    <Delete />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
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
                                Tipo: <i>{row.original.type}</i>
                            </Typography>
                            <Typography variant='body2' mr={3}>
                                Estatús: 
                                <i style={{ marginLeft: '0.5rem' }}>
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

export default TableAssistancesEditableUser;
