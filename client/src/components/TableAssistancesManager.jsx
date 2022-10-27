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
import { CheckSharp, ClearSharp } from "@mui/icons-material";
import { useFetchDataTable } from "../hooks/useFetchDataTable";
import { Loader } from "./Loader";

const TableAssistancesManager = ({ mode, type }) => {
    const username = sessionStorage.getItem("username");

    const { data, loading, error, handleStatusAssistance } = useFetchDataTable(
        username,
        mode,
        type
    );

    const columns = useMemo(() => [
        {
            accessorKey: "assistant",
            header: "Asistente",
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
            size: 300,
        },
        {
            accessorKey: "site",
            header: "Sitio",
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
                        </TextField>
                    </FormControl>
                );
            },
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
            muiTableBodyCellEditTextFieldProps: {
                required: true,
                type: "date",
                variant: "outlined",
            },
            size: 50,
        },
        {
            accessorKey: "startTime",
            header: "Entrada",
            muiTableBodyCellEditTextFieldProps: {
                required: true,
                type: "time",
                variant: "outlined",
            },
            size: 50,
        },
        {
            accessorKey: "endTime",
            header: "Salida",
            muiTableBodyCellEditTextFieldProps: {
                required: true,
                type: "time",
                variant: "outlined",
            },
            size: 50,
        },
        {
            accessorKey: "status",
            header: "Estado",
            muiTableBodyCellProp: {
                sx: {
                    fontWeight: "bold",
                },
            },
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
                    columns={columns}
                    data={data}
                    editingMode='modal'
                    enableEditing={type === "next" ? true : false}
                    onEditingRowSave={handleStatusAssistance}
                    renderRowActions={({ row, table }) => (
                        <Box sx={{ display: "flex", gap: "1rem" }}>
                            <Tooltip arrow placement='left' title='Aceptar'>
                                <IconButton
                                    sx={{
                                        color: "#000",
                                    }}
                                    onClick={() =>
                                        handleStatusAssistance(row, "Aceptada")
                                    }
                                    disabled={
                                        row.original.status === "Aceptada"
                                    }
                                >
                                    <CheckSharp />
                                </IconButton>
                            </Tooltip>
                            <Tooltip arrow placement='right' title='Rechazar'>
                                <IconButton
                                    color='error'
                                    onClick={() =>
                                        handleStatusAssistance(row, "Rechazada")
                                    }
                                    disabled={
                                        row.original.status === "Rechazada"
                                    }
                                >
                                    <ClearSharp />
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
                        </Box>
                    )}
                />
            )}
        </>
    );
};

export default TableAssistancesManager;
