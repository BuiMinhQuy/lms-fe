import React, { FC, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, TextField } from "@mui/material";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineMail } from "react-icons/ai";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useAdminUpdateUserMutation, useDeleteUserMutation, useGetAllUserQuery } from "@/redux/features/user/userApi";
import { format } from "timeago.js";
import { styles } from "@/app/styles/style";

type Props = {
    isTeam: boolean;
};

const AllUsers: FC<Props> = ({ isTeam }) => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const { data } = useGetAllUserQuery({});
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
    const [adminUpdateUser, { isLoading: isUpdating }] = useAdminUpdateUserMutation();

    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectedUserId, setSelectedUserId] = useState<string>("");
    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editRole, setEditRole] = useState("user");

    const rows = useMemo(() => {
        const out: any[] = [];
        const users = data?.users ?? [];

        const filtered = isTeam
            ? users.filter((item: any) => String(item?.role || "").toLowerCase() === "admin")
            : users;

        filtered.forEach((item: any) => {
            out.push({
                id: item._id,
                name: item.name,
                email: item.email,
                role: item.role,
                courses: item.courses?.length ?? 0,
                created_at: format(item.createdAt),
            });
        });

        return out;
    }, [data?.users, isTeam]);

    const handleOpenEdit = (row: any) => {
        setSelectedUserId(row.id);
        setEditName(row.name || "");
        setEditEmail(row.email || "");
        setEditRole(row.role || "user");
        setEditOpen(true);
    };

    const handleOpenDelete = (row: any) => {
        setSelectedUserId(row.id);
        setDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedUserId) return;
        try {
            await deleteUser({ id: selectedUserId }).unwrap();
            toast.success(t("user-deleted", { defaultValue: "Đã xóa người dùng" }));
            setDeleteOpen(false);
        } catch (err: any) {
            toast.error(err?.data?.message || "Delete failed");
        }
    };

    const handleSaveEdit = async () => {
        if (!selectedUserId) return;
        try {
            await adminUpdateUser({
                id: selectedUserId,
                name: editName,
                email: editEmail,
                role: editRole,
            }).unwrap();
            toast.success(t("user-updated", { defaultValue: "Cập nhật người dùng thành công" }));
            setEditOpen(false);
        } catch (err: any) {
            toast.error(err?.data?.message || "Update failed");
        }
    };

    const columns = [
        { field: "id", headerName: t("id"), flex: 0.3 },
        { field: "name", headerName: t("user-name"), flex: 0.5 },
        { field: "email", headerName: t("email-label", { defaultValue: "Email" }), flex: 0.5 },
        { field: "role", headerName: t("role"), flex: 0.5 },
        { field: "courses", headerName: t("purchased-courses"), flex: 0.5 },
        { field: "created_at", headerName: t("joined-at"), flex: 0.5 },
        {
            field: "edit",
            headerName: t("edit", { defaultValue: "Chỉnh sửa" }),
            flex: 0.2,
            sortable: false,
            renderCell: (params: any) => {
                return (
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEdit(params.row);
                        }}
                    >
                        <AiOutlineEdit className="dark:text-white text-black" size={20} />
                    </IconButton>
                );
            },
        },
        {
            field: " ",
            headerName: t("delete", { defaultValue: "Xóa" }),
            flex: 0.2,
            sortable: false,
            renderCell: (params: any) => {
                return (
                    <>
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDelete(params.row);
                            }}
                        >
                            <AiOutlineDelete className="dark:text-white text-black" size={20} />
                        </IconButton>
                    </>
                );
            },
        },
        {
            field: "sendEmail",
            headerName: t("send-email", { defaultValue: "Gửi Email" }),
            flex: 0.2,
            sortable: false,
            renderCell: (params: any) => {
                return (
                    <>
                        <IconButton
                            component="a"
                            href={`mailto:${params.row.email}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <AiOutlineMail className="dark:text-white text-black" size={20} />
                        </IconButton>
                    </>
                );
            },
        },
    ];

    return (
        <div className="mt-[120px]">
            <Box m="20px">
                <div className="w-full flex justify-end">
                    <div
                        className={`${styles.button} !w-[200px] dark:bg-[#57c7a3] h-[35px] dark:border dark:border-[#ffffff6c]`}
                        onClick={() => toast(t("coming-soon", { defaultValue: "Sắp có" }))}
                    >
                        {t("add-new-member")}
                    </div>
                </div>
                <Box
                    m="40px 0 0 0"
                    height="80vh"
                    sx={{
                        "& .MuiDataGrid-root": {
                            border: "none",
                            outline: "none",
                            backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
                        },
                        "& .css-pqjvzv-MuiSvgIcon-root-MuiSelect-icon": {
                            color: theme === "dark" ? "#fff" : "#000",
                        },
                        "& .MuiDataGrid-sortIcon": {
                            color: theme === "dark" ? "#fff" : "#000",
                        },
                        "& .MuiDataGrid-row": {
                            color: theme === "dark" ? "#fff" : "#000",
                            borderBottom:
                                theme === "dark" ? "1px solid #ffffff30!important" : "1px solid #ccc!important",
                        },
                        "& .MuiTablePagination-root": {
                            color: theme === "dark" ? "#fff" : "#000",
                        },
                        "& .MuiDataGrid-cell": {
                            borderBottom: "none",
                        },
                        "& .name-column--cell": {
                            color: theme === "dark" ? "#fff" : "#000",
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
                            borderBottom: "none",
                            color: theme === "dark" ? "#fff" : "#000",
                        },
                        "& .MuiDataGrid-virtualScroller": {
                            backgroundColor: theme === "dark" ? "#1F2A40" : "#F2F0F0",
                        },
                        "& .MuiDataGrid-footerContainer": {
                            color: theme === "dark" ? "#fff" : "#000",
                            borderTop: "none",
                            backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
                        },
                        "& .MuiCheckbox-root": {
                            color: theme === "dark" ? `#b7ebde !important` : `#000 !important`,
                        },
                        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                            color: `#fff !important`,
                        },
                        "&. MuiDataGrid-container--top": {
                            backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
                        },

                        "& .MuiDataGrid-row--borderBottom": {
                            background: "none !important",
                        },
                    }}
                >
                    <DataGrid checkboxSelection disableRowSelectionOnClick rows={rows} columns={columns} />
                </Box>
            </Box>

            {/* Edit user dialog */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{t("edit-user", { defaultValue: "Chỉnh sửa người dùng" })}</DialogTitle>
                <DialogContent>
                    <Box className="mt-3 flex flex-col gap-4">
                        <TextField
                            label={t("user-name", { defaultValue: "Tên người dùng" })}
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label={t("email-label", { defaultValue: "Email" })}
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            select
                            label={t("role", { defaultValue: "Vai trò" })}
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value)}
                            fullWidth
                        >
                            <MenuItem value="user">user</MenuItem>
                            <MenuItem value="admin">admin</MenuItem>
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)} disabled={isUpdating}>
                        {t("cancel", { defaultValue: "Hủy" })}
                    </Button>
                    <Button onClick={handleSaveEdit} disabled={isUpdating} variant="contained">
                        {t("save", { defaultValue: "Lưu" })}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete confirm dialog */}
            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                <DialogTitle>{t("confirm-delete", { defaultValue: "Xác nhận xóa" })}</DialogTitle>
                <DialogContent>{t("delete-user-confirm", { defaultValue: "Bạn có chắc chắn muốn xóa người dùng này?" })}</DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteOpen(false)} disabled={isDeleting}>
                        {t("cancel", { defaultValue: "Hủy" })}
                    </Button>
                    <Button onClick={handleConfirmDelete} disabled={isDeleting} color="error" variant="contained">
                        {t("delete", { defaultValue: "Xóa" })}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AllUsers;
