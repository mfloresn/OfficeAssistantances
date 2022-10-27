import { useState, useCallback, useEffect } from "react";
import Swal from "sweetalert2";
import deleteAssistance from "../helpers/deleteAssistance";
import deleteAssistanceExtern from "../helpers/deleteAssistanceExtern";
import getAssistancesUser from "../helpers/getAssistancesUser";
import getAssistancesExternal from "../helpers/getAssistancesExternal";
import getAssistancesThird from "../helpers/getAssistancesThird";
import editAssistance from "../helpers/editAssistance";
import editAssistanceExtern from "../helpers/editAssistanceExtern";
import getAllAssistances from "../helpers/getAllAssistances";
import getAssistancesSite from "../helpers/getAssistancesSite";
import getAllUsers from "../helpers/getAllUsers";
import updateStatus from "../helpers/updateStatusAssitance";
import updateStatusExternal from "../helpers/updateStatusAssistanceExternal";
import deleteUser from "../helpers/deleteUser";
import { userRegister } from "../helpers/userRegister";
import { userEdit } from "../helpers/userEdit";

export const useFetchDataTable = (username, mode, type) => {
    const [data, setData] = useState([]),
        [loading, setLoading] = useState(true),
        [error, setError] = useState(null),
        site = sessionStorage.getItem("site");

    const timerLoading = () => setTimeout(() => setLoading(false), 500);

    const getData = () => {
        if (mode === "user") {
            getAssistancesUser(username)
                .then((resp) => {
                    type === "next" ? setData(resp.next) : setData(resp.past);
                    timerLoading();
                })
                .catch((err) => {
                    setLoading(false);
                    setError(err);
                });
        } else if (mode === "external") {
            getAssistancesExternal(username)
                .then((resp) => {
                    type === "next" ? setData(resp.next) : setData(resp.past);
                    timerLoading();
                })
                .catch((err) => {
                    setLoading(false);
                    setError(err);
                });
        } else if (mode === "third") {
            getAssistancesThird(username)
                .then((resp) => {
                    type === "next" ? setData(resp.next) : setData(resp.past);
                    timerLoading();
                })
                .catch((err) => {
                    setLoading(false);
                    setError(err);
                });
        } else if (mode === "site") {
            getAssistancesSite(site)
                .then((resp) => {
                    type === "next"
                        ? setData(resp.next)
                        : type === "current"
                        ? setData(resp.inCourse)
                        : setData(resp.past);
                    timerLoading();
                })
                .catch((err) => {
                    setLoading(false);
                    setError(err);
                });
        } else if (mode === "all") {
            getAllAssistances()
                .then((resp) => {
                    type === "next"
                        ? setData(resp.next)
                        : type === "current"
                        ? setData(resp.inCourse)
                        : setData(resp.past);
                    timerLoading();
                })
                .catch((err) => {
                    setLoading(false);
                    setError(err);
                });
        } else if (mode === "admin-users") {
            getAllUsers()
                .then((resp) => {
                    setData(resp);
                    timerLoading();
                })
                .catch((err) => {
                    setLoading(false);
                    setError(err);
                });
        }
    };

    useEffect(() => {
        getData();
        return () => {
            setData([]);
            setLoading(true);
            setError(null);
        };
    }, [mode, type]);

    const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
        const data = {
            id:        row.original.id,
            logger:    row.original.logger,
            assistant: row.original.usernameAssistant || row.original.assistantUser,
            site:      values.siteId || row.original.siteId,
            date:      values.date || row.original.date,
            startTime: values.startTime || row.original.startTime,
            endTime:   values.endTime || row.original.endTime,
        };
        if (row.original.type === "Interno") {
            const resp = editAssistance(data);
            resp.then((res) => {
                if (res.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Asistencia actualizada correctamente",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    exitEditingMode();
                    if (mode === "user") {
                        getAssistancesUser(username)
                            .then((res) => {
                                setData(res.next);
                            })
                            .catch((err) => {
                                setLoading(false);
                                setError(err);
                            });
                    }
                    if (mode === "third") {
                        getAssistancesThird(username)
                            .then((res) => {
                                setData(res.next);
                            })
                            .catch((err) => {
                                setLoading(false);
                                setError(err);
                            });
                    }
                }
            }).catch((err) => {
                console.log(err);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: err.response.data.msg,
                });
            });
        } else if (row.original.type === "Externo") {
            const resp = editAssistanceExtern(data);
            resp.then((res) => {
                Swal.fire({
                    icon: "success",
                    title: "Asistencia actualizada correctamente",
                    showConfirmButton: false,
                    timer: 1500,
                });
                exitEditingMode();
                getAssistancesExternal(username)
                    .then((res) => {
                        setData(res.next);
                    })
                    .catch((err) => {
                        setLoading(false);
                        setError(err);
                    });
            }).catch((err) => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: err.response.data.msg,
                });
            });
        }
    };

    const handleDeleteRow = useCallback(
        (row) => {
            Swal.fire({
                title: "¿Estás seguro?",
                text: "La asistencia será eliminada permanentemente",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#1565c0",
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.isConfirmed) {
                    let newAsisstances = [];
                    if (row.original.type === "Interno") {
                        deleteAssistance(row.original.logger, row.original.id)
                            .then((response) => {
                                if (response.status === 200) {
                                    if (
                                        row.original.logger ===
                                        row.original.assistantUser
                                    ) {
                                        getAssistancesUser(username).then(
                                            (response) => {
                                                newAsisstances = response.next;
                                                setData(newAsisstances);
                                            }
                                        );
                                    } else {
                                        getAssistancesThird(username).then(
                                            (response) => {
                                                newAsisstances = response.next;
                                                setData(newAsisstances);
                                            }
                                        );
                                    }
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    } else if (row.original.type === "Externo") {
                        deleteAssistanceExtern(
                            row.original.logger,
                            row.original.id
                        )
                            .then((response) => {
                                if (response.status === 200) {
                                    getAssistancesExternal(username).then(
                                        (response) => {
                                            newAsisstances = response.next;
                                            setData(newAsisstances);
                                        }
                                    );
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    }
                }
            });
        },
        [data]
    );

    const handleStatusAssistance = (row, value) => {
        row.original.type === "Interno"
            ? updateStatus(row.original.id, value)
                  .then((res) => {
                      res.status === 200 &&
                          getAssistancesSite(row.original.site)
                              .then((res) => {
                                  setData(res.next);
                              })
                              .catch((err) => {
                                  setError(err);
                                  setLoading(false);
                              });
                  })
                  .catch((err) => {
                      setError(err);
                      setLoading(false);
                  })
            : updateStatusExternal(row.original.id, value).then((res) => {
                  res.status === 200 &&
                      getAssistancesSite(row.original.site)
                          .then((res) => {
                              setData(res.next);
                          })
                          .catch((err) => {
                              setError(err);
                              setLoading(false);
                          });
              });
    };

    const handleCreateNewRow = (values) => {
        data.push(values);
        setData([...data]);
    };

    const handleDeleteUser = (user) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "El usuario será eliminado.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#1565c0",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteUser(user).then((res) => {
                    if (res.status === 200) {
                        getAllUsers()
                            .then((res) => {
                                setData(res);
                            })
                            .catch((err) => {
                                setLoading(false);
                                setError(err);
                                console.log(err);
                            });
                    }
                });
            }
        });
    };

    const handleAddUser = (values, handleClose) => {
        userRegister(values)
            .then((res) => {
                if (res.status === 200) {
                    getAllUsers().then((res) => {
                        setData(res);
                        Swal.fire({
                            icon: "success",
                            title: "Usuario creado",
                            confirmButtonColor: "#1565c0",
                            confirmButtonText: "Aceptar",
                            timer: 1500,
                        });
                        handleClose();
                    });
                }
            })
            .catch((err) => {
                console.log(err.response.data.error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err.response.data.error,
                    confirmButtonColor: "#1565c0",
                    confirmButtonText: "Aceptar",
                });
            });
    };

    const handleEditUser = (values, handleClose) => {
        userEdit(values)
            .then((res) => {
                if (res.status === 200) {
                    getAllUsers().then((res) => {
                        setData(res);
                        Swal.fire({
                            icon: "success",
                            title: "Usuario editado",
                            confirmButtonColor: "#3085d6",
                            confirmButtonText: "Aceptar",
                            timer: 1500,
                        });
                        handleClose();
                    });
                }
            })
            .catch((err) => {
                console.log(err.response.data.error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err.response.data.error,
                    confirmButtonColor: "#1565c0",
                    confirmButtonText: "Aceptar",
                });
            });
    };

    return {
        data,
        loading,
        error,
        handleSaveRowEdits,
        handleDeleteRow,
        handleStatusAssistance,
        handleCreateNewRow,
        handleDeleteUser,
        handleAddUser,
        handleEditUser,
    };
};
